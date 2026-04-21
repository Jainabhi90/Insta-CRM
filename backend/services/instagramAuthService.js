const { config } = require("../config")

class InstagramAuthError extends Error {
  constructor(message, { status = 500, data = null } = {}) {
    super(message)
    this.name = "InstagramAuthError"
    this.status = status
    this.data = data
  }
}

function getRedirectUri(redirectUriFromClient) {
  return redirectUriFromClient || config.instagram.redirectUri
}

function assertInstagramAuthorizeConfig(redirectUri) {
  if (!config.instagram.clientId || !redirectUri) {
    throw new InstagramAuthError(
      "Instagram login configuration is incomplete. Set INSTAGRAM_CLIENT_ID and INSTAGRAM_REDIRECT_URI.",
      { status: 500 },
    )
  }
}

function assertInstagramConfig(redirectUri) {
  if (!config.instagram.clientId || !config.instagram.clientSecret || !redirectUri) {
    throw new InstagramAuthError(
      "Instagram OAuth configuration is incomplete. Set INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, and INSTAGRAM_REDIRECT_URI.",
      { status: 500 },
    )
  }
}

async function parseInstagramResponse(response) {
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

async function exchangeCodeForShortLivedToken({ code, redirectUri }) {
  const resolvedRedirectUri = getRedirectUri(redirectUri)
  assertInstagramConfig(resolvedRedirectUri)

  const body = new URLSearchParams({
    client_id: config.instagram.clientId,
    client_secret: config.instagram.clientSecret,
    grant_type: "authorization_code",
    redirect_uri: resolvedRedirectUri,
    code,
  })

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const data = await parseInstagramResponse(response)

  if (!response.ok) {
    throw new InstagramAuthError(
      data?.error_message || data?.error?.message || "Instagram code exchange failed.",
      {
        status: response.status,
        data,
      },
    )
  }

  return {
    shortLivedAccessToken: data.access_token,
    instagramUserId: (() => {
      const userId = String(data.user_id || "").trim()
      if (!userId || !/^\d+$/.test(userId)) {
        throw new InstagramAuthError(
          `Instagram returned an invalid user ID format: "${userId}". Expected a numeric string.`,
          { status: 400, data: { received_user_id: userId } },
        )
      }
      return userId
    })(),
    permissions: Array.isArray(data.permissions) ? data.permissions : [],
  }
}

async function exchangeShortLivedForLongLivedToken({ shortLivedAccessToken }) {
  const url = new URL("https://graph.instagram.com/access_token")
  url.searchParams.set("grant_type", "ig_exchange_token")
  url.searchParams.set("client_secret", config.instagram.clientSecret)
  url.searchParams.set("access_token", shortLivedAccessToken)

  const response = await fetch(url)
  const data = await parseInstagramResponse(response)

  if (!response.ok) {
    throw new InstagramAuthError(
      data?.error?.message || data?.message || "Long-lived token exchange failed.",
      {
        status: response.status,
        data,
      },
    )
  }

  return {
    longLivedAccessToken: data.access_token,
    tokenType: data.token_type || "bearer",
    expiresIn: Number(data.expires_in || 0),
  }
}

function buildInstagramAuthorizeUrl({
  redirectUri,
  state,
  forceReauth = true,
  scope = config.instagram.scope,
}) {
  const resolvedRedirectUri = getRedirectUri(redirectUri)
  assertInstagramAuthorizeConfig(resolvedRedirectUri)

  const params = new URLSearchParams({
    client_id: config.instagram.clientId,
    redirect_uri: resolvedRedirectUri,
    response_type: "code",
    scope,
    state,
  })

  if (forceReauth) {
    params.set("force_reauth", "true")
  }

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`
}

async function exchangeCodeForLongLivedToken({ code, redirectUri }) {
  const shortLivedToken = await exchangeCodeForShortLivedToken({ code, redirectUri })
  const longLivedToken = await exchangeShortLivedForLongLivedToken({
    shortLivedAccessToken: shortLivedToken.shortLivedAccessToken,
  })

  return {
    authorizationCode: code,
    instagramUserId: shortLivedToken.instagramUserId,
    permissions: shortLivedToken.permissions,
    shortLivedAccessToken: shortLivedToken.shortLivedAccessToken,
    longLivedAccessToken: longLivedToken.longLivedAccessToken,
    tokenType: longLivedToken.tokenType,
    expiresIn: longLivedToken.expiresIn,
    tokenExpiresAt: (() => {
      const expiresIn = Number(longLivedToken.expiresIn || 0)
      const MIN_EXPIRY_SECONDS = 3600
      if (expiresIn < MIN_EXPIRY_SECONDS) {
        console.warn(
          `[WARN] Instagram returned an unusually short token lifetime (${expiresIn}s). ` +
            `Using ${MIN_EXPIRY_SECONDS}s as the minimum.`,
        )
        return new Date(Date.now() + MIN_EXPIRY_SECONDS * 1000)
      }
      return new Date(Date.now() + expiresIn * 1000)
    })(),
    redirectUriUsed: getRedirectUri(redirectUri),
  }
}

module.exports = {
  InstagramAuthError,
  buildInstagramAuthorizeUrl,
  exchangeCodeForLongLivedToken,
}
