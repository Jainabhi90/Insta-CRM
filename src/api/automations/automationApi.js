import { apiRequest } from "../core/apiClient"

// Optional backend response:
// Array<automation>
// or { automations: Array<automation> }
export function getAutomations() {
  return apiRequest("/api/automations")
}
