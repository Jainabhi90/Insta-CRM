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
  body: "Your backend has not synced any Instagram post analytics into the CRM yet.",
  note: "Once posts are stored in your database, this section will show live reach and engagement.",
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
    likesTrend: "+23% vs last month",
    commentsTrend: "+18% growth",
    engagementLabel: "Industry avg: 3.5%",
    ...summary,
  };
  const insightContent = {
    ...defaultInsight,
    ...insight,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ fontWeight: 600 }}>Post Performance</h1>
        <p className="text-gray-600">
          Track your Instagram posts performance with detailed analytics on views, engagement, and interactions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-[#2563eb]" />
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{summaryCards.totalViews}</p>
          <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-sm text-gray-600">Total Likes</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{summaryCards.totalLikes}</p>
          <p className="text-sm text-green-600 mt-1">{summaryCards.likesTrend}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#f97316]" />
            <p className="text-sm text-gray-600">Total Comments</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{summaryCards.totalComments}</p>
          <p className="text-sm text-green-600 mt-1">{summaryCards.commentsTrend}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Avg Engagement</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{summaryCards.averageEngagement}</p>
          <p className="text-sm text-gray-600 mt-1">{summaryCards.engagementLabel}</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performancePosts.length > 0 ? performancePosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-gray-100">
            <div className="relative">
              <ImageWithFallback
                src={post.thumbnail}
                alt={post.caption}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-gray-700 hover:bg-white">
                  {post.postedAt}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-black/60 text-white hover:bg-black/70">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatNumber(post.views)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{post.caption}</p>
              
              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{formatNumber(post.likes)}</span>
                  <p className="text-xs text-gray-500">Likes</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageSquare className="w-4 h-4 text-[#2563eb]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{post.comments}</span>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Share2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{post.shares}</span>
                  <p className="text-xs text-gray-500">Shares</p>
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Engagement Rate</span>
                  <span className="text-sm font-semibold text-purple-700">
                    {((post.engagement / post.views) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border border-dashed border-gray-300 bg-white lg:col-span-3">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>
                No synced posts yet
              </h3>
              <p className="text-gray-600">
                Post analytics will appear here after your backend stores Instagram post performance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>📊 {insightContent.title}</h3>
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
