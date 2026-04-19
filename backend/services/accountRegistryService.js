const GOwner = require("../models/GOwner")
const IOwner = require("../models/IOwner")

function normalizeText(value) {
  return String(value || "").trim()
}

function formatHandle(username) {
  const normalizedUsername = normalizeText(username).replace(/^@/, "")
  return normalizedUsername ? `@${normalizedUsername}` : ""
}

function buildGOwnerResponse(gowner) {
  if (!gowner) {
    return null
  }

  return {
    id: gowner._id.toString(),
    email: gowner.email,
    googleSub: gowner.googleSub,
    name: gowner.name || gowner.email,
    avatarUrl: gowner.avatarUrl || "",
    emailVerified: Boolean(gowner.emailVerified),
    status: gowner.status,
    defaultIownerId: gowner.defaultIOwnerId ? gowner.defaultIOwnerId.toString() : "",
    lastLoginAt: gowner.lastLoginAt,
  }
}

function buildAccountSummary(iowner, { selectedOwnerId = "" } = {}) {
  if (!iowner) {
    return null
  }

  const id = iowner._id.toString()
  const username = normalizeText(iowner.instagramUsername)

  return {
    id,
    iownerId: id,
    ownerId: id,
    instagramUserId: normalizeText(iowner.instagramUserId),
    instagramUsername: username,
    instagramHandle: formatHandle(username),
    name:
      formatHandle(username) ||
      normalizeText(iowner.instagramDisplayName) ||
      (iowner.instagramUserId ? `Instagram ${iowner.instagramUserId}` : "Instagram account"),
    avatarUrl: normalizeText(iowner.profilePictureUrl),
    profilePictureUrl: normalizeText(iowner.profilePictureUrl),
    accountType: normalizeText(iowner.accountType || "UNKNOWN"),
    connectionStatus: normalizeText(iowner.connectionStatus || "pending"),
    tokenExpiresAt: iowner.tokenExpiresAt || null,
    connectedAt: iowner.connectedAt || null,
    permissions: Array.isArray(iowner.permissions) ? iowner.permissions : [],
    isSelected: String(selectedOwnerId || "") === id,
  }
}

async function getGOwnerAccounts(gownerId) {
  if (!gownerId) {
    return []
  }

  return IOwner.find({ gownerId }).sort({ updatedAt: -1, createdAt: -1 })
}

async function syncGOwnerAccountsSummary(gowner) {
  const resolvedGOwner =
    typeof gowner === "string" || gowner?._bsontype === "ObjectId"
      ? await GOwner.findById(gowner)
      : gowner

  if (!resolvedGOwner) {
    return {
      gowner: null,
      accounts: [],
    }
  }

  const accounts = await getGOwnerAccounts(resolvedGOwner._id)
  const selectedOwnerId = resolvedGOwner.defaultIOwnerId?.toString() || accounts[0]?._id?.toString() || ""

  resolvedGOwner.accountsSummary = accounts.map((account) => ({
    iownerId: account._id,
    instagramUserId: normalizeText(account.instagramUserId),
    instagramUsername: normalizeText(account.instagramUsername),
    instagramHandle: formatHandle(account.instagramUsername),
    profilePictureUrl: normalizeText(account.profilePictureUrl),
    connectionStatus: normalizeText(account.connectionStatus || "pending"),
    tokenExpiresAt: account.tokenExpiresAt || null,
  }))

  if (accounts.length === 0) {
    resolvedGOwner.defaultIOwnerId = null
    resolvedGOwner.status = "pending_instagram"
  } else {
    resolvedGOwner.defaultIOwnerId =
      resolvedGOwner.defaultIOwnerId || accounts[0]._id
    resolvedGOwner.status = "active"
  }

  await resolvedGOwner.save()

  return {
    gowner: resolvedGOwner,
    accounts,
    selectedOwnerId,
  }
}

