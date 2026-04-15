const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const { config } = require("./config")
const { backendRouter } = require("./router")
const { processInstagramWebhookPayload } = require("./services/instagramWebhookService")

const app = express()
app.set("trust proxy", 1)

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
    await processInstagramWebhookPayload(req.body)
  } catch (error) {
    console.error("Webhook processing failed:", error.message)
  }

  return res.sendStatus(200)
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({
    ok: false,
    message: error.message || "Unexpected server error.",
    details: error.data || null,
  })
})

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `No API route matched ${req.method} ${req.originalUrl}`,
  })
})

module.exports = app
