import { apiRequest } from "../core/apiClient"

// Expected backend response:
// { id, name, instagramHandle, plan, ... }
export function getOwnerProfile() {
  return apiRequest("/api/owner/profile")
}
