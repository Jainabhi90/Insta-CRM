import { apiRequest } from "../core/apiClient"

export function getAccounts() {
  return apiRequest("/api/accounts")
}

export function selectAccount(payload) {
  return apiRequest("/api/accounts/select", {
    method: "POST",
    body: payload,
  })
}
