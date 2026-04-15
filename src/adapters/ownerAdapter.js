import { formatHandle, getInitials, pickValue } from "./backendPayloadUtils"

export function normalizeOwner(rawOwner, fallbackOwner = {}) {
  const instagramUserId = pickValue(
    rawOwner,
    ["instagramUserId", "instagram_user_id", "accountId", "account_id"],
    fallbackOwner.instagramUserId || "",
  )

  const instagramUsername = pickValue(
    rawOwner,
    ["instagramUsername", "instagram_username", "instagramHandle", "instagram_handle", "username", "handle"],
    fallbackOwner.instagramUsername || fallbackOwner.instagramHandle || "",
  )

  const name = pickValue(
    rawOwner,
    ["name", "full_name", "owner_name", "display_name"],
    fallbackOwner.name ||
      (instagramUsername ? `@${String(instagramUsername).replace(/^@/, "")}` : "") ||
      (instagramUserId ? `Instagram ${instagramUserId}` : "Instagram Account"),
  )

  const handle = pickValue(
    rawOwner,
    ["instagramHandle", "instagram_handle", "instagramUsername", "instagram_username", "username", "handle"],
    instagramUsername || fallbackOwner.instagramHandle || "instagram_account",
  )

  const plan = pickValue(
    rawOwner,
    ["plan", "plan_name", "subscription_tier", "tier"],
    fallbackOwner.plan || "Growth Plan",
  )

  const id = pickValue(
    rawOwner,
    ["id", "ownerId", "owner_id", "user_id"],
    fallbackOwner.id || "owner-session",
  )

  const tokenExpiresAt = pickValue(
    rawOwner,
    ["tokenExpiresAt", "token_expires_at"],
    fallbackOwner.tokenExpiresAt || null,
  )

  const connectedAt = pickValue(
    rawOwner,
    ["connectedAt", "instagramConnectedAt", "instagram_connected_at"],
    fallbackOwner.connectedAt || null,
  )

  const explicitConnected = pickValue(rawOwner, ["instagramConnected", "instagram_connected"], null)
  const instagramConnected =
    explicitConnected === null
      ? Boolean(instagramUserId || fallbackOwner.instagramConnected)
      : Boolean(explicitConnected)

  return {
    id,
    name,
    instagramHandle: formatHandle(handle, fallbackOwner.instagramHandle),
    instagramUserId,
    instagramUsername: String(instagramUsername || "").replace(/^@/, ""),
    instagramConnected,
    tokenExpiresAt,
    connectedAt,
    plan,
    avatarInitials: fallbackOwner.avatarInitials || getInitials(name),
  }
}

export function normalizeSession(sessionPayload) {
  if (!sessionPayload) {
    return null
  }

  const authStatus =
    sessionPayload.authStatus ||
    (sessionPayload.authenticated === false ? "unauthenticated" : "authenticated")

  if (sessionPayload.authenticated === false && authStatus === "unauthenticated") {
    return null
  }

  const rawOwner =
    sessionPayload.owner ||
    sessionPayload.user ||
    sessionPayload.me ||
    sessionPayload.data?.owner ||
    sessionPayload.data?.user ||
    null

  if (!rawOwner) {
    return null
  }

  return {
    authenticated: authStatus === "authenticated",
    authStatus,
    owner: normalizeOwner(rawOwner),
  }
}
