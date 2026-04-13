const mongoose = require("mongoose")
const { connectToDatabase } = require("../db")

function objectIdCandidates(owner) {
  const values = []

  if (owner?._id) {
    values.push(owner._id)
    values.push(owner._id.toString())
  }

  return values
}

function stringCandidates(values) {
  return values.filter(Boolean).map((value) => String(value))
}

function buildOwnerScopedQuery(owner) {
  const ownerIds = objectIdCandidates(owner)
  const emails = stringCandidates([owner?.email])
  const instagramIds = stringCandidates([owner?.instagramUserId])
  const handles = stringCandidates([owner?.instagramUsername])

  const clauses = []

  if (ownerIds.length > 0) {
    clauses.push({ ownerId: { $in: ownerIds } })
    clauses.push({ owner_id: { $in: ownerIds.map(String) } })
    clauses.push({ owner: { $in: ownerIds.map(String) } })
    clauses.push({ userId: { $in: ownerIds.map(String) } })
    clauses.push({ user_id: { $in: ownerIds.map(String) } })
  }

  if (emails.length > 0) {
    clauses.push({ email: { $in: emails } })
    clauses.push({ ownerEmail: { $in: emails } })
    clauses.push({ owner_email: { $in: emails } })
  }

  if (instagramIds.length > 0) {
    clauses.push({ instagramUserId: { $in: instagramIds } })
    clauses.push({ instagram_user_id: { $in: instagramIds } })
    clauses.push({ accountId: { $in: instagramIds } })
    clauses.push({ account_id: { $in: instagramIds } })
  }

  if (handles.length > 0) {
    clauses.push({ instagramHandle: { $in: handles } })
    clauses.push({ instagram_handle: { $in: handles } })
    clauses.push({ username: { $in: handles } })
    clauses.push({ handle: { $in: handles } })
  }

  return clauses.length > 0 ? { $or: clauses } : {}
}

async function listCollectionDocuments(collectionName, owner, options = {}) {
  await connectToDatabase()

  const db = mongoose.connection.db
  const query = buildOwnerScopedQuery(owner)
  const sort = options.sort || { createdAt: -1, created_at: -1, _id: -1 }
  const limit = options.limit || 100

  try {
    return await db.collection(collectionName).find(query).sort(sort).limit(limit).toArray()
  } catch {
    return []
  }
}

async function getOwnerScopedWorkspace(owner) {
  const [campaigns, dmLogs, automations] = await Promise.all([
    listCollectionDocuments("campaigns", owner),
    listCollectionDocuments("dm_logs", owner),
    listCollectionDocuments("automations", owner),
  ])

  return {
    campaigns,
    dmLogs,
    automations,
  }
}

module.exports = {
  getOwnerScopedWorkspace,
}
