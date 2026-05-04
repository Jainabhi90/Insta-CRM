import { ChevronDown, LogOut, Repeat2 } from "lucide-react";
import { InstagramBrandMark } from "./InstagramBrandMark";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DashboardAccountMenu({ gowner, owner, accounts = [], onSwitchAccount, onSelectAccount, onConnectInstagram, onLogout, pendingAction, collapsed = false }) {
  const isBusy = Boolean(pendingAction)
  const instagramHandle = owner?.instagramHandle || owner?.name || "Instagram account"
  const instagramUserId = owner?.instagramUserId || "Not available"
  const selectedCount = accounts.filter((account) => account.connectionStatus === "connected").length

  const getInitials = (name) =>
    String(name || "IG")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center rounded-[22px] border border-[#f2d2e2] bg-white/92 text-left shadow-[0_22px_55px_-36px_rgba(106,54,87,0.4)] transition-all hover:-translate-y-0.5 hover:border-[#e9b7d0] hover:shadow-[0_26px_58px_-36px_rgba(106,54,87,0.46)] focus:outline-none focus:ring-2 focus:ring-[rgba(229,69,146,0.45)] focus:ring-offset-2 ${
            collapsed ? "p-1.5 justify-center" : "w-full gap-3 px-3.5 py-2.5"
          }`}
          aria-label="Open account menu"
          disabled={isBusy}
        >
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 border border-slate-200 shadow-sm">
              <AvatarImage src={owner?.avatarUrl || owner?.profilePictureUrl || ""} alt={instagramHandle} />
                <AvatarFallback className="bg-gradient-to-br from-theme-primary to-theme-accent text-white">
                  {getInitials(instagramHandle)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 rounded-full border border-white bg-white p-0.5 shadow-sm">
                <InstagramBrandMark className="h-4 w-4" />
            </div>
          </div>
          {!collapsed && (
            <>
              <div className="hidden min-w-0 sm:block flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{instagramHandle}</p>
                <p className="truncate text-xs text-slate-500">
                  {selectedCount} connected account{selectedCount === 1 ? "" : "s"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] rounded-[24px] border border-[#f2d2e2] bg-white/95 p-2 shadow-[0_30px_90px_-56px_rgba(106,54,87,0.45)] backdrop-blur">
        <DropdownMenuLabel className="rounded-[18px] bg-[#fff4fa] px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{instagramHandle}</p>
            <p className="text-xs text-slate-500">IG ID: {instagramUserId}</p>
            {gowner?.email ? <p className="text-xs text-slate-400">{gowner.email}</p> : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.length > 0 ? (
          <>
            <DropdownMenuLabel className="px-3 pt-2 text-xs uppercase tracking-wide text-slate-500">
              Workspace accounts
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm"
                onSelect={(event) => {
                  event.preventDefault();
                  if (!account.isSelected) {
                    onSelectAccount?.(account.id);
                  }
                }}
                disabled={isBusy || account.isSelected}
              >
                <Avatar className="h-9 w-9 border border-gray-200 shrink-0">
                  <AvatarImage src={account.avatarUrl || account.profilePictureUrl || ""} alt={account.name} />
                  <AvatarFallback className="bg-gradient-to-br from-theme-primary to-theme-accent text-white">
                    {getInitials(account.name || account.instagramHandle)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{account.instagramHandle || account.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {account.connectionStatus === "token_expired" ? "Reconnect soon" : account.connectionStatus}
                  </p>
                </div>
                {account.isSelected ? (
                  <span className="rounded-full bg-[#fde8f2] px-2 py-1 text-xs font-medium text-[#9f3f70]">
                    Active
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2.5 text-sm"
          onSelect={(event) => {
            event.preventDefault();
            onSwitchAccount?.();
          }}
          disabled={isBusy}
        >
          <Repeat2 className="h-4 w-4" />
          Manage accounts
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2.5 text-sm"
          onSelect={(event) => {
            event.preventDefault();
            onConnectInstagram?.();
          }}
          disabled={isBusy}
        >
          <InstagramBrandMark className="h-4 w-4" />
          Connect another Instagram
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-red-600 focus:text-red-600"
          onSelect={(event) => {
            event.preventDefault();
            onLogout?.();
          }}
          disabled={isBusy}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
