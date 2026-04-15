import { apiRequest } from "../core/apiClient"

export function getInstagramInbox() {
  return apiRequest("/api/instagram/inbox")
}
