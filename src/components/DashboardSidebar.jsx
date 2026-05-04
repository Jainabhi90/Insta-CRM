import { Zap, Users, BarChart3, MessageCircle, Inbox } from "lucide-react";
import { DashboardAccountMenu } from "./DashboardAccountMenu";

export function DashboardSidebar({ activeView, onViewChange, session, pendingAction, onSwitchAccount, onSelectAccount, onConnectInstagram, onLogout }) {
  const navItems = [
    { id: "leads", icon: Users, label: "Lead Center" },
    { id: "dm-inbox", icon: Inbox, label: "DM Inbox" },
    { id: "comments", icon: MessageCircle, label: "Comments" },
    { id: "automations", icon: Zap, label: "Automations" },
    { id: "performance", icon: BarChart3, label: "Post Performance" },
  ];

  return (
    <aside className="hidden lg:flex lg:w-[240px] lg:flex-col brand-hero-card border-r border-slate-200">
      <div className="flex h-screen flex-col overflow-hidden sticky top-0">
        <div className="px-5 py-6 pt-8">
          <div className="flex items-center gap-3 px-4">
            <div className="flex h-12 w-12  items-center justify-center rounded-lg brand-button-gradient text-white font-medium text-sm">
              IL
            </div>
            <div className="min-w-0">
              <span className="truncate block text-lg font-medium text-slate-900">InstaLead</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2">
          <p className="px-4 pb-3 pt-2 text-[14px] text-slate-600">
            Workspace
          </p>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 rounded-full px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "brand-button-gradient text-white font-medium"
                      : "text-slate-700 hover:bg-slate-200/60"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="truncate text-[15px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="px-3 pb-6">
          {session ? (
            <DashboardAccountMenu
              gowner={session.gowner}
              owner={session.owner}
              accounts={session.accounts || []}
              pendingAction={pendingAction}
              onSwitchAccount={onSwitchAccount}
              onSelectAccount={onSelectAccount}
              onConnectInstagram={onConnectInstagram}
              onLogout={onLogout}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}
