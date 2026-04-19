import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { getSavedInstagramAccounts } from "../api/auth/instagramAccountsApi";

export default function Accounts({ onConnectInstagram, onOpenDashboard, onBackToHome }) {
  const pendingEmail = useMemo(() => window.localStorage.getItem("pending_email") || "Not available", []);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSavedAccounts = async () => {
      setIsLoadingAccounts(true);

      try {
        const payload = await getSavedInstagramAccounts(pendingEmail === "Not available" ? "" : pendingEmail);
        const nextAccounts = Array.isArray(payload?.items) ? payload.items : [];

        if (!isMounted) {
          return;
        }

        setSavedAccounts(nextAccounts);

        if (nextAccounts.length > 0) {
          setSelectedAccountId(String(nextAccounts[0]?.id || nextAccounts[0]?.instagramUserId || ""));
        }
      } catch {
        if (!isMounted) {
          return;
        }

        // No backend endpoint yet: keep onboarding flow functional with button-only UI.
        setSavedAccounts([]);
        setSelectedAccountId("");
      } finally {
        if (isMounted) {
          setIsLoadingAccounts(false);
        }
      }
    };

    loadSavedAccounts();

    return () => {
      isMounted = false;
    };
  }, [pendingEmail]);

  const showAccountDropdown = !isLoadingAccounts && savedAccounts.length > 0;

  const handleConnectInstagram = () => {
    const normalizedSelection = String(selectedAccountId || "").trim();

    if (normalizedSelection) {
      window.localStorage.setItem("selected_instagram_account_id", normalizedSelection);
    } else {
      window.localStorage.removeItem("selected_instagram_account_id");
    }

    onConnectInstagram?.(
      normalizedSelection
        ? {
            selectedInstagramAccountId: normalizedSelection,
          }
        : undefined,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-14">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Onboarding</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Account setup</h1>
        <p className="mt-3 text-gray-600">Google sign-in is complete. Next, connect your Instagram account to unlock the dashboard.</p>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Google email (pending)</p>
          <p>{pendingEmail}</p>
        </div>

        {showAccountDropdown ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-900">Previously connected Instagram accounts</p>
            <select
              value={selectedAccountId}
              onChange={(event) => setSelectedAccountId(event.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="Select previously connected Instagram account"
            >
              {savedAccounts.map((account) => {
                const optionId = String(account?.id || account?.instagramUserId || "");
                const username = String(account?.instagramUsername || account?.instagramHandle || "").replace(/^@/, "");
                const userId = String(account?.instagramUserId || "").trim();

                const optionLabel = username
                  ? `@${username}${userId ? ` (${userId})` : ""}`
                  : userId
                    ? `Instagram ${userId}`
                    : "Instagram account";

                return (
                  <option key={optionId || optionLabel} value={optionId}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Select a saved account to continue faster without repeated setup.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConnectInstagram}>
            Connect Instagram
          </Button>
          <Button variant="outline" onClick={onOpenDashboard}>
            Open Dashboard
          </Button>
          <Button variant="ghost" onClick={onBackToHome}>
            Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
