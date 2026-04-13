const mongoose = require("mongoose")
const { config } = require("../config")

const apiCallSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["instagram_callback", "comment_webhook", "private_reply"],
      default: "instagram_callback",
    },
    status: {
      type: String,
      enum: ["received", "completed", "failed"],
      default: "received",
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      default: "",
    },
    authorizationCode: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    redirectUri: {
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
    instagramUserId: {
      type: String,
      default: "",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      default: null,
    },
    requestPayload: {
      type: Object,
      default: {},
    },
    responsePayload: {
      type: Object,
      default: {},
    },
    errorMessage: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + config.tempRecordTtlHours * 60 * 60 * 1000),
      expires: 0,
    },
  },
  {
    collection: "api_calls",
    timestamps: true,
    versionKey: false,
  },
)

module.exports = mongoose.models.ApiCall || mongoose.model("ApiCall", apiCallSchema)
