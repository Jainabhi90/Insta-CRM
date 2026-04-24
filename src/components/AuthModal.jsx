import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Instagram, Loader2 } from "lucide-react";

export function AuthModal({
  onClose,
  onConnectInstagram,
  pendingAction,
  errorMessage,
}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const isConnecting = pendingAction === "instagram_auth";
  const isBusy = Boolean(pendingAction);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center">
        <Card
          className={`relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_40px_120px_-65px_rgba(15,23,42,0.85)] transition-all duration-300 ${
            hasAnimated ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isBusy}
          >
            <X className="w-5 h-5" />
          </button>

          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-theme-primary to-theme-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                IL
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Continue With Instagram</CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Connect another Instagram account to this workspace. If the account is already here, we will reopen it right away.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 pb-6 px-6">
            {errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
                <p className="text-sm text-blue-900 font-semibold">
                  One workspace, multiple accounts
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  This account will appear in your switcher so you can move between dashboards without repeating the setup every time.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-900 font-semibold">
                  What happens next
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>1. Instagram asks you to approve access for your business account.</li>
                  <li>2. We finish the connection and keep this account ready in your workspace.</li>
                  <li>3. If the Instagram account already exists, you go right back into the same dashboard.</li>
                </ul>
              </div>

              <Button
                type="button"
                onClick={onConnectInstagram}
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow-md bg-theme-primary hover:bg-theme-primary-hover text-white"
                disabled={isBusy}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Opening Instagram
                  </>
                ) : (
                  <>
                    <Instagram className="w-5 h-5" />
                    Login With Instagram
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
