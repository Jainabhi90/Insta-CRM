import { MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function formatDateTime(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

export function CommentsInbox({
  comments = [],
  onRefresh,
  isRefreshing = false,
  errorMessage = "",
  lastSyncedAt = null,
}) {
  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600 }}>
            Instagram Comments
          </h1>
          <p className="text-gray-600">
            Review incoming comments and verify comment-read flow for app review.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Last synced: {formatDateTime(lastSyncedAt)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing || typeof onRefresh !== "function"}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {errorMessage}
        </div>
      ) : null}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {comments.map((comment, index) => (
              <div key={comment.id || `${comment.commentId || "comment"}-${index}`} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                      {comment.username || comment.from || "Instagram user"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.createdAt ? formatDateTime(comment.createdAt) : "Timestamp unavailable"}
                    </p>
                  </div>
                  <Badge variant="outline">Comment</Badge>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.text || comment.message || "No comment text available."}
                </p>

                <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
                  <span>Comment ID: {comment.commentId || comment.id || "N/A"}</span>
                  <span>Media ID: {comment.mediaId || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>
              No synced comments yet
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              This tab is ready for live Instagram comment data. Once backend comment sync is connected, comments will appear here for review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
