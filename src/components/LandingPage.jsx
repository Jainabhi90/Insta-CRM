import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, MessageSquare, TrendingUp, Zap, BarChart3, Target, Sun } from "lucide-react";

export function LandingPage({ onGetStarted, onLogin, onCreateAccount, onGoToPricing, onToggleTheme }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-lg" />
            <span className="text-xl" style={{ fontWeight: 600 }}>InstaLead</span>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-[#2563eb] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Features
            </button>
            <button 
              onClick={onGoToPricing}
              className="text-gray-600 hover:text-[#2563eb] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Pricing
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-600 hover:text-[#2563eb] transition-colors"
            >
              <Sun className="w-5 h-5" />
            </button>
            <Button variant="outline" onClick={onLogin}>
              Login
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-6" style={{ fontWeight: 700, lineHeight: 1.1 }}>
            Stop Losing Sales in Your{" "}
            <span className="bg-gradient-to-r from-[#2563eb] to-[#f97316] bg-clip-text text-transparent">
              Instagram DMs
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            The first "India-First" Instagram CRM that turns comments into customers.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Automate your replies, score your leads, and grow your revenue for the price of a pizza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-6 text-lg"
              onClick={onCreateAccount || onGetStarted}
            >
              Connect Instagram
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-[#2563eb] text-[#2563eb] hover:bg-blue-50"
              onClick={onLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-12" style={{ fontWeight: 600 }}>
            Sound Familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-red-100 bg-red-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-gray-700">
                  "Is your DM folder a <strong>graveyard</strong> of 'Price?' and 'Interested' messages?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-red-100 bg-red-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-gray-700">
                  "Spending <strong>4 hours a day</strong> manually replying 'Check DM'?"
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-red-100 bg-red-50/30">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-gray-700">
                  "Global tools like ManyChat charging you <strong>₹1,500/month?</strong> Switch to the local expert."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white" id="features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-4" style={{ fontWeight: 600 }}>
            The 3 Pillars of Automated Growth
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to turn Instagram into your 24/7 sales employee
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 600 }}>Auto-Responder</h3>
                <p className="text-gray-600 mb-4">
                  Set custom triggers for Reels and Posts. Never miss a "Price?" question again.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Instant replies to common questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Custom triggers per post</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Works 24/7, even while you sleep</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#fb923c] rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 600 }}>Lead Score Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  See who is a "Hot Lead" vs. a "Window Shopper" at a glance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1-100 scoring system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Track engagement patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Focus on ready-to-buy customers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#34d399] rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: 600 }}>Post Analytics</h3>
                <p className="text-gray-600 mb-4">
                  See exactly which posts drive the most engagement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Post-level performance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Lead generation metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Engagement insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#2563eb] to-[#f97316] rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-white" style={{ fontWeight: 700 }}>
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 500+ Indian creators who've automated their Instagram sales
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#2563eb] hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={onCreateAccount || onGetStarted}
          >
            Connect Instagram
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 InstaLead. Made in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
