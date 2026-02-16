import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, Users, MessageSquare, Heart, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const mockPosts = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1647004693489-ff8bf278edc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBwb3N0JTIwc2tpbmNhcmUlMjBiZWF1dHl8ZW58MXx8fHwxNzcwNDYwNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Best skincare routine for Indian skin 🌟",
    views: 15420,
    likes: 2847,
    comments: 156,
    shares: 89,
    engagement: 3092,
    postedAt: "2 days ago",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc3MDM3MjI5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "5 digital marketing tips that actually work 💡",
    views: 12340,
    likes: 1923,
    comments: 89,
    shares: 45,
    engagement: 2057,
    postedAt: "4 days ago",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1691096674730-2b5fb28b726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBlY29tbWVyY2V8ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "New product launch! Limited stock ⚡",
    views: 18750,
    likes: 3621,
    comments: 203,
    shares: 134,
    engagement: 3958,
    postedAt: "1 week ago",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1672327114747-261be18f4907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBpbmRpYW58ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Summer collection 2026 🌺",
    views: 9870,
    likes: 1456,
    comments: 67,
    shares: 32,
    engagement: 1555,
    postedAt: "1 week ago",
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1669743281584-b9125947f9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MDQzNjExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Weekend special menu! Order now 🍜",
    views: 7650,
    likes: 1234,
    comments: 45,
    shares: 28,
    engagement: 1307,
    postedAt: "2 weeks ago",
  },
  {
    id: "6",
    thumbnail: "https://images.unsplash.com/photo-1589451431369-f569890dfd84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMG1vdGl2YXRpb258ZW58MXx8fHwxNzcwMzg2ODczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Transform your body in 30 days 💪",
    views: 6540,
    likes: 987,
    comments: 34,
    shares: 19,
    engagement: 1040,
    postedAt: "2 weeks ago",
  },
];

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function PostPerformance() {
  const totalViews = mockPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = mockPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = mockPosts.reduce((sum, post) => sum + post.comments, 0);
  const avgEngagementRate = (
    (mockPosts.reduce((sum, post) => sum + (post.engagement / post.views) * 100, 0) /
      mockPosts.length)
  ).toFixed(1);

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
          <p className="text-3xl" style={{ fontWeight: 700 }}>{formatNumber(totalViews)}</p>
          <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-sm text-gray-600">Total Likes</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{formatNumber(totalLikes)}</p>
          <p className="text-sm text-green-600 mt-1">+23% vs last month</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#f97316]" />
            <p className="text-sm text-gray-600">Total Comments</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{totalComments}</p>
          <p className="text-sm text-green-600 mt-1">+18% growth</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Avg Engagement</p>
          </div>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{avgEngagementRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Industry avg: 3.5%</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPosts.map((post) => (
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
        ))}
      </div>

      {/* Insights Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>📊 Smart Insight</h3>
        <p className="text-gray-700 mb-2">
          Your "Product Launch" posts generate <strong>2.5x higher engagement</strong> than other content.
        </p>
        <p className="text-gray-600 text-sm">
          Consider creating more product-focused content with compelling visuals to maximize reach and interactions.
        </p>
      </div>
    </div>
  );
}
