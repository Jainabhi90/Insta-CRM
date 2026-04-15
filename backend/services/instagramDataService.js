const { config } = require("../config")
const { InstagramAuthError } = require("./instagramAuthService")

function getGraphBaseUrl(path) {
  return `https://graph.instagram.com/${config.meta.graphApiVersion}/${String(path || "").replace(/^\/+/, "")}`
}

async function parseInstagramResponse(response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return text ? { message: text } : {}
  }
}

async function instagramRequest(path, accessToken, options = {}) {
  if (!accessToken) {
    throw new InstagramAuthError("A connected Instagram access token is required.", {
      status: 401,
    })
  }

  const method = options.method || "GET"
  const url = new URL(getGraphBaseUrl(path))
  const query = options.query || {}

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...(options.headers || {}),
  }

  const requestOptions = {
    method,
    headers,
  }

  if (options.body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json"
    requestOptions.body =
      typeof options.body === "string" ? options.body : JSON.stringify(options.body)
  }

  const response = await fetch(url, requestOptions)
  const data = await parseInstagramResponse(response)

  if (!response.ok) {
    throw new InstagramAuthError(
      data?.error?.message || data?.message || "Instagram API request failed.",
      {
        status: response.status,
        data,
      },
    )
  }

  return data
}

function normalizePreviewText(message) {
  const directText = String(message?.message || "").trim()

  if (directText) {
    return directText
  }

  if (message?.attachments?.data?.length) {
    return "[Attachment]"
  }

  if (message?.story) {
    return "[Story reply]"
  }

  return "[Shared content]"
}

function selectRecipientId(conversation, selfUserId) {
  const participants = Array.isArray(conversation?.participants) ? conversation.participants : []
  const otherParticipant = participants.find((participant) => String(participant?.id || "") !== String(selfUserId || ""))
  return String(otherParticipant?.id || "")
}

function normalizeConversationParticipants(conversation) {
  return Array.isArray(conversation?.participants?.data)
    ? conversation.participants.data.map((participant) => ({
        id: String(participant?.id || ""),
        username: String(participant?.username || ""),
      }))
    : []
}

function buildBaseConversation(conversation, selfUserId) {
  const participants = normalizeConversationParticipants(conversation)
  const updatedTime = conversation?.updated_time || null

  return {
    id: String(conversation?.id || ""),
    updatedTime,
    participants,
    participantCount: participants.length,
    recipientId: selectRecipientId({ participants }, selfUserId),
    latestMessagePreview: "",
    latestMessageAt: updatedTime,
    latestSenderUsername: "",
    messages: [],
  }
}

async function getInstagramProfile(accessToken) {
  const data = await instagramRequest("me", accessToken, {
    query: {
      fields: "id,user_id,username,account_type,followers_count,media_count",
    },
  })

  return {
    instagramAccountId: String(data?.id || ""),
    instagramUserId: String(data?.user_id || ""),
    instagramUsername: String(data?.username || ""),
    accountType: String(data?.account_type || ""),
    followersCount: Number(data?.followers_count || 0),
    mediaCount: Number(data?.media_count || 0),
  }
}

async function listInstagramMedia(accessToken, options = {}) {
  const limit = options.limit || 6
  const data = await instagramRequest("me/media", accessToken, {
    query: {
      fields:
        "id,caption,media_type,media_url,thumbnail_url,timestamp,comments_count,like_count,permalink",
      limit,
    },
  })

  return Array.isArray(data?.data) ? data.data : []
}

