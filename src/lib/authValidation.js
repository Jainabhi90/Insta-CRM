const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase()
}

export function getDisplayNameFromEmail(email) {
  const emailPrefix = normalizeEmail(email).split("@")[0] || "Instagram User"

  return emailPrefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function validateLoginCredentials({ identifier, email, password }) {
  const normalizedEmail = normalizeEmail(email || identifier)

  if (!normalizedEmail) {
    return "Enter your email to continue."
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return "Enter a valid email address."
  }

  if (!password?.trim()) {
    return "Enter your password to continue."
  }

  return ""
}

export function validateAccountCredentials({ email, password }) {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    return "Enter your email to create your account."
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return "Enter a valid email address."
  }

  if (!password?.trim()) {
    return "Create a password to finish setting up your account."
  }

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
  }

  return ""
}
