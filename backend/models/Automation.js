const mongoose = require("mongoose")

const automationSchema = new mongoose.Schema(
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
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    trigger: {
      type: String,
      required: true,
      trim: true,
    },
    triggerKeywords: {
      type: [String],
      default: [],
      index: true,
    },
    response: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Sales",
      trim: true,
    },
    iconName: {
      type: String,
      default: "MessageSquare",
      trim: true,
    },
    mediaId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    mediaCaption: {
      type: String,
      default: "",
      trim: true,
    },
    mediaPermalink: {
      type: String,
      default: "",
      trim: true,
    },
    mediaThumbnail: {
      type: String,
      default: "",
      trim: true,
    },
    mediaType: {
      type: String,
      default: "",
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    dmLimit: {
      type: Number,
      default: 3,
    },
    workflowKey: {
      type: String,
      default: "comment_listener",
      trim: true,
    },
  },
  {
    collection: "automations",
    timestamps: true,
    versionKey: false,
  },
)

automationSchema.index({
  gownerId: 1,
  iownerId: 1,
  ownerId: 1,
  mediaId: 1,
  active: 1,
  updatedAt: -1,
})

module.exports = mongoose.models.Automation || mongoose.model("Automation", automationSchema)
