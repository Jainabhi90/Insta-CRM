const crypto = require("crypto")
const { config } = require("../config")
const { getPlanDefinition, normalizePlanTier } = require("./subscriptionPlanService")

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1"
const PLAN_PRICING = Object.freeze({
  premium: Object.freeze({
    monthly: Object.freeze({
      tier: "premium",
      billingCycle: "monthly",
      amount: 19900,
      currency: "INR",
    }),
    yearly: Object.freeze({
      tier: "premium",
      billingCycle: "yearly",
      amount: 199900,
      currency: "INR",
    }),
  }),
  premium_plus: Object.freeze({
    monthly: Object.freeze({
      tier: "premium_plus",
      billingCycle: "monthly",
      amount: 49900,
      currency: "INR",
    }),
    yearly: Object.freeze({
      tier: "premium_plus",
      billingCycle: "yearly",
      amount: 499900,
      currency: "INR",
    }),
  }),
})

function ensureRazorpayCredentials() {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    const error = new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.")
    error.status = 503
    throw error
  }
}

function getRazorpayAuthHeader() {
  ensureRazorpayCredentials()
  const token = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString("base64")
  return `Basic ${token}`
}

function getPaidPlanCheckoutConfig(tier, billingCycle = "monthly") {
  const normalizedTier = normalizePlanTier(tier)
  const normalizedBillingCycle = String(billingCycle || "").trim().toLowerCase() === "yearly"
    ? "yearly"
    : "monthly"

  if (normalizedTier === "free") {
    const error = new Error("Free plan does not require Razorpay checkout.")
    error.status = 400
    throw error
  }

  const pricing = PLAN_PRICING[normalizedTier]?.[normalizedBillingCycle]

  if (!pricing) {
    const error = new Error("Unsupported paid plan.")
    error.status = 400
    throw error
  }

  const definition = getPlanDefinition(normalizedTier)

  return {
    ...pricing,
    planName: definition.name,
    automationLimit: definition.automationLimit,
    dmLimitPerAutomation: definition.dmLimitPerAutomation,
  }
}

async function createRazorpayOrder({ amount, currency = "INR", receipt, notes = {} }) {
  ensureRazorpayCredentials()

  const maskedKeyId = config.razorpay.keyId
    ? `${config.razorpay.keyId.slice(0, 6)}...${config.razorpay.keyId.slice(-4)}`
    : "null"
  const secretLen = config.razorpay.keySecret ? config.razorpay.keySecret.length : 0
  const maskedSecret = config.razorpay.keySecret
    ? `${config.razorpay.keySecret.slice(0, 2)}...${config.razorpay.keySecret.slice(-2)} (len: ${secretLen})`
    : "null"

  console.log(`[Razorpay Order Create] Initiating request. KeyID: ${maskedKeyId}, Secret: ${maskedSecret}`)

  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      payment_capture: 1,
      notes,
    }),
  })

  const responseText = await response.text().catch(() => "")
  let data = null
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    data = null
  }

  if (!response.ok) {
    console.error(
      `[Razorpay Order Create Failed] Status: ${response.status}. Raw Response:`,
      responseText
    )
    const error = new Error(
      data?.error?.description ||
        data?.error?.message ||
        data?.message ||
        `Unable to create Razorpay order. Status: ${response.status}`,
    )
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

function verifyRazorpayPaymentSignature({ orderId, paymentId, signature }) {
  ensureRazorpayCredentials()

  const payload = `${String(orderId || "").trim()}|${String(paymentId || "").trim()}`
  const expectedSignature = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(payload)
    .digest("hex")

  return expectedSignature === String(signature || "").trim()
}

function verifyRazorpayWebhookSignature(rawBody, signature) {
  if (!config.razorpay.webhookSecret) {
    const error = new Error("Razorpay webhook secret is not configured. Set RAZORPAY_WEBHOOK_SECRET.")
    error.status = 503
    throw error
  }

  const expectedSignature = crypto
    .createHmac("sha256", config.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex")

  return expectedSignature === String(signature || "").trim()
}

module.exports = {
  createRazorpayOrder,
  getPaidPlanCheckoutConfig,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
}
