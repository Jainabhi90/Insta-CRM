const SIGNUP_CREDENTIALS_STORAGE_KEY = "instalead.signup.credentials"

function isValidCredentialPayload(payload) {
  return Boolean(payload?.username && payload?.password)
}

export function savePendingSignupCredentials({ username, password }) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    SIGNUP_CREDENTIALS_STORAGE_KEY,
    JSON.stringify({
      username: username.trim(),
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
          username: payload.username.trim(),
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
