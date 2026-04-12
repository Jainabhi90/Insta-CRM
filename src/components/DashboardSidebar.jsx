import { Home, Zap, Users, BarChart3, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function DashboardSidebar({ activeView, onViewChange, onLogout, onGoHome, owner }) {
  const navItems = [
    { id: "leads", icon: Users, label: "Lead Center" },
    { id: "automations", icon: Zap, label: "Automations" },
    { id: "performance", icon: BarChart3, label: "Post Performance" },
  ];
  const displayOwner = {
    name: owner?.name || "Rahul Kumar",
    plan: owner?.plan || "Growth Plan",
    avatarInitials: owner?.avatarInitials || "RK",
  };

  return (
    <div className="w-64 h-screen bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-lg" />
          <span className="text-xl" style={{ fontWeight: 600 }}>InstaLead</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {/* Home Button */}
          <button
            onClick={onGoHome || onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-[#f1f5f9] mb-2"
          >
            <Home className="w-5 h-5" />
            <span style={{ fontWeight: 400 }}>Home</span>
          </button>

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
                    ? "bg-[#2563eb] text-white"
                    : "text-gray-700 hover:bg-[#f1f5f9]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#f97316] flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
            {displayOwner.avatarInitials}
          </div>
          <div className="flex-1">
            <p style={{ fontWeight: 500 }}>{displayOwner.name}</p>
            <p className="text-sm text-gray-500">{displayOwner.plan}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
