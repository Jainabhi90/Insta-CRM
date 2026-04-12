import { apiRequest } from "../core/apiClient"

// Expected backend response:
// Array<dmLog>
// or { dmLogs: Array<dmLog> }
export function getDmLogs() {
  return apiRequest("/api/dm-logs")
}
