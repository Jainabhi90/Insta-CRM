const PLAN_DEFINITIONS = Object.freeze({
  free: Object.freeze({
    tier: "free",
    name: "Free",
    automationLimit: 1,
    dmLimitPerAutomation: 10,
  }),
  premium: Object.freeze({
    tier: "premium",
    name: "Premium",
    automationLimit: 2,
    dmLimitPerAutomation: 20,
  }),
  premium_plus: Object.freeze({
    tier: "premium_plus",
    name: "Premium Plus",
    automationLimit: 4,
    dmLimitPerAutomation: 30,
  }),
})
const DEFAULT_SUBSCRIPTION_WINDOW_DAYS = 30
const YEARLY_SUBSCRIPTION_WINDOW_DAYS = 365

function normalizeBillingCycle(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()

  if (normalized === "year" || normalized === "annual" || normalized === "annually") {
    return "yearly"
  }

  return normalized === "yearly" ? "yearly" : "monthly"
}

function normalizePlanTier(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")

  if (normalized === "premiumplus") {
    return "premium_plus"
  }

  if (PLAN_DEFINITIONS[normalized]) {
    return normalized
  }

  return "free"
}

function getPlanDefinition(tier) {
  return PLAN_DEFINITIONS[normalizePlanTier(tier)] || PLAN_DEFINITIONS.free
}

function isSupportedPlanTier(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")

  return Boolean(
    PLAN_DEFINITIONS[normalized] ||
      normalized === "premiumplus",
  )
}

function getOwnerPlanDefinition(owner) {
  return getPlanDefinition(
    owner?.subscriptionTier ||
      owner?.subscription_tier ||
      owner?.planTier ||
      owner?.plan_tier ||
      owner?.tier ||
      owner?.plan,
  )
}

function buildOwnerPlanSnapshot(owner) {
  const definition = getOwnerPlanDefinition(owner)
  const billingCycle = normalizeBillingCycle(
    owner?.subscriptionBillingCycle ||
      owner?.subscription_billing_cycle ||
      owner?.billingCycle ||
      owner?.billing_cycle,
  )

  return {
    tier: definition.tier,
    planName: definition.name,
    automationLimit: definition.automationLimit,
    dmLimitPerAutomation: definition.dmLimitPerAutomation,
    billingCycle,
    subscriptionStatus: String(owner?.subscriptionStatus || "active").trim().toLowerCase() || "active",
    subscribedAt: owner?.subscriptionPurchasedAt || null,
    expiresAt: owner?.subscriptionExpiresAt || null,
    source: String(owner?.subscriptionSource || "manual").trim().toLowerCase() || "manual",
  }
}

function getDefaultSubscriptionExpiry(tier, purchasedAt = new Date(), billingCycle = "monthly") {
  const definition = getPlanDefinition(tier)

  if (definition.tier === "free") {
    return null
  }

  const baseDate = purchasedAt instanceof Date ? purchasedAt : new Date(purchasedAt)
  const expiresAt = new Date(baseDate.getTime())
  const normalizedBillingCycle = normalizeBillingCycle(billingCycle)
  const durationDays =
    normalizedBillingCycle === "yearly"
      ? YEARLY_SUBSCRIPTION_WINDOW_DAYS
      : DEFAULT_SUBSCRIPTION_WINDOW_DAYS
  expiresAt.setDate(expiresAt.getDate() + durationDays)
  return expiresAt
}

async function applyOwnerSubscription(owner, {
  tier,
  billingCycle = "monthly",
  source = "manual",
  purchasedAt = new Date(),
  expiresAt,
  razorpayCustomerId = "",
  razorpayOrderId = "",
  razorpayPaymentId = "",
  razorpaySubscriptionId = "",
} = {}) {
  const normalizedTier = normalizePlanTier(tier)
  const normalizedBillingCycle = normalizeBillingCycle(billingCycle)

  owner.subscriptionTier = normalizedTier
  owner.subscriptionBillingCycle = normalizedBillingCycle
  owner.subscriptionStatus = "active"
  owner.subscriptionSource = String(source || "manual").trim().toLowerCase() || "manual"
  owner.subscriptionPurchasedAt = purchasedAt instanceof Date ? purchasedAt : new Date(purchasedAt)
  owner.subscriptionExpiresAt =
    expiresAt === undefined
      ? getDefaultSubscriptionExpiry(normalizedTier, owner.subscriptionPurchasedAt, normalizedBillingCycle)
      : expiresAt

  if (razorpayCustomerId) {
    owner.razorpayCustomerId = String(razorpayCustomerId).trim()
  }

  if (razorpayOrderId) {
    owner.razorpayOrderId = String(razorpayOrderId).trim()
  }

  if (razorpayPaymentId) {
    owner.razorpayPaymentId = String(razorpayPaymentId).trim()
  }

  if (razorpaySubscriptionId) {
    owner.razorpaySubscriptionId = String(razorpaySubscriptionId).trim()
  }

  await owner.save()
  return buildOwnerPlanSnapshot(owner)
}

module.exports = {
  PLAN_DEFINITIONS,
  applyOwnerSubscription,
  buildOwnerPlanSnapshot,
  getDefaultSubscriptionExpiry,
  getOwnerPlanDefinition,
  getPlanDefinition,
  isSupportedPlanTier,
  normalizeBillingCycle,
  normalizePlanTier,
}
