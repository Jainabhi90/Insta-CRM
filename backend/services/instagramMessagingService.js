const { config } = require("../config")
const { InstagramAuthError } = require("./instagramAuthService")

async function parseMessagingResponse(response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return text ? { message: text } : {}
  }
}

async function sendPrivateReply({ instagramUserId, accessToken, commentId, text }) {
  if (!instagramUserId || !accessToken || !commentId || !text?.trim()) {
    throw new InstagramAuthError("instagramUserId, accessToken, commentId, and text are required.")
  }

  const endpoint = `https://graph.instagram.com/${config.meta.graphApiVersion}/${instagramUserId}/messages`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      recipient: {
        comment_id: commentId,
      },
      message: {
        text: text.trim(),
      },
    }),
  })

  const data = await parseMessagingResponse(response)

  if (!response.ok) {
    throw new InstagramAuthError(
      data?.error?.message || data?.message || "Private reply send failed.",
      {
        status: response.status,
        data,
      },
    )
  }

  return data
}

module.exports = {
  sendPrivateReply,
}
