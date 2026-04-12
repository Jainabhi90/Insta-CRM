const CONTENT_PROFILES = [
  {
    label: "Skincare Studio",
    topics: [
      "Morning glow routine for Indian skin",
      "3-step night repair routine",
      "Niacinamide mistakes to avoid",
      "How to layer serums the right way",
      "Before-and-after client transformation",
      "Weekend skin reset checklist",
    ],
    handles: [
      "priya_glows",
      "skinwithananya",
      "mehta_beauty_diary",
      "selfcarewithriya",
      "glowkit_by_mira",
      "clearfaceclub",
      "thedermcorner",
      "sundayserumstudio",
    ],
  },
  {
    label: "Marketing Coach",
    topics: [
      "5 hooks that double Reel watch time",
      "Content calendar for busy founders",
      "DM script that converts cold leads",
      "Ad creative ideas for low-budget brands",
      "How to make offers feel irresistible",
      "Client acquisition playbook for creators",
    ],
    handles: [
      "amit_buildsbrands",
      "growthwithsneha",
      "adsbyrohit",
      "creatorcoachneha",
      "vikram_conversionlab",
      "funnelwithkavya",
      "contentwitharjun",
      "scalewithmahima",
    ],
  },
  {
    label: "D2C Fashion",
    topics: [
      "Summer co-ord drop now live",
      "Behind the scenes from our shoot day",
      "Best-selling kurti styling ideas",
      "How our fabric feels on real customers",
      "Limited stock launch alert",
      "Festive collection preview",
    ],
    handles: [
      "shopwithdiya",
      "stylebykashish",
      "closetwithisha",
      "urbanwear_rahul",
      "drapedbynaina",
      "labelmeher",
      "ootdwithtanu",
      "thewardrobecut",
    ],
  },
]

const POST_THUMBNAILS = [
  "https://images.unsplash.com/photo-1647004693489-ff8bf278edc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBwb3N0JTIwc2tpbmNhcmUlMjBiZWF1dHl8ZW58MXx8fHwxNzcwNDYwNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc3MDM3MjI5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1691096674730-2b5fb28b726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBlY29tbWVyY2V8ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1672327114747-261be18f4907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBpbmRpYW58ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1669743281584-b9125947f9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MDQzNjExMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1589451431369-f569890dfd84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMG1vdGl2YXRpb258ZW58MXx8fHwxNzcwMzg2ODczfDA&ixlib=rb-4.1.0&q=80&w=1080",
]

const BASE_LEADS = [
  { lastInteraction: "2 mins ago", leadScore: 92, interactions: 8 },
  { lastInteraction: "15 mins ago", leadScore: 85, interactions: 5 },
  { lastInteraction: "1 hour ago", leadScore: 78, interactions: 4 },
  { lastInteraction: "3 hours ago", leadScore: 65, interactions: 3 },
  { lastInteraction: "5 hours ago", leadScore: 58, interactions: 2 },
  { lastInteraction: "1 day ago", leadScore: 45, interactions: 2 },
  { lastInteraction: "2 days ago", leadScore: 38, interactions: 1 },
  { lastInteraction: "3 days ago", leadScore: 25, interactions: 1 },
]

const BASE_AUTOMATIONS = [
  {
    name: "Price Inquiry",
    description: "Auto-respond when users ask about pricing",
    triggerPrefix: "price, cost, kitne ka, how much",
    responsePrefix: "Thanks for your interest! Check the latest catalog and DM 'BUY' to place your order.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: true,
  },
  {
    name: "Lead Magnet",
    description: "Collect emails for free guides and offers",
    triggerPrefix: "guide, free, download, ebook",
    responsePrefix: "Share your email and we will send the resource instantly.",
    iconName: "Gift",
    category: "Lead Gen",
    enabled: true,
  },
  {
    name: "Availability Check",
    description: "Respond to stock or booking questions",
    triggerPrefix: "available, stock, slot, in stock",
    responsePrefix: "Yes, this is currently available. Reply with your preference and we will help you next.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: false,
  },
  {
    name: "Customer Support",
    description: "Handle common support questions",
    triggerPrefix: "help, support, issue, problem",
    responsePrefix: "We are on it. Share the issue details and our team will review it shortly.",
    iconName: "Mail",
    category: "Support",
    enabled: true,
  },
  {
    name: "Shipping Info",
    description: "Answer delivery questions fast",
    triggerPrefix: "shipping, delivery, dispatch, tracking",
    responsePrefix: "We ship pan-India and share tracking updates as soon as the order moves.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: false,
  },
  {
    name: "Offer Push",
    description: "Share the current promotion instantly",
    triggerPrefix: "discount, offer, sale, coupon",
    responsePrefix: "A live offer is available right now. Use the current promo code before it expires.",
    iconName: "Zap",
    category: "Sales",
    enabled: true,
  },
]

