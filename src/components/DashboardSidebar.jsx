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
    <aside className="hidden lg:flex lg:w-[290px] lg:flex-col">
      <div className="brand-panel sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[32px] border-0 bg-[radial-gradient(circle_at_top_left,_rgba(229,69,146,0.14),_transparent_38%),linear-gradient(180deg,#ffffff_0%,#fff7fb_52%,#fff1f8_100%)]">
        <div className="border-b border-slate-200/80 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-theme-primary via-[#f472b6] to-theme-accent text-white shadow-[0_24px_45px_-28px_rgba(214,64,134,0.58)]">
              IL
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-slate-900">InstaLead</span>
              <p className="text-xs text-slate-500">A calmer way to run Instagram revenue</p>
            </div>
          </div>
          <div className="mt-5 rounded-[24px] border border-[#f2d2e2] bg-white/85 px-4 py-4 shadow-[0_16px_40px_-34px_rgba(214,64,134,0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              Control Room
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
              Everything important stays one click away, without the clutter.
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-[0_28px_60px_-48px_rgba(106,54,87,0.38)] backdrop-blur">
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
                        ? "bg-gradient-to-r from-theme-primary to-theme-accent text-white shadow-[0_22px_36px_-28px_rgba(214,64,134,0.52)]"
                        : "text-slate-600 hover:bg-[#fff1f8] hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isActive ? "bg-white/12" : "bg-[#fff3f9]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
                      <p className={`text-xs ${isActive ? "text-pink-100" : "text-slate-400"}`}>
                        {item.id === "leads"
                          ? "Leads and responses"
                          : item.id === "dm-inbox"
                          ? "Direct conversations"
                          : item.id === "comments"
                          ? "Comment follow-up"
                          : item.id === "automations"
                          ? "Rules and templates"
                          : "Posts and reach"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="px-6 pb-6">
          <div className="rounded-[26px] border border-[#f0c9dc] bg-gradient-to-br from-[#9f3f70] to-[#7b3aed] px-5 py-5 text-white shadow-[0_24px_60px_-38px_rgba(126,59,113,0.52)]">
            <p className="text-sm font-semibold">Always-on workspace</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Keep conversations, automation, and performance in one polished operating system.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
