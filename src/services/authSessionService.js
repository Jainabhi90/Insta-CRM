import { normalizeSession } from "../adapters/ownerAdapter"
import { bootstrapInstagramSession } from "../api/auth/sessionBootstrapApi"
import { getCurrentSession, logoutCurrentSession } from "../api/auth/sessionApi"
import { ApiError, canUseDemoFallback, isDemoFallbackEnabled } from "../api/core/apiClient"
import {
  buildDemoInstagramCallbackUrl,
  getInstagramRedirectUri,
} from "../lib/instagramAuthConfig"
import { clearDemoSession, getStoredDemoSession } from "./demoSessionService"

export async function restoreExistingSession() {
  if (isDemoFallbackEnabled()) {
    return getStoredDemoSession()
  }

  try {
    const sessionPayload = await getCurrentSession()
    const session = normalizeSession(sessionPayload)

    if (session?.authStatus === "authenticated") {
      clearDemoSession()
    }

    return session
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null
    }

    if (canUseDemoFallback(error)) {
      return getStoredDemoSession()
    }

    throw error
  }
}

export async function startInstagramLogin() {
  if (isDemoFallbackEnabled()) {
    return {
      type: "redirect",
      source: "demo",
      url: buildDemoInstagramCallbackUrl(),
    }
  }

  const response = await bootstrapInstagramSession({
    redirectUri: getInstagramRedirectUri(),
    forceReauth: import.meta.env.VITE_INSTAGRAM_FORCE_REAUTH !== "false",
  })

  if (response?.action === "redirect" && response?.authorizeUrl) {
    return {
      type: "redirect",
      source: "backend",
      url: response.authorizeUrl,
    }
  }

  throw new Error("Instagram login could not be started right now.")
}

export async function logoutSession() {
  clearDemoSession()

  if (isDemoFallbackEnabled()) {
    return
  }

  try {
    await logoutCurrentSession()
  } catch (error) {
    const isLoggedOut =
      error instanceof ApiError && (error.status === 401 || error.status === 403)

    if (!isLoggedOut && !canUseDemoFallback(error)) {
      throw error
    }
  }
}
