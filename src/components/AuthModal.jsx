import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Instagram, Loader2 } from "lucide-react";

export function AuthModal({
  onClose,
  onLogin,
  onStartSignup,
  onModeChange,
  initialMode = "login",
  pendingAction,
  errorMessage,
}) {
  const [mode, setMode] = useState(initialMode);
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
  });

  const isSignupLoading = pendingAction === "signup_instagram";
  const isLoginLoading = pendingAction === "login";
  const isBusy = Boolean(pendingAction);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    onModeChange?.(nextMode);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    onLogin(loginForm);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    onStartSignup(signupForm);
  };

  useEffect(() => {
    setMode(initialMode);
    setLoginForm({
      identifier: "",
      password: "",
    });
    setSignupForm({
      email: "",
      password: "",
    });
  }, [initialMode]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <Card className="w-full max-w-md relative bg-white border border-gray-200 shadow-xl max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
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
            <CardTitle className="text-2xl font-bold">
              {mode === "login" ? "Welcome Back" : "Create Your InstaLead Account"}
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              {mode === "login"
                ? "Sign in with your email and password to open your dashboard."
                : "Choose your email and password first. Then we will send you to Instagram to finish connecting your business account."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-3 pb-6 px-6 overflow-y-auto flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
                style={{ fontWeight: 600 }}
                disabled={isBusy}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("signup")}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  mode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
                style={{ fontWeight: 600 }}
                disabled={isBusy}
              >
                Create Account
              </button>
            </div>

            {errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                {errorMessage}
              </div>
            ) : null}

            {mode === "login" ? (
              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier">Email</Label>
                    <Input
                      id="login-identifier"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.identifier}
                      onChange={(event) =>
                        setLoginForm((currentValue) => ({
                          ...currentValue,
                          identifier: event.target.value,
                        }))
                      }
                      disabled={isBusy}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((currentValue) => ({
                          ...currentValue,
                          password: event.target.value,
                        }))
                      }
                      disabled={isBusy}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  disabled={isBusy}
                >
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your Gmail or work email"
                      value={signupForm.email}
                      onChange={(event) =>
                        setSignupForm((currentValue) => ({
                          ...currentValue,
                          email: event.target.value,
                        }))
                      }
                      disabled={isBusy}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={signupForm.password}
                      onChange={(event) =>
                        setSignupForm((currentValue) => ({
                          ...currentValue,
                          password: event.target.value,
                        }))
                      }
                      disabled={isBusy}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
                    <p className="text-sm text-blue-900" style={{ fontWeight: 600 }}>
                      Signup flow
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      We save these credentials only across the Instagram redirect, then the backend combines your email, password, and Instagram code in one secure callback request.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  disabled={isBusy}
                >
                  {isSignupLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Opening Instagram
                    </>
                  ) : (
                    <>
                      <Instagram className="w-5 h-5" />
                      Continue With Instagram
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
