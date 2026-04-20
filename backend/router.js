const express = require("express")
const crypto = require("crypto")
const { config } = require("./config")
const { connectToDatabase } = require("./db")
const GOwner = require("./models/GOwner")
const IOwner = require("./models/IOwner")
const Owner = require("./models/Owner")
const ApiCall = require("./models/ApiCall")
const { hashPassword } = require("./services/passwordService")
const {
  confirmCommentAutomation,
  createOwnerAutomation,
  listOwnerAutomations,
  triggerCommentAutomation,
  updateOwnerAutomation,
} = require("./services/automationService")
const {
  buildAccountSummary,
  buildGOwnerResponse,
  getGOwnerAccounts,
  syncGOwnerAccountsSummary,
  upsertGOwnerFromGoogleProfile,
  upsertInstagramOwnerForGOwner,
} = require("./services/accountRegistryService")
const {
  exchangeGoogleCodeForProfile,
} = require("./services/googleAuthService")
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

  if (owner.instagramDisplayName) {
    return owner.instagramDisplayName
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
    connectedAt: owner.connectedAt || owner.instagramConnectedAt || null,
    connectionStatus: owner.connectionStatus || owner.status || "connected",
    avatarUrl: owner.profilePictureUrl || "",
    profilePictureUrl: owner.profilePictureUrl || "",
    accountType: owner.accountType || "UNKNOWN",
  }
}

function buildLegacyAccountSummary(owner) {
  const base = buildOwnerResponse(owner)

  return {
    ...base,
    iownerId: base.id,
    ownerId: base.id,
    isSelected: true,
  }
}

function buildSessionResponse({ gowner = null, owner = null, accounts = [], mode = "unauthenticated" } = {}) {
  const normalizedAccounts =
    mode === "gowner"
      ? accounts.map((account) =>
          buildAccountSummary(account, { selectedOwnerId: owner?._id?.toString() || "" }),
        )
      : owner
        ? [buildLegacyAccountSummary(owner)]
        : []

  return {
    authenticated: Boolean(gowner || owner),
    authStatus: gowner || owner ? "authenticated" : "unauthenticated",
    gowner: buildGOwnerResponse(gowner),
    owner: owner ? buildOwnerResponse(owner) : null,
    accounts: normalizedAccounts,
    selectedOwnerId: owner?._id?.toString() || "",
  }
}

