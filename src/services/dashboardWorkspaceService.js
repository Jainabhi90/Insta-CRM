import { completeInstagramCallback } from "../api/auth/instagramCallbackApi"
import { getCurrentSession } from "../api/auth/sessionApi"
import { getOwnerProfile } from "../api/owner/ownerApi"
import { getCampaigns } from "../api/campaigns/campaignApi"
import { getDmLogs } from "../api/dmLogs/dmLogApi"
import { getAutomations } from "../api/automations/automationApi"
import {
  ApiError,
  canUseDemoFallback,
  isDemoFallbackEnabled,
} from "../api/core/apiClient"
import { buildAutomationWorkspace } from "../adapters/automationAdapter"
import { buildPerformanceWorkspace } from "../adapters/campaignAdapter"
import { buildLeadWorkspace } from "../adapters/dmLogAdapter"
import { normalizeOwner, normalizeSession } from "../adapters/ownerAdapter"
import { getInstagramRedirectUri } from "../lib/instagramAuthConfig"
import { createWorkspaceModel } from "../lib/mockWorkspace"
import { completeDemoInstagramSignup, getStoredDemoSession } from "./demoSessionService"

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
    return `${label} are temporarily unavailable. Preview data is shown while the backend recovers. (${message})`
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

  if (isDemoFallbackEnabled()) {
    await completeDemoInstagramSignup(payload)
    return
  }

  try {
    await completeInstagramCallback(payload)
  } catch (error) {
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
        "The backend is temporarily unavailable, so demo data is shown instead.",
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

  let owner = session.owner

  try {
    const ownerPayload = await getOwnerProfile()
    owner = normalizeOwner(ownerPayload, owner)
  } catch (error) {
    if (canUseDemoFallback(error)) {
      return getDemoWorkspaceResponse(
        "The backend is temporarily unavailable, so demo data is shown instead.",
      )
    }

    throw error
  }

  const fallbackWorkspace = createWorkspaceModel(owner)
  const warnings = []
  const [campaignResult, dmLogResult, automationResult] = await Promise.allSettled([
    getCampaigns(),
    getDmLogs(),
    getAutomations(),
  ])

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
    },
    warnings,
  }
}
