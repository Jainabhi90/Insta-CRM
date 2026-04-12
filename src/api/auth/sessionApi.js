import { apiRequest } from "../core/apiClient"

// Expected backend response:
// { authenticated: true, owner: {...}, authStatus?: "authenticated" }
// or
// { authenticated: false }
export function getCurrentSession() {
  return apiRequest("/api/auth/session")
}

export function logoutCurrentSession() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  })
}
