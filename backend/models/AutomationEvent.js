const mongoose = require("mongoose")

const automationEventSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "meta_webhook",
      trim: true,
      index: true,
    },
    eventField: {
      type: String,
      default: "comments",
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      default: null,
      index: true,
    },
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
      trim: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      default: "",
      trim: true,
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
      trim: true,
      index: true,
    },
    commentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    commentText: {
      type: String,
      default: "",
      trim: true,
    },
    commenterId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    commenterUsername: {
      type: String,
      default: "",
      trim: true,
    },
    listened: {
      type: Boolean,
      default: false,
      index: true,
    },
    matched: {
      type: Boolean,
      default: false,
      index: true,
    },
    action: {
      type: String,
      default: "ignore",
      trim: true,
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    dmLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DmLog",
      default: null,
      index: true,
    },
    confirmUrl: {
      type: String,
      default: "",
      trim: true,
    },
    errorMessage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    collection: "automation_events",
    timestamps: true,
    versionKey: false,
  },
)

automationEventSchema.index({
  ownerId: 1,
  mediaId: 1,
  commentId: 1,
  commenterId: 1,
  createdAt: -1,
})

module.exports =
  mongoose.models.AutomationEvent || mongoose.model("AutomationEvent", automationEventSchema)
