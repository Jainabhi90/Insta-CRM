const crypto = require("crypto")
const { promisify } = require("util")

const scryptAsync = promisify(crypto.scrypt)

async function hashPassword(password) {
  const normalizedPassword = String(password || "").trim()
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = await scryptAsync(normalizedPassword, salt, 64)

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    await scryptAsync("dummy-timing-guard", "dummy-salt-guard", 64)
    return false
  }

  const [salt, savedDigest] = storedHash.split(":")

  if (!salt || !savedDigest) {
    await scryptAsync("dummy-timing-guard", "dummy-salt-guard", 64)
    return false
  }

  const derivedKey = await scryptAsync(String(password || "").trim(), salt, 64)
  const savedBuffer = Buffer.from(savedDigest, "hex")
  const derivedBuffer = Buffer.from(derivedKey)

  if (savedBuffer.length !== derivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(savedBuffer, derivedBuffer)
}

module.exports = {
  hashPassword,
  verifyPassword,
}
