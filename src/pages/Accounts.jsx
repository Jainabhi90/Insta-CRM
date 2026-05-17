import { useState, useEffect, useRef } from "react";
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

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function LoadingOverlay() {
  const [percent, setPercent] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 7000; // Match the actual ~7s loading time

  useEffect(() => {
    function tick(now) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      // Smooth curve that reaches 99% over the 7 seconds
      const progress = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - progress, 2);
      setPercent(Math.floor(eased * 99));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#ffffff",
      animation: "ilFadeIn 0.25s ease",
    }}>
      <style>{`
        @keyframes ilFadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Circular fluid container */}
      <div style={{ position: "relative", width: 160, height: 160, marginBottom: 48, borderRadius: "50%", overflow: "hidden", background: "#ffffff" }}>
        
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="wave-mask">
              <g style={{ transform: `translateY(${160 - (percent / 100) * 180}px)`, transition: 'transform 0.1s linear' }}>
                <path d="M 0 15 Q 40 -15 80 15 T 160 15 T 240 15 T 320 15 L 320 200 L 0 200 Z" fill="white">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="-160 0" dur="1.5s" repeatCount="indefinite" />
                </path>
              </g>
            </mask>
          </defs>

          {/* Background outlined text */}
          <text x="80" y="80" fill="transparent" stroke="#001d36" strokeWidth="2.5" textAnchor="middle" dominantBaseline="central" fontSize="56" fontWeight="600" fontFamily="'Inter', sans-serif" letterSpacing="-1">
            {percent}
          </text>

          {/* Liquid fill */}
          <rect x="0" y="0" width="160" height="160" fill="#001d36" mask="url(#wave-mask)" />
          
          {/* White solid text */}
          <text x="80" y="80" fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize="56" fontWeight="600" fontFamily="'Inter', sans-serif" letterSpacing="-1" mask="url(#wave-mask)">
            {percent}
          </text>
        </svg>
      </div>

      {/* Bottom progress bar */}
      <div style={{
        width: 220,
        height: 14,
        borderRadius: 99,
        border: "2px solid #001d36",
        background: "#ffffff",
        padding: 2,
        display: "flex",
      }}>
        <div style={{
          height: "100%",
          width: `${Math.max(3, percent)}%`,
          background: "#001d36",
          borderRadius: 99,
          transition: "width 0.1s linear",
        }} />
      </div>
    </div>
  );
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
  const isPreview = new URLSearchParams(window.location.search).get("previewLoading") === "1";
  const [loadingId, setLoadingId] = useState(isPreview ? "preview" : "");
  const isBusy = Boolean(pendingAction)

  return (
    <>
      {loadingId && <LoadingOverlay />}

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
                      onClick={() => {
                        setLoadingId(account.id);
                        onSelectAccount?.(account.id);
                      }}
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
    </>
  );
}
