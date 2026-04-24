import { CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

function getInitials(name) {
  return String(name || "IG")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function getStatusLabel(connectionStatus) {
  if (connectionStatus === "connected") {
    return "Ready"
  }

  if (connectionStatus === "token_expired") {
    return "Reconnect needed"
  }

  return connectionStatus || "Pending"
}

function formatExpiry(value) {
  if (!value) {
    return "Ready to open"
  }

  try {
    return `Updated ${new Date(value).toLocaleDateString()}`
  } catch {
    return "Ready to open"
  }
}

export default function Accounts({
  gowner,
  accounts = [],
  pendingAction,
  error,
  onConnectInstagram,
  onOpenDashboard,
  onSelectAccount,
  onBackToHome,
}) {
  const isBusy = Boolean(pendingAction)

  return (
    <div className="brand-shell-bg min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="brand-panel overflow-hidden rounded-[30px] border-0">
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <p className="text-sm font-medium text-slate-500">Choose an account</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Continue to InstaLead
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pick the Instagram account you want to open right now.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#f2d2e2] bg-white/82 px-4 py-3 shadow-[0_14px_40px_-34px_rgba(214,64,134,0.24)]">
              <Avatar className="h-11 w-11 border border-slate-200">
                <AvatarImage src={gowner?.avatarUrl || ""} alt={gowner?.name || gowner?.email || "Workspace"} />
                <AvatarFallback className="bg-gradient-to-br from-theme-primary to-theme-accent text-white">
                  {getInitials(gowner?.name || gowner?.email || "GW")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {gowner?.name || "Google workspace"}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {gowner?.email || "Not connected"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            {error ? (
              <div className="mb-4 rounded-2xl border border-[#f5c2d8] bg-[#fff0f7] px-4 py-3 text-sm text-[#9f3f70]">
                <p className="font-semibold text-red-800">Couldn’t open the dashboard</p>
                <p className="mt-1">{error}</p>
              </div>
            ) : null}

            {accounts.length > 0 ? (
              <div className="space-y-2">
                {accounts.map((account) => {
                  const isSelected = Boolean(account.isSelected)
                  const isConnected = account.connectionStatus === "connected"

                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => onSelectAccount?.(account.id)}
                      disabled={isBusy || !isConnected}
                      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all ${
                        isSelected
                          ? "border-[#ec4899] bg-[#fff0f7] shadow-[0_14px_35px_-25px_rgba(214,64,134,0.42)]"
                          : "border-[#f2d2e2] bg-white/88 hover:border-[#e9b7d0] hover:bg-[#fff6fb]"
                      } ${!isConnected ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                      <Avatar className="h-12 w-12 border border-slate-200">
                        <AvatarImage
                          src={account.avatarUrl || account.profilePictureUrl || ""}
                          alt={account.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-500 text-white">
                          {getInitials(account.name || account.instagramHandle)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {account.instagramHandle || account.name}
                          </p>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {account.accountType === "UNKNOWN" ? "Instagram account" : `${account.accountType.toLowerCase()} account`}
                        </p>
                          <p className="mt-2 text-xs text-[#8d6780]">
                            {getStatusLabel(account.connectionStatus)} • {formatExpiry(account.tokenExpiresAt)}
                          </p>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-theme-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                      )}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={onConnectInstagram}
                  disabled={isBusy}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-[#f2d2e2] bg-white/88 px-4 py-4 text-left transition-all hover:border-[#e9b7d0] hover:bg-[#fff6fb] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f2d2e2] bg-[#fff3f9] text-theme-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">Use another Instagram account</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add another Instagram account to this workspace
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#efc5db] bg-[#fff7fb] px-5 py-8 text-center">
                <p className="text-base font-semibold text-slate-900">No Instagram accounts connected</p>
                <p className="mt-2 text-sm text-slate-500">
                  Connect your first Instagram account to open the dashboard.
                </p>
                <Button
                  className="brand-button-gradient mt-5 h-11 text-white"
                  onClick={onConnectInstagram}
                  disabled={isBusy}
                >
                  Connect Instagram
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-[#f2d2e2] bg-white/74 px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="h-10" onClick={onBackToHome} disabled={isBusy}>
                Back Home
              </Button>
              {accounts.length > 0 ? (
                <Button
                  variant="ghost"
                  className="h-10 text-slate-500"
                  onClick={onOpenDashboard}
                  disabled={isBusy}
                >
                  Open selected dashboard manually
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
