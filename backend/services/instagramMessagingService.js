const { InstagramAuthError } = require("./instagramAuthService")
const { instagramRequest } = require("./instagramDataService")

async function sendInstagramReply({ accessToken, commentId, recipientId, text }) {
  const normalizedText = String(text || "").trim()
  const normalizedCommentId = String(commentId || "").trim()
  const normalizedRecipientId = String(recipientId || "").trim()

  if (!accessToken || !normalizedText) {
    throw new InstagramAuthError("accessToken and reply text are required.")
  }

  if (!normalizedCommentId && !normalizedRecipientId) {
    throw new InstagramAuthError("commentId or recipientId is required.")
  }

  const recipient = normalizedCommentId
    ? { comment_id: normalizedCommentId }
    : { id: normalizedRecipientId }

  return instagramRequest("me/messages", accessToken, {
    method: "POST",
    body: {
      recipient,
      message: {
        text: normalizedText,
      },
    },
  })
}

module.exports = {
  sendInstagramReply,
}
