const express = require("express")
const { connectToDatabase } = require("./db")
const Owner = require("./models/Owner")
const ApiCall = require("./models/ApiCall")
const { hashPassword, verifyPassword } = require("./services/passwordService")
const { exchangeCodeForLongLivedToken } = require("./services/instagramAuthService")
const { sendPrivateReply } = require("./services/instagramMessagingService")
const {
  readSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
} = require("./services/sessionService")
const { getOwnerScopedWorkspace } = require("./services/workspaceDataService")

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase()
}

function buildOwnerResponse(owner) {
  return {
    id: owner._id.toString(),
    email: owner.email,
    instagramUserId: owner.instagramUserId,
    instagramUsername: owner.instagramUsername,
    instagramConnected: Boolean(owner.longLivedAccessToken),
    tokenExpiresAt: owner.tokenExpiresAt,
    connectedAt: owner.instagramConnectedAt,
  }
}

function validateCallbackPayload(payload) {
  const email = normalizeEmail(payload?.email || payload?.identifier || payload?.username)
  const password = String(payload?.password || "")
  const code = String(payload?.code || "").trim()

  if (!email) {
    return "Email is required."
  }

  if (!password.trim()) {
    return "Password is required."
  }

  if (!code) {
    return "Instagram authorization code is required."
  }

  return ""
}

function validateLoginPayload(payload) {
  const email = normalizeEmail(payload?.email || payload?.identifier)
  const password = String(payload?.password || "")

  if (!email) {
    return "Email is required."
  }

  if (!password.trim()) {
    return "Password is required."
  }

  return ""
}

function validatePrivateReplyPayload(payload) {
  const lookupValue = String(payload?.ownerId || payload?.email || payload?.identifier || "").trim()
  const commentId = String(payload?.commentId || "").trim()
  const text = String(payload?.text || "").trim()

  if (!lookupValue) {
    return "ownerId or email is required."
  }

  if (!commentId) {
    return "commentId is required."
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

const router = express.Router()

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

    const email = normalizeEmail(req.body.email || req.body.identifier || req.body.username)
    const password = String(req.body.password || "")
    const authorizationCode = String(req.body.code || "").trim()
    const state = String(req.body.state || "").trim()
    const redirectUri = String(req.body.redirectUri || "").trim()

    const existingOwner = await Owner.findOne({ email })
    let passwordHash = existingOwner?.passwordHash || ""

    if (existingOwner) {
      const passwordMatches = await verifyPassword(password, existingOwner.passwordHash)

      if (!passwordMatches) {
        return res.status(401).json({
          authenticated: false,
          message: "Email already exists, but the password does not match.",
        })
      }
    } else {
      passwordHash = await hashPassword(password)
    }

    const apiCall = await ApiCall.create({
      requestType: "instagram_callback",
      status: "received",
      email,
      passwordHash,
      authorizationCode,
      state,
      redirectUri,
      requestPayload: {
        email,
        state,
        redirectUri,
        receivedPasswordLength: password.length,
      },
    })

    try {
      const exchangeResult = await exchangeCodeForLongLivedToken({
        code: authorizationCode,
        redirectUri,
      })

      const owner =
        existingOwner ||
        new Owner({
          email,
          passwordHash,
        })

      owner.passwordHash = passwordHash
      owner.authorizationCode = exchangeResult.authorizationCode
      owner.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
      owner.longLivedAccessToken = exchangeResult.longLivedAccessToken
      owner.instagramUserId = exchangeResult.instagramUserId
      owner.tokenType = exchangeResult.tokenType
      owner.tokenExpiresAt = exchangeResult.tokenExpiresAt
      owner.permissions = exchangeResult.permissions
      owner.lastMetaState = state
      owner.lastRedirectUri = exchangeResult.redirectUriUsed
      owner.instagramConnectedAt = new Date()
      owner.status = "connected"

      await owner.save()
      setSessionCookie(res, owner)

      apiCall.status = "completed"
      apiCall.ownerId = owner._id
      apiCall.shortLivedAccessToken = exchangeResult.shortLivedAccessToken
      apiCall.longLivedAccessToken = exchangeResult.longLivedAccessToken
      apiCall.instagramUserId = exchangeResult.instagramUserId
      apiCall.responsePayload = {
        tokenType: exchangeResult.tokenType,
        tokenExpiresAt: exchangeResult.tokenExpiresAt,
        permissions: exchangeResult.permissions,
      }
      await apiCall.save()

      return res.status(existingOwner ? 200 : 201).json({
        authenticated: true,
        authStatus: "authenticated",
        owner: buildOwnerResponse(owner),
        exchange: {
          receivedCode: true,
          longLivedTokenStored: true,
        },
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
  "/auth/login",
  asyncHandler(async (req, res) => {
    const validationError = validateLoginPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        authenticated: false,
        message: validationError,
      })
    }

    await connectToDatabase()

    const email = normalizeEmail(req.body.email || req.body.identifier)
    const password = String(req.body.password || "")
    const owner = await Owner.findOne({ email })

    if (!owner) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid email or password.",
      })
    }

    const passwordMatches = await verifyPassword(password, owner.passwordHash)

    if (!passwordMatches) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid email or password.",
      })
    }

    setSessionCookie(res, owner)

    return res.status(200).json({
      authenticated: true,
      owner: buildOwnerResponse(owner),
      userExists: true,
    })
  }),
)

router.get(
  "/auth/session",
  asyncHandler(async (req, res) => {
    const owner = await getAuthenticatedOwner(req)

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
    return res.status(200).json(buildOwnerResponse(req.owner))
  }),
)

router.get(
  "/campaigns",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const workspace = await getOwnerScopedWorkspace(req.owner)
    return res.status(200).json({
      items: workspace.campaigns,
      total: workspace.campaigns.length,
    })
  }),
)

router.get(
  "/dm-logs",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const workspace = await getOwnerScopedWorkspace(req.owner)
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

router.post(
  "/instagram/private-reply",
  asyncHandler(async (req, res) => {
    const validationError = validatePrivateReplyPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      })
    }

    await connectToDatabase()

    const lookupValue = String(req.body.ownerId || req.body.email || req.body.identifier || "").trim()
    const commentId = String(req.body.commentId || "").trim()
    const text = String(req.body.text || "").trim()
    const owner =
      lookupValue.includes("@") || !lookupValue.match(/^[a-fA-F0-9]{24}$/)
        ? await Owner.findOne({ email: normalizeEmail(lookupValue) })
        : await Owner.findById(lookupValue)

    if (!owner?.longLivedAccessToken || !owner.instagramUserId) {
      return res.status(404).json({
        ok: false,
        message: "No connected Instagram owner found for that lookup value.",
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
        text,
      },
    })

    try {
      const result = await sendPrivateReply({
        instagramUserId: owner.instagramUserId,
        accessToken: owner.longLivedAccessToken,
        commentId,
        text,
      })

      apiCall.status = "completed"
      apiCall.responsePayload = result
      await apiCall.save()

      return res.status(200).json({
        ok: true,
        owner: buildOwnerResponse(owner),
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
