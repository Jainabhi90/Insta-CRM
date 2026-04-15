import { formatRelativeTime, getArrayPayload, pickValue, toNumber } from "./backendPayloadUtils"

function normalizeMessage(message, index) {
  return {
    id: pickValue(message, ["id", "messageId", "message_id"], `message-${index}`),
    text: pickValue(message, ["text", "message", "preview"], ""),
    senderUsername: pickValue(message, ["senderUsername", "sender_username", "from"], "instagram_user"),
    senderId: pickValue(message, ["senderId", "sender_id"], ""),
    createdTime: pickValue(message, ["createdTime", "created_time", "timestamp"], ""),
    relativeTime: formatRelativeTime(
      pickValue(message, ["createdTime", "created_time", "timestamp"], ""),
      "Recently",
    ),
  }
}

function getConversationHandle(conversation) {
  const participants = getArrayPayload(conversation?.participants, ["participants"])
  const participant =
    (participants.length > 1 ? participants.find((item, index) => index > 0 && item?.username) : null) ||
    participants.find((item) => item?.username) ||
    {}
  const username = pickValue(participant, ["username"], "instagram_user")
  return username.startsWith("@") ? username : `@${username}`
}

function normalizeConversation(conversation, index) {
  const messages = getArrayPayload(conversation?.messages, ["messages"]).map(normalizeMessage)
  const participants = getArrayPayload(conversation?.participants, ["participants"]).map((participant) => ({
    id: pickValue(participant, ["id"], ""),
    username: pickValue(participant, ["username"], "instagram_user"),
  }))

  return {
    id: pickValue(conversation, ["id", "conversationId", "conversation_id"], `conversation-${index}`),
    handle: getConversationHandle(conversation),
    recipientId: pickValue(conversation, ["recipientId", "recipient_id"], ""),
    participantCount: toNumber(pickValue(conversation, ["participantCount", "participant_count"], participants.length), participants.length),
    latestMessagePreview: pickValue(
      conversation,
      ["latestMessagePreview", "latest_message_preview", "preview"],
      messages[0]?.text || "",
    ),
    latestMessageAt: pickValue(
      conversation,
      ["latestMessageAt", "latest_message_at", "updatedTime", "updated_time"],
      messages[0]?.createdTime || "",
    ),
    latestMessageLabel: formatRelativeTime(
      pickValue(
        conversation,
        ["latestMessageAt", "latest_message_at", "updatedTime", "updated_time"],
        messages[0]?.createdTime || "",
      ),
      "Recently",
    ),
    latestSenderUsername: pickValue(
      conversation,
      ["latestSenderUsername", "latest_sender_username"],
      messages[0]?.senderUsername || "",
    ),
    canReply: Boolean(pickValue(conversation, ["recipientId", "recipient_id"], "")),
    participants,
    messages,
  }
}

export function buildInboxWorkspace(inboxPayload) {
  const conversations = getArrayPayload(inboxPayload, ["conversations"]).map(normalizeConversation)
  const summaryPayload = inboxPayload?.summary || {}

  return {
    conversations,
    summary: {
      totalConversations: toNumber(summaryPayload.totalConversations, conversations.length),
      latestActivityLabel: formatRelativeTime(summaryPayload.latestActivityAt, "No recent DMs yet"),
      accountUsername: pickValue(summaryPayload, ["accountUsername", "account_username"], ""),
    },
  }
}
