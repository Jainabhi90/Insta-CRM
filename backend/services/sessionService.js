const crypto = require("crypto")
const { config } = require("../config")

const SESSION_COOKIE_NAME = "insta_crm_session"

function getSessionSecret() {
  return config.sessionSecret || config.meta.appSecret || "change-this-session-secret"
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

function createSessionToken(owner) {
  const payload = Buffer.from(
    JSON.stringify({
      ownerId: owner._id.toString(),
      email: owner.email,
      issuedAt: Date.now(),
    }),
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
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  } catch {
    return null
  }
}

function setSessionCookie(res, owner) {
  const token = createSessionToken(owner)

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: config.cookieSameSite,
    secure: config.cookieSecure,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
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
