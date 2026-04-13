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
