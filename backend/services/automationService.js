const Automation = require("../models/Automation")
const AutomationEvent = require("../models/AutomationEvent")
const DmLog = require("../models/DmLog")
const IOwner = require("../models/IOwner")
const Owner = require("../models/Owner")
const { sendInstagramReply } = require("./instagramMessagingService")

const MAX_AUTOMATIONS_PER_OWNER = 3
const MAX_AUTOMATION_SENDS = 3

function normalizeText(value) {
  return String(value || "").trim()
}

function normalizeKeywords(input) {
  if (Array.isArray(input)) {
    return input
      .flatMap((entry) => String(entry || "").split(","))
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  }

  return String(input || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function commentMatchesKeywords(commentText, keywords) {
  const normalizedComment = normalizeText(commentText).toLowerCase()

  if (!normalizedComment || keywords.length === 0) {
    return false
  }

  return keywords.some((keyword) => normalizedComment.includes(keyword))
}

function buildAutomationDocument(owner, payload, currentAutomation = null) {
  const trigger = normalizeText(payload.trigger)
  const triggerKeywords = normalizeKeywords(payload.triggerKeywords || trigger)

  const source = currentAutomation || owner

  return {
    gownerId: owner.gownerId || null,
    iownerId: owner.gownerId ? owner._id : null,
    ownerId: owner._id,
    ownerEmail: owner.email || "",
    instagramAccountId:
      normalizeText(owner.instagramUserId || payload.instagramAccountId || source.instagramAccountId),
    instagramUserId: normalizeText(owner.instagramUserId || payload.instagramUserId || source.instagramUserId),
    instagramUsername: normalizeText(owner.instagramUsername || payload.instagramUsername || source.instagramUsername),
    name: normalizeText(payload.name),
    description: normalizeText(payload.description),
    trigger,
    triggerKeywords,
    response: normalizeText(payload.response),
    category: normalizeText(payload.category) || "Sales",
    iconName: normalizeText(payload.iconName || payload.icon) || "MessageSquare",
    mediaId: normalizeText(payload.mediaId || payload.postId),
    mediaCaption: normalizeText(payload.mediaCaption || payload.caption),
    mediaPermalink: normalizeText(payload.mediaPermalink || payload.permalink),
    mediaThumbnail: normalizeText(payload.mediaThumbnail || payload.thumbnail || payload.mediaUrl),
    mediaType: normalizeText(payload.mediaType),
    active: payload.active !== false,
    enabled: payload.enabled !== false,
    workflowKey: normalizeText(payload.workflowKey) || "comment_listener",
  }
}

function buildAutomationResponse(automation) {
  return {
    id: automation._id.toString(),
    automation_id: automation._id.toString(),
    gownerId: automation.gownerId?.toString() || "",
    iownerId: automation.iownerId?.toString() || "",
    ownerId: automation.ownerId?.toString() || "",
    instagramAccountId: automation.instagramAccountId,
    instagramUserId: automation.instagramUserId,
    instagramUsername: automation.instagramUsername,
    name: automation.name,
    title: automation.name,
    description: automation.description,
    trigger: automation.trigger,
    trigger_keywords: automation.triggerKeywords,
    response: automation.response,
    message: automation.response,
    category: automation.category,
    iconName: automation.iconName,
    mediaId: automation.mediaId,
    mediaCaption: automation.mediaCaption,
    mediaPermalink: automation.mediaPermalink,
    mediaThumbnail: automation.mediaThumbnail,
    mediaType: automation.mediaType,
    active: Boolean(automation.active),
    enabled: Boolean(automation.enabled),
    workflowKey: automation.workflowKey,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
  }
}

async function listOwnerAutomations(owner) {
  const automations = await Automation.find({
    ownerId: owner._id,
  }).sort({ updatedAt: -1, createdAt: -1 })

  const stats = await DmLog.aggregate([
    {
      $match: {
        ownerId: owner._id,
      },
    },
    {
      $group: {
        _id: "$stage",
        count: { $sum: 1 },
      },
    },
  ])

  const statMap = stats.reduce((accumulator, entry) => {
    accumulator[entry._id] = entry.count
    return accumulator
  }, {})

  return {
    automations: automations.map(buildAutomationResponse),
    summary: {
      autoRepliesToday: Number(statMap.sent || 0),
      averageResponseTime: "Instant",
      timeSaved: `${Math.max(0, Number(statMap.sent || 0) * 2)} min`,
      timeSavedLabel:
        automations.length > 0
          ? "Live rules are ready for comment-triggered DM flow"
          : "Create your first rule to start saving time",
    },
    tip: {
      title: automations.length > 0 ? "Workflow ready" : "No automations yet",
      body:
        automations.length > 0
          ? "These rules are now stored in MongoDB and matched directly by the backend when new comments arrive."
          : "Create a rule, connect it to a post, and the backend can start matching incoming comments automatically.",
    },
  }
}

async function createOwnerAutomation(owner, payload) {
  const existingAutomationCount = await Automation.countDocuments({
    ownerId: owner._id,
  })

  if (existingAutomationCount >= MAX_AUTOMATIONS_PER_OWNER) {
    const error = new Error(`You can create up to ${MAX_AUTOMATIONS_PER_OWNER} automations per Instagram account.`)
    error.status = 400
    throw error
  }

  const automationData = buildAutomationDocument(owner, payload)

  if (!automationData.name) {
    throw new Error("Automation name is required.")
  }

  if (!automationData.trigger || automationData.triggerKeywords.length === 0) {
    throw new Error("Add at least one trigger keyword.")
  }

  if (!automationData.response) {
    throw new Error("Automation response is required.")
  }

  if (!automationData.mediaId) {
    throw new Error("Select an Instagram post before creating the automation.")
  }

  const automation = await Automation.create(automationData)
  return buildAutomationResponse(automation)
}

async function updateOwnerAutomation(owner, automationId, payload) {
  const automation = await Automation.findOne({
    _id: automationId,
    ownerId: owner._id,
  })

  if (!automation) {
    const error = new Error("Automation was not found for this account.")
    error.status = 404
    throw error
  }

  const nextValues = buildAutomationDocument(owner, {
    ...automation.toObject(),
    ...payload,
  }, automation.toObject())

  Object.assign(automation, nextValues)
  await automation.save()

  return buildAutomationResponse(automation)
}

async function findOwnerForInstagramAccount(instagramAccountId) {
  const normalizedAccountId = normalizeText(instagramAccountId)
  const iowner = await IOwner.findOne({
    instagramUserId: normalizedAccountId,
  })

  if (iowner) {
    return iowner
  }

  return Owner.findOne({
    instagramUserId: normalizeText(instagramAccountId),
  })
}

async function findMatchingAutomationForComment({ owner, instagramAccountId, postId, commentText }) {
  const mediaId = normalizeText(postId)
  const accountId = normalizeText(instagramAccountId)
  const automations = await Automation.find({
    ownerId: owner._id,
    instagramAccountId: accountId,
    mediaId,
    active: true,
  }).sort({ updatedAt: -1, createdAt: -1 })

  return (
    automations.find((automation) =>
      commentMatchesKeywords(commentText, normalizeKeywords(automation.triggerKeywords)),
    ) || null
  )
}

async function findExistingDmStage({ automationId, mediaId, targetInstagramUserId }) {
  return DmLog.findOne({
    automationId,
    mediaId: normalizeText(mediaId),
    targetInstagramUserId: normalizeText(targetInstagramUserId),
    stage: "sent",
  }).sort({ createdAt: -1 })
}

async function recordAutomationEvent({
  source = "meta_webhook",
  eventField = "comments",
  owner = null,
  automation = null,
  instagramAccountId = "",
  postId = "",
  commentId = "",
  commentText = "",
  commenterId = "",
  commenterUsername = "",
  listened = false,
  matched = false,
  action = "ignore",
  reason = "",
  dmLogId = null,
  confirmUrl = "",
  errorMessage = "",
}) {
  try {
    await AutomationEvent.create({
      source: normalizeText(source) || "meta_webhook",
      eventField: normalizeText(eventField) || "comments",
      ownerId: owner?._id || null,
      gownerId: owner?.gownerId || null,
      iownerId: owner?.gownerId ? owner?._id || null : null,
      ownerEmail: normalizeText(owner?.email),
      instagramAccountId: normalizeText(instagramAccountId),
      instagramUserId: normalizeText(owner?.instagramUserId),
      instagramUsername: normalizeText(owner?.instagramUsername),
      automationId: automation?._id || null,
      mediaId: normalizeText(postId),
      commentId: normalizeText(commentId),
      commentText: normalizeText(commentText),
      commenterId: normalizeText(commenterId),
      commenterUsername: normalizeText(commenterUsername),
      listened: Boolean(listened),
      matched: Boolean(matched),
      action: normalizeText(action) || "ignore",
      reason: normalizeText(reason),
      dmLogId,
      confirmUrl: normalizeText(confirmUrl),
      errorMessage: normalizeText(errorMessage),
    })
  } catch (error) {
    console.error("Failed to persist automation event:", error?.message || error)
  }
}

async function triggerCommentAutomation({
  instagramAccountId,
  postId,
  commentText,
  commenterId,
  commenterUsername,
  commentId,
  eventField = "comments",
  followConfirmBaseUrl,
  triggerSource = "meta_webhook",
}) {
  const owner = await findOwnerForInstagramAccount(instagramAccountId)

  if (!owner || !owner.longLivedAccessToken) {
    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: false,
      action: "ignore",
      reason: "owner_not_connected",
    })

    return {
      action: "ignore",
      reason: "owner_not_connected",
    }
  }

  const automation = await findMatchingAutomationForComment({
    owner,
    instagramAccountId,
    postId,
    commentText,
  })

  if (!automation) {
    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      owner,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: false,
      action: "ignore",
      reason: "no_matching_automation",
    })

    return {
      action: "ignore",
      reason: "no_matching_automation",
    }
  }

  const existingStage = await findExistingDmStage({
    automationId: automation._id,
    mediaId: postId,
    targetInstagramUserId: commenterId,
  })

  if (existingStage) {
    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      owner,
      automation,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: true,
      action: "ignore",
      reason: "already_sent",
      dmLogId: existingStage._id,
    })

    return {
      action: "ignore",
      reason: "already_sent",
      automationId: automation._id.toString(),
    }
  }

  const sentCount = await DmLog.countDocuments({
    automationId: automation._id,
    stage: "sent",
  })

  if (sentCount >= MAX_AUTOMATION_SENDS) {
    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      owner,
      automation,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: true,
      action: "ignore",
      reason: "automation_send_limit_reached",
    })

    return {
      action: "ignore",
      reason: "automation_send_limit_reached",
      automationId: automation._id.toString(),
    }
  }

  try {
    await sendInstagramReply({
      accessToken: owner.longLivedAccessToken,
      commentId: normalizeText(commentId) || undefined,
      recipientId: normalizeText(commentId) ? undefined : commenterId,
      text: automation.response,
      instagramAccountId: owner.instagramAccountId || undefined,
      instagramUserId: owner.instagramUserId || undefined,
    })

    const dmLog = await DmLog.create({
      ownerId: owner._id,
      gownerId: owner.gownerId || null,
      iownerId: owner.gownerId ? owner._id : null,
      ownerEmail: owner.email,
      instagramAccountId: normalizeText(instagramAccountId),
      instagramUserId: normalizeText(owner.instagramUserId),
      instagramUsername: normalizeText(owner.instagramUsername),
      automationId: automation._id,
      mediaId: normalizeText(postId),
      mediaPermalink: automation.mediaPermalink,
      triggerCommentId: normalizeText(commentId),
      triggerCommentText: normalizeText(commentText),
      eventField: normalizeText(eventField) || "comments",
      targetInstagramUserId: normalizeText(commenterId),
      targetInstagramUsername: normalizeText(commenterUsername),
      stage: "sent",
      messageText: automation.response,
      sentAt: new Date(),
    })

    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      owner,
      automation,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: true,
      action: "sent",
      reason: "direct_message_sent",
      dmLogId: dmLog._id,
    })

    return {
      action: "sent",
      automationId: automation._id.toString(),
      dmLogId: dmLog._id.toString(),
    }
  } catch (error) {
    await recordAutomationEvent({
      source: triggerSource,
      eventField,
      owner,
      automation,
      instagramAccountId,
      postId,
      commentId,
      commentText,
      commenterId,
      commenterUsername,
      listened: true,
      matched: true,
      action: "failed",
      reason: "direct_message_send_failed",
      errorMessage: error?.message || "Unknown automation send failure",
    })

    throw error
  }
}

