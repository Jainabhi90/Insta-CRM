import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Inbox,
  Loader2,
  LogOut,
  MessageCircle,
  Repeat2,
  Settings,
  Users,
  Zap,
  Bell,
} from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { DarkLandingPage } from "./components/DarkLandingPage";
import { GoogleLandingPage } from "./components/GoogleLandingPage";
import { PricingPage } from "./components/PricingPage";
import { AuthModal } from "./components/AuthModal";
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
import { createRazorpayCheckoutOrder, verifyRazorpayCheckoutPayment } from "./api/payments/razorpayApi";
import { getSubscriptionStatus } from "./api/subscription/subscriptionApi";
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
import { loadRazorpayCheckout } from "./services/razorpayCheckoutService";
import { buildCommentWorkspace } from "./adapters/commentAdapter";
import { buildInboxWorkspace } from "./adapters/inboxAdapter";
import { normalizeSession } from "./adapters/ownerAdapter";

import { buildGoogleAuthorizeUrl } from "./lib/googleAuthConfig";

const THEME_STORAGE_KEY = "instalead.theme";
const GOOGLE_AUTH_COMPLETED_KEY = "google_login_completed";
const PENDING_PRICING_SELECTION_KEY = "instalead.pending_pricing_selection";

function hasCompletedGoogleLogin() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(GOOGLE_AUTH_COMPLETED_KEY) === "true";
}

function readPendingPricingSelection() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSelection = window.localStorage.getItem(PENDING_PRICING_SELECTION_KEY);

    if (!rawSelection) {
      return null;
    }

    const parsedSelection = JSON.parse(rawSelection);
    const tier = String(parsedSelection?.tier || "").trim();

    if (!tier) {
      return null;
    }

    return {
      tier,
      billingCycle:
        String(parsedSelection?.billingCycle || "monthly").trim().toLowerCase() === "yearly"
          ? "yearly"
          : "monthly",
      createdAt: Number(parsedSelection?.createdAt || 0) || 0,
    };
  } catch {
    return null;
  }
}

function writePendingPricingSelection(selection) {
  if (typeof window === "undefined") {
    return;
  }

  const tier = String(selection?.tier || "").trim();

  if (!tier) {
    return;
  }

  window.localStorage.setItem(
    PENDING_PRICING_SELECTION_KEY,
    JSON.stringify({
      tier,
      billingCycle:
        String(selection?.billingCycle || "monthly").trim().toLowerCase() === "yearly"
          ? "yearly"
          : "monthly",
      createdAt: Date.now(),
    }),
  );
}

function clearPendingPricingSelection() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_PRICING_SELECTION_KEY);
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
      page: "instagram-callback",
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

function buildSubscriptionSnapshot(owner) {
  if (!owner) {
    return null
  }

  return {
    tier: owner.subscriptionTier || "free",
    planName: owner.plan || owner.planName || "Free",
    status: owner.subscriptionStatus || "active",
    billingCycle: owner.subscriptionBillingCycle || "monthly",
    limits: owner.limits || {
      automationLimit: 1,
      dmLimitPerAutomation: 10,
    },
    subscribedAt: owner.subscriptionPurchasedAt || null,
    expiresAt: owner.subscriptionExpiresAt || null,
  }
}

