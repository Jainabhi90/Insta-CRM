import { formatHandle, getInitials, pickValue } from "./backendPayloadUtils"

export function normalizeOwner(rawOwner, fallbackOwner = {}) {
  const id = pickValue(
    rawOwner,
    ["id", "iownerId", "ownerId", "owner_id", "user_id"],
    fallbackOwner.id || "owner-session",
  )

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

  const tokenExpiresAt = pickValue(
    rawOwner,
    ["tokenExpiresAt", "token_expires_at"],
    fallbackOwner.tokenExpiresAt || null,
  )

  const avatarUrl = pickValue(
    rawOwner,
    [
      "avatarUrl",
      "avatar_url",
      "profilePicture",
      "profile_picture",
      "profilePictureUrl",
      "profile_picture_url",
      "pictureUrl",
      "picture_url",
      "imageUrl",
      "image_url",
      "profileImage",
      "profile_image",
    ],
    fallbackOwner.avatarUrl || null,
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

  const connectionStatus = pickValue(
    rawOwner,
    ["connectionStatus", "connection_status", "status"],
    fallbackOwner.connectionStatus || (instagramConnected ? "connected" : "pending"),
  )

  const accountType = pickValue(
    rawOwner,
    ["accountType", "account_type"],
    fallbackOwner.accountType || "UNKNOWN",
  )

  const isSelected = Boolean(
    pickValue(rawOwner, ["isSelected", "selected"], fallbackOwner.isSelected || false),
  )

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
    avatarUrl,
    avatarInitials: fallbackOwner.avatarInitials || getInitials(name),
    connectionStatus,
    accountType,
    isSelected,
  }
}

export function normalizeGOwner(rawGOwner, fallbackGOwner = {}) {
  if (!rawGOwner) {
    return null
  }

  return {
    id: pickValue(rawGOwner, ["id", "gownerId"], fallbackGOwner.id || ""),
    email: pickValue(rawGOwner, ["email"], fallbackGOwner.email || ""),
    googleSub: pickValue(rawGOwner, ["googleSub", "google_sub"], fallbackGOwner.googleSub || ""),
    name: pickValue(rawGOwner, ["name", "display_name"], fallbackGOwner.name || ""),
    avatarUrl: pickValue(
      rawGOwner,
      ["avatarUrl", "avatar_url", "picture", "picture_url"],
      fallbackGOwner.avatarUrl || "",
    ),
    status: pickValue(rawGOwner, ["status"], fallbackGOwner.status || "pending_instagram"),
    defaultIownerId: pickValue(
      rawGOwner,
      ["defaultIownerId", "defaultIOwnerId", "default_iowner_id"],
      fallbackGOwner.defaultIownerId || "",
    ),
    lastLoginAt: pickValue(rawGOwner, ["lastLoginAt", "last_login_at"], fallbackGOwner.lastLoginAt || null),
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

  const rawGOwner =
    sessionPayload.gowner ||
    sessionPayload.workspace ||
    sessionPayload.data?.gowner ||
    null

  const rawOwner =
    sessionPayload.owner ||
    sessionPayload.user ||
    sessionPayload.me ||
    sessionPayload.data?.owner ||
    sessionPayload.data?.user ||
    null

  if (!rawOwner && !rawGOwner) {
    return null
  }

  const normalizedOwner = rawOwner ? normalizeOwner(rawOwner) : null
  const normalizedAccounts = Array.isArray(sessionPayload.accounts)
    ? sessionPayload.accounts.map((account) =>
        normalizeOwner(account, {
          id: sessionPayload.selectedOwnerId && String(account?.id || account?.ownerId || account?.iownerId || "") === String(sessionPayload.selectedOwnerId)
            ? String(sessionPayload.selectedOwnerId)
            : undefined,
          isSelected:
            String(account?.id || account?.ownerId || account?.iownerId || "") ===
            String(sessionPayload.selectedOwnerId || normalizedOwner?.id || ""),
        }),
      )
    : normalizedOwner
      ? [normalizeOwner(rawOwner, { isSelected: true })]
      : []

  return {
    authenticated: authStatus === "authenticated",
    authStatus,
    gowner: normalizeGOwner(rawGOwner),
    owner: normalizedOwner,
    accounts: normalizedAccounts,
    selectedOwnerId:
      sessionPayload.selectedOwnerId ||
      normalizedOwner?.id ||
      "",
  }
}
