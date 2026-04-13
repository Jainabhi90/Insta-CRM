const SIGNUP_CREDENTIALS_STORAGE_KEY = "instalead.signup.credentials.v2"

function isValidCredentialPayload(payload) {
  return Boolean((payload?.email || payload?.username) && payload?.password)
}

export function savePendingSignupCredentials({ email, password }) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    SIGNUP_CREDENTIALS_STORAGE_KEY,
    JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      savedAt: new Date().toISOString(),
    }),
  )
}

export function consumePendingSignupCredentials() {
  if (typeof window === "undefined") {
    return null
  }

  const rawValue = window.sessionStorage.getItem(SIGNUP_CREDENTIALS_STORAGE_KEY)
  window.sessionStorage.removeItem(SIGNUP_CREDENTIALS_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const payload = JSON.parse(rawValue)
    return isValidCredentialPayload(payload)
      ? {
          email: (payload.email || payload.username).trim().toLowerCase(),
          password: payload.password,
        }
      : null
  } catch {
    return null
  }
}

export function clearPendingSignupCredentials() {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(SIGNUP_CREDENTIALS_STORAGE_KEY)
}
