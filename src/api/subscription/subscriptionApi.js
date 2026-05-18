import { apiRequest } from "../core/apiClient"

export function getSubscriptionStatus() {
  return apiRequest("/api/subscription")
}
