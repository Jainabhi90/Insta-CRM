const mongoose = require("mongoose")

const accountSummarySchema = new mongoose.Schema(
  {
    iownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IOwner",
      default: null,
    },
    instagramUserId: {
      type: String,
      default: "",
      trim: true,
    },
    instagramUsername: {
      type: String,
      default: "",
      trim: true,
    },
    instagramHandle: {
      type: String,
      default: "",
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: "",
      trim: true,
    },
    connectionStatus: {
      type: String,
      default: "pending",
      trim: true,
    },
    tokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
)

const gownerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    googleSub: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending_instagram", "active", "suspended", "deleted"],
      default: "pending_instagram",
      index: true,
    },
    defaultIOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IOwner",
      default: null,
    },
    accountsSummary: {
      type: [accountSummarySchema],
      default: [],
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "gowners",
    timestamps: true,
    versionKey: false,
  },
)

gownerSchema.index(
  { googleSub: 1 },
  {
    unique: true,
    partialFilterExpression: {
      googleSub: { $type: "string", $ne: "" },
    },
  },
)

module.exports = mongoose.models.GOwner || mongoose.model("GOwner", gownerSchema)
