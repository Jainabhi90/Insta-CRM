import {
  formatRelativeTime,
  getArrayPayload,
  pickValue,
  toNumber,
} from "./backendPayloadUtils"

function buildEmptyLeadSummary() {
  return {
    totalLeads: 0,
    weeklyGrowth: "No synced leads yet",
    hotLeads: 0,
    hotLeadLabel: "Score 80+",
    responseRate: "0%",
    responseTrend: "Waiting for new DMs",
    estimatedRevenue: "₹0",
    revenueLabel: "No lead revenue yet",
  }
}

function getLeadBadgeSummary(leads, fallbackSummary) {
  const hotLeads = leads.filter((lead) => lead.leadScore >= 80).length
  const averageScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length)
      : 0

  return {
    totalLeads: leads.length,
    weeklyGrowth: fallbackSummary.weeklyGrowth,
    hotLeads,
    hotLeadLabel: "Score 80+",
    responseRate: `${Math.min(99, 72 + Math.round(averageScore / 4))}%`,
    responseTrend: fallbackSummary.responseTrend,
    estimatedRevenue: fallbackSummary.estimatedRevenue,
    revenueLabel: fallbackSummary.revenueLabel,
  }
}

export function buildLeadWorkspace(dmLogPayload, fallbackWorkspace, options = {}) {
  const { usePreviewFallback = false } = options
  const dmLogs = getArrayPayload(dmLogPayload, ["dmLogs", "logs"])

  if (dmLogs.length === 0) {
    if (usePreviewFallback) {
      return {
        leads: fallbackWorkspace.leads,
        summary: fallbackWorkspace.leadSummary,
        isFallback: true,
      }
    }

    return {
      leads: [],
      summary: buildEmptyLeadSummary(),
      isFallback: false,
    }
  }

  const leadMap = new Map()

  dmLogs.forEach((log, index) => {
    const handle = pickValue(
      log,
      ["handle", "instagram_handle", "username", "user_handle"],
      fallbackWorkspace.leads[index % fallbackWorkspace.leads.length].handle,
    )

    const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`
    const existingLead = leadMap.get(normalizedHandle)
    const leadScore = toNumber(
      pickValue(log, ["lead_score", "leadScore", "score"], existingLead?.leadScore || 55),
      existingLead?.leadScore || 55,
    )

    const nextLead = existingLead || {
      id: pickValue(log, ["id", "dm_log_id"], `${normalizedHandle}-${index}`),
      handle: normalizedHandle,
      lastInteraction: "Recently",
      leadScore,
      sourcePost: pickValue(
        log,
        ["source_post", "campaign_name", "post_caption", "campaignCaption"],
        fallbackWorkspace.leads[index % fallbackWorkspace.leads.length].sourcePost,
      ),
      interactions: 0,
    }

    nextLead.leadScore = Math.max(nextLead.leadScore, leadScore)
    nextLead.interactions += toNumber(
      pickValue(log, ["interactions", "message_count", "messages_count"], 1),
      1,
    )
    nextLead.lastInteraction = formatRelativeTime(
      pickValue(log, ["lastInteraction", "created_at", "updated_at", "timestamp"], nextLead.lastInteraction),
      nextLead.lastInteraction,
    )

    leadMap.set(normalizedHandle, nextLead)
  })

  const leads = [...leadMap.values()].sort((leftLead, rightLead) => rightLead.leadScore - leftLead.leadScore)

  return {
    leads,
    summary: getLeadBadgeSummary(leads, fallbackWorkspace.leadSummary),
    isFallback: false,
  }
}
