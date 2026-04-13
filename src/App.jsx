import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { DarkLandingPage } from "./components/DarkLandingPage";
import { PricingPage } from "./components/PricingPage";
import { AuthModal } from "./components/AuthModal";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { LeadCenter } from "./components/LeadCenter";
import { Automations } from "./components/Automations";
import { PostPerformance } from "./components/PostPerformance";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { readInstagramCallbackParams } from "./lib/instagramCallback";
import { validateAccountCredentials, validateLoginCredentials } from "./lib/authValidation";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DeleteData from "./pages/DeleteData";
import {
  loginWithCredentials,
  logoutSession,
  restoreExistingSession,
  startInstagramSignup,
} from "./services/authSessionService";
import {
  finishInstagramLogin,
  loadAuthenticatedWorkspace,
} from "./services/dashboardWorkspaceService";

const THEME_STORAGE_KEY = "instalead.theme";

function hasActiveSession(session) {
  return Boolean(session?.owner);
}

function getCurrentRoute() {
  if (typeof window === "undefined") {
    return { page: "landing", search: "" };
  }

  const path = window.location.pathname;

  if (path === "/pricing") {
    return { page: "pricing", search: window.location.search };
  }

  if (path === "/dashboard") {
    return { page: "dashboard", search: window.location.search };
  }

  if (path === "/auth/callback") {
    return {
      page: "dashboard",
      search: window.location.search,
    };
  }

  if (path === "/privacy") {
    return { page: "privacy", search: window.location.search };
  }

  if (path === "/terms") {
    return { page: "terms", search: window.location.search };
  }

  if (path === "/delete-data") {
    return { page: "delete-data", search: window.location.search };
  }

  return { page: "landing", search: window.location.search };
}

function getStoredTheme() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark";
}

