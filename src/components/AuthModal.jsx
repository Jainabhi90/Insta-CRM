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
    <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <Card
          className={`w-full max-w-md relative bg-white border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 ${
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                IL
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Continue With Instagram</CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Use your Instagram business account as the only login for InstaLead. If this account already exists, we refresh the saved token and open the same dashboard.
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
                <p className="text-sm text-blue-900" style={{ fontWeight: 600 }}>
                  Instagram-only access
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  We use the Instagram account identity returned by Meta to find or create your owner record, refresh the saved token, and open your dashboard.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                  What happens next
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>1. Instagram asks you to approve access for your business account.</li>
                  <li>2. We exchange the returned code on the backend and save the latest token.</li>
                  <li>3. If the Instagram account already exists, you go back into the same dashboard.</li>
                </ul>
              </div>

              <Button
                type="button"
                onClick={onConnectInstagram}
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
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
