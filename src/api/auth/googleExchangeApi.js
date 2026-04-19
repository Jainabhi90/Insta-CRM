import { apiRequest } from "../core/apiClient"

export function exchangeGoogleCode(payload) {
  return apiRequest("/api/auth/google/exchange", {
    method: "POST",
    body: payload,
  })
}
