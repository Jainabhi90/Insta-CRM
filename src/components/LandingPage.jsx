import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, MessageSquare, TrendingUp, Zap, BarChart3, Target, Sun, Star } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-theme-primary to-theme-accent rounded-lg" />
            <span className="text-xl font-black">InstaLead</span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={onGoToPricing}
              className="text-gray-600 hover:text-theme-primary transition-colors font-medium"
            >
              Pricing
            </button>
            {!isGoogleAuthenticated && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-600 hover:text-theme-primary transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={onToggleTheme}
                  className="p-2 text-gray-600 hover:text-theme-primary transition-colors"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <Button variant="outline" onClick={onLogin}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="border-theme-primary text-theme-primary hover:bg-blue-50"
                  onClick={onGoToGoogleLanding}
                >
                  Google Onboarding
                </Button>
              </>
            )}
            {isGoogleAuthenticated && (
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            )}
            <Button className="bg-theme-primary hover:bg-theme-primary-hover" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
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
          <p className="text-xl text-gray-600 mb-4">
            The first "India-First" Instagram CRM that turns comments into customers.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Automate your replies, score your leads, and grow your revenue for the price of a pizza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-theme-primary hover:bg-theme-primary-hover text-white px-8 py-6 text-lg"
              onClick={onCreateAccount || onGetStarted}
            >
              Connect Instagram
            </Button>
            {!isGoogleAuthenticated && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-theme-primary text-theme-primary hover:bg-blue-50"
                  onClick={onLogin}
                >
                  Login
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-theme-primary text-theme-primary hover:bg-blue-50"
                  onClick={onGoToGoogleLanding}
                >
                  Continue with Google
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-12 animate-fade-in pt-8 border-t border-gray-100">
            <div className="flex -space-x-4">
              {[
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/68.jpg",
                "https://randomuser.me/api/portraits/women/65.jpg",
                "https://randomuser.me/api/portraits/men/22.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Creator ${i + 1}`}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 block">
                Trusted by 500+ Indian creators
              </span>
            </div>
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
          <h2 className="text-3xl text-center mb-4 font-semibold">
            The 3 Pillars of Automated Growth
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Everything you need to turn Instagram into your 24/7 sales employee
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-primary-light rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Auto-Responder</h3>
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
                <div className="w-16 h-16 bg-gradient-to-br from-theme-accent to-theme-accent-light rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Lead Score Dashboard</h3>
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
                <div className="w-16 h-16 bg-gradient-to-br from-theme-success to-theme-success-light rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 font-semibold">Post Analytics</h3>
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 bg-blue-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 font-semibold">
            Don't just take our word for it
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-blue-100 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                  "Before InstaLead, I was spending minimum 3 hours a day just DMing links to my courses. Now the bot does it instantly. My sales increased by 40% in two weeks because nobody has to wait."
                </p>
                <div className="flex items-center gap-4">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Priya S." className="w-14 h-14 rounded-full border-2 border-blue-100" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Priya S.</p>
                    <p className="text-sm text-theme-primary font-medium">Fitness Coach, 120k followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-blue-100 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="pt-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                  "I tried ManyChat but it was simply too complex and incredibly expensive for what I needed. InstaLead took 5 minutes to set up and the lead scoring completely changed how I prioritize agency calls."
                </p>
                <div className="flex items-center gap-4">
                  <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Rahul M." className="w-14 h-14 rounded-full border-2 border-blue-100" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Rahul M.</p>
                    <p className="text-sm text-theme-primary font-medium">Marketing Agency Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-theme-primary to-theme-accent rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-white font-bold">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 500+ Indian creators who've automated their Instagram sales
          </p>
          <Button 
            size="lg" 
            className="bg-white text-theme-primary hover:bg-gray-100 px-8 py-6 text-lg"
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
