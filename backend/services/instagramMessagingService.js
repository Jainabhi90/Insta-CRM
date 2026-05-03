const { InstagramAuthError } = require("./instagramAuthService")
const { instagramRequest } = require("./instagramDataService")

function shouldRetryWithAlternatePath(error) {
  const status = Number(error?.status || 0)
  const message = String(error?.message || "").toLowerCase()

  if (status === 400 || status === 404) {
    return true
  }

  return (
    message.includes("unsupported") ||
    message.includes("unknown path components") ||
    message.includes("invalid api call") ||
    message.includes("tried accessing nonexisting field")
  )
}

async function sendInstagramReply({
  accessToken,
  commentId,
  recipientId,
  text,
  instagramAccountId,
  instagramUserId,
}) {
  const normalizedText = String(text || "").trim()
  const normalizedCommentId = String(commentId || "").trim()
  const normalizedRecipientId = String(recipientId || "").trim()
  const candidatePaths = Array.from(
    new Set(
      [
        "me/messages",
        String(instagramAccountId || "").trim()
          ? `${String(instagramAccountId || "").trim()}/messages`
          : "",
        String(instagramUserId || "").trim()
          ? `${String(instagramUserId || "").trim()}/messages`
          : "",
      ].filter(Boolean),
    ),
  )

  if (!accessToken || !normalizedText) {
    throw new InstagramAuthError("accessToken and reply text are required.")
  }

  if (!normalizedCommentId && !normalizedRecipientId) {
    throw new InstagramAuthError("commentId or recipientId is required.")
  }

  const recipient = normalizedCommentId
    ? { comment_id: normalizedCommentId }
    : { id: normalizedRecipientId }

  let lastError = null

  for (const path of candidatePaths) {
    try {
      return await instagramRequest(path, accessToken, {
        method: "POST",
        body: {
          recipient,
          message: {
            text: normalizedText,
          },
        },
      })
    } catch (error) {
      lastError = error

      if (!shouldRetryWithAlternatePath(error) || path === candidatePaths[candidatePaths.length - 1]) {
        throw error
      }
    }
  }

  throw lastError || new InstagramAuthError("Instagram reply could not be sent.")
}

module.exports = {
  sendInstagramReply,
}
