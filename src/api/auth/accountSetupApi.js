import { apiRequest } from "../core/apiClient"

// Expected backend response:
// {
//   authenticated: true,
//   authStatus: "authenticated",
//   owner: {...},
//   action?: "open_dashboard"
// }
//
// Backend expectation:
// 1. Read the pending Instagram-connected owner from the secure session/cookie.
// 2. Save the chosen email/password in your users table.
// 3. Mark onboarding complete and promote the session to a normal app session.
export function completeAccountSetup(payload) {
  return apiRequest("/api/auth/account/setup", {
    method: "POST",
    body: payload,
  })
}
