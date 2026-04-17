import { useMemo } from "react";
import { Button } from "../components/ui/button";

export default function Accounts({ onConnectInstagram, onOpenDashboard, onBackToHome }) {
  const pendingEmail = useMemo(() => window.localStorage.getItem("pending_email") || "Not available", []);

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

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onConnectInstagram}>
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
