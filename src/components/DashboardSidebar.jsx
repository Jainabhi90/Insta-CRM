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
    <aside className="hidden lg:flex lg:w-[280px] lg:flex-col">
      <div className="sticky top-0 flex h-screen grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white font-bold shadow-sm">
              IL
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">InstaLead</span>
        </div>

        <nav className="flex flex-1 flex-col mt-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">Workspace</div>
              <ul role="list" className="-mx-2 mt-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onViewChange(item.id)}
                        className={`w-full group flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all ${
                          isActive
                            ? "bg-[#eff6ff] text-[#2563eb] shadow-sm ring-1 ring-inset ring-[#bfdbfe]"
                            : "text-gray-600 hover:text-[#2563eb] hover:bg-gray-50"
                        }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#2563eb]" : "text-gray-400 group-hover:text-[#2563eb]"}`} />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
