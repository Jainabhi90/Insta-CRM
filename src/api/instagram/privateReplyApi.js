import { apiRequest } from "../core/apiClient"

export async function sendPrivateReply({ commentId, recipientId, text }) {
  const payload = {
    text: String(text || "").trim(),
  }

  if (commentId) {
    payload.commentId = String(commentId)
  }

  if (recipientId) {
    payload.recipientId = String(recipientId)
  }

  return apiRequest("/api/instagram/private-reply", {
    method: "POST",
    body: payload,
  })
}