async function listInstagramComments(accessToken, options = {}) {
  const mediaLimit = options.mediaLimit || 6
  const commentsPerMedia = options.commentsPerMedia || 10
  const mediaItems = await listInstagramMedia(accessToken, { limit: mediaLimit })

  const commentGroups = await Promise.all(
    mediaItems.map(async (mediaItem) => {
      const commentPayload = await instagramRequest(`${mediaItem.id}/comments`, accessToken, {
        query: {
          fields:
            "id,text,timestamp,from{id,username},like_count,replies{id,text,timestamp,from{id,username},like_count}",
          limit: commentsPerMedia,
        },
      })

      const comments = Array.isArray(commentPayload?.data) ? commentPayload.data : []

      return comments.map((comment) => ({
        id: String(comment?.id || ""),
        text: String(comment?.text || ""),
        timestamp: comment?.timestamp || null,
        likeCount: Number(comment?.like_count || 0),
        commenterId: String(comment?.from?.id || ""),
        commenterUsername: String(comment?.from?.username || ""),
        mediaId: String(mediaItem?.id || ""),
        mediaCaption: String(mediaItem?.caption || ""),
        mediaType: String(mediaItem?.media_type || ""),
        mediaPermalink: String(mediaItem?.permalink || ""),
        mediaThumbnail: String(mediaItem?.thumbnail_url || mediaItem?.media_url || ""),
        replyCount: Array.isArray(comment?.replies?.data) ? comment.replies.data.length : 0,
      }))
    }),
  )

  const comments = commentGroups
    .flat()
    .filter((comment) => comment.id)
    .sort((leftComment, rightComment) => {
      const leftTime = new Date(leftComment.timestamp || 0).getTime()
      const rightTime = new Date(rightComment.timestamp || 0).getTime()
      return rightTime - leftTime
    })

  return {
    comments,
    summary: {
      totalComments: comments.length,
      mediaReviewed: mediaItems.length,
      latestActivityAt: comments[0]?.timestamp || null,
    },
  }
}

async function listInstagramInbox(accessToken, options = {}) {
  const conversationLimit = options.conversationLimit || 8
  const messagesPerConversation = options.messagesPerConversation || 5
  const messageFetchLimit = Number.isFinite(Number(options.messageFetchLimit))
    ? Math.max(0, Number(options.messageFetchLimit))
    : 2
  const profile = await getInstagramProfile(accessToken)
  const conversationPayload = await instagramRequest("me/conversations", accessToken, {
    query: {
      fields: "id,updated_time,participants",
      limit: conversationLimit,
    },
  })

  const rawConversations = await Promise.all(
    (Array.isArray(conversationPayload?.data) ? conversationPayload.data : []).map(
      async (conversation, index) => {
        const baseConversation = buildBaseConversation(conversation, profile.instagramUserId)

        if (messagesPerConversation <= 0 || index >= messageFetchLimit) {
          return baseConversation
        }

        try {
          const messagesPayload = await instagramRequest(`${conversation.id}/messages`, accessToken, {
            query: {
              fields: "id,from,to,created_time,message,attachments,story",
              limit: messagesPerConversation,
            },
          })

          const messages = (Array.isArray(messagesPayload?.data) ? messagesPayload.data : []).map(
            (message) => ({
              id: String(message?.id || ""),
              text: normalizePreviewText(message),
              rawText: String(message?.message || ""),
              createdTime: message?.created_time || null,
              senderId: String(message?.from?.id || ""),
              senderUsername: String(message?.from?.username || ""),
            }),
          )

          const latestMessage = messages[0] || null

          return {
            ...baseConversation,
            updatedTime: baseConversation.updatedTime || latestMessage?.createdTime || null,
            latestMessagePreview: latestMessage?.text || baseConversation.latestMessagePreview,
            latestMessageAt: latestMessage?.createdTime || baseConversation.latestMessageAt || null,
            latestSenderUsername: latestMessage?.senderUsername || "",
            messages,
          }
        } catch (error) {
          return {
            ...baseConversation,
            latestMessagePreview:
              error?.status === 403
                ? "Message preview temporarily unavailable."
                : baseConversation.latestMessagePreview,
            messageLoadError: error?.message || "",
          }
        }
      },
    ),
  )

  const conversations = rawConversations
    .filter((conversation) => Boolean(conversation?.id))
    .sort((leftConversation, rightConversation) => {
      const leftTime = new Date(leftConversation?.latestMessageAt || leftConversation?.updatedTime || 0).getTime()
      const rightTime = new Date(rightConversation?.latestMessageAt || rightConversation?.updatedTime || 0).getTime()
      return rightTime - leftTime
    })

  return {
    conversations,
    summary: {
      totalConversations: conversations.length,
      latestActivityAt: conversations[0]?.latestMessageAt || conversations[0]?.updatedTime || null,
      accountUsername: profile.instagramUsername,
    },
  }
}

module.exports = {
  getInstagramProfile,
  instagramRequest,
  listInstagramComments,
  listInstagramInbox,
  listInstagramMedia,
}
