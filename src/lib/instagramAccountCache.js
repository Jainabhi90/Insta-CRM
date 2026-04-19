const INSTAGRAM_ACCOUNT_CACHE_KEY = "instalead.instagram.accounts.v1"

function readCache() {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(INSTAGRAM_ACCOUNT_CACHE_KEY)
    const parsed = rawValue ? JSON.parse(rawValue) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCache(items) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(INSTAGRAM_ACCOUNT_CACHE_KEY, JSON.stringify(items))
}

function toAccountRecord(account) {
  const id = String(account?.id || account?.instagramUserId || "").trim()

  if (!id) {
    return null
  }

  return {
    id,
    instagramUserId: String(account?.instagramUserId || "").trim(),
    instagramUsername: String(account?.instagramUsername || account?.instagramHandle || "")
      .replace(/^@/, "")
      .trim(),
    connectedAt: account?.connectedAt || null,
    lastUsedAt: account?.lastUsedAt || new Date().toISOString(),
  }
}

function sortByRecent(items) {
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a?.lastUsedAt || a?.connectedAt || 0) || 0
    const bTime = Date.parse(b?.lastUsedAt || b?.connectedAt || 0) || 0
    return bTime - aTime
  })
}

export function getCachedInstagramAccounts() {
  return sortByRecent(readCache().map(toAccountRecord).filter(Boolean))
}

export function mergeInstagramAccounts(accounts) {
  const mergedById = new Map()

  for (const cachedAccount of getCachedInstagramAccounts()) {
    mergedById.set(cachedAccount.id, cachedAccount)
  }

  for (const incomingAccount of Array.isArray(accounts) ? accounts : []) {
    const normalized = toAccountRecord(incomingAccount)

    if (!normalized) {
      continue
    }

    const previous = mergedById.get(normalized.id) || {}

    mergedById.set(normalized.id, {
      ...previous,
      ...normalized,
      lastUsedAt: previous.lastUsedAt || normalized.lastUsedAt,
    })
  }

  const nextItems = sortByRecent(Array.from(mergedById.values()))
  writeCache(nextItems)
  return nextItems
}

export function rememberInstagramAccount(owner) {
  const normalized = toAccountRecord(owner)

  if (!normalized) {
    return
  }

  const existing = getCachedInstagramAccounts().filter((item) => item.id !== normalized.id)
  const nextItems = sortByRecent([
    {
      ...normalized,
      lastUsedAt: new Date().toISOString(),
    },
    ...existing,
  ])

  writeCache(nextItems)
}
