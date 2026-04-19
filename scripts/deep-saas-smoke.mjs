import assert from "node:assert/strict"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import Module from "node:module"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")

function clearModule(modulePath) {
  const resolved = require.resolve(modulePath)
  delete require.cache[resolved]
}

async function withMockedModules(mocks, callback) {
  const originalLoad = Module._load

  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }

    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    return await callback()
  } finally {
    Module._load = originalLoad
  }
}

function createSortableResult(value) {
  return {
    sort: async () => value,
  }
}

async function requestJson(baseUrl, pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = response.headers.get("content-type") || ""
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  return {
    response,
    body,
    setCookie: response.headers.get("set-cookie") || "",
    cookie:
      (response.headers.get("set-cookie") || "")
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean)[0] || "",
  }
}

async function runRouteSmoke() {
  const apiCalls = []
  const automationCalls = []
  let gownerRecord = null
  const iownerRecords = []

  process.env.NODE_ENV = "test"
  process.env.INSTAGRAM_CLIENT_ID = "test-instagram-client-id"
  process.env.INSTAGRAM_REDIRECT_URI = "http://localhost:3000/auth/callback"
  process.env.N8N_INTERNAL_SECRET = "super-secret"
  process.env.COOKIE_SAME_SITE = "lax"
  process.env.COOKIE_SECURE = "false"

  clearModule("../backend/config")
  clearModule("../backend/router")
  clearModule("../backend/app")

  const mockApiCallModel = {
    async create(payload) {
      const record = {
        _id: `api-call-${apiCalls.length + 1}`,
        ...payload,
        async save() {
          return this
        },
      }
      apiCalls.push(record)
      return record
    },
    findOne() {
      return createSortableResult(null)
    },
  }

  const mocks = {
    "./db": {
      async connectToDatabase() {
        return null
      },
    },
    "./models/Owner": {
      async findById() {
        return null
      },
      async findOne() {
        return null
      },
    },
    "./models/ApiCall": mockApiCallModel,
    "./models/GOwner": {
      async findById(id) {
        return gownerRecord && String(gownerRecord._id) === String(id) ? gownerRecord : null
      },
    },
    "./models/IOwner": {
      async findOne(query) {
        return (
          iownerRecords.find(
            (record) =>
              String(record._id) === String(query._id || "") &&
              String(record.gownerId) === String(query.gownerId || record.gownerId),
          ) || null
        )
      },
    },
    "./services/passwordService": {
      async hashPassword(value) {
        return `hashed:${value}`
      },
    },
    "./services/accountRegistryService": {
      buildAccountSummary(account, { selectedOwnerId = "" } = {}) {
        return {
          id: account._id.toString(),
          iownerId: account._id.toString(),
          instagramUserId: account.instagramUserId,
          instagramUsername: account.instagramUsername,
          instagramHandle: `@${account.instagramUsername}`,
          name: `@${account.instagramUsername}`,
          connectionStatus: account.connectionStatus,
          tokenExpiresAt: account.tokenExpiresAt,
          avatarUrl: account.profilePictureUrl || "",
          profilePictureUrl: account.profilePictureUrl || "",
          isSelected: String(account._id) === String(selectedOwnerId),
        }
      },
      buildGOwnerResponse(gowner) {
        return gowner
          ? {
              id: gowner._id.toString(),
              email: gowner.email,
              name: gowner.name,
              avatarUrl: gowner.avatarUrl,
              status: gowner.status,
              defaultIownerId: gowner.defaultIOwnerId ? gowner.defaultIOwnerId.toString() : "",
            }
          : null
      },
      async getGOwnerAccounts(gownerId) {
        return iownerRecords.filter((record) => String(record.gownerId) === String(gownerId))
      },
      async syncGOwnerAccountsSummary(gowner) {
        const resolvedGowner =
          typeof gowner === "string"
            ? gownerRecord && String(gownerRecord._id) === String(gowner)
              ? gownerRecord
              : null
            : gowner

        if (!resolvedGowner) {
          return {
            gowner: null,
            accounts: [],
          }
        }

        const accounts = iownerRecords.filter(
          (record) => String(record.gownerId) === String(resolvedGowner._id),
        )

        resolvedGowner.accountsSummary = accounts.map((account) => ({
          iownerId: account._id,
          instagramUserId: account.instagramUserId,
          instagramUsername: account.instagramUsername,
          instagramHandle: `@${account.instagramUsername}`,
          profilePictureUrl: account.profilePictureUrl || "",
          connectionStatus: account.connectionStatus,
          tokenExpiresAt: account.tokenExpiresAt,
        }))
        resolvedGowner.defaultIOwnerId = resolvedGowner.defaultIOwnerId || accounts[0]?._id || null
        resolvedGowner.status = accounts.length > 0 ? "active" : "pending_instagram"

        return {
          gowner: resolvedGowner,
          accounts,
        }
      },
      async upsertGOwnerFromGoogleProfile(profile) {
        gownerRecord = {
          _id: gownerRecord?._id || "gowner-1",
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          status: iownerRecords.length > 0 ? "active" : "pending_instagram",
          defaultIOwnerId: gownerRecord?.defaultIOwnerId || null,
          async save() {
            return this
          },
        }

        return gownerRecord
      },
      async upsertInstagramOwnerForGOwner({ gowner }) {
        const iowner = {
          _id: "iowner-1",
          gownerId: gowner._id,
          email: gowner.email,
          instagramUserId: "acct-1",
          instagramUsername: "shop_one",
          profilePictureUrl: "",
          connectionStatus: "connected",
          tokenExpiresAt: new Date("2026-07-01T00:00:00.000Z"),
          longLivedAccessToken: "token-123",
        }
        iownerRecords.splice(0, iownerRecords.length, iowner)
        gowner.defaultIOwnerId = iowner._id

        return {
          gowner,
          iowner,
          accounts: [iowner],
        }
      },
    },
    "./services/googleAuthService": {
      async exchangeGoogleCodeForProfile() {
        return {
          email: "workspace@example.com",
          googleSub: "google-sub-1",
          name: "Workspace User",
          avatarUrl: "https://example.com/google-avatar.png",
          emailVerified: true,
        }
      },
    },
    "./services/automationService": {
      async confirmCommentAutomation(payload) {
        automationCalls.push({ type: "confirm", payload })
        return {
          action: "sent",
          message: "ok",
        }
      },
      async createOwnerAutomation() {
        return {}
      },
      async listOwnerAutomations() {
        return {
          automations: [],
          summary: {},
          tip: {},
        }
      },
      async triggerCommentAutomation(payload) {
        automationCalls.push({ type: "comment", payload })
        return {
          action: "prompted",
          confirmUrl: payload.followConfirmBaseUrl,
        }
      },
      async updateOwnerAutomation() {
        return {}
      },
    },
    "./services/instagramAuthService": require("../backend/services/instagramAuthService"),
    "./services/instagramMessagingService": {
      async sendInstagramReply() {
        return { ok: true }
      },
    },
    "./services/workspaceDataService": {
      async getOwnerScopedWorkspace() {
        return {
          campaigns: [],
          dmLogs: [],
        }
      },
    },
    "./services/instagramDataService": {
      async getInstagramProfile() {
        return {}
      },
      async listInstagramComments() {
        return {
          comments: [],
          summary: {},
        }
      },
      async listInstagramInbox() {
        return {
          conversations: [],
          summary: {},
        }
      },
      async listInstagramMedia() {
        return []
      },
    },
    "./services/instagramWebhookService": {
      async processInstagramWebhookPayload() {
        return null
      },
    },
  }

  return withMockedModules(mocks, async () => {
    const app = require("../backend/app")
    const server = http.createServer(app)

    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))

    const address = server.address()
    const baseUrl = `http://127.0.0.1:${address.port}`

    try {
      const health = await requestJson(baseUrl, "/api/health")
      assert.equal(health.response.status, 200)
      assert.equal(health.body.ok, true)

      const googleExchange = await requestJson(baseUrl, "/api/auth/google/exchange", {
        method: "POST",
        body: {
          code: "google-code-1",
          redirectUri: "http://localhost:3000/auth/google/callback",
        },
      })
      assert.equal(googleExchange.response.status, 200)
      assert.equal(googleExchange.body.gowner.email, "workspace@example.com")
      assert.equal(googleExchange.body.accounts.length, 0)
      assert.ok(googleExchange.cookie.includes("insta_crm_session="))

      const session = await requestJson(baseUrl, "/api/auth/session")
      assert.equal(session.response.status, 200)
      assert.equal(session.body.authStatus, "unauthenticated")

      const gownerSession = await requestJson(baseUrl, "/api/auth/session", {
        headers: {
          cookie: googleExchange.cookie,
        },
      })
      assert.equal(gownerSession.response.status, 200)
      assert.equal(gownerSession.body.gowner.email, "workspace@example.com")
      assert.equal(gownerSession.body.accounts.length, 0)

      const bootstrap = await requestJson(baseUrl, "/api/auth/session/bootstrap", {
        method: "POST",
        body: {
          redirectUri: "http://localhost:3000/auth/callback",
          forceReauth: true,
        },
      })
      assert.equal(bootstrap.response.status, 200)
      assert.equal(bootstrap.body.ok, true)
      assert.equal(bootstrap.body.action, "redirect")
      assert.ok(bootstrap.body.state)
      assert.ok(bootstrap.body.authorizeUrl.includes("https://www.instagram.com/oauth/authorize"))
      assert.equal(apiCalls.length, 1)
      assert.equal(apiCalls[0].requestType, "signup_init")

      const gownerBootstrap = await requestJson(baseUrl, "/api/auth/session/bootstrap", {
        method: "POST",
        headers: {
          cookie: googleExchange.cookie,
        },
        body: {
          redirectUri: "http://localhost:3000/auth/callback",
          forceReauth: true,
        },
      })
      assert.equal(gownerBootstrap.response.status, 200)

      const invalidGoogleExchange = await requestJson(baseUrl, "/api/auth/google/exchange", {
        method: "POST",
        body: {},
      })
      assert.equal(invalidGoogleExchange.response.status, 400)

      gownerRecord.defaultIOwnerId = "iowner-1"
      iownerRecords.splice(0, iownerRecords.length, {
        _id: "iowner-1",
        gownerId: "gowner-1",
        email: "workspace@example.com",
        instagramUserId: "acct-1",
        instagramUsername: "shop_one",
        profilePictureUrl: "",
        connectionStatus: "connected",
        tokenExpiresAt: new Date("2026-07-01T00:00:00.000Z"),
        longLivedAccessToken: "token-123",
      })

      const accounts = await requestJson(baseUrl, "/api/accounts", {
        headers: {
          cookie: googleExchange.cookie,
        },
      })
      assert.equal(accounts.response.status, 200)
      assert.equal(accounts.body.accounts.length, 1)

      const selectAccountResponse = await requestJson(baseUrl, "/api/accounts/select", {
        method: "POST",
        headers: {
          cookie: googleExchange.cookie,
        },
        body: {
          iownerId: "iowner-1",
        },
      })
      assert.equal(selectAccountResponse.response.status, 200)
      assert.equal(selectAccountResponse.body.owner.instagramUsername, "shop_one")

      const invalidCallback = await requestJson(baseUrl, "/api/auth/instagram/callback", {
        method: "POST",
        body: {
          state: bootstrap.body.state,
        },
      })
      assert.equal(invalidCallback.response.status, 400)
      assert.match(invalidCallback.body.message, /authorization code/i)

      const missingSecret = await requestJson(baseUrl, "/api/internal/n8n/comment-event", {
        method: "POST",
        body: {
          instagramAccountId: "acct-1",
        },
      })
      assert.equal(missingSecret.response.status, 403)

      const acceptedCommentEvent = await requestJson(baseUrl, "/api/internal/n8n/comment-event", {
        method: "POST",
        headers: {
          "x-n8n-secret": "super-secret",
        },
        body: {
          instagramAccountId: "acct-1",
          postId: "post-1",
          comment: "price",
          commenterId: "lead-1",
          commenterUsername: "lead_user",
          followConfirmBaseUrl: "https://n8n.example/webhook/follow-confirm",
        },
      })
      assert.equal(acceptedCommentEvent.response.status, 200)
      assert.equal(acceptedCommentEvent.body.ok, true)
      assert.equal(automationCalls.at(-1)?.type, "comment")

      const acceptedFollowConfirm = await requestJson(baseUrl, "/api/internal/n8n/follow-confirm", {
        method: "POST",
        headers: {
          "x-n8n-secret": "super-secret",
        },
        body: {
          instagramAccountId: "acct-1",
          postId: "post-1",
          igUserId: "lead-1",
          automationId: "automation-1",
        },
      })
      assert.equal(acceptedFollowConfirm.response.status, 200)
      assert.equal(acceptedFollowConfirm.body.ok, true)
      assert.equal(automationCalls.at(-1)?.type, "confirm")

      return [
        "route smoke: Google workspace session, account list, and account selection passed",
        "route smoke: health/session/bootstrap/invalid-callback passed",
        "route smoke: n8n internal endpoints reject missing secret and accept valid secret",
      ]
    } finally {
      await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
    }
  })
}

