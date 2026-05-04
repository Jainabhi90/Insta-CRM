import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Inbox,
  Loader2,
  LogOut,
  MessageCircle,
  Repeat2,
  Users,
  Zap,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { DarkLandingPage } from "./components/DarkLandingPage";

import { PricingPage } from "./components/PricingPage";
import { AuthModal } from "./components/AuthModal";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardAccountMenu } from "./components/DashboardAccountMenu";
import { LeadCenter } from "./components/LeadCenter";
import { CommentsInbox } from "./components/CommentsInbox";
import { DmInbox } from "./components/DmInbox";
import { Automations } from "./components/Automations";
import { PostPerformance } from "./components/PostPerformance";
import { InstagramBrandMark } from "./components/InstagramBrandMark";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Skeleton } from "./components/ui/skeleton";
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
import InstagramCallback from "./pages/InstagramCallback";
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
  readCachedWorkspace,
  writeCachedWorkspace,
} from "./services/dashboardWorkspaceService";
import { ensureDemoPreviewSession } from "./services/demoSessionService";
import { buildCommentWorkspace } from "./adapters/commentAdapter";
import { buildInboxWorkspace } from "./adapters/inboxAdapter";
import { normalizeSession } from "./adapters/ownerAdapter";

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

function getPreferredDashboardAccountId(session) {
  if (!session) {
    return ""
  }

  return (
    session.accounts?.find((account) => account.isSelected)?.id ||
    session.owner?.id ||
    session.selectedOwnerId ||
    session.accounts?.find((account) => account.connectionStatus === "connected")?.id ||
    session.accounts?.[0]?.id ||
    ""
  )
}

