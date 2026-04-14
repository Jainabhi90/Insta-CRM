import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Instagram, Loader2 } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username cannot exceed 32 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
});

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
  
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" }
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", password: "" }
  });

  const isSignupLoading = pendingAction === "signup_instagram";
  const isLoginLoading = pendingAction === "login";
  const isBusy = Boolean(pendingAction);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    onModeChange?.(nextMode);
    resetLogin();
    resetSignup();
  };

  const onValidLogin = (data) => {
    onLogin(data);
  };

  const onValidSignup = (data) => {
    onStartSignup(data);
  };

  useEffect(() => {
    setMode(initialMode);
    resetLogin();
    resetSignup();
  }, [initialMode, resetLogin, resetSignup]);

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
                ? "Sign in with your username and password to open your dashboard."
                : "Choose your username and password first. Then we will send you to Instagram to finish connecting your business account."}
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
              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit(onValidLogin)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier">Username</Label>
                    <Input
                      id="login-identifier"
                      type="text"
                      placeholder="Enter your username"
                      {...loginRegister("identifier")}
                      disabled={isBusy}
                      autoComplete="username"
                    />
                    {loginErrors.identifier && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{loginErrors.identifier.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      {...loginRegister("password")}
                      disabled={isBusy}
                      autoComplete="current-password"
                    />
                    {loginErrors.password && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{loginErrors.password.message}</p>
                    )}
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
              <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit(onValidSignup)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose your username"
                      {...signupRegister("username")}
                      disabled={isBusy}
                      autoComplete="username"
                    />
                    {signupErrors.username && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{signupErrors.username.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password"
                      {...signupRegister("password")}
                      disabled={isBusy}
                      autoComplete="new-password"
                    />
                    {signupErrors.password && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{signupErrors.password.message}</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
                    <p className="text-sm text-blue-900" style={{ fontWeight: 600 }}>
                      Signup flow
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      We save these credentials only across the Instagram redirect, then the backend combines them with the OAuth code in one secure callback request.
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
