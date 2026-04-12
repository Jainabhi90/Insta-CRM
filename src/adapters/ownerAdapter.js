import { formatHandle, getInitials, pickValue } from "./backendPayloadUtils"

export function normalizeOwner(rawOwner, fallbackOwner = {}) {
  const name = pickValue(
    rawOwner,
    ["name", "full_name", "owner_name", "display_name"],
    fallbackOwner.name || "Instagram Account",
  )

  const handle = pickValue(
    rawOwner,
    ["instagramHandle", "instagram_handle", "username", "handle"],
    fallbackOwner.instagramHandle || "instagram_account",
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

  return {
    id,
    name,
    instagramHandle: formatHandle(handle, fallbackOwner.instagramHandle),
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
