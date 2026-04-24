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
    <div className="w-72 h-screen border-r border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_38%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-[0_18px_30px_-20px_rgba(37,99,235,0.9)]">
            IL
          </div>
          <div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">InstaLead</span>
            <p className="text-xs text-slate-500">Customer conversations, organized beautifully</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="rounded-[26px] border border-white/70 bg-white/80 p-3 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.55)] backdrop-blur">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Workspace
          </p>
          <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_20px_35px_-28px_rgba(15,23,42,0.95)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-white/12" : "bg-slate-100"}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
              </button>
            );
          })}
          </div>
        </div>
      </nav>

      <div className="px-6 pb-6">
        <div className="rounded-[24px] border border-slate-200 bg-white/85 p-4 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.55)] backdrop-blur">
          <p className="text-sm font-semibold text-slate-900">Always-on workspace</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Review conversations, monitor replies, and keep every post response flow in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
