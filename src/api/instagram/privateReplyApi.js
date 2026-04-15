import { apiRequest } from "../core/apiClient"

// Send a private reply to a comment or DM
// Expected payload: { ownerId | email, commentId, text }
// Expected response: { ok: true, result: {...}, owner: {...} }
export async function sendPrivateReply({ commentId, text, ownerId, email }) {
  const payload = {
    commentId: String(commentId || ""),
    text: String(text || "").trim(),
  }

  if (ownerId) {
    payload.ownerId = String(ownerId)
  } else if (email) {
    payload.email = String(email)
  }

  return apiRequest("/api/instagram/private-reply", {
    method: "POST",
    body: payload,
  })
}
