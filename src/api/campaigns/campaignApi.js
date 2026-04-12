import { apiRequest } from "../core/apiClient"

// Expected backend response:
// Array<campaign>
// or { campaigns: Array<campaign> }
export function getCampaigns() {
  return apiRequest("/api/campaigns")
}
