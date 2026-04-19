import { useEffect, useRef, useState } from "react";
import { Loader2, LogOut, Repeat2 } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { DarkLandingPage } from "./components/DarkLandingPage";
import { GoogleLandingPage } from "./components/GoogleLandingPage";
import { PricingPage } from "./components/PricingPage";
import { AuthModal } from "./components/AuthModal";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { LeadCenter } from "./components/LeadCenter";
import { CommentsInbox } from "./components/CommentsInbox";
import { DmInbox } from "./components/DmInbox";
import { Automations } from "./components/Automations";
import { PostPerformance } from "./components/PostPerformance";
import { InstagramBrandMark } from "./components/InstagramBrandMark";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { readInstagramCallbackParams } from "./lib/instagramCallback";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DeleteData from "./pages/DeleteData";
import GoogleCallback from "./pages/GoogleCallback";
import Accounts from "./pages/Accounts";
import { sendInstagramReply } from "./api/instagram/replyApi";
import { getInstagramComments } from "./api/instagram/commentsApi";
import { getInstagramInbox } from "./api/instagram/inboxApi";
import { createAutomation, updateAutomation } from "./api/automations/automationApi";
import {
  logoutSession,
  restoreExistingSession,
  selectWorkspaceAccount,
  startInstagramLogin,
} from "./services/authSessionService";
import {
  finishInstagramLogin,
  loadAuthenticatedWorkspace,
} from "./services/dashboardWorkspaceService";
import { ensureDemoPreviewSession } from "./services/demoSessionService";
import { buildCommentWorkspace } from "./adapters/commentAdapter";
import { buildInboxWorkspace } from "./adapters/inboxAdapter";
import { normalizeSession } from "./adapters/ownerAdapter";
import { rememberInstagramAccount } from "./lib/instagramAccountCache";

const THEME_STORAGE_KEY = "instalead.theme";
const GOOGLE_AUTH_COMPLETED_KEY = "google_login_completed";

function hasCompletedGoogleLogin() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(GOOGLE_AUTH_COMPLETED_KEY) === "true";
}

function hasActiveSession(session) {
  return Boolean(session?.owner);
}

function hasWorkspaceSession(session) {
  return Boolean(session?.gowner);
}

