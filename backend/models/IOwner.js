const mongoose = require("mongoose")

const iownerSchema = new mongoose.Schema(
  {
    gownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GOwner",
      required: true,
      index: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    instagramUsername: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    instagramDisplayName: {
      type: String,
      default: "",
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: "",
      trim: true,
    },
    accountType: {
      type: String,
      default: "UNKNOWN",
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
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
    connectionStatus: {
      type: String,
      enum: ["pending", "connected", "token_expired", "revoked", "error"],
      default: "connected",
      index: true,
    },
    connectedAt: {
      type: Date,
      default: null,
    },
    lastProfileSyncAt: {
      type: Date,
      default: null,
    },
    lastTokenRefreshAt: {
      type: Date,
      default: null,
    },
    legacyOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      default: null,
    },
  },
  {
    collection: "iowners",
    timestamps: true,
    versionKey: false,
  },
)

iownerSchema.index({ instagramUserId: 1 }, { unique: true })
iownerSchema.index({ gownerId: 1, connectionStatus: 1, updatedAt: -1 })

module.exports = mongoose.models.IOwner || mongoose.model("IOwner", iownerSchema)