function validateGooglePayload(payload) {
  const code = String(payload?.code || "").trim()
  const redirectUri = String(payload?.redirectUri || "").trim()

  if (!code) {
    return "Google authorization code is required."
  }

  if (!redirectUri) {
    return "Google redirect URI is required. Check VITE_GOOGLE_REDIRECT_URI (frontend) and GOOGLE_REDIRECT_URI (backend) are set."
  }

  return ""
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

function validateAutomationPayload(payload) {
  const name = String(payload?.name || "").trim()
  const trigger = String(payload?.trigger || "").trim()
  const response = String(payload?.response || "").trim()
  const mediaId = String(payload?.mediaId || payload?.postId || "").trim()

  if (!name) {
    return "Automation name is required."
  }

  if (!trigger) {
    return "Trigger keyword is required."
  }

  if (!response) {
    return "Automation response is required."
  }

  if (!mediaId) {
    return "Select an Instagram post before creating the automation."
  }

  return ""
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

async function getAuthenticatedOwner(req) {
  const context = await getAuthenticatedContext(req)
  return context?.owner || null
}

async function getAuthenticatedContext(req) {
  const token = readSessionToken(req)
  const session = verifySessionToken(token)

  if (!session?.gownerId && !session?.ownerId) {
    return null
  }

  await connectToDatabase()

  if (session?.gownerId) {
    const gowner = await GOwner.findById(session.gownerId)

    if (!gowner) {
      return null
    }

    const accounts = await getGOwnerAccounts(gowner._id)
    const targetOwnerId =
      String(session.selectedIOwnerId || "").trim() ||
      String(gowner.defaultIOwnerId || "").trim()
    let owner =
      accounts.find((account) => account._id.toString() === targetOwnerId) || null

    if (!owner && accounts.length > 0) {
      owner = accounts[0]
    }

    return {
      session,
      mode: "gowner",
      gowner,
      owner,
      accounts,
    }
  }

  if (!session?.ownerId) {
    return null
  }

  const owner = await Owner.findById(session.ownerId)

  if (!owner) {
    return null
  }

  return {
    session,
    mode: "legacy",
    gowner: null,
    owner,
    accounts: [owner],
  }
}

async function requireAuthenticatedGOwner(req, res, next) {
  const context = await getAuthenticatedContext(req)

  if (!context?.gowner) {
    return res.status(401).json({
      authenticated: false,
      authStatus: "unauthenticated",
      message: "Login with Google first.",
    })
  }

  req.authContext = context
  req.gowner = context.gowner
  req.accounts = context.accounts || []
  req.owner = context.owner || null
  next()
}

async function requireAuthenticatedOwner(req, res, next) {
  const context = await getAuthenticatedContext(req)
  const owner = context?.owner || null

  if (!owner) {
    return res.status(401).json({
      authenticated: false,
      authStatus: context?.gowner ? "authenticated" : "unauthenticated",
      message: context?.gowner
        ? "Select or connect an Instagram account first."
        : "No active session.",
    })
  }

  req.authContext = context
  req.gowner = context?.gowner || null
  req.accounts = context?.accounts || [owner]
  req.owner = owner
  next()
}

function requireN8nSecret(req, res, next) {
  const providedSecret = String(req.headers["x-n8n-secret"] || "").trim()

  if (!config.n8n.internalSecret) {
    return res.status(503).json({
      ok: false,
      message: "N8N_INTERNAL_SECRET is not configured on the backend.",
    })
  }

  if (!providedSecret || providedSecret !== config.n8n.internalSecret) {
    return res.status(403).json({
      ok: false,
      message: "n8n secret validation failed.",
    })
  }

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
  "/auth/google/exchange",
  asyncHandler(async (req, res) => {
    const validationError = validateGooglePayload(req.body)

    if (validationError) {
      return res.status(400).json({
        authenticated: false,
        message: validationError,
      })
    }

    await connectToDatabase()

    const googleProfile = await exchangeGoogleCodeForProfile({
      code: String(req.body.code || "").trim(),
      redirectUri: String(req.body.redirectUri || "").trim(),
    })

    let gowner = await upsertGOwnerFromGoogleProfile(googleProfile)
    const synced = await syncGOwnerAccountsSummary(gowner)
    gowner = synced.gowner
    const selectedOwner = synced.accounts.find(
      (account) => account._id.toString() === String(gowner.defaultIOwnerId || ""),
    ) || synced.accounts[0] || null

    setSessionCookie(res, {
      gownerId: gowner._id,
      email: gowner.email,
      selectedIOwnerId: selectedOwner?._id || "",
    })

    return res.status(200).json(
      buildSessionResponse({
        gowner,
        owner: selectedOwner,
        accounts: synced.accounts,
        mode: "gowner",
      }),
    )
  }),
)

router.post(
  "/auth/session/bootstrap",
  asyncHandler(async (req, res) => {
    await connectToDatabase()
    const context = await getAuthenticatedContext(req)

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
      email: context?.gowner?.email || context?.owner?.email || "",
      state,
      redirectUri,
      gownerId: context?.gowner?._id || null,
      iownerId: context?.owner?._id || null,
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
    const authContext = await getAuthenticatedContext(req)

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
      email: authContext?.gowner?.email || "",
      authorizationCode,
      state,
      redirectUri,
      gownerId: authContext?.gowner?._id || null,
      iownerId: authContext?.owner?._id || null,
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

      if (authContext?.gowner) {
        const { gowner, iowner, accounts } = await upsertInstagramOwnerForGOwner({
          gowner: authContext.gowner,
          exchangeResult,
          profile,
        })

        setSessionCookie(res, {
          gownerId: gowner._id,
          email: gowner.email,
          selectedIOwnerId: iowner._id,
        })

        if (bootstrapCall) {
          bootstrapCall.status = "completed"
          bootstrapCall.email = gowner.email
          bootstrapCall.gownerId = gowner._id
          bootstrapCall.iownerId = iowner._id
          bootstrapCall.instagramUserId = iowner.instagramUserId
          bootstrapCall.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
          bootstrapCall.longLivedAccessToken = exchangeResult.longLivedAccessToken
          bootstrapCall.responsePayload = {
            authorizeCompletedAt: new Date().toISOString(),
            callbackApiCallId: apiCall._id.toString(),
            instagramUsername: iowner.instagramUsername,
          }
          await bootstrapCall.save()
        }

        apiCall.status = "completed"
        apiCall.email = gowner.email
        apiCall.gownerId = gowner._id
        apiCall.iownerId = iowner._id
        apiCall.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
        apiCall.longLivedAccessToken = exchangeResult.longLivedAccessToken
        apiCall.instagramUserId = iowner.instagramUserId
        apiCall.responsePayload = {
          tokenType: exchangeResult.tokenType,
          tokenExpiresAt: exchangeResult.tokenExpiresAt,
          permissions: exchangeResult.permissions,
          instagramUsername: iowner.instagramUsername,
        }
        await apiCall.save()

        return res.status(200).json({
          ...buildSessionResponse({
            gowner,
            owner: iowner,
            accounts,
            mode: "gowner",
          }),
          exchange: {
            receivedCode: true,
            longLivedTokenStored: true,
          },
        })
      }

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
    const context = await getAuthenticatedContext(req)

    if (!context) {
      return res.status(200).json(buildSessionResponse())
    }

    if (context.mode === "gowner") {
      const owner = context.owner ? await enrichOwnerProfile(context.owner) : null
      const synced = await syncGOwnerAccountsSummary(context.gowner)
      const selectedOwner = owner
        ? synced.accounts.find((account) => account._id.toString() === owner._id.toString()) || owner
        : null

      if (selectedOwner && String(context.session?.selectedIOwnerId || "") !== selectedOwner._id.toString()) {
        setSessionCookie(res, {
          gownerId: synced.gowner._id,
          email: synced.gowner.email,
          selectedIOwnerId: selectedOwner._id,
        })
      }

      return res.status(200).json(
        buildSessionResponse({
          gowner: synced.gowner,
          owner: selectedOwner,
          accounts: synced.accounts,
          mode: "gowner",
        }),
      )
    }

    const owner = await enrichOwnerProfile(context.owner)

    return res.status(200).json(
      buildSessionResponse({
        owner,
        accounts: [owner],
        mode: "legacy",
      }),
    )
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
  "/accounts",
  asyncHandler(async (req, res, next) => requireAuthenticatedGOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const synced = await syncGOwnerAccountsSummary(req.gowner)
    const selectedOwner =
      (req.owner &&
        synced.accounts.find((account) => account._id.toString() === req.owner._id.toString())) ||
      synced.accounts.find((account) => account._id.toString() === String(synced.gowner.defaultIOwnerId || "")) ||
      synced.accounts[0] ||
      null

    return res.status(200).json({
      gowner: buildGOwnerResponse(synced.gowner),
      accounts: synced.accounts.map((account) =>
        buildAccountSummary(account, { selectedOwnerId: selectedOwner?._id?.toString() || "" }),
      ),
      selectedOwnerId: selectedOwner?._id?.toString() || "",
    })
  }),
)

router.post(
  "/accounts/select",
  asyncHandler(async (req, res, next) => requireAuthenticatedGOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const iownerId = String(req.body.iownerId || req.body.ownerId || "").trim()

    if (!iownerId) {
      return res.status(400).json({
        ok: false,
        message: "Select an Instagram account first.",
      })
    }

    const selectedOwner = await IOwner.findOne({
      _id: iownerId,
      gownerId: req.gowner._id,
    })

    if (!selectedOwner) {
      return res.status(404).json({
        ok: false,
        message: "That Instagram account was not found for this workspace.",
      })
    }

    req.gowner.defaultIOwnerId = selectedOwner._id
    await req.gowner.save()
    const synced = await syncGOwnerAccountsSummary(req.gowner)

    setSessionCookie(res, {
      gownerId: synced.gowner._id,
      email: synced.gowner.email,
      selectedIOwnerId: selectedOwner._id,
    })

    return res.status(200).json(
      buildSessionResponse({
        gowner: synced.gowner,
        owner: selectedOwner,
        accounts: synced.accounts,
        mode: "gowner",
      }),
    )
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
    const workspace = await listOwnerAutomations(req.owner)
    return res.status(200).json({
      automations: workspace.automations,
      items: workspace.automations,
      total: workspace.automations.length,
      summary: workspace.summary,
      tip: workspace.tip,
    })
  }),
)

router.post(
  "/automations",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const validationError = validateAutomationPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      })
    }

    const automation = await createOwnerAutomation(req.owner, req.body)

    return res.status(201).json({
      ok: true,
      automation,
    })
  }),
)

