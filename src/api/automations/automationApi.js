import { apiRequest } from "../core/apiClient"

// Optional backend response:
// Array<automation>
// or { automations: Array<automation> }
export function getAutomations() {
  return apiRequest("/api/automations")
}

export function createAutomation(payload) {
  return apiRequest("/api/automations", {
    method: "POST",
    body: payload,
  })
}

export function updateAutomation(automationId, payload) {
  return apiRequest(`/api/automations/${automationId}`, {
    method: "PATCH",
    body: payload,
  })
}

export function deleteAutomation(automationId) {
  return apiRequest(`/api/automations/${automationId}`, {
    method: "DELETE",
  })
}
