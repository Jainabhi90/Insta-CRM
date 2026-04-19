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

export default function Accounts({
  gowner,
  accounts = [],
  pendingAction,
  onConnectInstagram,
  onOpenDashboard,
  onSelectAccount,
  onBackToHome,
}) {
  const isBusy = Boolean(pendingAction)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Choose your Instagram account</h1>
        <p className="mt-3 text-gray-600">
          Your Google workspace is ready. Pick a connected Instagram account to open its dashboard, or connect another account to this same workspace.
        </p>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Google workspace</p>
          <p>{gowner?.email || "Not connected"}</p>
          {gowner?.name ? <p className="mt-1 text-blue-700">{gowner.name}</p> : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-gray-200">
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
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(account.connectionStatus)}`}>
                    {account.connectionStatus === "token_expired" ? "Reconnect soon" : account.connectionStatus}
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  <p>Account type: {account.accountType || "UNKNOWN"}</p>
                  <p className="mt-1">
                    Token expiry: {account.tokenExpiresAt ? new Date(account.tokenExpiresAt).toLocaleString() : "Not available"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onSelectAccount?.(account.id)}
                    disabled={isBusy}
                  >
                    Open Dashboard
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
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onConnectInstagram} disabled={isBusy}>
            {accounts.length > 0 ? "Connect Another Instagram" : "Connect Instagram"}
          </Button>
          {accounts.length > 0 ? (
            <Button variant="outline" onClick={onOpenDashboard} disabled={isBusy}>
              Open Selected Dashboard
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onBackToHome} disabled={isBusy}>
            Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
