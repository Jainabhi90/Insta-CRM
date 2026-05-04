import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, MessageSquare, TrendingUp, Zap, BarChart3, Target, Sun, Sparkles, ArrowRight } from "lucide-react";

export function DarkLandingPage({
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
    <div className="brand-shell-bg min-h-screen text-white">
      {/* Header */}
      <header className="border-b border-[#1B4965]/30 bg-[#0B1F3B]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-[0_22px_46px_-30px_rgba(98,182,203,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">InstaLead</p>
              <p className="text-xs text-gray-400">Instagram CRM</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <button
              onClick={onGoToPricing}
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Pricing
            </button>
            {!isGoogleAuthenticated ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={onToggleTheme}
                  className="p-2 text-white hover:text-white transition-colors"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <Button variant="outline" className="rounded-full border-[#BEE9E8] bg-white/85 text-gray-900 hover:bg-[#F0F9FF]" onClick={onLogin}>
                  Login
                </Button>
                
                <Button className="brand-button-gradient rounded-full font-semibold" onClick={onGoToGoogleLanding}>
                  Google Onboarding
                </Button>
              </>
            ) : (
              <Button variant="outline" className="border-[#1B4965]/50 text-white hover:bg-[#1B4965]/20" onClick={onLogout}>
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
          <p className="text-xl text-[#BEE9E8]/80 mb-4">
            The first "India-First" Instagram CRM that turns comments into customers.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            Automate your replies, score your leads, and grow your revenue for the price of a pizza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isGoogleAuthenticated && (
              <Button
                size="lg"
                className="brand-button-gradient h-14 rounded-full px-4 py-3 text-lg font-semibold shadow-xl shadow-theme-primary/20"
                onClick={onGoToGoogleLanding}
              >
                Continue with Google
              </Button>
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
            <Card className="rounded-none border-0 shadow-xl bg-gradient-to-br from-theme-primary to-theme-accent" >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0B1F3B]/10  flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-[#1B4965]" />
                </div>
                <p className="text-[#1B4965]/90 font-medium">
                  "Is your DM folder a <strong className="text-[#0B1F3B]">graveyard</strong> of 'Price?' and 'Interested' messages?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-none border-0 shadow-xl bg-gradient-to-br from-theme-primary to-theme-accent" >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0B1F3B]/10  flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#1B4965]" />
                </div>
                <p className="text-[#1B4965]/90 font-medium">
                  "Spending <strong className="text-[#0B1F3B]">4 hours a day</strong> manually replying 'Check DM'?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-none border-0 shadow-xl bg-gradient-to-br from-theme-primary to-theme-accent " >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0B1F3B]/10  flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#1B4965]" />
                </div>
                <p className="text-[#1B4965]/90 font-medium">
                  "Global tools like ManyChat charging you <strong className="text-[#0B1F3B]">₹1,500/month?</strong> Switch to the local expert."
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
          <p className="text-center text-[#BEE9E8]/60 mb-12">
            Everything you need to turn Instagram into your 24/7 sales employee
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="rounded-none border border-[#1B4965]/40  bg-gradient-to-br from-theme-primary to-theme-accent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-theme-primary/10">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 text-white font-semibold">Auto-Responder</h3>
                <p className="text-gray-400 mb-4">
                  Set custom triggers for Reels and Posts. Never miss a "Price?" question again.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Instant replies to common questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Custom triggers per post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Works 24/7, even while you sleep</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-none bg-gradient-to-br from-theme-primary to-theme-accent border border-[#1B4965]/40 hover:border-[#62B6CB]/40 transition-colors ">
              <CardContent className="pt-6">
                <div className="w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-theme-accent/10">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 text-white font-semibold">Lead Score Dashboard</h3>
                <p className="text-gray-400 mb-4">
                  See who is a "Hot Lead" vs. a "Window Shopper" at a glance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">1-100 scoring system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Track engagement patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Focus on ready-to-buy customers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-none bg-gradient-to-br from-theme-primary to-theme-accent border border-[#1B4965]/40 hover:border-[#62B6CB]/40 transition-colors ">
              <CardContent className="pt-6">
                <div className="w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-theme-success/10">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 text-white font-semibold">Post Analytics</h3>
                <p className="text-gray-400 mb-4">
                  See exactly which posts drive the most engagement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Post-level performance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Lead generation metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Engagement insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-theme-primary to-theme-accent p-12 shadow-2xl shadow-[#1B4965]/20">
          <h2 className="text-3xl md:text-4xl mb-4 text-white font-bold">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 500+ Indian creators who've automated their Instagram sales
          </p>
          <Button 
            size="lg" 
            className="h-14 rounded-full px-10 text-lg font-semibold shadow-xl shadow-theme-primary/20"
            onClick={onCreateAccount || onGetStarted}
          >
            Countinue with Google
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1B4965]/30 bg-[#0B1F3B] py-10 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-400 md:flex-row md:px-6">
          <p>© 2026 InstaLead. Made in India 🇮🇳</p>
          <div className="flex items-center gap-5">
            <a href="/terms" className="transition-colors hover:text-white">Terms</a>
            <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
