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
    return false
  }

  const [salt, savedDigest] = storedHash.split(":")
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
