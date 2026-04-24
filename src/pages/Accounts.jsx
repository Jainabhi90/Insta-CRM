import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

function getStatusTone(connectionStatus) {
  if (connectionStatus === "connected") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (connectionStatus === "token_expired") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  return "border-slate-200 bg-slate-50 text-slate-700"
}

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
  const selectedAccount = accounts.find((account) => account.isSelected) || accounts[0] || null
  const connectedAccounts = accounts.filter((account) => account.connectionStatus === "connected").length

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0,rgba(219,234,254,0.45)_18%,#f8fafc_42%,#f8fafc_100%)] px-4 py-14">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_90px_-45px_rgba(37,99,235,0.55)] backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Workspace</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Choose your Instagram account</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
          Your Google workspace is ready. Pick a connected Instagram account to open its dashboard, or connect another account to this same workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 shadow-sm">
            <p className="font-semibold">{connectedAccounts} connected account{connectedAccounts === 1 ? "" : "s"}</p>
            <p className="mt-1 text-blue-700">
              {selectedAccount ? `${selectedAccount.instagramHandle || selectedAccount.name} opens by default` : "Connect Instagram to begin"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Google Workspace</p>
            <div className="mt-4 flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-blue-100 shadow-sm">
                <AvatarImage src={gowner?.avatarUrl || ""} alt={gowner?.name || gowner?.email || "Google workspace"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-400 text-white">
                  {getInitials(gowner?.name || gowner?.email || "GW")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-semibold text-slate-900">{gowner?.name || "Workspace not connected"}</p>
                <p className="text-sm text-slate-600">{gowner?.email || "Not connected"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#fb923c_100%)] p-[1px] shadow-[0_20px_60px_-40px_rgba(15,23,42,0.85)]">
            <div className="rounded-[27px] bg-slate-950/90 px-5 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/80">Selected Dashboard</p>
              {selectedAccount ? (
                <div className="mt-4 flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-white/15 shadow-sm">
                    <AvatarImage src={selectedAccount.avatarUrl || selectedAccount.profilePictureUrl || ""} alt={selectedAccount.name} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {getInitials(selectedAccount.name || selectedAccount.instagramHandle)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{selectedAccount.instagramHandle || selectedAccount.name}</p>
                    <p className="truncate text-sm text-slate-300">IG ID: {selectedAccount.instagramUserId || "Not available"}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
                      {getStatusLabel(selectedAccount.connectionStatus)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">Connect an Instagram account to unlock the dashboard.</p>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
          <span className="font-semibold text-slate-900">Tip:</span> The selected card below is the one that will open when you click <span className="font-semibold text-slate-900">Open Selected Dashboard</span>.
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                key={account.id}
                className={`relative overflow-hidden rounded-[28px] border-2 p-5 shadow-sm transition-all duration-200 ${
                  account.isSelected
                    ? "border-blue-500 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(255,255,255,0.98))] shadow-[0_24px_60px_-40px_rgba(37,99,235,0.95)]"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_24px_60px_-48px_rgba(15,23,42,0.45)]"
                }`}
              >
                {account.isSelected ? (
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-orange-400" />
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className={`h-14 w-14 border shadow-sm ${account.isSelected ? "border-blue-200" : "border-slate-200"}`}>
                      <AvatarImage src={account.avatarUrl || account.profilePictureUrl || ""} alt={account.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-500 text-white">
                        {getInitials(account.name || account.instagramHandle)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{account.instagramHandle || account.name}</p>
                      <p className="text-sm text-gray-500">IG ID: {account.instagramUserId || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(account.connectionStatus)}`}>
                      {getStatusLabel(account.connectionStatus)}
                    </span>
                    {account.isSelected ? (
                      <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        Selected
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${account.isSelected ? "bg-white/80 text-slate-700" : "bg-slate-50 text-slate-600"}`}>
                  <p className="font-medium text-slate-800">Account type: {account.accountType || "UNKNOWN"}</p>
                  <p className="mt-2">
                    Token expiry: {account.tokenExpiresAt ? new Date(account.tokenExpiresAt).toLocaleString() : "Not available"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className={`${
                      account.isSelected
                        ? "bg-slate-900 hover:bg-slate-800"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => onSelectAccount?.(account.id)}
                    disabled={isBusy || account.connectionStatus !== "connected"}
                  >
                    {account.isSelected ? "Open This Dashboard" : "Make Active + Open"}
                  </Button>
                  {account.connectionStatus !== "connected" ? (
                    <Button variant="outline" onClick={onConnectInstagram} disabled={isBusy}>
                      Reconnect Instagram
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">No Instagram accounts connected yet</h2>
              <p className="mt-2 text-sm text-gray-600">
                Connect your first Instagram business account to unlock the dashboard, comments, inbox, and automation setup.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-slate-900 hover:bg-slate-800" onClick={onOpenDashboard} disabled={isBusy || !selectedAccount}>
            Open Selected Dashboard
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onConnectInstagram} disabled={isBusy}>
            {accounts.length > 0 ? "Connect Another Instagram" : "Connect Instagram"}
          </Button>
          <Button variant="ghost" onClick={onBackToHome} disabled={isBusy}>
            Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
