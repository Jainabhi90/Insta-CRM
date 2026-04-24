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
    return "Token expiry not available"
  }

  try {
    return `Token expiry: ${new Date(value).toLocaleString()}`
  } catch {
    return "Token expiry not available"
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
    <div className="min-h-screen bg-slate-100 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.55)]">
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <p className="text-sm font-medium text-slate-500">Choose an account</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Continue to InstaLead
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select the Instagram account you want to open.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Avatar className="h-11 w-11 border border-slate-200">
                <AvatarImage src={gowner?.avatarUrl || ""} alt={gowner?.name || gowner?.email || "Workspace"} />
                <AvatarFallback className="bg-slate-900 text-white">
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
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                          ? "border-blue-500 bg-blue-50 shadow-[0_14px_35px_-25px_rgba(37,99,235,0.85)]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
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
                          IG ID: {account.instagramUserId || "Not available"}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {getStatusLabel(account.connectionStatus)} • {account.accountType || "UNKNOWN"} • {formatExpiry(account.tokenExpiresAt)}
                        </p>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
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
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">Use another Instagram account</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Connect another Instagram account to this Google workspace
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <p className="text-base font-semibold text-slate-900">No Instagram accounts connected</p>
                <p className="mt-2 text-sm text-slate-500">
                  Connect your first Instagram account to open the dashboard.
                </p>
                <Button
                  className="mt-5 h-11 bg-slate-900 text-white hover:bg-slate-800"
                  onClick={onConnectInstagram}
                  disabled={isBusy}
                >
                  Connect Instagram
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
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
