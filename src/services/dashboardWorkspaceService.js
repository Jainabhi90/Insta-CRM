import { completeInstagramCallback } from "../api/auth/instagramCallbackApi"
import { getCurrentSession } from "../api/auth/sessionApi"
import { getOwnerProfile } from "../api/owner/ownerApi"
import { getCampaigns } from "../api/campaigns/campaignApi"
import { getDmLogs } from "../api/dmLogs/dmLogApi"
import { getAutomations } from "../api/automations/automationApi"
import { getInstagramComments } from "../api/instagram/commentsApi"
import { getInstagramInbox } from "../api/instagram/inboxApi"
import {
  ApiError,
  canUseDemoFallback,
  isDemoFallbackEnabled,
} from "../api/core/apiClient"
import { buildAutomationWorkspace } from "../adapters/automationAdapter"
import { buildPerformanceWorkspace } from "../adapters/campaignAdapter"
import { buildCommentWorkspace } from "../adapters/commentAdapter"
import { buildLeadWorkspace } from "../adapters/dmLogAdapter"
import { buildInboxWorkspace } from "../adapters/inboxAdapter"
import { normalizeOwner, normalizeSession } from "../adapters/ownerAdapter"
import { getInstagramRedirectUri } from "../lib/instagramAuthConfig"
import { createWorkspaceModel } from "../lib/mockWorkspace"
import { completeDemoInstagramSignup, getStoredDemoSession } from "./demoSessionService"

const INSTAGRAM_CALLBACK_LOCK_PREFIX = "instagram_callback_inflight:"
const WORKSPACE_CACHE_PREFIX = "instalead.workspace.cache:"
const WORKSPACE_CACHE_VERSION = 1
const WORKSPACE_SECTION_TIMEOUT_MS = 8000

function withTimeout(promise, label, timeoutMs = WORKSPACE_SECTION_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = globalThis.setTimeout(() => {
      reject(new Error(`${label} took too long to load.`))
    }, timeoutMs)

    Promise.resolve(promise)
      .then((value) => {
        globalThis.clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        globalThis.clearTimeout(timer)
        reject(error)
      })
  })
}

function getWorkspaceOwnerId(sessionLike) {
  return String(
    sessionLike?.owner?.id ||
      sessionLike?.selectedOwnerId ||
      "",
  ).trim()
}

function getWorkspaceCacheKey(ownerId) {
  return `${WORKSPACE_CACHE_PREFIX}${ownerId}`
}

export function readCachedWorkspace(sessionLike) {
  if (typeof window === "undefined") {
    return null
  }

  const ownerId = getWorkspaceOwnerId(sessionLike)
  if (!ownerId) {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(getWorkspaceCacheKey(ownerId))
    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue)
    if (parsed?.version !== WORKSPACE_CACHE_VERSION || !parsed?.workspace) {
      return null
    }

    return parsed.workspace
  } catch {
    return null
  }
}

export function writeCachedWorkspace(sessionLike, workspace) {
  if (typeof window === "undefined" || !workspace) {
    return
  }

  const ownerId = getWorkspaceOwnerId(sessionLike)
  if (!ownerId) {
    return
  }

  try {
    window.localStorage.setItem(
      getWorkspaceCacheKey(ownerId),
      JSON.stringify({
        version: WORKSPACE_CACHE_VERSION,
        savedAt: new Date().toISOString(),
        workspace,
      }),
    )
  } catch {
    // Ignore quota/storage errors and continue without cache.
  }
}

function buildWorkspaceResponse(owner, session, warnings = []) {
  const fallbackWorkspace = createWorkspaceModel(owner)

  return {
    session: {
      ...session,
      owner,
    },
    workspace: {
      leads: fallbackWorkspace.leads,
      leadSummary: fallbackWorkspace.leadSummary,
      automations: fallbackWorkspace.automations,
      automationSummary: fallbackWorkspace.automationSummary,
      automationTip: fallbackWorkspace.automationTip,
      posts: fallbackWorkspace.posts,
      performanceSummary: fallbackWorkspace.performanceSummary,
      performanceInsight: fallbackWorkspace.performanceInsight,
      comments: [],
      commentSummary: {
        totalComments: 0,
        mediaReviewed: 0,
        latestActivityLabel: "No recent comments yet",
      },
      inbox: [],
      inboxSummary: {
        totalConversations: 0,
        latestActivityLabel: "No recent DMs yet",
        accountUsername: owner?.instagramUsername || "",
      },
    },
    warnings,
  }
}

function getDemoWorkspaceResponse(reason) {
  const demoSession = getStoredDemoSession()

  if (!demoSession) {
    return {
      session: null,
      workspace: null,
      warnings: reason ? [reason] : [],
    }
  }

  return buildWorkspaceResponse(demoSession.owner, demoSession, reason ? [reason] : [])
}

function buildSectionWarning(label, error, isPreviewData) {
  const message = error?.message || `${label} could not be loaded.`

  if (isPreviewData) {
    return `${label} are temporarily unavailable for the moment. Saved preview content is shown meanwhile. (${message})`
  }

  return `${label} could not be loaded: ${message}`
}

function resolveWorkspaceSection({
  label,
  result,
  fallbackWorkspace,
  buildLiveWorkspace,
  buildPreviewWorkspace,
  warnings,
}) {
  if (result.status === "fulfilled") {
    return buildLiveWorkspace(result.value, fallbackWorkspace)
  }

  if (canUseDemoFallback(result.reason)) {
    warnings.push(buildSectionWarning(label, result.reason, true))
    return buildPreviewWorkspace(null, fallbackWorkspace, { usePreviewFallback: true })
  }

  warnings.push(buildSectionWarning(label, result.reason, false))
  return buildLiveWorkspace(null, fallbackWorkspace)
}

