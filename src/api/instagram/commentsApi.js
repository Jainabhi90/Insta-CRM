import { apiRequest } from "../core/apiClient"

export function getInstagramComments() {
  return apiRequest("/api/instagram/comments")
}