router.patch(
  "/automations/:automationId",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const automation = await updateOwnerAutomation(req.owner, req.params.automationId, req.body || {})

    return res.status(200).json({
      ok: true,
      automation,
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

router.post(
  "/internal/n8n/comment-event",
  requireN8nSecret,
  asyncHandler(async (req, res) => {
    await connectToDatabase()

    const result = await triggerCommentAutomation({
      instagramAccountId: req.body.instagramAccountId,
      postId: req.body.postId,
      commentText: req.body.comment,
      commenterId: req.body.commenterId || req.body.igUserId,
      commenterUsername: req.body.commenterUsername,
      commentId: req.body.commentId,
      eventField: req.body.eventField,
      followConfirmBaseUrl: req.body.followConfirmBaseUrl,
    })

    return res.status(200).json({
      ok: true,
      ...result,
    })
  }),
)

router.post(
  "/internal/n8n/follow-confirm",
  requireN8nSecret,
  asyncHandler(async (req, res) => {
    await connectToDatabase()

    const result = await confirmCommentAutomation({
      instagramAccountId: req.body.instagramAccountId,
      postId: req.body.postId,
      igUserId: req.body.igUserId,
      automationId: req.body.automationId,
    })

    return res.status(200).json({
      ok: true,
      ...result,
    })
  }),
)

module.exports = {
  backendRouter: router,
}
