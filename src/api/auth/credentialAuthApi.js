import { apiRequest } from "../core/apiClient"

// Expected backend response:
// { authenticated: true }
export function signInWithPassword(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: payload,
  })
}

export function registerUserAccount(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: payload,
  })
}
