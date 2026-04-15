const express = require("express")
const crypto = require("crypto")
const { connectToDatabase } = require("./db")
const Owner = require("./models/Owner")
const ApiCall = require("./models/ApiCall")
const { hashPassword } = require("./services/passwordService")
const {
  buildInstagramAuthorizeUrl,
  exchangeCodeForLongLivedToken,
} = require("./services/instagramAuthService")
const { sendInstagramReply } = require("./services/instagramMessagingService")
const {
  readSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
} = require("./services/sessionService")
const { getOwnerScopedWorkspace } = require("./services/workspaceDataService")
const {
  getInstagramProfile,
  listInstagramComments,
  listInstagramInbox,
  listInstagramMedia,
} = require("./services/instagramDataService")

function buildSyntheticEmail(instagramUserId) {
  const normalizedInstagramUserId = String(instagramUserId || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")

  return `ig_${normalizedInstagramUserId}@instalead.local`
}

function buildOwnerDisplayName(owner) {
  if (owner.instagramUsername) {
    return `@${String(owner.instagramUsername).replace(/^@/, "")}`
  }

  if (owner.instagramUserId) {
    return `Instagram ${owner.instagramUserId}`
  }

  return owner.email || "Instagram Account"
}

function buildOwnerResponse(owner) {
  return {
    id: owner._id.toString(),
    name: buildOwnerDisplayName(owner),
    email: owner.email,
    instagramUserId: owner.instagramUserId,
    instagramUsername: owner.instagramUsername,
    instagramHandle: owner.instagramUsername ? `@${owner.instagramUsername}` : "",
    instagramConnected: Boolean(owner.longLivedAccessToken),
    permissions: Array.isArray(owner.permissions) ? owner.permissions : [],
    tokenExpiresAt: owner.tokenExpiresAt,
    connectedAt: owner.instagramConnectedAt,
  }
}

function validateCallbackPayload(payload) {
  const code = String(payload?.code || "").trim()
  const state = String(payload?.state || "").trim()

  if (!code) {
    return "Instagram authorization code is required."
  }

  if (!state) {
    return "Instagram login state is required."
  }

  return ""
}

function validatePrivateReplyPayload(payload) {
  const commentId = String(payload?.commentId || "").trim()
  const recipientId = String(payload?.recipientId || "").trim()
  const text = String(payload?.text || "").trim()

  if (!commentId && !recipientId) {
    return "commentId or recipientId is required."
  }

  if (!text) {
    return "Reply text is required."
  }

  return ""
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

async function getAuthenticatedOwner(req) {
  const token = readSessionToken(req)
  const session = verifySessionToken(token)

  if (!session?.ownerId) {
    return null
  }

  await connectToDatabase()
  return Owner.findById(session.ownerId)
}

async function requireAuthenticatedOwner(req, res, next) {
  const owner = await getAuthenticatedOwner(req)

  if (!owner) {
    return res.status(401).json({
      authenticated: false,
      authStatus: "unauthenticated",
      message: "No active session.",
    })
  }

  req.owner = owner
  next()
}

function hasConnectedInstagram(owner) {
  return Boolean(owner?.longLivedAccessToken)
}

async function enrichOwnerProfile(owner) {
  if (!hasConnectedInstagram(owner)) {
    return owner
  }

  try {
    const profile = await getInstagramProfile(owner.longLivedAccessToken)
    const nextInstagramUserId = profile.instagramAccountId || profile.instagramUserId || owner.instagramUserId

    if (
      nextInstagramUserId !== owner.instagramUserId ||
      profile.instagramUsername !== owner.instagramUsername
    ) {
      owner.instagramUserId = nextInstagramUserId
      owner.instagramUsername = profile.instagramUsername || owner.instagramUsername
      await owner.save()
    }
  } catch (error) {
    if (!owner.instagramUsername) {
      console.error("Instagram profile hydration failed:", error.message)
    }
  }

  return owner
}

const router = express.Router()

router.post(
  "/auth/session/bootstrap",
  asyncHandler(async (req, res) => {
    await connectToDatabase()

    const redirectUri = String(req.body.redirectUri || "").trim()
    const forceReauth = req.body.forceReauth !== false
    const state = `instalead-auth-${crypto.randomBytes(18).toString("hex")}`
    const authorizeUrl = buildInstagramAuthorizeUrl({
      redirectUri,
      state,
      forceReauth,
    })

    await ApiCall.create({
      requestType: "signup_init",
      status: "received",
      state,
      redirectUri,
      requestPayload: {
        redirectUri,
        forceReauth,
      },
    })

    return res.status(200).json({
      ok: true,
      action: "redirect",
      state,
      authorizeUrl,
    })
  }),
)

router.post(
  "/auth/instagram/callback",
  asyncHandler(async (req, res) => {
    const validationError = validateCallbackPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        authenticated: false,
        message: validationError,
      })
    }

    await connectToDatabase()

    const authorizationCode = String(req.body.code || "").trim()
    const state = String(req.body.state || "").trim()
    let redirectUri = String(req.body.redirectUri || "").trim()
    const bootstrapCall = await ApiCall.findOne({
      requestType: "signup_init",
      state,
      status: "received",
    }).sort({ createdAt: -1 })

    if (!bootstrapCall) {
      return res.status(400).json({
        authenticated: false,
        message: "No pending Instagram login was found for this session. Please try again.",
      })
    }

    redirectUri = redirectUri || String(bootstrapCall.redirectUri || "").trim()

    const apiCall = await ApiCall.create({
      requestType: "instagram_callback",
      status: "received",
      authorizationCode,
      state,
      redirectUri,
      requestPayload: {
        state,
        redirectUri,
      },
    })

    try {
      const exchangeResult = await exchangeCodeForLongLivedToken({
        code: authorizationCode,
        redirectUri,
      })
      const profile = await getInstagramProfile(exchangeResult.longLivedAccessToken)
      const identityCandidates = [
        String(profile.instagramAccountId || "").trim(),
        String(profile.instagramUserId || "").trim(),
        String(exchangeResult.instagramUserId || "").trim(),
      ].filter(Boolean)

      if (identityCandidates.length === 0) {
        throw new Error("Instagram did not return a stable account ID for this login.")
      }

      let owner = await Owner.findOne({
        instagramUserId: { $in: identityCandidates },
      })
      const ownerExists = Boolean(owner)
      const canonicalInstagramUserId = identityCandidates[0]
      const syntheticEmail = buildSyntheticEmail(canonicalInstagramUserId)
      const syntheticPasswordHash =
        owner?.passwordHash || (await hashPassword(`instagram-only:${canonicalInstagramUserId}`))

      if (!owner) {
        owner = new Owner({
          email: syntheticEmail,
          passwordHash: syntheticPasswordHash,
        })
      }

      owner.email = owner.email || syntheticEmail
      owner.passwordHash = owner.passwordHash || syntheticPasswordHash
      owner.authorizationCode = exchangeResult.authorizationCode
      owner.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
      owner.longLivedAccessToken = exchangeResult.longLivedAccessToken
      owner.instagramUserId = canonicalInstagramUserId
      owner.instagramUsername = profile.instagramUsername || owner.instagramUsername
      owner.tokenType = exchangeResult.tokenType
      owner.tokenExpiresAt = exchangeResult.tokenExpiresAt
      owner.permissions = exchangeResult.permissions
      owner.lastMetaState = state
      owner.lastRedirectUri = exchangeResult.redirectUriUsed
      owner.instagramConnectedAt = new Date()
      owner.status = "connected"

      await owner.save()
      setSessionCookie(res, owner)

      if (bootstrapCall) {
        bootstrapCall.status = "completed"
        bootstrapCall.ownerId = owner._id
        bootstrapCall.instagramUserId = canonicalInstagramUserId
        bootstrapCall.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
        bootstrapCall.longLivedAccessToken = exchangeResult.longLivedAccessToken
        bootstrapCall.responsePayload = {
          authorizeCompletedAt: new Date().toISOString(),
          callbackApiCallId: apiCall._id.toString(),
          instagramUsername: profile.instagramUsername,
        }
        await bootstrapCall.save()
      }

      apiCall.status = "completed"
      apiCall.ownerId = owner._id
      apiCall.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
      apiCall.longLivedAccessToken = exchangeResult.longLivedAccessToken
      apiCall.instagramUserId = canonicalInstagramUserId
      apiCall.responsePayload = {
        tokenType: exchangeResult.tokenType,
        tokenExpiresAt: exchangeResult.tokenExpiresAt,
        permissions: exchangeResult.permissions,
        instagramUsername: profile.instagramUsername,
      }
      await apiCall.save()

      return res.status(ownerExists ? 200 : 201).json({
        authenticated: true,
        authStatus: "authenticated",
        owner: buildOwnerResponse(owner),
        exchange: {
          receivedCode: true,
          longLivedTokenStored: true,
        },
      })
    } catch (error) {
      if (bootstrapCall) {
        bootstrapCall.status = "failed"
        bootstrapCall.errorMessage = error.message
        bootstrapCall.responsePayload = {
          status: error.status || 500,
          data: error.data || null,
        }
        await bootstrapCall.save()
      }

      apiCall.status = "failed"
      apiCall.errorMessage = error.message
      apiCall.responsePayload = {
        status: error.status || 500,
        data: error.data || null,
      }
      await apiCall.save()
      throw error
    }
  }),
)

