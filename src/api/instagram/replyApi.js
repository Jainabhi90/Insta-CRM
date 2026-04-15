import { apiRequest } from "../core/apiClient"

export function sendInstagramReply(payload) {
  return apiRequest("/api/instagram/private-reply", {
    method: "POST",
    body: payload,
  })
}
