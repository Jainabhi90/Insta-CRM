import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { exchangeGoogleCode } from "../api/auth/googleExchangeApi";
import { getGoogleRedirectUri } from "../lib/googleAuthConfig";

const GOOGLE_EXCHANGE_LOCK_PREFIX = "google_exchange_inflight:";

export default function GoogleCallback({ onComplete, onFailed }) {
  const [hasCode, setHasCode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    let isCancelled = false;

    if (code) {
      setHasCode(true);
      setErrorMessage("");

      const lockKey = `${GOOGLE_EXCHANGE_LOCK_PREFIX}${code}`;
      if (window.sessionStorage.getItem(lockKey) === "1") {
        if (!isCancelled) {
          setErrorMessage("This Google login callback was already processed. Please start login again.");
          setHasCode(false);
        }

        return () => {
          isCancelled = true;
        };
      }

      window.sessionStorage.setItem(lockKey, "1");

      const finishGoogleLogin = async () => {
        try {
          const sessionPayload = await exchangeGoogleCode({
            code,
            redirectUri: getGoogleRedirectUri(),
          });

          if (!isCancelled) {
            onComplete?.(sessionPayload);
          }
        } catch (error) {
          if (!isCancelled) {
            setErrorMessage(error?.message || "Google login could not be completed.");
            setHasCode(false);
          }
          window.sessionStorage.removeItem(lockKey);
        }
      };

      finishGoogleLogin();

      return () => {
        isCancelled = true;
      };
    }

    setHasCode(false);
    return undefined;
  }, []);

  if (!hasCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Google login failed</h2>
          <p className="mb-6 text-gray-600">
            {errorMessage || "No authorization code was found. Start login from the Google onboarding page."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => (window.location.href = "/google-auth")}>Go to Google Login</Button>
            <Button variant="outline" onClick={() => onFailed?.()}>
              Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-40 bg-slate-200" />
            <Skeleton className="h-3 w-24 bg-slate-100" />
          </div>
        </div>
        
        {/* Body Skeletons */}
        <div className="space-y-3 mb-6">
          <Skeleton className="h-3.5 w-full bg-slate-100" />
          <Skeleton className="h-3.5 w-[90%] bg-slate-100" />
          <Skeleton className="h-3.5 w-[80%] bg-slate-100" />
        </div>
        
        {/* Big Block Skeleton */}
        <Skeleton className="h-32 w-full rounded-xl bg-slate-50" />
        
        <div className="mt-8 flex justify-center">
          <div className="text-sm font-medium text-slate-400 animate-pulse flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing login...
          </div>
        </div>
      </div>
    </div>
  );
}