export default function App() {
  const [route, setRoute] = useState(() => getCurrentRoute());
  const [session, setSession] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [workspaceWarnings, setWorkspaceWarnings] = useState([]);
  const [activeView, setActiveView] = useState("leads");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isDarkTheme, setIsDarkTheme] = useState(() => getStoredTheme());
  const [pendingAction, setPendingAction] = useState("");
  const [authError, setAuthError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const dashboardLoadSequence = useRef(0);

  const navigate = (path, options = {}) => {
    const historyMethod = options.replace ? "replaceState" : "pushState";
    window.history[historyMethod]({}, "", path);
    setRoute(getCurrentRoute());
  };

  const closeAuthModal = () => {
    setAuthError("");
    setShowAuthModal(false);
  };

  const openSignupModal = () => {
    if (pendingAction) {
      return;
    }

    if (hasActiveSession(session)) {
      navigate("/dashboard");
      return;
    }

    setAuthMode("signup");
    setAuthError("");
    setDashboardError("");
    setShowAuthModal(true);
  };

  const hydrateDashboard = async (search = window.location.search) => {
    const requestId = dashboardLoadSequence.current + 1;
    dashboardLoadSequence.current = requestId;
    setIsDashboardLoading(true);
    setDashboardError("");

    try {
      const callbackParams = readInstagramCallbackParams(search);

      if (callbackParams) {
        await finishInstagramLogin(callbackParams);
        window.history.replaceState({}, "", "/dashboard");
        setRoute(getCurrentRoute());
      }

      const result = await loadAuthenticatedWorkspace();

      if (requestId !== dashboardLoadSequence.current) {
        return;
      }

      setSession(result.session);
      setWorkspace(result.workspace);
      setWorkspaceWarnings(result.warnings || []);
      setShowAuthModal(false);
      setAuthError("");
      setDashboardError(!result.session && result.warnings?.length ? result.warnings[0] : "");

      if (!result.session) {
        setActiveView("leads");
      }
    } catch (error) {
      if (requestId !== dashboardLoadSequence.current) {
        return;
      }

      setSession(null);
      setWorkspace(null);
      setWorkspaceWarnings([]);
      setDashboardError(error.message || "Unable to open your dashboard right now.");

      if (readInstagramCallbackParams(search)) {
        window.history.replaceState({}, "", "/dashboard");
        setRoute(getCurrentRoute());
      }
    } finally {
      if (requestId === dashboardLoadSequence.current) {
        setIsDashboardLoading(false);
        setHasRestoredSession(true);
      }
    }
  };

  const openLoginModal = () => {
    if (pendingAction) {
      return;
    }

    if (hasActiveSession(session)) {
      navigate("/dashboard");
      return;
    }

    setAuthMode("login");
    setAuthError("");
    setDashboardError("");
    setShowAuthModal(true);
  };

  const handleGetStarted = () => {
    if (pendingAction) {
      return;
    }

    if (hasActiveSession(session)) {
      navigate("/dashboard");
      return;
    }

    openSignupModal();
  };

  const handleLogin = async (credentials) => {
    if (pendingAction) {
      return;
    }

    const validationError = validateLoginCredentials(credentials);

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setPendingAction("login");
    setAuthError("");

    try {
      const result = await loginWithCredentials(credentials);

      setShowAuthModal(false);

      if (result.session) {
        setSession(result.session);
      }

      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard");
      } else {
        await hydrateDashboard(window.location.search);
      }
    } catch (error) {
      setAuthError(error.message || "Unable to sign in.");
    } finally {
      setPendingAction("");
    }
  };

  const handleStartSignup = async (credentials) => {
    if (pendingAction) {
      return;
    }

    const validationError = validateAccountCredentials(credentials);

    if (validationError) {
      setAuthError(validationError);
      return;
    }

    setPendingAction("signup_instagram");
    setAuthError("");
    setDashboardError("");

    try {
      const result = await startInstagramSignup(credentials);

      if (result.type === "redirect") {
        setShowAuthModal(false);
        window.location.assign(result.url);
        return;
      }

      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard");
      } else {
        await hydrateDashboard(window.location.search);
      }
    } catch (error) {
      setAuthMode("signup");
      setAuthError(error.message || "Unable to connect Instagram right now.");
      setShowAuthModal(true);
    } finally {
      setPendingAction("");
    }
  };

  const handleLogout = async () => {
    if (pendingAction) {
      return;
    }

    setPendingAction("logout");
    setSession(null);
    setWorkspace(null);
    setWorkspaceWarnings([]);
    setActiveView("leads");
    setShowAuthModal(false);
    setAuthError("");
    setDashboardError("");

    try {
      await logoutSession();
    } finally {
      setPendingAction("");
      navigate("/");
    }
  };

  const handleGoToPricing = () => {
    navigate("/pricing");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleToggleTheme = () => {
    setIsDarkTheme((previousTheme) => !previousTheme);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    document.documentElement.style.colorScheme = isDarkTheme ? "dark" : "light";
  }, [isDarkTheme]);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      try {
        const restoredSession = await restoreExistingSession();

        if (!isActive) {
          return;
        }

        setSession(restoredSession);
      } catch (error) {
        if (isActive) {
          setDashboardError(error.message || "Unable to restore your account.");
        }
      } finally {
        if (isActive) {
          setHasRestoredSession(true);
        }
      }
    };

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (route.page === "dashboard") {
      hydrateDashboard(route.search);
    }
  }, [route.page, route.search]);

  if (route.page !== "dashboard") {
    return (
      <>
        {route.page === "privacy" ? (
          <Privacy />
        ) : route.page === "terms" ? (
          <Terms />
        ) : route.page === "delete-data" ? (
          <DeleteData />
        ) : route.page === "pricing" ? (
          <PricingPage
            onGetStarted={handleGetStarted}
            onBackToHome={handleBackToHome}
            onLogin={openLoginModal}
            onCreateAccount={openSignupModal}
          />
        ) : isDarkTheme ? (
          <DarkLandingPage
            onGetStarted={handleGetStarted}
            onLogin={openLoginModal}
            onCreateAccount={openSignupModal}
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          <LandingPage
            onGetStarted={handleGetStarted}
            onLogin={openLoginModal}
            onCreateAccount={openSignupModal}
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
          />
        )}

        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            onLogin={handleLogin}
            onStartSignup={handleStartSignup}
            initialMode={authMode}
            pendingAction={pendingAction}
            errorMessage={authError}
            onModeChange={() => setAuthError("")}
          />
        )}
      </>
    );
  }

  if (isDashboardLoading || (!hasRestoredSession && !session && !workspace)) {
    return <DashboardLoadingState />;
  }

  if (!session || !workspace) {
    return (
      <>
        <DashboardAccessGate
          errorMessage={dashboardError}
          onBackHome={handleBackToHome}
          onLogin={openLoginModal}
          onCreateAccount={openSignupModal}
          pendingAction={pendingAction}
        />
        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            onLogin={handleLogin}
            onStartSignup={handleStartSignup}
            initialMode={authMode}
            pendingAction={pendingAction}
            errorMessage={authError || dashboardError}
            onModeChange={() => {
              setAuthError("");
              setDashboardError("");
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onGoHome={handleBackToHome}
        onLogout={handleLogout}
        owner={session.owner}
      />
      <main className="flex-1 overflow-y-auto">
        {workspaceWarnings.length > 0 ? <DashboardNotices warnings={workspaceWarnings} /> : null}
        {activeView === "leads" && (
          <LeadCenter summary={workspace.leadSummary} leads={workspace.leads} />
        )}
        {activeView === "automations" && (
          <Automations
            summary={workspace.automationSummary}
            initialTemplates={workspace.automations}
            tip={workspace.automationTip}
          />
        )}
        {activeView === "performance" && (
          <PostPerformance
            summary={workspace.performanceSummary}
            posts={workspace.posts}
            insight={workspace.performanceInsight}
          />
        )}
      </main>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin text-[#2563eb]" />
        <span style={{ fontWeight: 500 }}>Loading your dashboard...</span>
      </div>
    </div>
  );
}

function DashboardAccessGate({ errorMessage, onBackHome, onLogin, onCreateAccount, pendingAction }) {
  const isConnecting = pendingAction === "signup_instagram";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border border-gray-200 shadow-lg bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
              IL
            </div>
          </div>
          <CardTitle className="text-2xl" style={{ fontWeight: 700 }}>
            Access Your Dashboard
          </CardTitle>
          <CardDescription className="text-gray-500">
            Returning users can sign in with email and password. New users should create their account first, then connect Instagram during signup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
          <Button
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
            onClick={onCreateAccount}
            disabled={Boolean(pendingAction)}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opening Instagram
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={onLogin} disabled={Boolean(pendingAction)}>
            Sign In
          </Button>
          <Button variant="outline" className="w-full" onClick={onBackHome} disabled={Boolean(pendingAction)}>
            Back To Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardNotices({ warnings }) {
  return (
    <div className="p-6 pb-0">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-amber-900" style={{ fontWeight: 600 }}>
              Dashboard notices
            </p>
            <div className="space-y-2">
              {warnings.map((warning) => (
                <p key={warning} className="text-sm text-amber-800">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
