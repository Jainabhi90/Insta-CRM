import { Inbox, Loader2, RefreshCw, Send } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { sendPrivateReply } from "../api/instagram/privateReplyApi";

function buildDefaultSummary(conversations) {
  return {
    totalConversations: conversations.length,
    latestActivityLabel: conversations.length > 0 ? "Recently updated" : "No recent DMs yet",
    accountUsername: "",
  };
}

export function DmInbox({
  conversations = [],
  summary,
  onRefresh,
  onSendReply,
}) {
  const normalizedConversations = useMemo(
    () =>
      conversations.map((conversation, index) => ({
        ...conversation,
        _rowId: conversation.id || `${conversation.handle || "conversation"}-${index}`,
      })),
    [conversations],
  );

  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState({ type: "", message: "" });
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const inboxSummary = useMemo(
    () => ({
      ...buildDefaultSummary(normalizedConversations),
      ...(summary || {}),
    }),
    [normalizedConversations, summary],
  );

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) {
      return normalizedConversations[0] || null;
    }

    return (
      normalizedConversations.find((conversation) => conversation._rowId === selectedConversationId) ||
      normalizedConversations[0] ||
      null
    );
  }, [normalizedConversations, selectedConversationId]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversationId(conversation._rowId);
    setReplyStatus({ type: "", message: "" });
  };

  const handleRefresh = useCallback(async () => {
    if (typeof onRefresh !== "function") {
      return;
    }

    setReplyStatus({ type: "", message: "" });
    setIsRefreshing(true);

    try {
      await onRefresh();
      setReplyStatus({
        type: "success",
        message: "New conversation activity just arrived.",
      });
    } catch (error) {
      setReplyStatus({
        type: "error",
        message: error?.message || "Conversation activity could not refresh right now.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const handleSendReply = useCallback(async () => {
    const trimmedReply = replyText.trim();

    if (!selectedConversation) {
      setReplyStatus({ type: "error", message: "Select a conversation first." });
      return;
    }

    if (!trimmedReply) {
      setReplyStatus({ type: "error", message: "Reply text cannot be empty." });
      return;
    }

    if (!selectedConversation.canReply || !selectedConversation.recipientId) {
      setReplyStatus({
        type: "error",
        message: "This conversation is view-only right now.",
      });
      return;
    }

    setIsSendingReply(true);
    setReplyStatus({ type: "", message: "" });

    try {
      if (typeof onSendReply === "function") {
        await onSendReply({
          recipientId: selectedConversation.recipientId,
          text: trimmedReply,
        });
      } else {
        await sendPrivateReply({
          recipientId: selectedConversation.recipientId,
          text: trimmedReply,
        });
      }

      setReplyStatus({
        type: "success",
        message: `Reply sent to ${selectedConversation.handle || "conversation"}.`,
      });
      setReplyText("");

      if (typeof onRefresh === "function") {
        try {
          await onRefresh();
        } catch (_error) {
          setReplyStatus({
            type: "success",
            message: `Reply sent to ${selectedConversation.handle || "conversation"}. New data will arrive shortly.`,
          });
        }
      }
    } catch (error) {
      setReplyStatus({
        type: "error",
        message: error?.message || "Could not send reply right now.",
      });
    } finally {
      setIsSendingReply(false);
    }
  }, [onRefresh, onSendReply, replyText, selectedConversation]);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-base font-semibold leading-6 text-gray-900">Inbox Overview</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-gray-500 font-medium">
            {inboxSummary.totalConversations} conversations
          </Badge>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || typeof onRefresh !== "function"}
            className="rounded-lg border-gray-200 bg-white text-sm shadow-sm h-8 px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {replyStatus.message ? (
        <div
          className={`rounded-lg px-4 py-3 text-sm mb-6 ${
            replyStatus.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {replyStatus.message}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-6">
        {normalizedConversations.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {normalizedConversations.map((conversation) => (
              <div
                key={conversation._rowId}
                className={`p-5 cursor-pointer transition-colors ${
                  selectedConversation?._rowId === conversation._rowId
                    ? "bg-indigo-50/50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                      {conversation.handle || "Instagram user"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last message: {conversation.latestMessageLabel || "Recently"}
                    </p>
                  </div>
                  <Badge variant="outline">DM</Badge>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {conversation.latestMessagePreview || "Conversation preview unavailable."}
                </p>

                <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
                  <span>Participants: {conversation.participantCount ?? 0}</span>
                  <span>Reply ready: {conversation.canReply ? "Yes" : "No"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <Inbox className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>
                No conversations yet
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto">
              New conversations will appear here as soon as this account starts receiving messages.
              </p>
            </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <h2 className="text-base font-semibold leading-6 text-gray-900 mb-1">
          Reply Composer
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a conversation above, draft a response, and send it when it feels right.
        </p>

        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Selected conversation</p>
          <Input
            readOnly
            value={selectedConversation?.handle || "No conversation selected"}
            className="bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Recent messages</p>
          <div className="space-y-2">
            {selectedConversation?.messages?.length ? (
              selectedConversation.messages.slice(0, 4).map((message) => (
                <div key={message.id} className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                    <span>{message.senderUsername || "instagram_user"}</span>
                    <span>{message.relativeTime || "Recently"}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                    {message.text || "[No text content]"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                No message thread is available for the selected conversation yet.
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Message</p>
          <Textarea
            placeholder="Type your DM reply..."
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            disabled={isSendingReply}
          />
        </div>

        {replyStatus.message ? (
          <div
            className={`rounded-lg px-3 py-2 text-sm mb-4 ${
              replyStatus.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {replyStatus.message}
          </div>
        ) : null}

        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          onClick={handleSendReply}
          disabled={isSendingReply || !selectedConversation || !selectedConversation?.canReply}
        >
          {isSendingReply ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Reply
            </>
          )}
        </Button>
        {selectedConversation && !selectedConversation.canReply ? (
          <p className="mt-3 text-xs text-gray-500">
            Reply is available for 1:1 conversations only.
          </p>
        ) : null}
      </div>
    </div>
  );
}