router.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    return res.status(410).json({
      authenticated: false,
      message: "Email/password login is no longer supported. Use Instagram login.",
    })
  }),
)

router.get(
  "/auth/session",
  asyncHandler(async (req, res) => {
    const owner = await enrichOwnerProfile(await getAuthenticatedOwner(req))

    if (!owner) {
      return res.status(200).json({
        authenticated: false,
        authStatus: "unauthenticated",
      })
    }

    return res.status(200).json({
      authenticated: true,
      authStatus: "authenticated",
      owner: buildOwnerResponse(owner),
    })
  }),
)

router.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    clearSessionCookie(res)
    return res.status(200).json({
      ok: true,
      authenticated: false,
    })
  }),
)

router.get(
  "/owner/profile",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    await enrichOwnerProfile(req.owner)
    return res.status(200).json(buildOwnerResponse(req.owner))
  }),
)

router.get(
  "/campaigns",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const owner = await enrichOwnerProfile(req.owner)
    let mediaItems = []

    if (hasConnectedInstagram(owner)) {
      mediaItems = await listInstagramMedia(owner.longLivedAccessToken, { limit: 8 })
    }

    if (mediaItems.length === 0) {
      const workspace = await getOwnerScopedWorkspace(owner)
      return res.status(200).json({
        items: workspace.campaigns,
        total: workspace.campaigns.length,
      })
    }

    return res.status(200).json({
      items: mediaItems,
      total: mediaItems.length,
    })
  }),
)

