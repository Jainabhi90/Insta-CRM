import { getArrayPayload, pickValue } from "./backendPayloadUtils"

function buildEmptyAutomationWorkspace() {
  return {
    templates: [],
    summary: {
      autoRepliesToday: 0,
      averageResponseTime: "0 sec",
      timeSaved: "0 hrs",
      timeSavedLabel: "Create your first rule to start saving time",
    },
    tip: {
      title: "No automations yet",
      body: "Create your first automation rule to start replying faster inside InstaLead.",
    },
    limits: null,
    isFallback: false,
  }
}

export function buildAutomationWorkspace(automationPayload, fallbackWorkspace, options = {}) {
  const { usePreviewFallback = false } = options
  const automations = getArrayPayload(automationPayload, ["automations"])
  const fallbackAutomations = Array.isArray(fallbackWorkspace?.automations) ? fallbackWorkspace.automations : []

  if (automations.length === 0) {
    if (usePreviewFallback && fallbackAutomations.length > 0) {
      return {
        templates: fallbackAutomations,
        summary: fallbackWorkspace.automationSummary,
        tip: fallbackWorkspace.automationTip,
        limits: fallbackWorkspace.automationLimits || null,
        isFallback: true,
      }
    }

    return {
      ...buildEmptyAutomationWorkspace(),
    }
  }

  return {
    templates: automations.map((automation) => {
      return {
        id: pickValue(automation, ["id", "automation_id"], ""),
        name: pickValue(automation, ["name", "title"], ""),
        description: pickValue(automation, ["description", "summary"], ""),
        trigger: pickValue(automation, ["trigger", "trigger_keywords", "keywords"], ""),
        response: pickValue(automation, ["response", "reply_template", "message"], ""),
        iconName: pickValue(automation, ["iconName", "icon"], "MessageSquare"),
        category: pickValue(automation, ["category", "type"], "Sales"),
        enabled: Boolean(pickValue(automation, ["enabled", "is_enabled", "active"], false)),
        mediaId: pickValue(automation, ["mediaId", "postId", "media_id"], ""),
        mediaCaption: pickValue(automation, ["mediaCaption", "caption", "media_caption"], ""),
        mediaThumbnail: pickValue(automation, ["mediaThumbnail", "thumbnail", "media_thumbnail"], ""),
        dmSentCount: Number(pickValue(automation, ["dmSentCount", "sentCount", "dm_sent_count"], 0)),
        dmLimitPerAutomation: Number(pickValue(automation, ["dmLimitPerAutomation", "dmLimit", "dm_limit"], 10)),
      }
    }),
    summary: {
      ...fallbackWorkspace?.automationSummary,
      ...(automationPayload?.summary || {}),
    },
    tip: {
      ...fallbackWorkspace?.automationTip,
      ...(automationPayload?.tip || {}),
    },
    limits: automationPayload?.limits || fallbackWorkspace?.automationLimits || null,
    isFallback: false,
  }
}

