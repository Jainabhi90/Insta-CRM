const path = require("path")
const dotenv = require("dotenv")

dotenv.config({ path: path.join(process.cwd(), ".env") })
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true })

function readOrigins(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function resolveWebhookVerifyToken() {
  const token = process.env.META_WEBHOOK_VERIFY_TOKEN || process.env.CHECK_KEY || ""
  if (!token) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "META_WEBHOOK_VERIFY_TOKEN is required in production. " +
          "Set it in your environment variables before deploying.",
      )
    }
    return "dev-webhook-verify-token-change-me"
  }

  return token
}

const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  frontendOrigins: readOrigins(
    process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://localhost:3001,http://localhost:3002",
  ),
  tempRecordTtlHours: Number(process.env.TEMP_RECORD_TTL_HOURS || 24),
  sessionSecret: process.env.SESSION_SECRET || "",
  cookieSameSite:
    process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === "production" ? "none" : "lax"),
  cookieSecure:
    process.env.COOKIE_SECURE === "true" ||
    (process.env.COOKIE_SECURE !== "false" && process.env.NODE_ENV === "production"),
  meta: {
    appId: process.env.META_APP_ID || "",
    appSecret: process.env.META_APP_SECRET || process.env.APP_SECRET || "",
    webhookVerifyToken: resolveWebhookVerifyToken(),
    graphApiVersion: process.env.META_GRAPH_API_VERSION || "v23.0",
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || "",
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "",
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || "",
    scope:
      process.env.INSTAGRAM_SCOPE ||
      "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  },
  n8n: {
    internalSecret: process.env.N8N_INTERNAL_SECRET || "",
  },
}

function validateConfig(cfg) {
  if (process.env.NODE_ENV !== "production") {
    return cfg
  }

  const required = [
    { key: "mongoUri", envVar: "MONGODB_URI" },
    { key: "sessionSecret", envVar: "SESSION_SECRET" },
  ]

  const missing = required.filter(({ key }) => {
    const value = cfg[key]
    return !value || String(value).trim().length === 0
  })

  if (missing.length > 0) {
    const names = missing.map(({ envVar }) => envVar).join(", ")
    throw new Error(
      `Missing required environment variable(s): ${names}. ` +
        "Set them before deploying to production.",
    )
  }

  if (cfg.sessionSecret && cfg.sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long for adequate security.")
  }

  return cfg
}

module.exports = {
  config: validateConfig(config),
}
