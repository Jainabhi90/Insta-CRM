import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Users, MessageSquare, Heart, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

const defaultInsight = {
  title: "No post data yet",
  body: "Post insights will appear here once this account has enough activity to display.",
  note: "When fresh post activity arrives, this section will start highlighting reach and engagement patterns.",
};

export function PostPerformance({ summary, posts, insight }) {
  const performancePosts = posts || [];
  const totalViews = performancePosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = performancePosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = performancePosts.reduce((sum, post) => sum + post.comments, 0);
  const avgEngagementRate =
    performancePosts.length > 0
      ? (
          performancePosts.reduce((sum, post) => sum + (post.engagement / post.views) * 100, 0) /
          performancePosts.length
        ).toFixed(1)
      : "0.0";
  const summaryCards = {
    totalViews: formatNumber(totalViews),
    totalLikes: formatNumber(totalLikes),
    totalComments: totalComments.toString(),
    averageEngagement: `${avgEngagementRate}%`,
    likesTrend: "↑ 19% vs last month",
    commentsTrend: "↑ 14% growth",
    engagementLabel: "Industry avg: 3.5%",
    ...summary,
  };
  const insightContent = {
    ...defaultInsight,
    ...insight,
  };

  return (
    <div className="p-8">
      <div className="brand-hero-card mb-12 rounded-[28px] p-6 relative z-10">
        <p className="text-sm font-medium text-slate-500">Insights</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Post Performance</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Keep the eye on reach, engagement, and which posts are creating the strongest response.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 relative z-10">
        <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Eye className="w-[18px] h-[18px] stroke-[1.5]" />
            <p className="text-[13px] font-medium">Total Views</p>
          </div>
          <p className="text-[28px] font-semibold tracking-tight text-slate-900">{summaryCards.totalViews}</p>
          <p className="text-[13px] text-slate-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
            <p className="text-[13px] font-medium">Total Likes</p>
          </div>
          <p className="text-[28px] font-semibold tracking-tight text-slate-900">{summaryCards.totalLikes}</p>
          <p className="text-[13px] text-[#2EA366] mt-1 font-medium">{summaryCards.likesTrend}</p>
        </div>
        
        <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <MessageSquare className="w-[18px] h-[18px] stroke-[1.5]" />
            <p className="text-[13px] font-medium">Total Comments</p>
          </div>
          <p className="text-[28px] font-semibold tracking-tight text-slate-900">{summaryCards.totalComments}</p>
          <p className="text-[13px] text-[#2EA366] mt-1 font-medium">{summaryCards.commentsTrend}</p>
        </div>
        
        <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Users className="w-[18px] h-[18px] stroke-[1.5]" />
            <p className="text-[13px] font-medium">Avg Engagement</p>
          </div>
          <p className="text-[28px] font-semibold tracking-tight text-slate-900">{summaryCards.averageEngagement}</p>
          <p className="text-[13px] text-slate-500 mt-1">{summaryCards.engagementLabel}</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {performancePosts.length > 0 ? performancePosts.map((post) => (
          <div key={post.id} className="group cursor-pointer flex flex-col h-full bg-white border border-slate-100 rounded-[20px] p-3 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative mb-3">
              <ImageWithFallback
                src={post.thumbnail}
                alt={post.caption}
                className="w-full aspect-square object-cover rounded-[16px]"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/50 border-0 px-2.5 py-0.5 text-[11px] font-normal">
                  {post.postedAt}
                </Badge>
              </div>
            </div>
            <div className="px-1 flex flex-col flex-1">
              <p className="text-[14px] font-medium text-slate-900 leading-snug line-clamp-2 mb-3 flex-1">{post.caption}</p>
              
              <div className="flex items-center gap-4 text-slate-500 mt-auto">
                <div className="flex items-center gap-1.5" title="Views">
                  <Eye className="w-[14px] h-[14px]" />
                  <span className="text-xs font-medium">{formatNumber(post.views)}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Likes">
                  <Heart className="w-[14px] h-[14px]" />
                  <span className="text-xs font-medium">{formatNumber(post.likes)}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Comments">
                  <MessageSquare className="w-[14px] h-[14px]" />
                  <span className="text-xs font-medium">{post.comments}</span>
                </div>
                <div className="flex items-center gap-1 ml-auto text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full" title="Engagement Rate">
                  <span className="text-[11px] font-semibold">{post.views > 0 ? ((post.engagement / post.views) * 100).toFixed(1) : "0.0"}%</span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <Card className="border border-dashed border-slate-300 bg-white lg:col-span-3">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg text-gray-900 mb-2 font-semibold">
                No posts yet
              </h3>
              <p className="text-gray-600">
                Post insights will appear here once the account has recent post activity ready to review.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

        <div className="brand-hero-card mt-8 rounded-[28px] p-6">
        <h3 className="text-lg mb-2 font-semibold text-slate-900">{insightContent.title}</h3>
        <p className="text-gray-700 mb-2">
          {insightContent.body}
        </p>
        <p className="text-gray-600 text-sm">
          {insightContent.note}
        </p>
      </div>
    </div>
  );
}
