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

const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  frontendOrigins: readOrigins(
    process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:3000",
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
    webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || process.env.CHECK_KEY || "123",
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
}

module.exports = {
  config,
}