function getCurrentRoute() {
  if (typeof window === "undefined") {
    return { page: "landing", search: "" };
  }

  const path = window.location.pathname;

  if (path === "/") {
    return {
      page: "landing",
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
      page: "instagram-callback",
      search: window.location.search,
    };
  }

  if (path === "/google-auth") {
    return { page: "landing", search: window.location.search };
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

const DASHBOARD_VIEW_META = {
  leads: {
    label: "Lead Center",
    icon: Users,
    eyebrow: "Workspace",
    title: "Lead Center",
    description: "Review warm conversations, fast-moving leads, and your freshest outreach in one place.",
  },
  "dm-inbox": {
    label: "DM Inbox",
    icon: Inbox,
    eyebrow: "Messages",
    title: "DM Inbox",
    description: "Stay close to private conversations without leaving the product shell.",
  },
  comments: {
    label: "Comments",
    icon: MessageCircle,
    eyebrow: "Community",
    title: "Comments Inbox",
    description: "Monitor the latest public intent and turn comment activity into clean follow-up.",
  },
  automations: {
    label: "Automations",
    icon: Zap,
    eyebrow: "Automation",
    title: "Automation Playbook",
    description: "Create, tune, and manage the rules powering your always-on replies.",
  },
  performance: {
    label: "Post Performance",
    icon: BarChart3,
    eyebrow: "Insights",
    title: "Post Performance",
    description: "Track the content driving attention, comments, and stronger conversion moments.",
  },
};

function getDashboardViewMeta(activeView) {
  return DASHBOARD_VIEW_META[activeView] || DASHBOARD_VIEW_META.leads;
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
  const [selectError, setSelectError] = useState("");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const dashboardLoadSequence = useRef(0);
  const instagramAuthInFlight = useRef(false);

  const applyCachedWorkspace = (sessionPayload) => {
    const cachedWorkspace = readCachedWorkspace(sessionPayload)

    if (!cachedWorkspace) {
      return false
    }

    setWorkspace(cachedWorkspace)
    return true
  }

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

    if (hasWorkspaceSession(session)) {
      navigate("/accounts");
      return;
    }

    navigate("/google-auth");
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
    }
  };

  const hydrateDashboard = async (search = window.location.search) => {
    const requestId = dashboardLoadSequence.current + 1;
    dashboardLoadSequence.current = requestId;
    applyCachedWorkspace(session)
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

      setDashboardError(error.message || "Unable to open your dashboard right now.");
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

  const handleInstagramAuth = async () => {
    if (pendingAction || instagramAuthInFlight.current) {
      return;
    }

    instagramAuthInFlight.current = true;
    setPendingAction("instagram_auth");
    setAuthError("");
    setDashboardError("");

    try {
      const result = await startInstagramLogin();

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
      instagramAuthInFlight.current = false;
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
      navigate("/");
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
    return sendInstagramReply(payload);
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

  const handleInstagramWorkspaceReady = (sessionPayload) => {
    const normalizedSession = normalizeSession(sessionPayload);
    setSession(normalizedSession);
    if (!applyCachedWorkspace(normalizedSession)) {
      setWorkspace(null);
    }
    setDashboardError("");
    setSelectError("");

    if (normalizedSession?.gowner) {
      setHasGoogleLogin(true);
    }

    navigate("/dashboard", { replace: true });
  };

  const handleInstagramCallbackFailed = () => {
    if (hasWorkspaceSession(session)) {
      navigate("/accounts", { replace: true });
      return;
    }

    navigate("/", { replace: true });
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
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (session?.owner && workspace) {
      writeCachedWorkspace(session, workspace)
    }
  }, [session, workspace]);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      try {
        const restoredSession = await restoreExistingSession();

        if (!isActive) {
          return;
        }

        setSession(restoredSession);
        if (restoredSession?.owner) {
          applyCachedWorkspace(restoredSession)
        }
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

      if (pendingAction === "select_account") {
        return;
      }

      if (!session?.owner && hasWorkspaceSession(session) && pendingAction !== "select_account") {
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
  }, [route.page, route.search, session, pendingAction]);

  const handleSelectWorkspaceAccount = async (iownerId) => {
    if (pendingAction) {
      return;
    }

    setPendingAction("select_account");
    setDashboardError("");
    setSelectError("");

    try {
      const nextSession = await selectWorkspaceAccount(iownerId);
      setSession(nextSession);
      if (!applyCachedWorkspace(nextSession)) {
        setWorkspace(null);
      }
      setHasGoogleLogin(Boolean(nextSession?.gowner));
      
      // If already on dashboard, hydrate immediately
      // Otherwise navigate first and let the useEffect handle hydration
      if (route.page === "dashboard") {
        await hydrateDashboard("");
      } else {
        navigate("/dashboard");
        // Small delay to ensure route updates before hydration
        await new Promise(resolve => setTimeout(resolve, 50));
        await hydrateDashboard("");
      }
    } catch (error) {
      setSelectError(error?.message || "Unable to open that Instagram account right now.");
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
            isDarkTheme={isDarkTheme}
            onToggleTheme={handleToggleTheme}
          />
        ) : route.page === "google-callback" ? (
          <GoogleCallback
            onComplete={handleGoogleWorkspaceReady}
            onFailed={handleGoogleCallbackFailed}
          />
        ) : route.page === "instagram-callback" ? (
          <InstagramCallback
            onComplete={handleInstagramWorkspaceReady}
            onFailed={handleInstagramCallbackFailed}
          />
        ) : route.page === "accounts" ? (
          <Accounts
            gowner={session?.gowner}
            accounts={session?.accounts || []}
            pendingAction={pendingAction}
            error={selectError}
            onConnectInstagram={handleInstagramAuth}
            onOpenDashboard={() => {
              const fallbackAccount = getPreferredDashboardAccountId(session);

              if (fallbackAccount) {
                handleSelectWorkspaceAccount(fallbackAccount);
              }
            }}
            onSelectAccount={handleSelectWorkspaceAccount}
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

  if ((isDashboardLoading && !workspace) || (!hasRestoredSession && !session && !workspace) || (route.page === "dashboard" && session?.owner && !workspace)) {
    return <DashboardLoadingState owner={session?.owner} />;
  }

  if (!session || !workspace) {
    if (session?.gowner && !session?.owner) {
      return (
        <Accounts
          gowner={session.gowner}
          accounts={session.accounts || []}
          pendingAction={pendingAction}
          onConnectInstagram={handleInstagramAuth}
          onOpenDashboard={() => {
            const fallbackAccount = getPreferredDashboardAccountId(session);

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
          isDarkTheme={isDarkTheme}
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

  const activeViewMeta = getDashboardViewMeta(activeView);
  const ActiveViewIcon = activeViewMeta.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen w-full">
        <DashboardSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          session={session}
          pendingAction={pendingAction}
          onSwitchAccount={handleSwitchAccount}
          onSelectAccount={handleSelectWorkspaceAccount}
          onConnectInstagram={handleInstagramAuth}
          onLogout={handleLogout}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl">
              <div className="min-w-0">
                <h1 className="text-[26px] font-medium text-slate-900">
                  {activeViewMeta.title}
                </h1>
                <p className="mt-1 text-[13px] text-slate-600">
                  {activeViewMeta.description}
                </p>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-8 py-8 max-w-7xl">
            <div className="bg-white">
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


function DashboardLoadingState({ owner }) {
  const ownerLabel = owner?.instagramHandle || owner?.name || "Instagram workspace"

  return (
    <div className="brand-shell-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-5 px-4 py-4 sm:px-5 lg:px-6">
        <aside className="hidden lg:block lg:w-[290px]">
          <div className="brand-panel sticky top-4 overflow-hidden rounded-[32px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#f97316] text-white shadow-sm">
                IL
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="mt-10 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="brand-panel flex flex-col gap-3 rounded-[30px] px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Opening dashboard</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {ownerLabel}
                  </h1>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#f2d2e2] bg-[#fff0f7] px-3 py-2 text-sm text-[#9f3f70]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Bringing in fresh updates</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Saved workspace activity appears first, then the newest updates settle in automatically.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="brand-panel-soft rounded-3xl p-5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-4 h-8 w-20" />
                  <Skeleton className="mt-3 h-3 w-28" />
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
              <div className="brand-panel-soft rounded-3xl p-5">
                <Skeleton className="h-5 w-40" />
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brand-panel-soft rounded-3xl p-5">
                <Skeleton className="h-5 w-32" />
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-slate-100 p-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="mt-3 h-3 w-full" />
                      <Skeleton className="mt-2 h-3 w-4/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardAccessGate({ errorMessage, onBackHome, onConnectInstagram, pendingAction, isDarkTheme }) {
  const isConnecting = pendingAction === "instagram_auth";

  return (
    <div className={`brand-shell-bg min-h-screen flex items-center justify-center p-6 text-[#1B4965] dark:text-white ${isDarkTheme ? 'dark' : ''}`}>
      <Card className="brand-panel w-full max-w-md overflow-hidden rounded-[30px] border-0 bg-white/92">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary via-[#f472b6] to-theme-accent text-lg text-white shadow-[0_22px_44px_-26px_rgba(214,64,134,0.6)]">
              IL
            </div>
          </div>
          <CardTitle className="text-2xl" style={{ fontWeight: 700 }}>
            Access Your Dashboard
          </CardTitle>
          <CardDescription className="text-gray-500">
            Sign in with Instagram to open this account. If it already exists in your workspace, we will bring you right back in.
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
