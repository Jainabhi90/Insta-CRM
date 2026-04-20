import { ApiError, apiRequest } from "../core/apiClient"

function shouldUseFallback(error) {
  if (!(error instanceof ApiError)) {
    return false
  }

  if (error.status === 404) {
    return true
  }

  const message = String(error?.message || "").toLowerCase()
  return message.includes("not_found") || message.includes("could not be found")
}

export async function exchangeGoogleCode(payload) {
  try {
    return await apiRequest("/api/auth/google/exchange", {
      method: "POST",
      body: payload,
    })
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error
    }

    return apiRequest("/api/auth/google-exchange", {
      method: "POST",
      body: payload,
    })
  }
}
