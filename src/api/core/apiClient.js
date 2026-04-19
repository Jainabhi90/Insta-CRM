const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "")

export class ApiError extends Error {
  constructor(message, { status, data, path } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
    this.path = path
  }
}

function buildUrl(path) {
  const normalizedPath = String(path || "").trim()

  if (!API_BASE_URL) {
    return normalizedPath
  }

  if (API_BASE_URL.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${API_BASE_URL}${normalizedPath.slice(4)}`
  }

  return `${API_BASE_URL}${normalizedPath}`
}

export function isDemoFallbackEnabled() {
  return !import.meta.env.PROD && !API_BASE_URL
}

export function isBackendUnavailableError(error) {
  return error instanceof TypeError || (error instanceof ApiError && error.status === 503)
}

export function canUseDemoFallback(error) {
  return !import.meta.env.PROD && (isDemoFallbackEnabled() || isBackendUnavailableError(error))
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }

  const text = await response.text()
  return text ? { message: text } : null
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const requestOptions = {
    method: options.method || "GET",
    credentials: "include",
    headers,
    cache: options.cache || "no-store",
  }

  if (options.body !== undefined) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    requestOptions.body =
      typeof options.body === "string" ? options.body : JSON.stringify(options.body)
  }

  const response = await fetch(buildUrl(path), requestOptions)
  const data = await parseResponseBody(response)

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request to ${path} failed with status ${response.status}`

    throw new ApiError(message, {
      status: response.status,
      data,
      path,
    })
  }

  return data
}
