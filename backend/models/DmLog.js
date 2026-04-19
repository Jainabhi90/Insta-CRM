const mongoose = require("mongoose")

const dmLogSchema = new mongoose.Schema(
  {
    gownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GOwner",
      default: null,
      index: true,
    },
    iownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IOwner",
      default: null,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      index: true,
    },
    ownerEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    instagramAccountId: {
      type: String,
      default: "",
      index: true,
    },
    instagramUserId: {
      type: String,
      default: "",
      index: true,
    },
    instagramUsername: {
      type: String,
      default: "",
      trim: true,
    },
    automationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      default: null,
      index: true,
    },
    mediaId: {
      type: String,
      default: "",
      index: true,
    },
    mediaPermalink: {
      type: String,
      default: "",
      trim: true,
    },
    triggerCommentId: {
      type: String,
      default: "",
      index: true,
    },
    triggerCommentText: {
      type: String,
      default: "",
      trim: true,
    },
    eventField: {
      type: String,
      default: "comments",
      trim: true,
    },
    targetInstagramUserId: {
      type: String,
      default: "",
      index: true,
    },
    targetInstagramUsername: {
      type: String,
      default: "",
      trim: true,
    },
    stage: {
      type: String,
      enum: ["prompted", "sent", "ignored", "failed"],
      default: "prompted",
      index: true,
    },
    messageText: {
      type: String,
      default: "",
      trim: true,
    },
    confirmUrl: {
      type: String,
      default: "",
      trim: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    collection: "dm_logs",
    timestamps: true,
    versionKey: false,
  },
)

dmLogSchema.index(
  {
    automationId: 1,
    mediaId: 1,
    targetInstagramUserId: 1,
    stage: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      automationId: { $exists: true, $ne: null },
      mediaId: { $type: "string", $ne: "" },
      targetInstagramUserId: { $type: "string", $ne: "" },
      stage: { $in: ["prompted", "sent"] },
    },
  },
)

module.exports = mongoose.models.DmLog || mongoose.model("DmLog", dmLogSchema)
