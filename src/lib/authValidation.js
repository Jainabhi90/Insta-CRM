const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/
const MIN_PASSWORD_LENGTH = 8

export function normalizeUsername(username) {
  return (username || "").trim()
}

export function validateLoginCredentials({ identifier, password }) {
  if (!identifier?.trim()) {
    return "Enter your username to continue."
  }

  if (!password?.trim()) {
    return "Enter your password to continue."
  }

  return ""
}

export function validateAccountCredentials({ username, password }) {
  const normalizedUsername = normalizeUsername(username)

  if (!normalizedUsername) {
    return "Choose a username to finish setting up your account."
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return "Use 3-32 characters with letters, numbers, dots, hyphens, or underscores."
  }

  if (!password?.trim()) {
    return "Create a password to finish setting up your account."
  }

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
  }

  return ""
}