async function runAutomationServiceSmoke() {
  const sentReplies = []
  const createdLogs = []
  let ownerRecord = null
  let automationList = []
  let automationOne = null
  let existingStage = null
  let existingSentLog = null

  clearModule("../backend/services/automationService")

  const mocks = {
    "../models/Automation": {
      find(query) {
        return createSortableResult(
          automationList.filter(
            (automation) =>
              automation.ownerId === query.ownerId &&
              automation.instagramAccountId === query.instagramAccountId &&
              automation.mediaId === query.mediaId &&
              automation.active === query.active,
          ),
        )
      },
      findOne(query) {
        const match =
          automationOne &&
          (!query._id || automationOne._id === query._id) &&
          automationOne.ownerId === query.ownerId &&
          automationOne.instagramAccountId === query.instagramAccountId &&
          automationOne.mediaId === query.mediaId &&
          automationOne.active === query.active
            ? automationOne
            : null

        return createSortableResult(match)
      },
      async create(payload) {
        return {
          _id: "automation-created",
          ...payload,
        }
      },
    },
    "../models/DmLog": {
      findOne(query) {
        if (query.stage?.$in) {
          return createSortableResult(existingStage)
        }

        if (query.stage === "sent") {
          return createSortableResult(existingSentLog)
        }

        return createSortableResult(null)
      },
      async create(payload) {
        const record = {
          _id: `dm-log-${createdLogs.length + 1}`,
          ...payload,
        }
        createdLogs.push(record)
        return record
      },
      async aggregate() {
        return []
      },
    },
    "../models/IOwner": {
      async findOne(query) {
        return ownerRecord && String(ownerRecord.instagramUserId) === String(query.instagramUserId)
          ? ownerRecord
          : null
      },
    },
    "../models/Owner": {
      async findOne(query) {
        if (!ownerRecord) {
          return null
        }

        return String(ownerRecord.instagramUserId) === String(query.instagramUserId)
          ? ownerRecord
          : null
      },
    },
    "./instagramMessagingService": {
      async sendInstagramReply(payload) {
        sentReplies.push(payload)
        return {
          ok: true,
        }
      },
    },
  }

  return withMockedModules(mocks, async () => {
    const {
      triggerCommentAutomation,
      confirmCommentAutomation,
    } = require("../backend/services/automationService")

    ownerRecord = null
    let result = await triggerCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      commentText: "price please",
      commenterId: "lead-1",
      commenterUsername: "lead_user",
      commentId: "comment-1",
      followConfirmBaseUrl: "https://n8n.example/webhook/follow-confirm",
    })
    assert.equal(result.reason, "owner_not_connected")

    ownerRecord = {
      _id: "owner-1",
      email: "owner@example.com",
      instagramUserId: "acct-1",
      instagramUsername: "shop_one",
      longLivedAccessToken: "token-123",
    }
    automationList = []
    result = await triggerCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      commentText: "price please",
      commenterId: "lead-1",
      commenterUsername: "lead_user",
      commentId: "comment-1",
      followConfirmBaseUrl: "https://n8n.example/webhook/follow-confirm",
    })
    assert.equal(result.reason, "no_matching_automation")

    automationList = [
      {
        _id: "automation-1",
        ownerId: "owner-1",
        instagramAccountId: "acct-1",
        mediaId: "post-1",
        active: true,
        triggerKeywords: ["price"],
        mediaPermalink: "https://instagram.com/p/post-1",
        response: "Thanks! check your DM",
      },
    ]
    existingStage = null
    result = await triggerCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      commentText: "Need PRICE details",
      commenterId: "lead-1",
      commenterUsername: "lead_user",
      commentId: "comment-1",
      followConfirmBaseUrl: "https://n8n.example/webhook/follow-confirm",
    })
    assert.equal(result.action, "prompted")
    assert.equal(sentReplies.length, 1)
    assert.equal(createdLogs.at(-1)?.stage, "prompted")
    assert.match(result.confirmUrl, /igUserId=lead-1/)
    assert.match(result.confirmUrl, /postId=post-1/)
    assert.match(result.confirmUrl, /automationId=automation-1/)

    existingStage = { stage: "prompted" }
    result = await triggerCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      commentText: "price again",
      commenterId: "lead-1",
      commenterUsername: "lead_user",
      commentId: "comment-2",
      followConfirmBaseUrl: "https://n8n.example/webhook/follow-confirm",
    })
    assert.equal(result.reason, "already_prompted")

    existingStage = null
    await assert.rejects(
      triggerCommentAutomation({
        instagramAccountId: "acct-1",
        postId: "post-1",
        commentText: "price",
        commenterId: "lead-2",
        commenterUsername: "lead_user",
        commentId: "comment-3",
        followConfirmBaseUrl: "",
      }),
      /followConfirmBaseUrl is required/i,
    )

    ownerRecord = null
    result = await confirmCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      igUserId: "lead-1",
      automationId: "automation-1",
    })
    assert.equal(result.action, "error")

    ownerRecord = {
      _id: "owner-1",
      email: "owner@example.com",
      instagramUserId: "acct-1",
      instagramUsername: "shop_one",
      longLivedAccessToken: "token-123",
    }
    automationOne = null
    result = await confirmCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      igUserId: "lead-1",
      automationId: "automation-1",
    })
    assert.equal(result.action, "ignore")

    automationOne = {
      _id: "automation-1",
      ownerId: "owner-1",
      instagramAccountId: "acct-1",
      mediaId: "post-1",
      active: true,
      response: "Here are the details",
      mediaPermalink: "https://instagram.com/p/post-1",
    }
    existingSentLog = { stage: "sent" }
    result = await confirmCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      igUserId: "lead-1",
      automationId: "automation-1",
    })
    assert.equal(result.action, "already_sent")

    existingSentLog = null
    result = await confirmCommentAutomation({
      instagramAccountId: "acct-1",
      postId: "post-1",
      igUserId: "lead-1",
    })
    assert.equal(result.action, "sent")
    assert.equal(sentReplies.at(-1)?.recipientId, "lead-1")
    assert.equal(sentReplies.at(-1)?.text, "Here are the details")
    assert.equal(createdLogs.at(-1)?.stage, "sent")

    return [
      "automation service: owner lookup, keyword match, follow prompt, duplicate guard, and confirm-send paths passed",
    ]
  })
}

