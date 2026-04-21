const crypto = require("crypto")
const { config } = require("../config")

const SESSION_COOKIE_NAME = "insta_crm_session"
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

function getSessionSecret() {
  const secret = config.sessionSecret || config.meta.appSecret
  if (!secret || secret.trim().length === 0) {
    throw new Error("SESSION_SECRET is not configured. Set it in your environment variables.")
  }
  return secret
}

function parseCookies(headerValue) {
  return String(headerValue || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const separatorIndex = entry.indexOf("=")

      if (separatorIndex === -1) {
        return cookies
      }

      const key = entry.slice(0, separatorIndex).trim()
      const value = entry.slice(separatorIndex + 1).trim()
      cookies[key] = decodeURIComponent(value)
      return cookies
    }, {})
}

function signPayload(payload) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
}

function createSessionToken(sessionState) {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + SESSION_MAX_AGE_MS

  const payloadValue = {
    issuedAt,
    expiresAt,
  }

  if (sessionState?.gownerId) {
    payloadValue.gownerId = String(sessionState.gownerId)
    payloadValue.email = sessionState.email || ""

    if (sessionState.selectedIOwnerId) {
      payloadValue.selectedIOwnerId = String(sessionState.selectedIOwnerId)
    }
  } else if (sessionState?.ownerId) {
    payloadValue.ownerId = String(sessionState.ownerId)
    payloadValue.email = sessionState.email || ""
  } else if (sessionState?._id) {
    payloadValue.ownerId = sessionState._id.toString()
    payloadValue.email = sessionState.email
  }

  const payload = Buffer.from(
    JSON.stringify(payloadValue),
  ).toString("base64url")

  const signature = signPayload(payload)
  return `${payload}.${signature}`
}

function readSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie)
  return cookies[SESSION_COOKIE_NAME] || ""
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = signPayload(payload)
  const expectedBuffer = Buffer.from(expectedSignature)
  const providedBuffer = Buffer.from(signature)

  if (expectedBuffer.length !== providedBuffer.length) {
    return null
  }

  if (!crypto.timingSafeEqual(expectedBuffer, providedBuffer)) {
    return null
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))

    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null
    }

    if (session.issuedAt && Date.now() - session.issuedAt > SESSION_MAX_AGE_MS) {
      return null
    }

    return session
  } catch {
    return null
  }
}

function setSessionCookie(res, sessionState) {
  const token = createSessionToken(sessionState)

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  })
}

function clearSessionCookie(res) {
  res.cookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    path: "/",
    expires: new Date(0),
  })
}

module.exports = {
  readSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
}
