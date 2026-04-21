import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getInstagramRedirectUri } from "../lib/instagramAuthConfig";

const INSTAGRAM_EXCHANGE_LOCK_PREFIX = "instagram_exchange_inflight:";

export default function InstagramCallback({ onComplete, onFailed }) {
  const [hasCode, setHasCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    let isCancelled = false;

    if (code && state) {
      setHasCode(true);
      setErrorMessage("");

      const lockKey = `${INSTAGRAM_EXCHANGE_LOCK_PREFIX}${code}`;
      if (window.sessionStorage.getItem(lockKey) === "1") {
        if (!isCancelled) {
          setErrorMessage("This Instagram login callback was already processed. Please start login again.");
          setHasCode(false);
        }

        return () => {
          isCancelled = true;
        };
      }

      window.sessionStorage.setItem(lockKey, "1");

      const finishInstagramLogin = async () => {
        try {
          const response = await fetch("/api/auth/instagram/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              code,
              state,
              redirectUri: getInstagramRedirectUri(),
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Instagram authentication failed");
          }

          const sessionPayload = await response.json();

          if (!isCancelled) {
            onComplete?.(sessionPayload);
          }
        } catch (error) {
          if (!isCancelled) {
            setErrorMessage(error?.message || "Instagram login could not be completed.");
            setHasCode(false);
          }
          window.sessionStorage.removeItem(lockKey);
        }
      };

      finishInstagramLogin();

      return () => {
        isCancelled = true;
      };
    }

    if (!code) {
      setHasCode(false);
      setErrorMessage("No authorization code was found. Start login from the Accounts page.");
    }

    return undefined;
  }, []);

  if (!hasCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Instagram login failed</h2>
          <p className="mb-6 text-gray-600">
            {errorMessage || "No authorization code was found. Start login from the Accounts page."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => (window.location.href = "/accounts")}>Go to Accounts</Button>
            <Button variant="outline" onClick={() => onFailed?.()}>
              Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Processing Instagram login...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
