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
    isFallback: false,
  }
}

export function buildAutomationWorkspace(automationPayload, fallbackWorkspace, options = {}) {
  const { usePreviewFallback = false } = options
  const automations = getArrayPayload(automationPayload, ["automations"])

  if (automations.length === 0) {
    if (usePreviewFallback) {
      return {
        templates: fallbackWorkspace.automations,
        summary: fallbackWorkspace.automationSummary,
        tip: fallbackWorkspace.automationTip,
        isFallback: true,
      }
    }

    return {
      ...buildEmptyAutomationWorkspace(),
    }
  }

  return {
    templates: automations.map((automation, index) => ({
      id: pickValue(automation, ["id", "automation_id"], fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].id),
      name: pickValue(automation, ["name", "title"], fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].name),
      description: pickValue(
        automation,
        ["description", "summary"],
        fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].description,
      ),
      trigger: pickValue(
        automation,
        ["trigger", "trigger_keywords", "keywords"],
        fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].trigger,
      ),
      response: pickValue(
        automation,
        ["response", "reply_template", "message"],
        fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].response,
      ),
      iconName: pickValue(
        automation,
        ["iconName", "icon"],
        fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].iconName,
      ),
      category: pickValue(
        automation,
        ["category", "type"],
        fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].category,
      ),
      enabled: Boolean(
        pickValue(
          automation,
          ["enabled", "is_enabled", "active"],
          fallbackWorkspace.automations[index % fallbackWorkspace.automations.length].enabled,
        ),
      ),
      mediaId: pickValue(automation, ["mediaId", "postId", "media_id"], ""),
      mediaCaption: pickValue(automation, ["mediaCaption", "caption", "media_caption"], ""),
      mediaThumbnail: pickValue(automation, ["mediaThumbnail", "thumbnail", "media_thumbnail"], ""),
    })),
    summary: {
      ...fallbackWorkspace.automationSummary,
      ...(automationPayload?.summary || {}),
    },
    tip: {
      ...fallbackWorkspace.automationTip,
      ...(automationPayload?.tip || {}),
    },
    isFallback: false,
  }
}