async function upsertGOwnerFromGoogleProfile(profile) {
  const email = normalizeText(profile.email).toLowerCase()
  const googleSub = normalizeText(profile.googleSub)

  let gowner = await GOwner.findOne({
    $or: [
      ...(googleSub ? [{ googleSub }] : []),
      ...(email ? [{ email }] : []),
    ],
  })

  if (!gowner) {
    gowner = new GOwner({
      email,
    })
  }

  gowner.email = email || gowner.email
  gowner.googleSub = googleSub || gowner.googleSub
  gowner.name = normalizeText(profile.name) || gowner.name || email
  gowner.avatarUrl = normalizeText(profile.avatarUrl) || gowner.avatarUrl
  gowner.emailVerified = Boolean(profile.emailVerified)
  gowner.lastLoginAt = new Date()

  await gowner.save()

  return gowner
}

async function upsertInstagramOwnerForGOwner({
  gowner,
  exchangeResult,
  profile,
}) {
  const identityCandidates = [
    normalizeText(profile.instagramAccountId),
    normalizeText(profile.instagramUserId),
    normalizeText(exchangeResult.instagramUserId),
  ].filter(Boolean)

  if (identityCandidates.length === 0) {
    throw new Error("Instagram did not return a stable account ID for this login.")
  }

  let iowner = await IOwner.findOne({
    instagramUserId: { $in: identityCandidates },
  })

  if (iowner && String(iowner.gownerId) !== String(gowner._id)) {
    const error = new Error(
      "This Instagram account is already linked to a different Google workspace.",
    )
    error.status = 409
    throw error
  }

  if (!iowner) {
    iowner = new IOwner({
      gownerId: gowner._id,
      email: gowner.email,
      instagramUserId: identityCandidates[0],
    })
  }

  iowner.gownerId = gowner._id
  iowner.email = gowner.email
  iowner.instagramUserId = identityCandidates[0]
  iowner.instagramUsername = normalizeText(profile.instagramUsername)
  iowner.instagramDisplayName = normalizeText(profile.instagramUsername)
  iowner.profilePictureUrl = normalizeText(profile.profilePictureUrl)
  iowner.accountType = normalizeText(profile.accountType || "UNKNOWN")
  iowner.permissions = Array.isArray(exchangeResult.permissions) ? exchangeResult.permissions : []
  iowner.authorizationCode = normalizeText(exchangeResult.authorizationCode)
  iowner.shortLivedAccessToken = normalizeText(exchangeResult.shortLivedAccessToken)
  iowner.longLivedAccessToken = normalizeText(exchangeResult.longLivedAccessToken)
  iowner.tokenType = normalizeText(exchangeResult.tokenType || "bearer")
  iowner.tokenExpiresAt = exchangeResult.tokenExpiresAt || null
  iowner.connectionStatus = "connected"
  iowner.connectedAt = new Date()
  iowner.lastProfileSyncAt = new Date()
  iowner.lastTokenRefreshAt = new Date()

  await iowner.save()

  if (!gowner.defaultIOwnerId) {
    gowner.defaultIOwnerId = iowner._id
    await gowner.save()
  }

  const synced = await syncGOwnerAccountsSummary(gowner)

  return {
    gowner: synced.gowner,
    iowner,
    accounts: synced.accounts,
  }
}

async function findSelectedIOwner(gowner, selectedOwnerId) {
  if (!gowner) {
    return null
  }

  const targetId =
    normalizeText(selectedOwnerId) ||
    normalizeText(gowner.defaultIOwnerId?.toString())

  if (targetId) {
    const selected = await IOwner.findOne({
      _id: targetId,
      gownerId: gowner._id,
    })

    if (selected) {
      return selected
    }
  }

  return IOwner.findOne({ gownerId: gowner._id }).sort({ updatedAt: -1, createdAt: -1 })
}

module.exports = {
  buildAccountSummary,
  buildGOwnerResponse,
  findSelectedIOwner,
  getGOwnerAccounts,
  syncGOwnerAccountsSummary,
  upsertGOwnerFromGoogleProfile,
  upsertInstagramOwnerForGOwner,
}
