export function getArrayPayload(payload, candidateKeys = []) {
  if (Array.isArray(payload)) {
    return payload
  }

  const keys = [...candidateKeys, "items", "data", "results"]

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key]
    }
  }

  return []
}

export function pickValue(source, keys, fallback = undefined) {
  for (const key of keys) {
    const value = source?.[key]

    if (value !== undefined && value !== null && value !== "") {
      return value
    }
  }

  return fallback
}

export function toNumber(value, fallback = 0) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : fallback
}

export function getInitials(value) {
  const parts = (value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) {
    return "IG"
  }

  return parts.map((part) => part[0].toUpperCase()).join("")
}

export function formatHandle(value, fallback = "@instagram_owner") {
  if (!value) {
    return fallback
  }

  return value.startsWith("@") ? value : `@${value}`
}

export function formatRelativeTime(value, fallback = "Recently") {
  if (!value) {
    return fallback
  }

  if (typeof value === "string" && /ago$/i.test(value.trim())) {
    return value
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))

  if (seconds < 60) {
    return `${seconds} sec ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }

  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

export function formatCompactNumber(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }

  return `${value}`
}