const BASE_POST_METRICS = [
  { views: 15420, likes: 2847, comments: 156, shares: 89, postedAt: "2 days ago" },
  { views: 12340, likes: 1923, comments: 89, shares: 45, postedAt: "4 days ago" },
  { views: 18750, likes: 3621, comments: 203, shares: 134, postedAt: "1 week ago" },
  { views: 9870, likes: 1456, comments: 67, shares: 32, postedAt: "1 week ago" },
  { views: 7650, likes: 1234, comments: 45, shares: 28, postedAt: "2 weeks ago" },
  { views: 6540, likes: 987, comments: 34, shares: 19, postedAt: "2 weeks ago" },
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function hashString(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function rotate(list, offset) {
  return list.map((_, index) => list[(index + offset) % list.length])
}

function formatCompactNumber(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }

  return value.toString()
}

function buildRevenueLabel(seed) {
  const revenue = 24 + (seed % 29)
  return `₹${revenue.toFixed(1)}K`
}

export function createWorkspaceModel(owner) {
  const seed = hashString(`${owner.id}:${owner.name}`)
  const contentProfile = CONTENT_PROFILES[seed % CONTENT_PROFILES.length]
  const handles = rotate(contentProfile.handles, seed % contentProfile.handles.length)
  const topics = rotate(contentProfile.topics, seed % contentProfile.topics.length)

  const leads = BASE_LEADS.map((lead, index) => {
    const scoreDelta = ((seed + index * 7) % 9) - 4

    return {
      id: `${owner.id}-lead-${index}`,
      handle: `@${handles[index % handles.length]}`,
      lastInteraction: lead.lastInteraction,
      leadScore: clamp(lead.leadScore + scoreDelta, 18, 98),
      sourcePost: topics[index % topics.length],
      interactions: lead.interactions + ((seed + index) % 2),
    }
  })

  const automations = BASE_AUTOMATIONS.map((automation, index) => ({
    id: `${owner.id}-automation-${index}`,
    name: automation.name,
    description: automation.description,
    trigger: `${automation.triggerPrefix}, ${topics[index % topics.length].toLowerCase()}`,
    response: `${automation.responsePrefix} Mention "${topics[(index + 1) % topics.length]}" for the fastest follow-up.`,
    iconName: automation.iconName,
    category: automation.category,
    enabled: automation.enabled,
  }))

  const posts = BASE_POST_METRICS.map((post, index) => {
    const views = post.views + (seed % 900) + index * 180
    const likes = post.likes + (seed % 230) + index * 34
    const comments = post.comments + (seed % 16) + index * 3
    const shares = post.shares + (seed % 9) + index * 2
    const engagement = likes + comments + shares

    return {
      id: `${owner.id}-post-${index}`,
      thumbnail: POST_THUMBNAILS[index % POST_THUMBNAILS.length],
      caption: topics[index % topics.length],
      views,
      likes,
      comments,
      shares,
      engagement,
      postedAt: post.postedAt,
    }
  })

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)
  const averageEngagement = (
    posts.reduce((sum, post) => sum + (post.engagement / post.views) * 100, 0) / posts.length
  ).toFixed(1)

  return {
    workspaceLabel: contentProfile.label,
    leadSummary: {
      totalLeads: 180 + (seed % 140),
      weeklyGrowth: `+${8 + (seed % 9)}% this week`,
      hotLeads: leads.filter((lead) => lead.leadScore >= 80).length + 18 + (seed % 10),
      hotLeadLabel: "Score 80+",
      responseRate: `${89 + (seed % 8)}%`,
      responseTrend: `+${3 + (seed % 6)}% improvement`,
      estimatedRevenue: buildRevenueLabel(seed),
      revenueLabel: "This month",
    },
    automationSummary: {
      autoRepliesToday: 60 + (seed % 120),
      averageResponseTime: `${6 + (seed % 5)} sec`,
      timeSaved: `${(1.8 + (seed % 18) / 10).toFixed(1)} hrs`,
      timeSavedLabel: "Just today",
    },
    performanceSummary: {
      totalViews: formatCompactNumber(totalViews),
      totalLikes: formatCompactNumber(totalLikes),
      totalComments: totalComments.toString(),
      averageEngagement: `${averageEngagement}%`,
      likesTrend: `+${12 + (seed % 12)}% vs last month`,
      commentsTrend: `+${7 + (seed % 9)}% growth`,
      engagementLabel: "Industry avg: 3.5%",
    },
    performanceInsight: {
      title: "Smart Insight",
      body: `Posts around "${topics[0]}" are driving the strongest engagement for ${owner.name}. Double down on that format and keep the CTA focused on DMs.`,
      note: `Your current mix suggests repeatable traction in the ${contentProfile.label.toLowerCase()} content bucket.`,
    },
    automationTip: {
      title: "Pro Tip",
      body: `Pair "Price Inquiry" with the topic "${topics[0]}" so your highest-intent leads get an instant reply without extra ops work.`,
    },
    leads,
    automations,
    posts,
  }
}