export async function finishInstagramLogin(callbackParams) {
  if (callbackParams.error || callbackParams.errorReason) {
    throw new Error(
      callbackParams.errorDescription ||
        callbackParams.errorReason ||
        callbackParams.error ||
        "Instagram login was not completed.",
    )
  }

  const payload = {
    code: callbackParams.code,
    state: callbackParams.state,
    redirectUri: getInstagramRedirectUri(),
  }

  const lockKey =
    `${INSTAGRAM_CALLBACK_LOCK_PREFIX}${String(payload.state || "")}:${String(payload.code || "")}`

  if (typeof window !== "undefined" && window.sessionStorage.getItem(lockKey) === "1") {
    return
  }

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(lockKey, "1")
  }

  if (isDemoFallbackEnabled()) {
    await completeDemoInstagramSignup(payload)
    return
  }

  try {
    await completeInstagramCallback(payload)
  } catch (error) {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(lockKey)
    }

    if (canUseDemoFallback(error)) {
      await completeDemoInstagramSignup(payload)
      return
    }

    throw error
  }
}

export async function loadAuthenticatedWorkspace() {
  if (isDemoFallbackEnabled()) {
    return getDemoWorkspaceResponse(
      "Demo mode is active because VITE_API_BASE_URL is not set in development.",
    )
  }

  let sessionPayload

  try {
    sessionPayload = await getCurrentSession()
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return {
        session: null,
        workspace: null,
        warnings: [],
      }
    }

    if (canUseDemoFallback(error)) {
      return getDemoWorkspaceResponse(
        "The service is temporarily unavailable, so preview data is shown instead.",
      )
    }

    throw error
  }

  const session = normalizeSession(sessionPayload)

  if (!session) {
    return {
      session: null,
      workspace: null,
      warnings: [],
    }
  }

  if (session.authStatus !== "authenticated") {
    throw new Error(
      "Signup must finish inside /api/auth/instagram/callback. The frontend no longer supports a second account-setup step.",
    )
  }

  if (!session.owner) {
    return {
      session,
      workspace: null,
      warnings: ["Choose an Instagram account from your workspace first."],
    }
  }

  let owner = session.owner
  const warnings = []

  try {
    const ownerPayload = await withTimeout(getOwnerProfile(), "Instagram account profile")
    owner = normalizeOwner(ownerPayload, owner)
  } catch (error) {
    if (canUseDemoFallback(error)) {
      return getDemoWorkspaceResponse(
        "The service is temporarily unavailable, so preview data is shown instead.",
      )
    }

    warnings.push(`Instagram account profile could not be refreshed: ${error.message || "Unknown error."}`)
  }

  const fallbackWorkspace = createWorkspaceModel(owner)
  const [campaignResult, automationResult, commentResult, inboxResult] = await Promise.allSettled([
    withTimeout(getCampaigns(), "Campaign analytics"),
    withTimeout(getAutomations(), "Automation rules"),
    withTimeout(getInstagramComments(), "Instagram comments"),
    withTimeout(getInstagramInbox(), "Instagram inbox"),
  ])

  const dmLogResult =
    inboxResult.status === "fulfilled" ? inboxResult : await getDmLogFallbackResult()

  const performance = resolveWorkspaceSection({
    label: "Campaign analytics",
    result: campaignResult,
    fallbackWorkspace,
    buildLiveWorkspace: buildPerformanceWorkspace,
    buildPreviewWorkspace: buildPerformanceWorkspace,
    warnings,
  })

  const leads = resolveWorkspaceSection({
    label: "DM lead activity",
    result: dmLogResult,
    fallbackWorkspace,
    buildLiveWorkspace: buildLeadWorkspace,
    buildPreviewWorkspace: buildLeadWorkspace,
    warnings,
  })

  const automations = resolveWorkspaceSection({
    label: "Automation rules",
    result: automationResult,
    fallbackWorkspace,
    buildLiveWorkspace: buildAutomationWorkspace,
    buildPreviewWorkspace: buildAutomationWorkspace,
    warnings,
  })

  const comments = resolveWorkspaceSection({
    label: "Instagram comments",
    result: commentResult,
    fallbackWorkspace,
    buildLiveWorkspace: buildCommentWorkspace,
    buildPreviewWorkspace: buildCommentWorkspace,
    warnings,
  })

  const inbox = resolveWorkspaceSection({
    label: "Instagram inbox",
    result: inboxResult,
    fallbackWorkspace,
    buildLiveWorkspace: buildInboxWorkspace,
    buildPreviewWorkspace: buildInboxWorkspace,
    warnings,
  })

  return {
    session: {
      ...session,
      owner,
    },
    workspace: {
      leads: leads.leads,
      leadSummary: leads.summary,
      automations: automations.templates,
      automationSummary: automations.summary,
      automationTip: automations.tip,
      posts: performance.posts,
      performanceSummary: performance.summary,
      performanceInsight: performance.insight,
      comments: comments.comments,
      commentSummary: comments.summary,
      inbox: inbox.conversations,
      inboxSummary: inbox.summary,
    },
    warnings,
  }
}

async function getDmLogFallbackResult() {
  try {
    const dmLogs = await withTimeout(getDmLogs(), "DM lead activity")
    return {
      status: "fulfilled",
      value: dmLogs,
    }
  } catch (error) {
    return {
      status: "rejected",
      reason: error,
    }
  }
}
