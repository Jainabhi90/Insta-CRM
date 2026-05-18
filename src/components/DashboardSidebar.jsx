import { Zap, Users, BarChart3, MessageCircle, Inbox, CreditCard, X } from "lucide-react";

export function DashboardSidebar({ activeView, onViewChange, onGoToPricing, isOpen, onClose }) {
  const navItems = [
    { id: "leads", icon: Users, label: "Lead Center" },
    { id: "dm-inbox", icon: Inbox, label: "DM Inbox" },
    { id: "comments", icon: MessageCircle, label: "Comments" },
    { id: "automations", icon: Zap, label: "Automations" },
    { id: "performance", icon: BarChart3, label: "Post Performance" },
    { id: "pricing", icon: CreditCard, label: "Manage plan", action: onGoToPricing },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100 lg:border-transparent lg:mt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm">
              IL
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">InstaLead</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700 p-1 -mr-2 rounded-md hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col mt-4 px-6 overflow-y-auto hide-scrollbar pb-6">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">Workspace</div>
              <ul role="list" className="-mx-2 mt-4 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else {
                            onViewChange(item.id);
                          }
                          onClose?.();
                        }}
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
      </aside>
    </>
  );
}

