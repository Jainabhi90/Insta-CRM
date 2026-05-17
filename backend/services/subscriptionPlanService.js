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

  return {
    tier: definition.tier,
    planName: definition.name,
    automationLimit: definition.automationLimit,
    dmLimitPerAutomation: definition.dmLimitPerAutomation,
    subscriptionStatus: String(owner?.subscriptionStatus || "active").trim().toLowerCase() || "active",
    subscribedAt: owner?.subscriptionPurchasedAt || null,
    expiresAt: owner?.subscriptionExpiresAt || null,
    source: String(owner?.subscriptionSource || "manual").trim().toLowerCase() || "manual",
  }
}

module.exports = {
  PLAN_DEFINITIONS,
  buildOwnerPlanSnapshot,
  getOwnerPlanDefinition,
  getPlanDefinition,
  isSupportedPlanTier,
  normalizePlanTier,
}
