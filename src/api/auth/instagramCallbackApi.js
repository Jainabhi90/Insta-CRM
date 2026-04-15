import { apiRequest } from "../core/apiClient"

// Expected backend behavior:
// 1. Validate OAuth state
// 2. Exchange Instagram code for tokens
// 3. Resolve the pending signup context from the saved OAuth state
// 4. Store tokens securely in DB
// 5. Set the app session cookie
export function completeInstagramCallback(payload) {
  return apiRequest("/api/auth/instagram/callback", {
    method: "POST",
    body: payload,
  })
}
