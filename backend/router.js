const express = require("express")
const crypto = require("crypto")
const { config } = require("./config")
const { connectToDatabase } = require("./db")
const GOwner = require("./models/GOwner")
const IOwner = require("./models/IOwner")
const Owner = require("./models/Owner")
const ApiCall = require("./models/ApiCall")
const AutomationEvent = require("./models/AutomationEvent")
const { hashPassword } = require("./services/passwordService")
const {
  confirmCommentAutomation,
  createOwnerAutomation,
  listOwnerAutomations,
  triggerCommentAutomation,
  updateOwnerAutomation,
} = require("./services/automationService")
const {
  applyOwnerSubscription,
  buildOwnerPlanSnapshot,
  isSupportedPlanTier,
  normalizeBillingCycle,
  normalizePlanTier,
} = require("./services/subscriptionPlanService")
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
  createRazorpayOrder,
  getPaidPlanCheckoutConfig,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} = require("./services/razorpayService")
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
  if (!owner || typeof owner !== "object") {
    throw new Error("buildOwnerResponse: invalid owner object")
  }

  const plan = buildOwnerPlanSnapshot(owner)

  return {
    id: owner._id?.toString() ?? "unknown",
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
    plan: plan.planName,
    planName: plan.planName,
    subscriptionTier: plan.tier,
    subscriptionStatus: plan.subscriptionStatus,
    subscriptionBillingCycle: plan.billingCycle,
    limits: {
      automationLimit: plan.automationLimit,
      dmLimitPerAutomation: plan.dmLimitPerAutomation,
    },
  }
}

function resolveRequestBaseUrl(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim()
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim()
  const host = forwardedHost || String(req.headers.host || "").trim()
  const protocol = forwardedProto || req.protocol || "https"

  if (host) {
    return `${protocol}://${host}`
  }

  return config.frontendOrigins[0] || ""
}

