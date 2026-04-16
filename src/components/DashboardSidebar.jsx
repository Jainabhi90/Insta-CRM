import { Zap, Users, BarChart3, MessageCircle, Inbox } from "lucide-react";

export function DashboardSidebar({ activeView, onViewChange }) {
  const navItems = [
    { id: "leads", icon: Users, label: "Lead Center" },
    { id: "dm-inbox", icon: Inbox, label: "DM Inbox" },
    { id: "comments", icon: MessageCircle, label: "Comments" },
    { id: "automations", icon: Zap, label: "Automations" },
    { id: "performance", icon: BarChart3, label: "Post Performance" },
  ];

  return (
    <div className="w-64 h-screen bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-theme-primary to-theme-accent rounded-lg" />
          <span className="text-xl font-semibold">InstaLead</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {/* Dashboard Views */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-theme-primary text-white"
                    : "text-gray-700 hover:bg-[#f1f5f9]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
