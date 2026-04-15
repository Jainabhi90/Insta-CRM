import { formatRelativeTime, getArrayPayload, pickValue, toNumber } from "./backendPayloadUtils"

function normalizeComment(comment, index) {
  return {
    id: pickValue(comment, ["id", "commentId", "comment_id"], `comment-${index}`),
    text: pickValue(comment, ["text", "message"], ""),
    commenterUsername: pickValue(
      comment,
      ["commenterUsername", "commenter_username", "username", "from.username"],
      "instagram_user",
    ),
    commenterId: pickValue(comment, ["commenterId", "commenter_id"], ""),
    mediaCaption: pickValue(comment, ["mediaCaption", "media_caption", "caption"], ""),
    mediaPermalink: pickValue(comment, ["mediaPermalink", "media_permalink", "permalink"], ""),
    mediaThumbnail: pickValue(comment, ["mediaThumbnail", "media_thumbnail", "thumbnail"], ""),
    mediaId: pickValue(comment, ["mediaId", "media_id"], ""),
    likeCount: toNumber(pickValue(comment, ["likeCount", "like_count"], 0), 0),
    replyCount: toNumber(pickValue(comment, ["replyCount", "reply_count"], 0), 0),
    timestamp: pickValue(comment, ["timestamp", "createdTime", "created_time"], ""),
    relativeTime: formatRelativeTime(
      pickValue(comment, ["timestamp", "createdTime", "created_time"], ""),
      "Recently",
    ),
  }
}

export function buildCommentWorkspace(commentPayload) {
  const comments = getArrayPayload(commentPayload, ["comments"]).map(normalizeComment)
  const summaryPayload = commentPayload?.summary || {}

  return {
    comments,
    summary: {
      totalComments: toNumber(summaryPayload.totalComments, comments.length),
      mediaReviewed: toNumber(summaryPayload.mediaReviewed, 0),
      latestActivityLabel: formatRelativeTime(summaryPayload.latestActivityAt, "No recent comments yet"),
    },
  }
}