function shouldAttemptCommentAutomation(comment) {
  const timestamp = String(comment?.timestamp || "").trim()

  if (!timestamp) {
    return true
  }

  const commentTime = new Date(timestamp).getTime()

  if (!Number.isFinite(commentTime)) {
    return true
  }

  const AUTOMATION_FALLBACK_WINDOW_MS = 30 * 60 * 1000
  return Date.now() - commentTime <= AUTOMATION_FALLBACK_WINDOW_MS
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

  const MAX_REPLY_LENGTH = 1000
  if (text.length > MAX_REPLY_LENGTH) {
    return `Reply text must be ${MAX_REPLY_LENGTH} characters or fewer.`
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

function validateRazorpayOrderPayload(payload) {
  const tier = String(payload?.tier || payload?.plan || payload?.subscriptionTier || "").trim()

  if (!tier) {
    return "Select a plan before creating a Razorpay order."
  }

  return ""
}

function validateRazorpayVerifyPayload(payload) {
  const orderId = String(payload?.razorpay_order_id || payload?.orderId || "").trim()
  const paymentId = String(payload?.razorpay_payment_id || payload?.paymentId || "").trim()
  const signature = String(payload?.razorpay_signature || payload?.signature || "").trim()
  const tier = String(payload?.tier || payload?.plan || payload?.subscriptionTier || "").trim()

  if (!orderId || !paymentId || !signature) {
    return "Razorpay order, payment, and signature are required."
  }

  if (!tier) {
    return "Plan tier is required for payment verification."
  }

  return ""
}

function buildAutomationEventResponse(event) {
  return {
    id: event._id?.toString() || "",
    source: event.source,
    eventField: event.eventField,
    ownerId: event.ownerId?.toString() || "",
    automationId: event.automationId?.toString() || "",
    mediaId: event.mediaId,
    commentId: event.commentId,
    commentText: event.commentText,
    commenterId: event.commenterId,
    commenterUsername: event.commenterUsername,
    listened: Boolean(event.listened),
    matched: Boolean(event.matched),
    action: event.action,
    reason: event.reason,
    dmLogId: event.dmLogId?.toString() || "",
    confirmUrl: event.confirmUrl,
    errorMessage: event.errorMessage,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }
}

function buildAutomationStatusAnswer(events) {
  const latestEvent = events[0] || null
  const hasMetaWebhookEvent = events.some((event) => event.source === "meta_webhook")
  const hasListenedEvent = events.some((event) => event.listened)
  const hasMatchedEvent = events.some((event) => event.matched)
  const hasPromptedEvent = events.some((event) => event.action === "prompted")
  const hasFinalSentEvent = events.some(
    (event) => event.action === "sent" && event.source === "follow_confirm",
  )

  return {
    metaSentTrigger: hasMetaWebhookEvent ? "yes" : "no",
    automationListened: hasListenedEvent ? "yes" : "no",
    matchedRule: hasMatchedEvent ? "yes" : "no",
    dmPromptSent: hasPromptedEvent ? "yes" : "no",
    finalDmSent: hasFinalSentEvent ? "yes" : "no",
    latestSource: latestEvent?.source || "",
    latestAction: latestEvent?.action || "",
    latestReason: latestEvent?.reason || latestEvent?.errorMessage || "",
    latestEventAt: latestEvent?.createdAt || null,
  }
}

async function findSubscriptionOwnerById(ownerId) {
  const normalizedOwnerId = String(ownerId || "").trim()

  if (!normalizedOwnerId) {
    return null
  }

  const iowner = await IOwner.findById(normalizedOwnerId)

  if (iowner) {
    return iowner
  }

  return Owner.findById(normalizedOwnerId)
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderAutomationConfirmPage({ status = "success", title, message }) {
  const palette =
    status === "success"
      ? {
          badge: "Ready",
          tint: "rgba(219, 39, 119, 0.12)",
          border: "rgba(236, 72, 153, 0.25)",
          primary: "#db2777",
          shadow: "rgba(219, 39, 119, 0.22)",
        }
      : {
          badge: "Needs attention",
          tint: "rgba(148, 163, 184, 0.12)",
          border: "rgba(148, 163, 184, 0.26)",
          primary: "#64748b",
          shadow: "rgba(100, 116, 139, 0.18)",
        }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} • InstaLead</title>
    <style>
      :root {
        color-scheme: light;
        --bg-a: #fff8fc;
        --bg-b: #fffdf7;
        --card: rgba(255,255,255,0.88);
        --border: ${palette.border};
        --primary: ${palette.primary};
        --text: #251829;
        --muted: #6b5a67;
        --shadow: 0 38px 90px -56px ${palette.shadow};
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(251, 207, 232, 0.6), transparent 32%),
          radial-gradient(circle at bottom right, rgba(254, 240, 138, 0.32), transparent 34%),
          linear-gradient(135deg, var(--bg-a), var(--bg-b));
        color: var(--text);
      }
      .card {
        width: min(100%, 520px);
        padding: 30px 28px;
        border-radius: 28px;
        border: 1px solid var(--border);
        background: var(--card);
        box-shadow: var(--shadow);
        backdrop-filter: blur(18px);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: ${palette.tint};
        color: var(--primary);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.01em;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--primary);
        box-shadow: 0 0 0 6px ${palette.tint};
      }
      h1 {
        margin: 18px 0 10px;
        font-size: clamp(28px, 4vw, 38px);
        line-height: 1.05;
      }
      p {
        margin: 0;
        color: var(--muted);
        font-size: 16px;
        line-height: 1.65;
      }
      .footer {
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px solid rgba(226, 232, 240, 0.75);
        color: var(--muted);
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="badge"><span class="dot"></span>${escapeHtml(palette.badge)}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <div class="footer">You can close this tab and return to Instagram.</div>
    </main>
  </body>
</html>`
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

    if (selectedOwner.connectionStatus !== "connected") {
      return res.status(400).json({
        ok: false,
        message: "This Instagram account is not connected. Please reconnect it first.",
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
      limits: workspace.limits,
    })
  }),
)

router.get(
  "/subscription",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const plan = buildOwnerPlanSnapshot(req.owner)

    return res.status(200).json({
      ok: true,
      ownerId: req.owner._id.toString(),
      instagramUserId: String(req.owner.instagramUserId || ""),
      instagramUsername: String(req.owner.instagramUsername || ""),
      tier: plan.tier,
      planName: plan.planName,
      status: plan.subscriptionStatus,
      billingCycle: plan.billingCycle,
      limits: {
        automationLimit: plan.automationLimit,
        dmLimitPerAutomation: plan.dmLimitPerAutomation,
      },
      subscribedAt: plan.subscribedAt,
      expiresAt: plan.expiresAt,
    })
  }),
)

router.patch(
  "/subscription/plan",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const requestedTier = String(req.body?.tier || req.body?.plan || req.body?.subscriptionTier || "").trim()
    const billingCycle = normalizeBillingCycle(req.body?.billingCycle || req.body?.cycle)

    if (!requestedTier || !isSupportedPlanTier(requestedTier)) {
      return res.status(400).json({
        ok: false,
        message: "Plan tier must be one of: free, premium, premium_plus.",
      })
    }

    const tier = normalizePlanTier(requestedTier)

    req.owner.subscriptionTier = tier
    req.owner.subscriptionBillingCycle = billingCycle
    req.owner.subscriptionStatus = "active"
    req.owner.subscriptionSource = req.owner.subscriptionSource || "manual"
    req.owner.subscriptionPurchasedAt = req.owner.subscriptionPurchasedAt || new Date()
    await req.owner.save()

    const plan = buildOwnerPlanSnapshot(req.owner)

    return res.status(200).json({
      ok: true,
      owner: buildOwnerResponse(req.owner),
      subscription: {
        tier: plan.tier,
        planName: plan.planName,
        status: plan.subscriptionStatus,
        billingCycle: plan.billingCycle,
        limits: {
          automationLimit: plan.automationLimit,
          dmLimitPerAutomation: plan.dmLimitPerAutomation,
        },
        subscribedAt: plan.subscribedAt,
        expiresAt: plan.expiresAt,
      },
    })
  }),
)

router.post(
  "/payments/razorpay/order",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const validationError = validateRazorpayOrderPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      })
    }

    const checkoutPlan = getPaidPlanCheckoutConfig(
      req.body?.tier || req.body?.plan || req.body?.subscriptionTier,
      req.body?.billingCycle || req.body?.cycle,
    )
    const receipt = `rcpt_${req.owner._id.toString().slice(-8)}_${Date.now()}`

    const apiCall = await ApiCall.create({
      requestType: "razorpay_order",
      status: "received",
      email: req.owner.email || "",
      ownerId: req.owner.gownerId ? null : req.owner._id,
      gownerId: req.owner.gownerId || null,
      iownerId: req.owner.gownerId ? req.owner._id : null,
      instagramUserId: req.owner.instagramUserId || "",
      requestPayload: {
        tier: checkoutPlan.tier,
        billingCycle: checkoutPlan.billingCycle,
        amount: checkoutPlan.amount,
        currency: checkoutPlan.currency,
      },
    })

    try {
      const order = await createRazorpayOrder({
        amount: checkoutPlan.amount,
        currency: checkoutPlan.currency,
        receipt,
        notes: {
          ownerId: req.owner._id.toString(),
          ownerModel: req.owner.gownerId ? "iowner" : "owner",
          instagramUserId: String(req.owner.instagramUserId || ""),
          subscriptionTier: checkoutPlan.tier,
          billingCycle: checkoutPlan.billingCycle,
        },
      })

      req.owner.razorpayOrderId = String(order.id || "").trim()
      await req.owner.save()

      apiCall.status = "completed"
      apiCall.responsePayload = {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      }
      await apiCall.save()

      return res.status(200).json({
        ok: true,
        keyId: config.razorpay.keyId,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
        plan: {
          tier: checkoutPlan.tier,
          planName: checkoutPlan.planName,
          billingCycle: checkoutPlan.billingCycle,
          automationLimit: checkoutPlan.automationLimit,
          dmLimitPerAutomation: checkoutPlan.dmLimitPerAutomation,
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
  "/payments/razorpay/verify",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const validationError = validateRazorpayVerifyPayload(req.body)

    if (validationError) {
      return res.status(400).json({
        ok: false,
        message: validationError,
      })
    }

    const orderId = String(req.body?.razorpay_order_id || req.body?.orderId || "").trim()
    const paymentId = String(req.body?.razorpay_payment_id || req.body?.paymentId || "").trim()
    const signature = String(req.body?.razorpay_signature || req.body?.signature || "").trim()
    const checkoutPlan = getPaidPlanCheckoutConfig(
      req.body?.tier || req.body?.plan || req.body?.subscriptionTier,
      req.body?.billingCycle || req.body?.cycle,
    )

    const apiCall = await ApiCall.create({
      requestType: "razorpay_verify",
      status: "received",
      email: req.owner.email || "",
      ownerId: req.owner.gownerId ? null : req.owner._id,
      gownerId: req.owner.gownerId || null,
      iownerId: req.owner.gownerId ? req.owner._id : null,
      instagramUserId: req.owner.instagramUserId || "",
      requestPayload: {
        tier: checkoutPlan.tier,
        billingCycle: checkoutPlan.billingCycle,
        orderId,
        paymentId,
      },
    })

    if (!verifyRazorpayPaymentSignature({ orderId, paymentId, signature })) {
      apiCall.status = "failed"
      apiCall.errorMessage = "Razorpay payment signature verification failed."
      await apiCall.save()

      return res.status(400).json({
        ok: false,
        message: "Razorpay payment signature verification failed.",
      })
    }

    const subscription = await applyOwnerSubscription(req.owner, {
      tier: checkoutPlan.tier,
      billingCycle: checkoutPlan.billingCycle,
      source: "razorpay",
      purchasedAt: new Date(),
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    })

    apiCall.status = "completed"
    apiCall.responsePayload = {
      tier: subscription.tier,
      planName: subscription.planName,
      status: subscription.subscriptionStatus,
      expiresAt: subscription.expiresAt,
    }
    await apiCall.save()

    return res.status(200).json({
      ok: true,
      owner: buildOwnerResponse(req.owner),
      subscription: {
        tier: subscription.tier,
        planName: subscription.planName,
        status: subscription.subscriptionStatus,
        billingCycle: subscription.billingCycle,
        limits: {
          automationLimit: subscription.automationLimit,
          dmLimitPerAutomation: subscription.dmLimitPerAutomation,
        },
        subscribedAt: subscription.subscribedAt,
        expiresAt: subscription.expiresAt,
      },
    })
  }),
)

router.post(
  "/payments/razorpay/webhook",
  asyncHandler(async (req, res) => {
    const signature = String(req.headers["x-razorpay-signature"] || "").trim()

    if (!signature) {
      return res.status(400).json({
        ok: false,
        message: "Missing Razorpay webhook signature.",
      })
    }

    if (!verifyRazorpayWebhookSignature(req.rawBody, signature)) {
      return res.status(403).json({
        ok: false,
        message: "Razorpay webhook signature verification failed.",
      })
    }

    const eventType = String(req.body?.event || "").trim()
    const paymentEntity = req.body?.payload?.payment?.entity || null
    const orderEntity = req.body?.payload?.order?.entity || null
    const notes = paymentEntity?.notes || orderEntity?.notes || {}
    const ownerId = String(notes?.ownerId || "").trim()
    const requestedTier = String(notes?.subscriptionTier || "").trim()
    const billingCycle = normalizeBillingCycle(notes?.billingCycle)

    const apiCall = await ApiCall.create({
      requestType: "razorpay_webhook",
      status: "received",
      email: "",
      instagramUserId: String(notes?.instagramUserId || ""),
      requestPayload: {
        event: eventType,
        orderId: orderEntity?.id || paymentEntity?.order_id || "",
        paymentId: paymentEntity?.id || "",
        ownerId,
        subscriptionTier: requestedTier,
        billingCycle,
      },
    })

    if (!ownerId || !requestedTier) {
      apiCall.status = "completed"
      apiCall.responsePayload = {
        ignored: true,
        reason: "missing_owner_or_tier",
      }
      await apiCall.save()

      return res.status(200).json({
        ok: true,
        ignored: true,
      })
    }

    if (!["payment.captured", "order.paid"].includes(eventType)) {
      apiCall.status = "completed"
      apiCall.responsePayload = {
        ignored: true,
        reason: "event_not_used_for_subscription_activation",
      }
      await apiCall.save()

      return res.status(200).json({
        ok: true,
        ignored: true,
      })
    }

    const owner = await findSubscriptionOwnerById(ownerId)

    if (!owner) {
      apiCall.status = "failed"
      apiCall.errorMessage = "Webhook owner was not found."
      await apiCall.save()

      return res.status(404).json({
        ok: false,
        message: "Webhook owner was not found.",
      })
    }

    const checkoutPlan = getPaidPlanCheckoutConfig(requestedTier, billingCycle)
    const paymentId = String(paymentEntity?.id || "").trim()
    const orderId = String(orderEntity?.id || paymentEntity?.order_id || "").trim()
    const customerId = String(paymentEntity?.customer_id || "").trim()

    const subscription = await applyOwnerSubscription(owner, {
      tier: checkoutPlan.tier,
      billingCycle: checkoutPlan.billingCycle,
      source: "razorpay_webhook",
      purchasedAt: new Date(),
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpayCustomerId: customerId,
    })

    apiCall.status = "completed"
    apiCall.email = owner.email || ""
    apiCall.ownerId = owner.gownerId ? null : owner._id
    apiCall.gownerId = owner.gownerId || null
    apiCall.iownerId = owner.gownerId ? owner._id : null
    apiCall.responsePayload = {
      tier: subscription.tier,
      planName: subscription.planName,
      status: subscription.subscriptionStatus,
      expiresAt: subscription.expiresAt,
    }
    await apiCall.save()

    return res.status(200).json({
      ok: true,
      processed: true,
    })
  }),
)

router.get(
  "/automations/status",
  asyncHandler(async (req, res, next) => requireAuthenticatedOwner(req, res, next)),
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(String(req.query.limit || "10"), 10) || 10, 1), 50)
    const commentId = String(req.query.commentId || "").trim()
    const commenterId = String(req.query.commenterId || req.query.igUserId || "").trim()
    const mediaId = String(req.query.mediaId || req.query.postId || "").trim()
    const automationId = String(req.query.automationId || "").trim()

    const query = {
      ownerId: req.owner._id,
    }

    if (commentId) {
      query.commentId = commentId
    }

    if (commenterId) {
      query.commenterId = commenterId
    }

    if (mediaId) {
      query.mediaId = mediaId
    }

    if (automationId) {
      query.automationId = automationId
    }

    const events = await AutomationEvent.find(query).sort({ createdAt: -1 }).limit(limit)

    return res.status(200).json({
      ok: true,
      answer: buildAutomationStatusAnswer(events),
      total: events.length,
      filters: {
        commentId,
        commenterId,
        mediaId,
        automationId,
      },
      events: events.map(buildAutomationEventResponse),
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

    const baseUrl = resolveRequestBaseUrl(req)
    const followConfirmBaseUrl = baseUrl ? `${baseUrl}/api/automation/follow-confirm` : ""

    await Promise.all(
      comments.comments
        .filter(shouldAttemptCommentAutomation)
        .map((comment) =>
          triggerCommentAutomation({
            instagramAccountId: owner.instagramUserId,
            postId: comment.mediaId,
            commentText: comment.text,
            commenterId: comment.commenterId,
            commenterUsername: comment.commenterUsername,
            commentId: comment.id,
            eventField: "comments_refresh",
            followConfirmBaseUrl,
            triggerSource: "comments_refresh",
          }).catch((error) => {
            console.error("Comment automation fallback failed:", {
              commentId: comment.id,
              mediaId: comment.mediaId,
              message: error?.message || "Unknown error",
            })
            return null
          }),
        ),
    )

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
        instagramAccountId: owner.instagramAccountId || undefined,
        instagramUserId: owner.instagramUserId || undefined,
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

router.get(
  "/automation/follow-confirm",
  asyncHandler(async (req, res) => {
    await connectToDatabase()

    const result = await confirmCommentAutomation({
      instagramAccountId: req.query.instagramAccountId,
      postId: req.query.postId,
      igUserId: req.query.igUserId,
      automationId: req.query.automationId,
    })

    const isSuccess = result.action === "sent" || result.action === "already_sent"
    const title = isSuccess ? "Check your Instagram DMs" : "Automation could not finish"
    const message =
      result.message ||
      (isSuccess
        ? "The requested message is on its way."
        : "We could not complete this request. Please return to Instagram and try again.")

    return res
      .status(isSuccess ? 200 : 400)
      .type("html")
      .send(
        renderAutomationConfirmPage({
          status: isSuccess ? "success" : "error",
          title,
          message,
        }),
      )
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
      triggerSource: req.body.triggerSource || "internal_test",
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
