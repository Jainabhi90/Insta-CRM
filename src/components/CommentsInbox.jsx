import { Loader2, Mail, MessageCircle, RefreshCw, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { sendPrivateReply } from "../api/instagram/privateReplyApi";

function buildDefaultSummary(comments) {
  return {
    totalComments: comments.length,
    mediaReviewed: 0,
    latestActivityLabel: comments.length > 0 ? "Recently updated" : "No recent comments yet",
  }
}

function ReplyComposer({ comment, disabled, onCancel, onSubmit }) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    const trimmedReply = replyText.trim();

    if (!trimmedReply) {
      return;
    }

    await onSubmit(trimmedReply);
    setReplyText("");
  };

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm text-blue-900" style={{ fontWeight: 600 }}>
        Send private reply to @{comment.commenterUsername || "instagram_user"}
      </p>
      <Textarea
        value={replyText}
        onChange={(event) => setReplyText(event.target.value)}
        placeholder="Write the DM reply that should be sent for this comment..."
        className="mt-3 min-h-[110px] bg-white"
        disabled={disabled}
      />
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-[#2563eb] hover:bg-[#1d4ed8]"
          onClick={handleSubmit}
          disabled={disabled || !replyText.trim()}
        >
          {disabled ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function CommentsInbox({
  comments = [],
  summary,
  onRefresh,
  onSendReply,
}) {
  const [activeCommentId, setActiveCommentId] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const commentSummary = useMemo(
    () => ({
      ...buildDefaultSummary(comments),
      ...(summary || {}),
    }),
    [comments, summary],
  );

  const handleRefresh = async () => {
    if (typeof onRefresh !== "function") {
      return;
    }

    setStatus({ type: "", message: "" });
    setIsRefreshing(true);

    try {
      await onRefresh();
      setStatus({
        type: "success",
        message: "Instagram comments were refreshed from the backend.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Instagram comments could not be refreshed right now.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReplySubmit = async (comment, text) => {
    const commentId = comment.id || "";

    setReplyingCommentId(commentId);
    setStatus({ type: "", message: "" });

    try {
      if (typeof onSendReply === "function") {
        await onSendReply({
          commentId,
          text,
        });
      } else {
        await sendPrivateReply({
          commentId,
          text,
        });
      }

      setStatus({
        type: "success",
        message: `Private reply sent for comment ${commentId}.`,
      });
      setActiveCommentId("");

      if (typeof onRefresh === "function") {
        await onRefresh();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Comment reply could not be sent.",
      });
    } finally {
      setReplyingCommentId("");
    }
  };

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
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>{commentSummary.totalComments} comments</span>
            <span>{commentSummary.mediaReviewed} posts reviewed</span>
            <span>Latest activity: {commentSummary.latestActivityLabel}</span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || typeof onRefresh !== "function"}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {status.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm mb-6 ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {comments.map((comment, index) => {
              const commentId = comment.id || `comment-${index}`;
              const isReplying = replyingCommentId === commentId;
              const isActive = activeCommentId === commentId;

              return (
                <div key={commentId} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                        @{comment.commenterUsername || "instagram_user"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.relativeTime || "Recently"}
                      </p>
                    </div>
                    <Badge variant="outline">Comment</Badge>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.text || "No comment text available."}
                  </p>

                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    <p style={{ fontWeight: 500 }}>Source post</p>
                    <p className="mt-1 line-clamp-2">{comment.mediaCaption || "Instagram post"}</p>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
                    <span>Comment ID: {commentId}</span>
                    <span>Media ID: {comment.mediaId || "N/A"}</span>
                    <span>{comment.likeCount || 0} likes</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveCommentId((currentCommentId) =>
                          currentCommentId === commentId ? "" : commentId,
                        )
                      }
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send private reply
                    </Button>
                  </div>

                  {isActive ? (
                    <ReplyComposer
                      comment={comment}
                      disabled={isReplying}
                      onCancel={() => setActiveCommentId("")}
                      onSubmit={(text) => handleReplySubmit(comment, text)}
                    />
                  ) : null}
                </div>
              );
            })}
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
              Live Instagram comments will appear here once the connected business account has readable comment activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
