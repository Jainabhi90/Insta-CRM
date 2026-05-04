const { connectToDatabase } = require("../db")
const { triggerCommentAutomation } = require("./automationService")

function extractCommentEvents(payload) {
  const entries = Array.isArray(payload?.entry) ? payload.entry : []
  const commentEvents = []

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : []

    for (const change of changes) {
      if (change?.field !== "comments") {
        continue
      }

      commentEvents.push({
        instagramAccountId: String(entry?.id || ""),
        commentId: String(change?.value?.id || ""),
        commentText: change?.value?.text || "",
        fromId: String(change?.value?.from?.id || ""),
        fromUsername: String(change?.value?.from?.username || ""),
        mediaId: String(change?.value?.media?.id || change?.value?.media_id || ""),
        createdTime: change?.value?.created_time || null,
      })
    }
  }

  return commentEvents
}

async function processInstagramWebhookPayload(payload, options = {}) {
  const commentEvents = extractCommentEvents(payload)
  const followConfirmBaseUrl = String(options.followConfirmBaseUrl || "").trim()

  if (commentEvents.length === 0) {
    return {
      commentEvents: [],
      readyCount: 0,
      promptedCount: 0,
    }
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.error("[CRITICAL] Webhook cannot connect to database:", error)
    throw error
  }

  const eventResults = []

  for (const commentEvent of commentEvents) {
    const automationResult = await triggerCommentAutomation({
      instagramAccountId: commentEvent.instagramAccountId,
      postId: commentEvent.mediaId,
      commentText: commentEvent.commentText,
      commenterId: commentEvent.fromId,
      commenterUsername: commentEvent.fromUsername,
      commentId: commentEvent.commentId,
      eventField: "comments",
      followConfirmBaseUrl,
      triggerSource: "meta_webhook",
    })

    eventResults.push({
      ...commentEvent,
      action: automationResult.action || "ignore",
      reason: automationResult.reason || "",
      automationId: automationResult.automationId || "",
      dmLogId: automationResult.dmLogId || "",
    })
  }

  return {
    commentEvents: eventResults,
    readyCount: eventResults.length,
    promptedCount: eventResults.filter((event) => event.action === "prompted").length,
  }
}

module.exports = {
  processInstagramWebhookPayload,
}
