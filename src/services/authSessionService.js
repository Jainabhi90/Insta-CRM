import { normalizeSession } from "../adapters/ownerAdapter"
import { signInWithPassword } from "../api/auth/credentialAuthApi"
import { bootstrapInstagramSession } from "../api/auth/sessionBootstrapApi"
import { getCurrentSession, logoutCurrentSession } from "../api/auth/sessionApi"
import { ApiError, canUseDemoFallback, isDemoFallbackEnabled } from "../api/core/apiClient"
import {
  buildDemoInstagramCallbackUrl,
  buildInstagramAuthorizeUrl,
  getInstagramRedirectUri,
} from "../lib/instagramAuthConfig"
import { clearDemoSession, getStoredDemoSession, loginDemoUser } from "./demoSessionService"
import {
  clearPendingSignupCredentials,
  savePendingSignupCredentials,
} from "./signupCredentialBridge"

function assertBackendLoginResponse(response) {
  if (response?.action === "redirect" || response?.authorizeUrl) {
    throw new Error(
      "Returning user login should not redirect to Instagram. Remove OAuth from /api/auth/login.",
    )
  }
}

export async function restoreExistingSession() {
  if (isDemoFallbackEnabled()) {
    return getStoredDemoSession()
  }

  try {
    const sessionPayload = await getCurrentSession()
    const session = normalizeSession(sessionPayload)

    if (session?.authStatus === "authenticated") {
      clearDemoSession()
      clearPendingSignupCredentials()
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

export async function loginWithCredentials({ identifier, password }) {
  const normalizedEmail = identifier.trim().toLowerCase()
  const payload = {
    identifier: normalizedEmail,
    email: normalizedEmail,
    password,
  }

  if (isDemoFallbackEnabled()) {
    const session = await loginDemoUser(payload)
    clearPendingSignupCredentials()

    return {
      source: "demo",
      nextStep: { type: "dashboard" },
      session,
    }
  }

  try {
    const response = await signInWithPassword(payload)
    assertBackendLoginResponse(response)
    clearDemoSession()
    clearPendingSignupCredentials()

    return {
      source: "backend",
      nextStep: { type: "dashboard" },
      response,
    }
  } catch (error) {
    if (!canUseDemoFallback(error)) {
      throw error
    }

    const session = await loginDemoUser(payload)
    clearPendingSignupCredentials()

    return {
      source: "demo",
      nextStep: { type: "dashboard" },
      session,
    }
  }
}

export async function startInstagramSignup({ email, password }) {
  const authorizeUrl = buildInstagramAuthorizeUrl()

  if (authorizeUrl) {
    savePendingSignupCredentials({ email, password })

    return {
      type: "redirect",
      source: "instagram",
      url: authorizeUrl,
    }
  }

  savePendingSignupCredentials({ email, password })

  return {
    type: "redirect",
    source: "demo",
    url: buildDemoInstagramCallbackUrl(),
  }
}

export async function logoutSession() {
  clearDemoSession()
  clearPendingSignupCredentials()

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
