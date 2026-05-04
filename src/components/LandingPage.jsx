import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, MessageSquare, TrendingUp, Zap, BarChart3, Target, Moon, Sparkles, ArrowRight } from "lucide-react";

export function LandingPage({
  onGetStarted,
  onLogin,
  onCreateAccount,
  onGoToPricing,
  onToggleTheme,
  onGoToGoogleLanding,
  onLogout,
  isGoogleAuthenticated,
}) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="brand-shell-bg min-h-screen text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/75 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-[0_22px_46px_-30px_rgba(27,73,101,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">InstaLead</p>
              <p className="text-xs text-[#1B4965]/70">Instagram CRM</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm ">
            <button onClick={onGoToPricing} className="hidden text-[#1B4965]/70 transition-colors hover:text-gray-900 sm:inline">
              Pricing
            </button>
            {!isGoogleAuthenticated ? (
              <>
                <button onClick={() => scrollToSection("features")} className="hidden text-[#1B4965]/70 transition-colors hover:text-gray-900 md:inline">
                  Features
                </button>
                <button onClick={onToggleTheme} className="p-2 text-[#1B4965]/70 hover:text-gray-900">
                  <Moon className="w-5 h-5" />
                </button>
                <Button variant="outline" className="rounded-full border-[#BEE9E8] bg-white/85 text-gray-900 hover:bg-[#F0F9FF]" onClick={onLogin}>
                  Login
                </Button>
                <Button className="brand-button-gradient rounded-full font-semibold" onClick={onGoToGoogleLanding}>
                  Get Started
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full border-[#BEE9E8] bg-white/85 text-gray-900 hover:bg-[#F0F9FF]" onClick={onLogout}>
                Logout
              </Button>
            )}
            
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-6 font-bold leading-[1.1]">
            Stop Losing Sales in Your{" "}
            <span className="bg-gradient-to-r from-theme-primary to-theme-accent bg-clip-text text-transparent">
              Instagram DMs
            </span>
          </h1>
          <p className="text-xl text-[#1B4965] mb-4">
            The first "India-First" Instagram CRM that turns comments into customers.
          </p>
          <p className="text-lg text-[#1B4965]/70 mb-8">
            Automate your replies, score your leads, and grow your revenue for the price of a pizza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {!isGoogleAuthenticated && (
              <>
                
                <Button
                  size="lg"
                  className="brand-button-gradient h-14 rounded-full px-4 py-3  text-lg font-semibold shadow-xl shadow-theme-primary/20"
                  onClick={onGoToGoogleLanding}
                >
                  Continue with Google
                </Button>
                
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12 font-semibold">
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="brand-panel-soft overflow-hidden rounded-none border-blue-100 bg-blue-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-none flex items-center justify-center mb-4 text-[#1B4965]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-[#1B4965]/80">
                  "Is your DM folder a <strong className="text-gray-900">graveyard</strong> of 'Price?' and 'Interested' messages?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="brand-panel-soft overflow-hidden rounded-none border-blue-100 bg-blue-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-none flex items-center justify-center mb-4 text-[#1B4965]">
                  <Zap className="w-6 h-6" />
                </div>
                <p className="text-[#1B4965]/80">
                  "Spending <strong className="text-gray-900">4 hours a day</strong> manually replying 'Check DM'?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="brand-panel-soft overflow-hidden rounded-none border-blue-100 bg-blue-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-none flex items-center justify-center mb-4 text-[#1B4965]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-[#1B4965]/80">
                  "Global tools like ManyChat charging you <strong className="text-gray-900">₹1,500/month?</strong> Switch to the local expert."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16" id="features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-4 font-semibold">
            The 3 Pillars of Automated Growth
          </h2>
          <p className="text-center text-[#1B4965]/70 mb-12">
            Everything you need to turn Instagram into your 24/7 sales employee
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="brand-panel overflow-hidden rounded-none border-0 transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#F0F9FF] rounded-none flex items-center justify-center mb-4 text-theme-primary ring-1 ring-[#1B4965]/10">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Auto-Responder</h3>
                <p className="text-[#1B4965]/80 mb-4">
                  Set custom triggers for Reels and Posts. Never miss a "Price?" question again.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Instant replies to common questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Custom triggers per post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Works 24/7, even while you sleep</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="brand-panel overflow-hidden rounded-none border-0 transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#F0F9FF] rounded-none flex items-center justify-center mb-4 text-theme-accent ring-1 ring-[#62B6CB]/10">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Lead Score Dashboard</h3>
                <p className="text-[#1B4965]/80 mb-4">
                  See who is a "Hot Lead" vs. a "Window Shopper" at a glance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">1-100 scoring system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Track engagement patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Focus on ready-to-buy customers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="brand-panel overflow-hidden rounded-none border-0 transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#F0F9FF] rounded-none flex items-center justify-center mb-4 text-green-500 ring-1 ring-[#10b981]/10">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Post Analytics</h3>
                <p className="text-[#1B4965]/80 mb-4">
                  See exactly which posts drive the most engagement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Post-level performance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Lead generation metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#1B4965]/80">Engagement insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto brand-panel overflow-hidden p-12">
          <h2 className="text-3xl md:text-4xl mb-4 font-bold">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl mb-8 text-[#1B4965]/70">
            Join 500+ Indian creators who've automated their Instagram sales
          </p>
          <Button 
            size="lg" 
            className="brand-button-gradient h-14 rounded-full px-10 text-lg font-semibold"
            onClick={onCreateAccount || onGetStarted}
          >
            Start with Google
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/70 bg-white/65 py-10 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-[#1B4965]/70 md:flex-row md:px-6">
          <p>© 2026 InstaLead. Made in India 🇮🇳</p>
          <div className="flex items-center gap-5">
            <a href="/terms" className="transition-colors hover:text-gray-900">Terms</a>
            <a href="/privacy" className="transition-colors hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
