import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const mockLeads = [
  {
    id: 1,
    handle: "@priya_mehta",
    lastInteraction: "2 mins ago",
    leadScore: 92,
    sourcePost: "Best skincare routine video",
    interactions: 8,
  },
  {
    id: 2,
    handle: "@amit_sharma",
    lastInteraction: "15 mins ago",
    leadScore: 85,
    sourcePost: "Digital marketing tips",
    interactions: 5,
  },
  {
    id: 3,
    handle: "@sneha_patel",
    lastInteraction: "1 hour ago",
    leadScore: 78,
    sourcePost: "Best skincare routine video",
    interactions: 4,
  },
  {
    id: 4,
    handle: "@rohit_verma",
    lastInteraction: "3 hours ago",
    leadScore: 65,
    sourcePost: "Product launch Reel",
    interactions: 3,
  },
  {
    id: 5,
    handle: "@kavita_singh",
    lastInteraction: "5 hours ago",
    leadScore: 58,
    sourcePost: "Digital marketing tips",
    interactions: 2,
  },
  {
    id: 6,
    handle: "@arjun_reddy",
    lastInteraction: "1 day ago",
    leadScore: 45,
    sourcePost: "Product launch Reel",
    interactions: 2,
  },
  {
    id: 7,
    handle: "@neha_gupta",
    lastInteraction: "2 days ago",
    leadScore: 38,
    sourcePost: "Best skincare routine video",
    interactions: 1,
  },
  {
    id: 8,
    handle: "@vikram_joshi",
    lastInteraction: "3 days ago",
    leadScore: 25,
    sourcePost: "Digital marketing tips",
    interactions: 1,
  },
];

function getScoreBadge(score) {
  if (score >= 80) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🔥 Hot Lead</Badge>;
  } else if (score >= 60) {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">⚡ Warm</Badge>;
  } else {
    return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">👀 Window Shopper</Badge>;
  }
}

export function LeadCenter() {
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
          <p className="text-3xl" style={{ fontWeight: 700 }}>247</p>
          <p className="text-sm text-green-600 mt-1">+12% this week</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Hot Leads</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>43</p>
          <p className="text-sm text-orange-600 mt-1">Score 80+</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>94%</p>
          <p className="text-sm text-green-600 mt-1">+8% improvement</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Est. Revenue</p>
          <p className="text-3xl" style={{ fontWeight: 700 }}>₹48.2K</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by handle or post..."
            className="pl-10 bg-white"
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
            {mockLeads.map((lead) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
