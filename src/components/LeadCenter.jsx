import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Search, RefreshCw, MessageCircleReply, Mail, MessageSquare, Send, Loader2 } from "lucide-react";

function getScoreBadge(score) {
  if (score >= 80) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🔥 Hot Lead</Badge>;
  } else if (score >= 60) {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">⚡ Warm</Badge>;
  } else {
    return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">👀 Window Shopper</Badge>;
  }
}

const defaultSummary = {
  totalLeads: 0,
  weeklyGrowth: "No synced leads yet",
  hotLeads: 0,
  hotLeadLabel: "Score 80+",
  responseRate: "0%",
  responseTrend: "Waiting for lead activity",
  estimatedRevenue: "₹0",
  revenueLabel: "No lead revenue yet",
};

const defaultCommentSummary = {
  totalComments: 0,
  mediaReviewed: 0,
  latestActivityLabel: "No recent comments yet",
};

const defaultInboxSummary = {
  totalConversations: 0,
  latestActivityLabel: "No recent DMs yet",
  accountUsername: "",
};

function ReplyComposer({
  title,
  placeholder,
  onCancel,
  onSubmit,
  disabled,
}) {
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    await onSubmit(trimmedValue);
    setValue("");
  };

  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <p className="text-sm text-blue-900 mb-2" style={{ fontWeight: 600 }}>
        {title}
      </p>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="min-h-[90px] bg-white"
        disabled={disabled}
      />
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-[#2563eb] hover:bg-[#1d4ed8]"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
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

export function LeadCenter({
  summary,
  leads,
  comments,
  commentSummary,
  inbox,
  inboxSummary,
  onRefreshInstagram,
  onSendReply,
}) {
  const [query, setQuery] = useState("");
  const [activeReplyTarget, setActiveReplyTarget] = useState("");
  const [replyStatus, setReplyStatus] = useState({ type: "", message: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyingTarget, setReplyingTarget] = useState("");
  const leadRows = leads || [];
  const commentItems = comments || [];
  const inboxItems = inbox || [];
  const leadSummary = {
    ...defaultSummary,
    ...summary,
  };
  const commentStats = {
    ...defaultCommentSummary,
    ...commentSummary,
  };
  const inboxStats = {
    ...defaultInboxSummary,
    ...inboxSummary,
  };
  const normalizedQuery = query.trim().toLowerCase();

  const filteredLeads = useMemo(
    () =>
      leadRows.filter((lead) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          lead.handle.toLowerCase().includes(normalizedQuery) ||
          lead.sourcePost.toLowerCase().includes(normalizedQuery)
        );
      }),
    [leadRows, normalizedQuery],
  );

  const handleRefresh = async () => {
    if (!onRefreshInstagram) {
      return;
    }

    setReplyStatus({ type: "", message: "" });
    setIsRefreshing(true);

    try {
      await onRefreshInstagram();
      setReplyStatus({
        type: "success",
        message: "Instagram comments and inbox were refreshed from the backend.",
      });
    } catch (error) {
      setReplyStatus({
        type: "error",
        message: error.message || "Instagram data could not be refreshed right now.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReplySubmit = async (payload, successMessage) => {
    if (!onSendReply) {
      return;
    }

    const targetKey = payload.commentId
      ? `comment:${payload.commentId}`
      : `dm:${payload.recipientId}`;

    setReplyingTarget(targetKey);
    setReplyStatus({ type: "", message: "" });

    try {
      await onSendReply(payload);
      setReplyStatus({
        type: "success",
        message: successMessage,
      });
      setActiveReplyTarget("");
      await handleRefresh();
    } catch (error) {
      setReplyStatus({
        type: "error",
        message: error.message || "Reply could not be sent.",
      });
    } finally {
      setReplyingTarget("");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl mb-2" style={{ fontWeight: 600 }}>Lead Command Center</h1>
            <p className="text-gray-600">
              Live Instagram comments, inbox conversations, and reply actions for your connected business account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Live Instagram Data
            </Badge>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
        {replyStatus.message ? (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              replyStatus.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {replyStatus.message}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Leads</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.totalLeads}</p>
          <p className="text-sm text-green-600 mt-1">{leadSummary.weeklyGrowth}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Hot Leads</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.hotLeads}</p>
          <p className="text-sm text-orange-600 mt-1">{leadSummary.hotLeadLabel}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.responseRate}</p>
          <p className="text-sm text-green-600 mt-1">{leadSummary.responseTrend}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Est. Revenue</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.estimatedRevenue}</p>
          <p className="text-sm text-green-600 mt-1">{leadSummary.revenueLabel}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by handle or post..."
            className="pl-10 bg-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead style={{ fontWeight: 600 }}>User Handle</TableHead>
              <TableHead style={{ fontWeight: 600 }}>Last Interaction</TableHead>
              <TableHead style={{ fontWeight: 600 }}>Lead Score</TableHead>
              <TableHead style={{ fontWeight: 600 }}>Source Post</TableHead>
              <TableHead style={{ fontWeight: 600 }}>Interactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-gray-50">
                <TableCell style={{ fontWeight: 500 }}>{lead.handle}</TableCell>
                <TableCell className="text-gray-600">{lead.lastInteraction}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            lead.leadScore >= 80
                              ? "bg-green-500"
                              : lead.leadScore >= 60
                              ? "bg-orange-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${lead.leadScore}%` }}
                        />
                      </div>
                      <span className="text-sm" style={{ fontWeight: 600 }}>{lead.leadScore}</span>
                    </div>
                    {getScoreBadge(lead.leadScore)}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{lead.sourcePost}</TableCell>
                <TableCell>
                  <Badge variant="outline">{lead.interactions} msgs</Badge>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {normalizedQuery
                    ? "No leads match your search yet."
                    : "No DM leads have been synced yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircleReply className="w-5 h-5 text-[#2563eb]" />
                  <h2 className="text-xl" style={{ fontWeight: 600 }}>Instagram Comments</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Reading live comments from the connected Instagram Business account.
                </p>
              </div>
              <Badge variant="outline">
                {commentStats.totalComments} comments
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
              <span>Posts reviewed: {commentStats.mediaReviewed}</span>
              <span>Latest activity: {commentStats.latestActivityLabel}</span>
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto p-6 space-y-4">
            {commentItems.length > 0 ? commentItems.map((comment) => {
              const replyKey = `comment:${comment.id}`;
              const isSending = replyingTarget === replyKey;
              const isActive = activeReplyTarget === replyKey;

              return (
                <div key={comment.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                        @{comment.commenterUsername}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{comment.relativeTime}</p>
                    </div>
                    <Badge variant="outline">{comment.likeCount} likes</Badge>
                  </div>
                  <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{comment.text}</p>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    <p style={{ fontWeight: 500 }}>Source post</p>
                    <p className="mt-1 line-clamp-2">{comment.mediaCaption || "Instagram post"}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveReplyTarget((current) => (current === replyKey ? "" : replyKey))
                      }
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send private reply
                    </Button>
                    <span className="text-xs text-gray-500">
                      Comment ID: {comment.id}
                    </span>
                  </div>
                  {isActive ? (
                    <ReplyComposer
                      title={`Send private reply to @${comment.commenterUsername}`}
                      placeholder="Write the DM reply that should be sent for this comment..."
                      onCancel={() => setActiveReplyTarget("")}
                      onSubmit={(text) =>
                        handleReplySubmit(
                          {
                            commentId: comment.id,
                            text,
                          },
                          `Private reply sent for comment ${comment.id}.`,
                        )
                      }
                      disabled={isSending}
                    />
                  ) : null}
                </div>
              );
            }) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                No live Instagram comments were returned yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-[#f97316]" />
                  <h2 className="text-xl" style={{ fontWeight: 600 }}>Instagram Inbox</h2>
                </div>
                <p className="text-sm text-gray-600">
                  Reading recent DM conversations and showing the latest message preview.
                </p>
              </div>
              <Badge variant="outline">
                {inboxStats.totalConversations} conversations
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
              <span>Latest activity: {inboxStats.latestActivityLabel}</span>
              {inboxStats.accountUsername ? (
                <span>Connected account: @{inboxStats.accountUsername}</span>
              ) : null}
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto p-6 space-y-4">
            {inboxItems.length > 0 ? inboxItems.map((conversation) => {
              const replyKey = `dm:${conversation.id}`;
              const isSending = replyingTarget === replyKey;
              const isActive = activeReplyTarget === replyKey;

              return (
                <div key={conversation.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                        {conversation.handle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.latestMessageLabel}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {conversation.participantCount} participant{conversation.participantCount > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-gray-800">
                    {conversation.latestMessagePreview || "[No text preview available]"}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Latest sender: {conversation.latestSenderUsername || "Unknown"}
                  </div>
                  <div className="mt-4 space-y-2">
                    {conversation.messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                          <span>{message.senderUsername}</span>
                          <span>{message.relativeTime}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                          {message.text || "[No text content]"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setActiveReplyTarget((current) => (current === replyKey ? "" : replyKey))
                      }
                      disabled={!conversation.canReply}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply in DM
                    </Button>
                    {!conversation.canReply ? (
                      <span className="text-xs text-gray-500">
                        Reply is available for 1:1 conversations only.
                      </span>
                    ) : null}
                  </div>
                  {isActive ? (
                    <ReplyComposer
                      title={`Send DM to ${conversation.handle}`}
                      placeholder="Write the Instagram DM reply..."
                      onCancel={() => setActiveReplyTarget("")}
                      onSubmit={(text) =>
                        handleReplySubmit(
                          {
                            recipientId: conversation.recipientId,
                            text,
                          },
                          `DM reply sent to ${conversation.handle}.`,
                        )
                      }
                      disabled={isSending}
                    />
                  ) : null}
                </div>
              );
            }) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                No live Instagram DM conversations were returned yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
