const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const { config } = require("./config")
const { backendRouter } = require("./router")
const { processInstagramWebhookPayload } = require("./services/instagramWebhookService")

const app = express()
app.set("trust proxy", 1)

function resolveRequestBaseUrl(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim()
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim()
  const host = forwardedHost || String(req.headers.host || "").trim()
  const protocol = forwardedProto || req.protocol || "https"

  if (host) {
    return `${protocol}://${host}`
  }

  return config.frontendOrigins[0] || ""
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.length === 0 || config.frontendOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`Origin ${origin} is not allowed.`))
    },
    credentials: true,
  }),
)

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  }),
)

app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    ok: true,
    service: "insta-crm-api",
  })
})

app.use("/api", backendRouter)
app.use(backendRouter)

app.get(["/metadata", "/api/metadata"], (req, res) => {
  if (req.query["hub.verify_token"] === config.meta.webhookVerifyToken) {
    res.status(200).send(req.query["hub.challenge"])
    return
  }

  res.sendStatus(403)
})

app.post(["/metadata", "/api/metadata"], async (req, res) => {
  const metaSignature = req.headers["x-hub-signature-256"]

  if (!metaSignature) {
    return res.sendStatus(403)
  }

  const generatedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", config.meta.appSecret)
      .update(req.rawBody)
      .digest("hex")

  if (metaSignature !== generatedSignature) {
    return res.sendStatus(403)
  }

  try {
    // Return 503 on processing errors so Meta retries webhook delivery.
    const baseUrl = resolveRequestBaseUrl(req)
    const result = await processInstagramWebhookPayload(req.body, {
      followConfirmBaseUrl: baseUrl ? `${baseUrl}/api/automation/follow-confirm` : "",
    })
    return res.status(200).json({ ok: true, processed: result.readyCount ?? 0 })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return res.status(503).json({
      ok: false,
      message: "Webhook processing failed. Meta will retry.",
    })
  }
})

app.use((error, req, res, next) => {
  console.error(error)
  const isDev = process.env.NODE_ENV !== "production"
  const upstreamMessage =
    error?.data?.error?.message ||
    error?.data?.message ||
    error?.message ||
    "Unexpected server error."
  const canExposeMessage =
    isDev ||
    Number(error?.status || 0) < 500 ||
    error?.name === "InstagramAuthError"

  res.status(error.status || 500).json({
    ok: false,
    message: canExposeMessage ? upstreamMessage : "An unexpected error occurred.",
    ...(isDev && { details: error.data || null }),
  })
})

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `No API route matched ${req.method} ${req.originalUrl}`,
  })
})

module.exports = app
