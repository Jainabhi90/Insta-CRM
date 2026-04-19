import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { exchangeGoogleCode } from "../api/auth/googleExchangeApi";
import { getGoogleRedirectUri } from "../lib/googleAuthConfig";

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
        }
      };

      finishGoogleLogin();

      return () => {
        isCancelled = true;
      };
    }

    setHasCode(false);
    return undefined;
  }, [onComplete, onFailed]);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Processing login...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
