import { normalizeOwner } from "../adapters/ownerAdapter"
import {
  getDisplayNameFromEmail,
  normalizeEmail,
  validateAccountCredentials,
  validateLoginCredentials,
} from "../lib/authValidation"

const DEMO_STORAGE_VERSION = "v2"
const USERS_STORAGE_KEY = `instalead.demo.users.${DEMO_STORAGE_VERSION}`
const SESSION_STORAGE_KEY = `instalead.demo.session.${DEMO_STORAGE_VERSION}`

function readStorage(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

function slugify(value) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function getStoredUsers() {
  return readStorage(USERS_STORAGE_KEY, [])
}

function saveStoredUsers(users) {
  writeStorage(USERS_STORAGE_KEY, users)
}

function persistSession(userId) {
  writeStorage(SESSION_STORAGE_KEY, {
    userId,
    createdAt: new Date().toISOString(),
  })
}

function buildSessionPayload(user) {
  return {
    authenticated: true,
    authStatus: "authenticated",
    source: "demo",
    owner: normalizeOwner({
      id: user.id,
      name: user.name || getDisplayNameFromEmail(user.email) || user.email,
      instagram_handle: user.instagramHandle,
      plan: user.plan,
    }),
  }
}

function getLookupCandidates(user) {
  const email = user.email ? normalizeEmail(user.email) : ""
  const emailPrefix = email ? email.split("@")[0] : ""
  const instagramHandle = (user.instagramHandle || "").replace(/^@/, "").toLowerCase()
  const normalizedName = slugify(user.name).replace(/_/g, "")

  return [email, emailPrefix, instagramHandle, normalizedName].filter(Boolean)
}

async function hashPassword(password) {
  const normalizedPassword = password.trim()

  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const passwordBytes = new TextEncoder().encode(normalizedPassword)
    const digest = await window.crypto.subtle.digest("SHA-256", passwordBytes)

    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  }

  let hash = 0

  for (let index = 0; index < normalizedPassword.length; index += 1) {
    hash = (hash << 5) - hash + normalizedPassword.charCodeAt(index)
    hash |= 0
  }

  return String(hash)
}

function createDemoInstagramProfileFromCode(code, email) {
  const normalizedCode = (code || `${Date.now()}`)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .slice(-6)

  const suffix = normalizedCode || `${Date.now()}`.slice(-4)
  const normalizedEmail = normalizeEmail(email)

  return {
    id: `demo-${Date.now()}`,
    name: getDisplayNameFromEmail(normalizedEmail) || `Instagram Creator ${suffix}`,
    instagramHandle: `creator_${suffix}`,
    plan: "Growth Plan",
  }
}

function userMatchesEmail(user, normalizedEmail) {
  const currentEmail = normalizeEmail(user.email)
  return currentEmail === normalizedEmail
}

export function clearDemoSession() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function getStoredDemoSession() {
  const storedSession = readStorage(SESSION_STORAGE_KEY, null)

  if (!storedSession?.userId) {
    return null
  }

  const storedUser = getStoredUsers().find((user) => user.id === storedSession.userId)

  if (!storedUser) {
    clearDemoSession()
    return null
  }

  return buildSessionPayload(storedUser)
}

export async function completeDemoInstagramSignup({ code, email, password }) {
  const validationError = validateAccountCredentials({ email, password })

  if (validationError) {
    throw new Error(validationError)
  }

  const normalizedEmail = normalizeEmail(email)
  const users = getStoredUsers()

  if (users.some((user) => userMatchesEmail(user, normalizedEmail))) {
    throw new Error("This email is already registered.")
  }

  const instagramProfile = createDemoInstagramProfileFromCode(code, normalizedEmail)
  const newUser = {
    id: instagramProfile.id,
    email: normalizedEmail,
    name: instagramProfile.name,
    instagramHandle: instagramProfile.instagramHandle,
    passwordHash: await hashPassword(password),
    plan: instagramProfile.plan,
    createdAt: new Date().toISOString(),
  }

  saveStoredUsers([...users, newUser])
  persistSession(newUser.id)

  return buildSessionPayload(newUser)
}

export async function loginDemoUser({ identifier, email, password }) {
  const validationError = validateLoginCredentials({ identifier, email, password })

  if (validationError) {
    throw new Error(validationError)
  }

  const normalizedIdentifier = normalizeEmail(email || identifier)
  const passwordHash = await hashPassword(password)
  const user = getStoredUsers().find((candidate) =>
    getLookupCandidates(candidate).includes(normalizedIdentifier),
  )

  if (!user || user.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password.")
  }

  persistSession(user.id)

  return buildSessionPayload(user)
}