function getPricingContext(search = "") {
  const params = new URLSearchParams(search || "")

  return {
    reason: params.get("reason") || "",
    sourceView: params.get("sourceView") || "",
    automationId: params.get("automationId") || "",
    tier: params.get("tier") || "",
    billingCycle: params.get("billingCycle") || "monthly",
    intent: params.get("intent") || "",
  }
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
  const [pricingSubscription, setPricingSubscription] = useState(null);
  const [pricingCheckoutState, setPricingCheckoutState] = useState({
    status: "",
    message: "",
    pendingPlanKey: "",
  });
  const dashboardLoadSequence = useRef(0);
  const skipNextDashboardHydration = useRef(false);
  const instagramAuthInFlight = useRef(false);
  const pricingResumeAttempted = useRef(false);

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

  const navigateToPricing = ({
    reason = "",
    sourceView = activeView,
    automationId = "",
    tier = "",
    billingCycle = "",
    intent = "",
  } = {}) => {
    const params = new URLSearchParams()

    if (reason) {
      params.set("reason", reason)
    }

    if (sourceView) {
      params.set("sourceView", sourceView)
    }

    if (automationId) {
      params.set("automationId", automationId)
    }

    if (tier) {
      params.set("tier", tier)
    }

    if (billingCycle) {
      params.set("billingCycle", billingCycle)
    }

    if (intent) {
      params.set("intent", intent)
    }

    const nextPath = params.toString() ? `/pricing?${params.toString()}` : "/pricing"
    navigate(nextPath)
  };

  const closeAuthModal = () => {
    setAuthError("");
    setShowAuthModal(false);
  };

  const handleGoogleLogin = () => {
    const authorizeUrl = buildGoogleAuthorizeUrl();
    if (!authorizeUrl) {
      window.alert("Google login is not configured. Set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI.");
      return;
    }
    window.location.assign(authorizeUrl);
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

    handleGoogleLogin();
  };

  const openSignupModal = () => {
    openInstagramModal();
  };

  const applyWorkspaceResult = (result) => {
    setSession(result.session);
    setWorkspace(result.workspace);
    setPricingSubscription(buildSubscriptionSnapshot(result.session?.owner));
    setShowAuthModal(false);
    setAuthError("");
    setDashboardError(!result.session && result.warnings?.length ? result.warnings[0] : "");

    if (!result.session) {
      setActiveView("leads");
    }
  };

  const hydrateDashboard = async (search = window.location.search, sessionOverride = null) => {
    const requestId = dashboardLoadSequence.current + 1;
    dashboardLoadSequence.current = requestId;
    applyCachedWorkspace(sessionOverride || session)
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

  const refreshSubscriptionStatus = async () => {
    if (!session?.owner) {
      setPricingSubscription(null)
      return null
    }

    try {
      const subscription = await getSubscriptionStatus()
      setPricingSubscription(subscription)
      return subscription
    } catch (error) {
      const fallbackSubscription = buildSubscriptionSnapshot(session.owner)
      setPricingSubscription(fallbackSubscription)
      return fallbackSubscription
    }
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

    handleGoogleLogin();
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
    clearPendingPricingSelection();

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
    try {
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
    } catch (error) {
      const errorMessage = String(error?.message || "")

      if (errorMessage.includes("allows up to")) {
        setPricingCheckoutState({
          status: "limit",
          message: errorMessage,
          pendingPlanKey: "",
        })
        navigateToPricing({ reason: "automation_limit", sourceView: "automations" })
      }

      throw error;
    }
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

  const handleUpgradeFromAutomations = ({ reason = "automation_limit", automationId = "" } = {}) => {
    setPricingCheckoutState({
      status: "limit",
      message:
        reason === "dm_limit"
          ? "This automation has reached its DM send cap. Upgrade to unlock more sends."
          : "Your current plan has reached its automation cap. Upgrade to create more rules.",
      pendingPlanKey: "",
    })
    navigateToPricing({ reason, sourceView: "automations", automationId })
  };

  const handleGoToGoogleLanding = () => {
    navigate("/google-auth");
  };

  const handleSelectPaidPlan = async ({ tier, billingCycle }) => {
    if (!session?.owner) {
      writePendingPricingSelection({ tier, billingCycle })
      setPricingCheckoutState({
        status: "auth_required",
        message: "Finish login and connect Instagram to continue this upgrade.",
        pendingPlanKey: "",
      })
      handleGetStarted()
      return
    }

    const planKey = `${tier}:${billingCycle || "monthly"}`
    setPricingCheckoutState({
      status: "pending",
      message: "",
      pendingPlanKey: planKey,
    })

    try {
      const orderPayload = await createRazorpayCheckoutOrder({
        tier,
        billingCycle,
      })
      const RazorpayCheckout = await loadRazorpayCheckout()
      const keyId = orderPayload?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || ""

      if (!keyId) {
        throw new Error("Razorpay checkout is not configured. Set VITE_RAZORPAY_KEY_ID.")
      }

      await new Promise((resolve, reject) => {
        const razorpay = new RazorpayCheckout({
          key: keyId,
          amount: orderPayload?.order?.amount,
          currency: orderPayload?.order?.currency || "INR",
          name: "InstaLead",
          description: `${orderPayload?.plan?.planName || "Premium"} plan (${billingCycle || "monthly"})`,
          order_id: orderPayload?.order?.id,
          handler: async (response) => {
            try {
              const verifyPayload = await verifyRazorpayCheckoutPayment({
                tier,
                billingCycle,
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
              })

              setPricingSubscription(verifyPayload?.subscription || buildSubscriptionSnapshot(verifyPayload?.owner))
              setPricingCheckoutState({
                status: "success",
                message: `${verifyPayload?.subscription?.planName || "Plan"} is now active for this Instagram account.`,
                pendingPlanKey: "",
              })
              clearPendingPricingSelection()
              await refreshWorkspace().catch(() => null)
              resolve(verifyPayload)
            } catch (error) {
              reject(error)
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Razorpay checkout was closed before payment finished."))
            },
          },
          prefill: {
            email: session?.owner?.email || session?.gowner?.email || "",
            name: session?.owner?.name || session?.gowner?.name || "",
          },
          notes: {
            subscriptionTier: tier,
            billingCycle: billingCycle || "monthly",
          },
          theme: {
            color: "#0f172a",
          },
        })

        razorpay.open()
      })
    } catch (error) {
      setPricingCheckoutState({
        status: "error",
        message: error?.message || "Checkout could not be completed right now.",
        pendingPlanKey: "",
      })
    }
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
    clearPendingPricingSelection();
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
    setPricingSubscription(buildSubscriptionSnapshot(normalizedSession?.owner));
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
    setPricingSubscription(buildSubscriptionSnapshot(normalizedSession?.owner));
    if (!applyCachedWorkspace(normalizedSession)) {
      setWorkspace(null);
    }
    setDashboardError("");
    setSelectError("");

    if (normalizedSession?.gowner) {
      setHasGoogleLogin(true);
    }

    const pendingPricingSelection = readPendingPricingSelection();

    if (pendingPricingSelection) {
      navigateToPricing({
        reason: "upgrade",
        sourceView: "pricing",
        tier: pendingPricingSelection.tier,
        billingCycle: pendingPricingSelection.billingCycle,
        intent: "resume",
      });
      return;
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
  }, [isDarkTheme]);

  useEffect(() => {
    if (session?.owner && workspace) {
      writeCachedWorkspace(session, workspace)
    }
  }, [session, workspace]);

  useEffect(() => {
    if (route.page !== "pricing") {
      pricingResumeAttempted.current = false
      return
    }

    if (!session?.owner) {
      setPricingSubscription(null)
      return
    }

    refreshSubscriptionStatus().catch(() => null)
  }, [route.page, session?.owner?.id]);

  useEffect(() => {
    const pricingContext = getPricingContext(route.search)

    if (route.page !== "pricing" || pricingContext.intent !== "resume" || !session?.owner) {
      return
    }

    if (pricingResumeAttempted.current || pricingCheckoutState.pendingPlanKey) {
      return
    }

    const pendingSelection = readPendingPricingSelection()

    if (!pendingSelection?.tier) {
      return
    }

    pricingResumeAttempted.current = true
    clearPendingPricingSelection()
    void handleSelectPaidPlan({
      tier: pendingSelection.tier,
      billingCycle: pendingSelection.billingCycle,
    })
  }, [route.page, route.search, session?.owner?.id, pricingCheckoutState.pendingPlanKey]);

  useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      try {
        const restoredSession = await restoreExistingSession();

        if (!isActive) {
          return;
        }

        setSession(restoredSession);
        setPricingSubscription(buildSubscriptionSnapshot(restoredSession?.owner));
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

      if (skipNextDashboardHydration.current) {
        skipNextDashboardHydration.current = false;
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

      await hydrateDashboard("", nextSession);

      const pendingPricingSelection = readPendingPricingSelection();

      if (pendingPricingSelection) {
        navigateToPricing({
          reason: "upgrade",
          sourceView: "pricing",
          tier: pendingPricingSelection.tier,
          billingCycle: pendingPricingSelection.billingCycle,
          intent: "resume",
        });
        return;
      }

      if (route.page !== "dashboard") {
        skipNextDashboardHydration.current = true;
        navigate("/dashboard");
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
            onSelectPlan={handleSelectPaidPlan}
            currentSubscription={pricingSubscription}
            checkoutState={pricingCheckoutState}
            pricingContext={getPricingContext(route.search)}
          />
        ) : route.page === "google-landing" ? (
          <GoogleLandingPage />
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
    <div className="brand-shell-bg min-h-screen">
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-gray-200 pt-1">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 w-48 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
              IL
            </div>
            <span className="text-xl font-bold text-gray-900">InstaLead</span>
          </div>

          {/* Center: Pill Navigation */}
          <nav className="flex overflow-x-auto hide-scrollbar items-center gap-1 bg-white rounded-full p-1 border border-gray-200 shadow-sm mx-auto">
            {Object.entries(DASHBOARD_VIEW_META).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeView === key
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {meta.label}
              </button>
            ))}
          </nav>

          {/* Right: Actions and Profile */}
          <div className="flex items-center justify-end gap-3 w-48 shrink-0">
            <button
              type="button"
              onClick={handleGoToPricing}
              className="hidden md:inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Manage plan
            </button>
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <DashboardAccountMenu
              gowner={session.gowner}
              owner={session.owner}
              accounts={session.accounts || []}
              pendingAction={pendingAction}
              onSwitchAccount={handleSwitchAccount}
              onSelectAccount={handleSelectWorkspaceAccount}
              onGoToPricing={handleGoToPricing}
              onConnectInstagram={handleInstagramAuth}
              onLogout={handleLogout}
            />
          </div>
        </header>
        
        <main className="min-w-0 flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
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
                  limits={workspace.automationLimits}
                  availablePosts={workspace.posts}
                  onCreateAutomation={handleCreateAutomation}
                  onToggleAutomation={handleToggleAutomation}
                  onUpgrade={handleUpgradeFromAutomations}
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
  );
}

function DashboardAccountMenu({
  gowner,
  owner,
  accounts = [],
  onSwitchAccount,
  onSelectAccount,
  onGoToPricing,
  onConnectInstagram,
  onLogout,
  pendingAction,
}) {
  const isBusy = Boolean(pendingAction)
  const instagramHandle = owner?.instagramHandle || owner?.name || "Instagram account"
  const instagramUserId = owner?.instagramUserId || "Not available"
  const selectedCount = accounts.filter((account) => account.connectionStatus === "connected").length
  const planName = owner?.planName || owner?.plan || "Free"
  const billingCycle = owner?.subscriptionBillingCycle === "yearly" ? "yearly" : "monthly"

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
          className="relative inline-flex items-center justify-center rounded-full h-10 w-10 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-transform hover:scale-105"
          aria-label="Open account menu"
          disabled={isBusy}
        >
          <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
            <AvatarImage src={owner?.avatarUrl || owner?.profilePictureUrl || ""} alt={instagramHandle} />
            <AvatarFallback className="bg-gray-900 text-white text-xs font-medium">
              {getInitials(instagramHandle)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={14}
        collisionPadding={20}
        className="w-[320px] rounded-[24px] border border-gray-200 bg-white p-3 shadow-xl backdrop-blur"
      >
        <DropdownMenuLabel className="rounded-[18px] bg-gray-50 px-4 py-4 mb-2">
          <div className="space-y-1.5">
            <p className="text-base font-semibold text-gray-900">{instagramHandle}</p>
            <p className="text-sm text-gray-500">IG ID: {instagramUserId}</p>
            {gowner?.email ? <p className="text-sm text-gray-400">{gowner.email}</p> : null}
            <p className="text-xs font-medium text-[#9f3f70]">
              {planName} plan · {billingCycle}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.length > 0 ? (
          <>
            <DropdownMenuLabel className="px-3 pt-2 text-xs uppercase tracking-wide text-slate-500">
              Workspace accounts
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm"
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
                  <AvatarFallback className="bg-gradient-to-br from-theme-primary to-theme-accent text-white">
                    {getInitials(account.name || account.instagramHandle)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{account.instagramHandle || account.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {account.connectionStatus === "token_expired" ? "Reconnect soon" : account.connectionStatus}
                  </p>
                </div>
                {account.isSelected ? (
                  <span className="rounded-full bg-[#fde8f2] px-2 py-1 text-xs font-medium text-[#9f3f70]">
                    Active
                  </span>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          onSelect={(event) => {
            event.preventDefault();
            onGoToPricing?.();
          }}
          disabled={isBusy}
        >
          <Settings className="h-5 w-5 text-gray-400" />
          Manage plan & billing
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          onSelect={(event) => {
            event.preventDefault();
            onSwitchAccount?.();
          }}
          disabled={isBusy}
        >
          <Repeat2 className="h-5 w-5 text-gray-400" />
          Manage accounts
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
          onSelect={(event) => {
            event.preventDefault();
            onConnectInstagram?.();
          }}
          disabled={isBusy}
        >
          <InstagramBrandMark className="h-5 w-5 text-gray-400" />
          Connect another Instagram
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
          onSelect={(event) => {
            event.preventDefault();
            onLogout?.();
          }}
          disabled={isBusy}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DashboardRefreshBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d2e2] bg-[#fff0f7] px-3 py-2 text-sm text-[#9f3f70] shadow-[0_14px_40px_-32px_rgba(214,64,134,0.45)]">
      <Loader2 className="h-4 w-4 animate-spin text-theme-primary" />
      <span className="font-medium">New data arriving...</span>
    </div>
  )
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

function DashboardAccessGate({ errorMessage, onBackHome, onConnectInstagram, pendingAction }) {
  const isConnecting = pendingAction === "instagram_auth";

  return (
    <div className="brand-shell-bg min-h-screen flex items-center justify-center p-6">
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
