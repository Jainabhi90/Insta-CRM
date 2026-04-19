const { config } = require("../config")

class GoogleAuthError extends Error {
  constructor(message, { status = 500, data = null } = {}) {
    super(message)
    this.name = "GoogleAuthError"
    this.status = status
    this.data = data
  }
}

function getRedirectUri(redirectUriFromClient) {
  return redirectUriFromClient || config.google.redirectUri
}

function assertGoogleConfig(redirectUri) {
  if (!config.google.clientId || !config.google.clientSecret || !redirectUri) {
    throw new GoogleAuthError(
      "Google OAuth configuration is incomplete. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.",
      { status: 500 },
    )
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return text ? { message: text } : {}
  }
}

async function exchangeCodeForTokens({ code, redirectUri }) {
  const resolvedRedirectUri = getRedirectUri(redirectUri)
  assertGoogleConfig(resolvedRedirectUri)

  const body = new URLSearchParams({
    code,
    client_id: config.google.clientId,
    client_secret: config.google.clientSecret,
    redirect_uri: resolvedRedirectUri,
    grant_type: "authorization_code",
  })

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new GoogleAuthError(
      data?.error_description || data?.error || "Google code exchange failed.",
      {
        status: response.status,
        data,
      },
    )
  }

  return data
}

async function getGoogleUserProfile(accessToken) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new GoogleAuthError(
      data?.error_description || data?.error || "Google user profile could not be loaded.",
      {
        status: response.status,
        data,
      },
    )
  }

  return {
    googleSub: String(data?.sub || ""),
    email: String(data?.email || "").trim().toLowerCase(),
    name: String(data?.name || data?.given_name || "").trim(),
    avatarUrl: String(data?.picture || "").trim(),
    emailVerified: Boolean(data?.email_verified),
  }
}

async function exchangeGoogleCodeForProfile({ code, redirectUri }) {
  const tokens = await exchangeCodeForTokens({ code, redirectUri })
  const profile = await getGoogleUserProfile(tokens.access_token)

  if (!profile.email) {
    throw new GoogleAuthError("Google did not return an email address for this account.", {
      status: 400,
    })
  }

  return {
    ...profile,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    idToken: tokens.id_token || "",
    redirectUriUsed: getRedirectUri(redirectUri),
  }
}

module.exports = {
  GoogleAuthError,
  exchangeGoogleCodeForProfile,
}
