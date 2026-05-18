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
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4F5] px-4">
      <style>{`
        @keyframes stretch {
          0%, 100% { height: 60px; transform: scaleY(1) translateY(0); }
          50% { height: 110px; transform: scaleY(1.05) translateY(-5px); }
        }
        @keyframes walk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-15deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-4px) rotate(15deg); }
        }
        @keyframes blink {
          0%, 96%, 98% { transform: scaleY(1); }
          97%, 100% { transform: scaleY(0.1); }
        }
        @keyframes armLeft {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-30deg); }
        }
        @keyframes armRight {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(30deg); }
        }
      `}</style>
      
      <div className="w-full max-w-md mx-auto relative flex flex-col min-h-screen py-8">
        
        {/* Top Header Row */}
        <div className="flex items-center gap-4 w-full">
          <div className="h-12 flex-1 rounded-2xl bg-slate-200/60 animate-pulse"></div>
          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200/60 animate-pulse"></div>
        </div>

        {/* Center Character Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="relative flex flex-col items-center justify-end h-40 w-32">
            
            {/* Character Body (stretches up and down) */}
            <div className="absolute bottom-[4px] flex flex-col items-center" style={{ animation: 'stretch 1.2s ease-in-out infinite' }}>
              <div className="w-[46px] h-full min-h-[60px] bg-white border-[2.5px] border-slate-800 rounded-full relative z-10 flex flex-col items-center pt-3 shadow-sm">
                {/* Eyes */}
                <div className="flex gap-2" style={{ animation: 'blink 4s infinite' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                </div>
                {/* Mouth */}
                <div className="w-2.5 h-1.5 rounded-b-full bg-slate-800 mt-1"></div>
                
                {/* Arms */}
                <div className="absolute -left-1.5 top-8 w-2 h-5 rounded-full border-[2px] border-slate-800 bg-white origin-top" style={{ animation: 'armLeft 1.2s ease-in-out infinite' }}></div>
                <div className="absolute -right-1.5 top-8 w-2 h-5 rounded-full border-[2px] border-slate-800 bg-white origin-top" style={{ animation: 'armRight 1.2s ease-in-out infinite' }}></div>
              </div>
            </div>
            
            {/* Shoes */}
            <div className="absolute bottom-[1px] flex gap-2 z-20">
              <div className="w-[22px] h-[14px] bg-[#0066FF] border-[2.5px] border-slate-800 rounded-t-xl rounded-b-sm" style={{ animation: 'walk 1.2s ease-in-out infinite' }}></div>
              <div className="w-[22px] h-[14px] bg-[#0066FF] border-[2.5px] border-slate-800 rounded-t-xl rounded-b-sm" style={{ animation: 'walk 1.2s ease-in-out infinite', animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Floor Line */}
            <div className="absolute bottom-0 w-24 h-[2.5px] bg-slate-800 rounded-full"></div>
          </div>
          
          <div className="mt-8 font-medium text-slate-400 animate-pulse text-sm">
            Processing login...
          </div>
        </div>

        {/* Bottom Skeleton Rows */}
        <div className="w-full mt-auto pb-8">
          <div className="flex justify-between px-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={`r1-${i}`} className="w-[48px] h-[48px] rounded-full bg-slate-200/60 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
