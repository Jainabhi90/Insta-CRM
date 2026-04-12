import { apiRequest } from "../core/apiClient"

// Expected backend response:
// { action: "redirect", authorizeUrl: "https://www.instagram.com/oauth/authorize?..." }
export function bootstrapInstagramSession(payload) {
  return apiRequest("/api/auth/session/bootstrap", {
    method: "POST",
    body: payload,
  })
}