function runStaticChecks() {
  const envExample = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf8")
  const envProductionExample = fs.readFileSync(
    path.join(projectRoot, ".env.production.example"),
    "utf8",
  )
  const workflow = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "scripts/comment-listener-complete.workflow.json"), "utf8"),
  )

  assert.match(envExample, /^N8N_INTERNAL_SECRET=/m)
  assert.match(envProductionExample, /^N8N_INTERNAL_SECRET=/m)

  const nodeNames = new Set(workflow.nodes.map((node) => node.name))
  assert(nodeNames.has("Receive Instagram Event (POST)"))
  assert(nodeNames.has("Forward Event To Backend"))
  assert(nodeNames.has("Follow Confirm Click (GET)"))
  assert(nodeNames.has("Confirm With Backend"))

  const workflowText = JSON.stringify(workflow)
  const warnings = []

  if (workflowText.includes("replace-me-with-your-backend-secret")) {
    warnings.push(
      "workflow template still contains the placeholder n8n secret; replace it in the live n8n workflow before activation.",
    )
  }

  if (workflowText.includes("http://127.0.0.1:4000")) {
    warnings.push(
      "workflow template still points at the local backend URL; replace it in the live n8n workflow before activation.",
    )
  }

  return {
    results: [
      "static checks: env examples expose required n8n secret setting and workflow contains both webhook paths",
    ],
    warnings,
  }
}

async function main() {
  const staticChecks = runStaticChecks()
  const routeResults = await runRouteSmoke()
  const serviceResults = await runAutomationServiceSmoke()

  console.log("Deep SaaS smoke checks passed")
  for (const line of [...staticChecks.results, ...routeResults, ...serviceResults]) {
    console.log(`- ${line}`)
  }

  if (staticChecks.warnings.length > 0) {
    console.log("Warnings:")
    for (const warning of staticChecks.warnings) {
      console.log(`- ${warning}`)
    }
  }
}

main().catch((error) => {
  console.error("Deep SaaS smoke checks failed")
  console.error(error.stack || error.message || error)
  process.exit(1)
})
