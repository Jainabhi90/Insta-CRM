const { connectToDatabase } = require("../db")
const Owner = require("../models/Owner")

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
        mediaId: String(change?.value?.media?.id || change?.value?.media_id || ""),
        createdTime: change?.value?.created_time || null,
      })
    }
  }

  return commentEvents
}

async function processInstagramWebhookPayload(payload) {
  const commentEvents = extractCommentEvents(payload)

  if (commentEvents.length === 0) {
    return {
      commentEvents: [],
      readyCount: 0,
    }
  }

  try {
    await connectToDatabase()
  } catch (error) {
    return {
      commentEvents,
      readyCount: 0,
      warning: error.message,
    }
  }

  const eventResults = []

  for (const commentEvent of commentEvents) {
    const owner = await Owner.findOne({
      instagramUserId: commentEvent.instagramAccountId,
    }).lean()

    eventResults.push({
      ...commentEvent,
      ownerId: owner?._id?.toString() || null,
      readyToSendDm: Boolean(owner?.longLivedAccessToken),
    })
  }

  return {
    commentEvents: eventResults,
    readyCount: eventResults.filter((event) => event.readyToSendDm).length,
  }
}

module.exports = {
  processInstagramWebhookPayload,
}
