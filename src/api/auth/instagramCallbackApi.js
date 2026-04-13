import { apiRequest } from "../core/apiClient"

// Expected backend behavior:
// 1. Validate OAuth state
// 2. Exchange Instagram code for tokens
// 3. Store tokens securely in DB
// 4. Persist the email/password chosen before redirect
// 5. Set the app session cookie
export function completeInstagramCallback(payload) {
  return apiRequest("/api/auth/instagram/callback", {
    method: "POST",
    body: payload,
  })
}