router.get(
  "/dm-logs",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const owner = await enrichOwnerProfile(req.owner)

    if (hasConnectedInstagram(owner)) {
      const inbox = await listInstagramInbox(owner.longLivedAccessToken, {
        conversationLimit: 8,
        messagesPerConversation: 0,
        messageFetchLimit: 0,
      })

      return res.status(200).json({
        items: inbox.conversations,
        total: inbox.conversations.length,
        summary: inbox.summary,
      })
    }

    const workspace = await getOwnerScopedWorkspace(owner)
    return res.status(200).json({
      items: workspace.dmLogs,
      total: workspace.dmLogs.length,
    })
  }),
)

router.get(
  "/automations",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const workspace = await getOwnerScopedWorkspace(req.owner)
    return res.status(200).json({
      items: workspace.automations,
      total: workspace.automations.length,
    })
  }),
)

router.get(
  "/instagram/comments",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const owner = await enrichOwnerProfile(req.owner)

    if (!hasConnectedInstagram(owner)) {
      return res.status(400).json({
        ok: false,
        message: "Connect an Instagram Business account before reading comments.",
      })
    }

    const comments = await listInstagramComments(owner.longLivedAccessToken, {
      mediaLimit: 6,
      commentsPerMedia: 10,
    })

    return res.status(200).json({
      items: comments.comments,
      total: comments.comments.length,
      summary: comments.summary,
    })
  }),
)

router.get(
  "/instagram/inbox",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const owner = await enrichOwnerProfile(req.owner)

    if (!hasConnectedInstagram(owner)) {
      return res.status(400).json({
        ok: false,
        message: "Connect an Instagram Business account before reading inbox conversations.",
      })
    }

    const inbox = await listInstagramInbox(owner.longLivedAccessToken, {
      conversationLimit: 8,
      messagesPerConversation: 5,
      messageFetchLimit: 2,
    })

    return res.status(200).json({
      items: inbox.conversations,
      total: inbox.conversations.length,
      summary: inbox.summary,
    })
  }),
)

router.post(
  "/instagram/private-reply",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const validationError = validatePrivateReplyPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      })
    }

    const commentId = String(req.body.commentId || "").trim()
    const recipientId = String(req.body.recipientId || "").trim()
    const text = String(req.body.text || "").trim()
    const owner = await enrichOwnerProfile(req.owner)

    if (!hasConnectedInstagram(owner)) {
      return res.status(404).json({
        ok: false,
        message: "No connected Instagram owner found for this session.",
      })
    }

    const apiCall = await ApiCall.create({
      requestType: "private_reply",
      status: "received",
      email: owner.email,
      ownerId: owner._id,
      instagramUserId: owner.instagramUserId,
      requestPayload: {
        commentId,
        recipientId,
        text,
      },
    })

    try {
      const result = await sendInstagramReply({
        accessToken: owner.longLivedAccessToken,
        commentId: commentId || undefined,
        recipientId: recipientId || undefined,
        text,
      })

      apiCall.status = "completed"
      apiCall.responsePayload = result
      await apiCall.save()

      return res.status(200).json({
        ok: true,
        owner: buildOwnerResponse(owner),
        replyTarget: commentId ? "comment" : "dm",
        result,
      })
    } catch (error) {
      apiCall.status = "failed"
      apiCall.errorMessage = error.message
      apiCall.responsePayload = {
        status: error.status || 500,
        data: error.data || null,
      }
      await apiCall.save()
      throw error
    }
  }),
)

module.exports = {
  backendRouter: router,
}
