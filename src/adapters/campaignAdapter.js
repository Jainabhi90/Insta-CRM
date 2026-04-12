import {
  formatCompactNumber,
  formatRelativeTime,
  getArrayPayload,
  pickValue,
  toNumber,
} from "./backendPayloadUtils"

function buildEmptyPerformanceWorkspace() {
  return {
    posts: [],
    summary: {
      totalViews: "0",
      totalLikes: "0",
      totalComments: "0",
      averageEngagement: "0.0%",
      likesTrend: "No synced posts yet",
      commentsTrend: "Waiting for new post analytics",
      engagementLabel: "Analytics will appear after your first sync",
    },
    insight: {
      title: "No post data yet",
      body: "Your backend has not synced any Instagram posts into the CRM yet.",
      note: "Once posts are stored in your database, this section will show live reach and engagement.",
    },
    isFallback: false,
  }
}

function normalizeCampaign(campaign, fallbackPost, index) {
  const views = toNumber(
    pickValue(campaign, ["views", "reach", "impressions", "view_count"], fallbackPost.views),
    fallbackPost.views,
  )
  const likes = toNumber(
    pickValue(campaign, ["likes", "like_count", "likes_count"], fallbackPost.likes),
    fallbackPost.likes,
  )
  const comments = toNumber(
    pickValue(campaign, ["comments", "comment_count", "comments_count"], fallbackPost.comments),
    fallbackPost.comments,
  )
  const shares = toNumber(
    pickValue(campaign, ["shares", "share_count", "shares_count"], fallbackPost.shares),
    fallbackPost.shares,
  )

  return {
    id: pickValue(campaign, ["id", "campaign_id", "post_id"], fallbackPost.id || `campaign-${index}`),
    thumbnail: pickValue(
      campaign,
      ["thumbnail", "thumbnail_url", "image_url", "media_url", "cover_url"],
      fallbackPost.thumbnail,
    ),
    caption: pickValue(
      campaign,
      ["caption", "post_caption", "title", "campaign_name", "name"],
      fallbackPost.caption,
    ),
    views,
    likes,
    comments,
    shares,
    engagement: likes + comments + shares,
    postedAt: formatRelativeTime(
      pickValue(campaign, ["postedAt", "posted_at", "published_at", "created_at"], fallbackPost.postedAt),
      fallbackPost.postedAt,
    ),
  }
}

export function buildPerformanceWorkspace(campaignPayload, fallbackWorkspace, options = {}) {
  const { usePreviewFallback = false } = options
  const campaigns = getArrayPayload(campaignPayload, ["campaigns", "posts"])

  if (campaigns.length === 0) {
    if (usePreviewFallback) {
      return {
        posts: fallbackWorkspace.posts,
        summary: fallbackWorkspace.performanceSummary,
        insight: fallbackWorkspace.performanceInsight,
        isFallback: true,
      }
    }

    return {
      ...buildEmptyPerformanceWorkspace(),
    }
  }

  const posts = campaigns.map((campaign, index) =>
    normalizeCampaign(campaign, fallbackWorkspace.posts[index % fallbackWorkspace.posts.length], index),
  )

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)
  const averageEngagement = (
    posts.reduce((sum, post) => sum + (post.engagement / Math.max(post.views, 1)) * 100, 0) / posts.length
  ).toFixed(1)

  return {
    posts,
    summary: {
      totalViews: formatCompactNumber(totalViews),
      totalLikes: formatCompactNumber(totalLikes),
      totalComments: `${totalComments}`,
      averageEngagement: `${averageEngagement}%`,
      likesTrend: fallbackWorkspace.performanceSummary.likesTrend,
      commentsTrend: fallbackWorkspace.performanceSummary.commentsTrend,
      engagementLabel: fallbackWorkspace.performanceSummary.engagementLabel,
    },
    insight: {
      title: fallbackWorkspace.performanceInsight.title,
      body: `Campaign data is now powering this section. Top post: "${posts[0]?.caption || fallbackWorkspace.posts[0].caption}".`,
      note: "Replace the adapter keys if your backend uses different campaign field names.",
    },
    isFallback: false,
  }
}