async function confirmCommentAutomation({
  instagramAccountId,
  postId,
  igUserId,
  automationId,
}) {
  const owner = await findOwnerForInstagramAccount(instagramAccountId)

  if (!owner || !owner.longLivedAccessToken) {
    await recordAutomationEvent({
      source: "follow_confirm",
      eventField: "follow_confirm",
      instagramAccountId,
      postId,
      commenterId: igUserId,
      listened: true,
      matched: false,
      action: "error",
      reason: "owner_not_connected",
    })

    return {
      action: "error",
      message: "The connected Instagram account is no longer available.",
    }
  }

  const normalizedAutomationId = normalizeText(automationId)
  const automationQuery = {
    ownerId: owner._id,
    instagramAccountId: normalizeText(instagramAccountId),
    mediaId: normalizeText(postId),
    active: true,
  }

  if (normalizedAutomationId) {
    automationQuery._id = normalizedAutomationId
  }

  const automation = await Automation.findOne(automationQuery).sort({ updatedAt: -1, createdAt: -1 })

  if (!automation) {
    await recordAutomationEvent({
      source: "follow_confirm",
      eventField: "follow_confirm",
      owner,
      instagramAccountId,
      postId,
      commenterId: igUserId,
      listened: true,
      matched: false,
      action: "ignore",
      reason: "no_active_automation_for_confirm",
    })

    return {
      action: "ignore",
      message: "No active automation was found for this Instagram post.",
    }
  }

  const existingSentLog = await DmLog.findOne({
    automationId: automation._id,
    mediaId: normalizeText(postId),
    targetInstagramUserId: normalizeText(igUserId),
    stage: "sent",
  }).sort({ createdAt: -1 })

  if (existingSentLog) {
    await recordAutomationEvent({
      source: "follow_confirm",
      eventField: "follow_confirm",
      owner,
      automation,
      instagramAccountId,
      postId,
      commenterId: igUserId,
      listened: true,
      matched: true,
      action: "already_sent",
      reason: "duplicate_confirm_click",
      dmLogId: existingSentLog._id,
    })

    return {
      action: "already_sent",
      message: "You're already all set. Check your DMs.",
    }
  }

  try {
    await sendInstagramReply({
      accessToken: owner.longLivedAccessToken,
      recipientId: igUserId,
      text: automation.response,
      instagramAccountId: owner.instagramAccountId || undefined,
      instagramUserId: owner.instagramUserId || undefined,
    })

    const dmLog = await DmLog.create({
      ownerId: owner._id,
      gownerId: owner.gownerId || null,
      iownerId: owner.gownerId ? owner._id : null,
      ownerEmail: owner.email,
      instagramAccountId: normalizeText(instagramAccountId),
      instagramUserId: normalizeText(owner.instagramUserId),
      instagramUsername: normalizeText(owner.instagramUsername),
      automationId: automation._id,
      mediaId: normalizeText(postId),
      mediaPermalink: automation.mediaPermalink,
      targetInstagramUserId: normalizeText(igUserId),
      stage: "sent",
      messageText: automation.response,
      sentAt: new Date(),
    })

    await recordAutomationEvent({
      source: "follow_confirm",
      eventField: "follow_confirm",
      owner,
      automation,
      instagramAccountId,
      postId,
      commenterId: igUserId,
      listened: true,
      matched: true,
      action: "sent",
      reason: "final_message_sent",
      dmLogId: dmLog._id,
    })

    return {
      action: "sent",
      message: "You're all set! Check your DMs.",
      automationId: automation._id.toString(),
      dmLogId: dmLog._id.toString(),
    }
  } catch (error) {
    await recordAutomationEvent({
      source: "follow_confirm",
      eventField: "follow_confirm",
      owner,
      automation,
      instagramAccountId,
      postId,
      commenterId: igUserId,
      listened: true,
      matched: true,
      action: "failed",
      reason: "final_message_send_failed",
      errorMessage: error?.message || "Unknown confirm send failure",
    })

    throw error
  }
}

module.exports = {
  buildAutomationResponse,
  confirmCommentAutomation,
  createOwnerAutomation,
  listOwnerAutomations,
  normalizeKeywords,
  triggerCommentAutomation,
  updateOwnerAutomation,
}