function getCurrentRoute() {
  if (typeof window === "undefined") {
    return { page: "google-landing", search: "" };
  }

  const path = window.location.pathname;

  if (path === "/") {
    return {
      page: "google-landing",
      search: window.location.search,
    };
  }

  if (path === "/insta-landing") {
    return { page: "landing", search: window.location.search };
  }

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

  if (path === "/google-auth") {
    return { page: "google-landing", search: window.location.search };
  }

  if (path === "/auth/google/callback") {
    return { page: "google-callback", search: window.location.search };
  }

  if (path === "/accounts") {
    return { page: "accounts", search: window.location.search };
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
  const [hasGoogleLogin, setHasGoogleLogin] = useState(() => hasCompletedGoogleLogin());
  const [session, setSession] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [activeView, setActiveView] = useState("leads");
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  const openInstagramModal = () => {
    if (pendingAction) {
      return;
    }

    if (hasActiveSession(session)) {
      navigate("/dashboard");
      return;
    }

    if (!hasWorkspaceSession(session)) {
      navigate("/google-auth");
      return;
    }

    setAuthError("");
    setDashboardError("");
    setShowAuthModal(true);
  };

  const openSignupModal = () => {
    openInstagramModal();
  };

  const applyWorkspaceResult = (result) => {
    setSession(result.session);
    setWorkspace(result.workspace);
    setShowAuthModal(false);
    setAuthError("");
    setDashboardError(!result.session && result.warnings?.length ? result.warnings[0] : "");

    if (!result.session) {
      setActiveView("leads");
      return;
    }

    rememberInstagramAccount(result.session.owner);
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

      applyWorkspaceResult(result);
    } catch (error) {
      if (requestId !== dashboardLoadSequence.current) {
        return;
      }

      setSession(null);
      setWorkspace(null);
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

  const refreshWorkspace = async () => {
    const result = await loadAuthenticatedWorkspace();
    applyWorkspaceResult(result);
    return result;
  };

  const openLoginModal = () => {
    openInstagramModal();
  };

  const handleGetStarted = () => {
    if (pendingAction) {
      return;
    }

    if (hasActiveSession(session)) {
      navigate("/dashboard");
      return;
    }

    if (hasWorkspaceSession(session)) {
      navigate("/accounts");
      return;
    }

    navigate("/google-auth");
  };

  const handleInstagramAuth = async (options) => {
    if (pendingAction) {
      return;
    }

    setPendingAction("instagram_auth");
    setAuthError("");
    setDashboardError("");

    try {
      const result = await startInstagramLogin(options);

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
    setActiveView("leads");
    setShowAuthModal(false);
    setAuthError("");
    setDashboardError("");

    try {
      await logoutSession();
    } finally {
      setPendingAction("");
      navigate("/insta-landing");
    }
  };

  const handleSwitchAccount = async () => {
    if (pendingAction) {
      return;
    }

    navigate("/accounts");
  };

  const handleRefreshInstagram = async () => {
    await refreshWorkspace();
  };

  const handleRefreshComments = async () => {
    const commentPayload = await getInstagramComments();
    const nextCommentsWorkspace = buildCommentWorkspace(commentPayload);

    setWorkspace((currentWorkspace) =>
      currentWorkspace
        ? {
            ...currentWorkspace,
            comments: nextCommentsWorkspace.comments,
            commentSummary: nextCommentsWorkspace.summary,
          }
        : currentWorkspace,
    );

    return nextCommentsWorkspace;
  };

  const handleRefreshInbox = async () => {
    const inboxPayload = await getInstagramInbox();
    const nextInboxWorkspace = buildInboxWorkspace(inboxPayload);

    setWorkspace((currentWorkspace) =>
      currentWorkspace
        ? {
            ...currentWorkspace,
            inbox: nextInboxWorkspace.conversations,
            inboxSummary: nextInboxWorkspace.summary,
          }
        : currentWorkspace,
    );

    return nextInboxWorkspace;
  };

  const handleSendInstagramReply = async (payload) => {
    const result = await sendInstagramReply(payload);
    await refreshWorkspace();
    return result;
  };

  const handleCreateAutomation = async (payload) => {
    const response = await createAutomation(payload);
    const createdAutomation = response?.automation || response;

    setWorkspace((currentWorkspace) =>
      currentWorkspace
        ? {
            ...currentWorkspace,
            automations: [...(currentWorkspace.automations || []), createdAutomation],
          }
        : currentWorkspace,
    );

    return createdAutomation;
  };

  const handleToggleAutomation = async (automationId, enabled) => {
    const response = await updateAutomation(automationId, {
      enabled,
      active: enabled,
    });

    const updatedAutomation = response?.automation || response;

    setWorkspace((currentWorkspace) =>
      currentWorkspace
        ? {
            ...currentWorkspace,
            automations: (currentWorkspace.automations || []).map((automation) =>
              automation.id === automationId || automation.automation_id === automationId
                ? updatedAutomation
                : automation,
            ),
          }
        : currentWorkspace,
    );

    return updatedAutomation;
  };

  const handleGoToPricing = () => {
    navigate("/pricing");
  };

  const handleGoToGoogleLanding = () => {
    navigate("/google-auth");
  };

  const handleLandingLogout = async () => {
    if (pendingAction) {
      return;
    }

    setPendingAction("logout");
    setSession(null);
    setWorkspace(null);
    setActiveView("leads");
    setShowAuthModal(false);
    setAuthError("");
    setDashboardError("");
    window.localStorage.removeItem(GOOGLE_AUTH_COMPLETED_KEY);
    setHasGoogleLogin(false);

    try {
      await logoutSession();
    } finally {
      setPendingAction("");
      navigate("/google-auth");
    }
  };

  const handleGoogleWorkspaceReady = (sessionPayload) => {
    const normalizedSession = normalizeSession(sessionPayload);
    window.localStorage.setItem(GOOGLE_AUTH_COMPLETED_KEY, "true");
    setHasGoogleLogin(Boolean(normalizedSession?.gowner));
    setSession(normalizedSession);
    setWorkspace(null);
    setDashboardError("");
    navigate("/accounts", { replace: true });
  };

  const handleGoogleCallbackFailed = () => {
    navigate("/google-auth", { replace: true });
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
        if (restoredSession?.gowner) {
          setHasGoogleLogin(true);
        }
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
    let isMounted = true;

    const loadDashboardRoute = async () => {
      if (route.page !== "dashboard") {
        return;
      }

      const params = new URLSearchParams(route.search || "");

      if (params.get("devPreview") === "1") {
        ensureDemoPreviewSession();
      }

      if (!session?.owner && hasWorkspaceSession(session)) {
        navigate("/accounts", { replace: true });
        return;
      }

      if (isMounted) {
        await hydrateDashboard(route.search);
      }
    };

    loadDashboardRoute();

    return () => {
      isMounted = false;
    };
  }, [route.page, route.search, session]);

  const handleSelectWorkspaceAccount = async (iownerId) => {
    if (pendingAction) {
      return;
    }

    setPendingAction("select_account");
    setDashboardError("");

    try {
      const nextSession = await selectWorkspaceAccount(iownerId);
      setSession(nextSession);
      setHasGoogleLogin(Boolean(nextSession?.gowner));
      navigate("/dashboard", { replace: route.page === "dashboard" });
      await hydrateDashboard("");
    } catch (error) {
      setDashboardError(error?.message || "Unable to open that Instagram account right now.");
    } finally {
      setPendingAction("");
    }
  };

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
        ) : route.page === "google-landing" ? (
          <GoogleLandingPage />
        ) : route.page === "google-callback" ? (
          <GoogleCallback
            onComplete={handleGoogleWorkspaceReady}
            onFailed={handleGoogleCallbackFailed}
          />
        ) : route.page === "accounts" ? (
          <Accounts
<<<<<<< HEAD
            gowner={session?.gowner}
            accounts={session?.accounts || []}
            pendingAction={pendingAction}
            onConnectInstagram={openInstagramModal}
            onOpenDashboard={() => {
              if (session?.owner) {
                navigate("/dashboard");
                return;
              }

              const fallbackAccount = session?.accounts?.[0]?.id || "";

              if (fallbackAccount) {
                handleSelectWorkspaceAccount(fallbackAccount);
              }
            }}
            onSelectAccount={handleSelectWorkspaceAccount}
=======
            onConnectInstagram={handleInstagramAuth}
            onOpenDashboard={() => navigate("/dashboard")}
>>>>>>> 986d0ff5e81c81cef24e0e278adf51be8570bbb4
            onBackToHome={handleBackToHome}
          />
        ) : isDarkTheme ? (
          <DarkLandingPage
            onGetStarted={handleGetStarted}
            onLogin={openLoginModal}
            onCreateAccount={openSignupModal}
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
            onGoToGoogleLanding={handleGoToGoogleLanding}
            onLogout={handleLandingLogout}
            isGoogleAuthenticated={hasGoogleLogin}
          />
        ) : (
          <LandingPage
            onGetStarted={handleGetStarted}
            onLogin={openLoginModal}
            onCreateAccount={openSignupModal}
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
            onGoToGoogleLanding={handleGoToGoogleLanding}
            onLogout={handleLandingLogout}
            isGoogleAuthenticated={hasGoogleLogin}
          />
        )}

        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            onConnectInstagram={handleInstagramAuth}
            pendingAction={pendingAction}
            errorMessage={authError}
          />
        )}
      </>
    );
  }

  if (isDashboardLoading || (!hasRestoredSession && !session && !workspace)) {
    return <DashboardLoadingState />;
  }

  if (!session || !workspace) {
    if (session?.gowner && !session?.owner) {
      return (
        <Accounts
          gowner={session.gowner}
          accounts={session.accounts || []}
          pendingAction={pendingAction}
          onConnectInstagram={openInstagramModal}
          onOpenDashboard={() => {
            const fallbackAccount = session?.accounts?.[0]?.id || "";

            if (fallbackAccount) {
              handleSelectWorkspaceAccount(fallbackAccount);
            }
          }}
          onSelectAccount={handleSelectWorkspaceAccount}
          onBackToHome={handleBackToHome}
        />
      )
    }

    return (
      <>
        <DashboardAccessGate
          errorMessage={dashboardError}
          onBackHome={handleBackToHome}
          onConnectInstagram={openInstagramModal}
          pendingAction={pendingAction}
        />
        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            onConnectInstagram={handleInstagramAuth}
            pendingAction={pendingAction}
            errorMessage={authError || dashboardError}
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
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="fixed right-4 top-[22px] z-40">
          <DashboardAccountMenu
            gowner={session.gowner}
            owner={session.owner}
            accounts={session.accounts || []}
            pendingAction={pendingAction}
            onSwitchAccount={handleSwitchAccount}
            onSelectAccount={handleSelectWorkspaceAccount}
            onConnectInstagram={handleInstagramAuth}
            onLogout={handleLogout}
          />
        </div>
        {activeView === "leads" && (
          <LeadCenter
            owner={session.owner}
            summary={workspace.leadSummary}
            leads={workspace.leads}
            comments={workspace.comments}
            commentSummary={workspace.commentSummary}
            inbox={workspace.inbox}
            inboxSummary={workspace.inboxSummary}
            onRefreshInstagram={handleRefreshInstagram}
            onSendReply={handleSendInstagramReply}
          />
        )}
        {activeView === "dm-inbox" && (
          <DmInbox
            conversations={workspace.inbox || []}
            summary={workspace.inboxSummary}
            onRefresh={handleRefreshInbox}
            onSendReply={handleSendInstagramReply}
          />
        )}
        {activeView === "comments" && (
          <CommentsInbox
            comments={workspace.comments || []}
            summary={workspace.commentSummary}
            onRefresh={handleRefreshComments}
            onSendReply={handleSendInstagramReply}
          />
        )}
        {activeView === "automations" && (
          <Automations
            summary={workspace.automationSummary}
            initialTemplates={workspace.automations}
            tip={workspace.automationTip}
            availablePosts={workspace.posts}
            onCreateAutomation={handleCreateAutomation}
            onToggleAutomation={handleToggleAutomation}
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

function DashboardAccountMenu({ gowner, owner, accounts = [], onSwitchAccount, onSelectAccount, onConnectInstagram, onLogout, pendingAction }) {
  const isBusy = Boolean(pendingAction)
  const instagramHandle = owner?.instagramHandle || owner?.name || "Instagram account"
  const instagramUserId = owner?.instagramUserId || "Not available"

  const getInitials = (name) =>
    String(name || "IG")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-300 transition-all hover:shadow-md hover:ring-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open account menu"
          disabled={isBusy}
        >
          <InstagramBrandMark className="h-10 w-10" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
        <DropdownMenuLabel className="px-3 py-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{instagramHandle}</p>
            <p className="text-xs text-gray-500">IG ID: {instagramUserId}</p>
            {gowner?.email ? <p className="text-xs text-gray-400">{gowner.email}</p> : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.length > 0 ? (
          <>
            <DropdownMenuLabel className="px-3 pt-2 text-xs uppercase tracking-wide text-gray-500">
              Workspace accounts
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm"
                onSelect={(event) => {
                  event.preventDefault();
                  if (!account.isSelected) {
                    onSelectAccount?.(account.id);
                  }
                }}
                disabled={isBusy || account.isSelected}
              >
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={account.avatarUrl || account.profilePictureUrl || ""} alt={account.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-500 text-white">
                    {getInitials(account.name || account.instagramHandle)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{account.instagramHandle || account.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {account.connectionStatus === "token_expired" ? "Reconnect soon" : account.connectionStatus}
                  </p>
                </div>
                {account.isSelected ? (
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    Active
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm"
          onSelect={(event) => {
            event.preventDefault();
            onSwitchAccount?.();
          }}
          disabled={isBusy}
        >
          <Repeat2 className="h-4 w-4" />
          Manage accounts
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm"
          onSelect={(event) => {
            event.preventDefault();
            onConnectInstagram?.();
          }}
          disabled={isBusy}
        >
          <InstagramBrandMark className="h-4 w-4" />
          Connect another Instagram
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 focus:text-red-600"
          onSelect={(event) => {
            event.preventDefault();
            onLogout?.();
          }}
          disabled={isBusy}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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

function DashboardAccessGate({ errorMessage, onBackHome, onConnectInstagram, pendingAction }) {
  const isConnecting = pendingAction === "instagram_auth";

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
            Login with Instagram to open your owner dashboard. If this account already exists, we refresh the saved token and take you back inside.
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
            onClick={onConnectInstagram}
            disabled={Boolean(pendingAction)}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opening Instagram
              </>
            ) : (
              "Login With Instagram"
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={onBackHome} disabled={Boolean(pendingAction)}>
            Back To Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
