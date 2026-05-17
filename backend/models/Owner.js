const mongoose = require("mongoose")

const ownerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    instagramUserId: {
      type: String,
      default: "",
      index: true,
    },
    instagramUsername: {
      type: String,
      default: "",
    },
    authorizationCode: {
      type: String,
      default: "",
    },
    shortLivedAccessToken: {
      type: String,
      default: "",
    },
    longLivedAccessToken: {
      type: String,
      default: "",
    },
    tokenType: {
      type: String,
      default: "bearer",
    },
    tokenExpiresAt: {
      type: Date,
      default: null,
    },
    lastMetaState: {
      type: String,
      default: "",
    },
    lastRedirectUri: {
      type: String,
      default: "",
    },
    permissions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["connected", "pending"],
      default: "connected",
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "premium", "premium_plus"],
      default: "free",
      index: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired", "canceled", "past_due"],
      default: "active",
    },
    subscriptionSource: {
      type: String,
      default: "manual",
      trim: true,
    },
    subscriptionPurchasedAt: {
      type: Date,
      default: null,
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    razorpayCustomerId: {
      type: String,
      default: "",
      trim: true,
    },
    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },
    razorpaySubscriptionId: {
      type: String,
      default: "",
      trim: true,
    },
    instagramConnectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "owners",
    timestamps: true,
    versionKey: false,
  },
)

module.exports = mongoose.models.Owner || mongoose.model("Owner", ownerSchema)
