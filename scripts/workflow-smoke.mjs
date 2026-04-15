import assert from "node:assert/strict"
import mongoose from "mongoose"

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:4000").replace(/\/+$/, "")
const redirectUri = process.env.REDIRECT_URI || `${baseUrl}/auth/callback`
const mongoUri = process.env.MONGODB_URI || ""

function buildUrl(path) {
  return `${baseUrl}${path}`
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
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

  return { response, body }
}

async function verifySignupInitRecord({ state }) {
  if (!mongoUri) {
    return {
      skipped: true,
      message: "MONGODB_URI not set, skipping DB verification.",
    }
  }

  await mongoose.connect(mongoUri)

  try {
    const record = await mongoose.connection.db.collection("api_calls").findOne(
      {
        requestType: "signup_init",
        state,
      },
      {
        sort: { createdAt: -1 },
      },
    )

    assert(record, "signup_init record was not persisted in api_calls")
    assert.equal(record.status, "received")

    return {
      skipped: false,
      message: `Found api_calls signup_init record ${record._id.toString()}.`,
    }
  } finally {
    await mongoose.disconnect()
  }
}

async function main() {
  const checks = []

  const health = await request("/api/health")
  assert.equal(health.response.status, 200, "health endpoint should return 200")
  assert.equal(health.body.ok, true, "health endpoint should report ok=true")
  checks.push("health endpoint is up")

  const session = await request("/api/auth/session")
  assert.equal(session.response.status, 200, "session endpoint should return 200")
  assert.equal(
    session.body.authStatus,
    "unauthenticated",
    "fresh smoke session should be unauthenticated",
  )
  checks.push("session endpoint returns unauthenticated without cookie")

  const bootstrap = await request("/api/auth/session/bootstrap", {
    method: "POST",
    body: {
      redirectUri,
      forceReauth: true,
    },
  })

  assert.equal(bootstrap.response.status, 200, "bootstrap should return 200")
  assert.equal(bootstrap.body.ok, true, "bootstrap should report ok=true")
  assert.equal(bootstrap.body.action, "redirect", "bootstrap should return redirect action")
  assert.ok(bootstrap.body.state, "bootstrap should return OAuth state")
  assert.ok(bootstrap.body.authorizeUrl, "bootstrap should return authorize URL")

  const authorizeUrl = new URL(bootstrap.body.authorizeUrl)
  assert.equal(authorizeUrl.origin, "https://www.instagram.com")
  assert.equal(authorizeUrl.pathname, "/oauth/authorize")
  assert.equal(authorizeUrl.searchParams.get("redirect_uri"), redirectUri)
  assert.equal(authorizeUrl.searchParams.get("state"), bootstrap.body.state)
  assert.equal(authorizeUrl.searchParams.get("response_type"), "code")
  checks.push("instagram bootstrap returns valid authorize URL")

  const dbVerification = await verifySignupInitRecord({
    state: bootstrap.body.state,
  })
  checks.push(dbVerification.message)

  const invalidCallback = await request("/api/auth/instagram/callback", {
    method: "POST",
    body: {
      state: bootstrap.body.state,
      redirectUri,
    },
  })
  assert.equal(invalidCallback.response.status, 400, "callback without code should return 400")
  checks.push("callback validation rejects missing code")

  const ownerProfile = await request("/api/owner/profile")
  assert.equal(ownerProfile.response.status, 401, "owner profile should require a session")
  checks.push("protected owner profile is guarded by session")

  console.log(`Workflow smoke test passed for ${baseUrl}`)
  for (const check of checks) {
    console.log(`- ${check}`)
  }
}

main().catch((error) => {
  console.error(`Workflow smoke test failed for ${baseUrl}`)
  console.error(error.stack || error.message || error)
  process.exit(1)
})
