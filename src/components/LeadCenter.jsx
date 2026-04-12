import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

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

export function LeadCenter({ summary, leads }) {
  const [query, setQuery] = useState("");
  const leadRows = leads || [];
  const leadSummary = {
    ...defaultSummary,
    ...summary,
  };
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLeads = leadRows.filter((lead) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      lead.handle.toLowerCase().includes(normalizedQuery) ||
      lead.sourcePost.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ fontWeight: 600 }}>Lead Command Center</h1>
        <p className="text-gray-600">Your real-time lead dashboard. Focus on hot leads first.</p>
      </div>

      {/* Stats Cards */}
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

      {/* Search */}
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

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
