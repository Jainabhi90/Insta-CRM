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
  weeklyGrowth: "No leads yet",
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
    <div className="mt-3 rounded-2xl border border-[#f2d2e2] bg-[#fff0f7] p-3">
      <p className="text-sm text-[#8e295c] mb-2" style={{ fontWeight: 600 }}>
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
          className="brand-button-gradient"
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
        message: "Fresh activity has arrived across your workspace.",
      });
    } catch (error) {
      setReplyStatus({
        type: "error",
        message: error.message || "Activity could not refresh right now.",
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

      try {
        await handleRefresh();
      } catch (_error) {
        setReplyStatus({
          type: "success",
          message: `${successMessage} New data will arrive shortly.`,
        });
      }
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
        <div className="brand-hero-card rounded-[28px] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Lead Command Center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Spot your strongest opportunities first, keep conversations moving, and reply from one calm workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-transparent bg-[#fde8f2] text-[#9f3f70] hover:bg-[#fce1ee]">
            Latest activity
          </Badge>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-2xl border-[#f2d2e2] bg-white"
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
        </div>
      </div>
      {replyStatus.message ? (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            replyStatus.type === "success"
              ? "border-theme-success/20 bg-theme-success/10 text-theme-success"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {replyStatus.message}
        </div>
      ) : null}


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="brand-panel-soft rounded-[24px] p-6">
          <p className="text-sm text-gray-600 mb-1">Total Leads</p>
          <p className="text-3xl font-bold" style={{ fontWeight: 700 }}>{leadSummary.totalLeads}</p>
          <p className="text-sm text-green-600 mt-1">{leadSummary.weeklyGrowth}</p>
        </div>
        <div className="brand-panel-soft rounded-[24px] p-6">
          <p className="text-sm text-gray-600 mb-1">Hot Leads</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.hotLeads}</p>
          <p className="text-sm text-orange-600 mt-1">{leadSummary.hotLeadLabel}</p>
        </div>
        <div className="brand-panel-soft rounded-[24px] p-6">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>{leadSummary.responseRate}</p>
          <p className="text-sm text-green-600 mt-1">{leadSummary.responseTrend}</p>
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

      <div className="brand-panel-soft overflow-hidden rounded-[28px] mb-8">
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


    </div>
  );
}
