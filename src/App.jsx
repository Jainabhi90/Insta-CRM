import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { DarkLandingPage } from "./components/DarkLandingPage";
import { PricingPage } from "./components/PricingPage";
import { AuthModal } from "./components/AuthModal";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { LeadCenter } from "./components/LeadCenter";
import { Automations } from "./components/Automations";
import { PostPerformance } from "./components/PostPerformance";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState("leads");
  const [currentPage, setCurrentPage] = useState("landing");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveView("leads");
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("landing");
  };

  const handleGoToPricing = () => {
    setCurrentPage("pricing");
  };

  const handleBackToHome = () => {
    setCurrentPage("landing");
  };

  const handleToggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  if (!isLoggedIn) {
    return (
      <>
        {currentPage === "pricing" ? (
          <PricingPage onGetStarted={handleGetStarted} onBackToHome={handleBackToHome} />
        ) : isDarkTheme ? (
          <DarkLandingPage 
            onGetStarted={handleGetStarted} 
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onGoToPricing={handleGoToPricing}
            onToggleTheme={handleToggleTheme}
          />
        )}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
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
        {activeView === "leads" && <LeadCenter />}
        {activeView === "automations" && <Automations />}
        {activeView === "performance" && <PostPerformance />}
      </main>
    </div>
  );
}
