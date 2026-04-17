import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Star, Zap, ArrowRight, MessageSquare, Sparkles, CheckCircle2, Users, Rocket, TrendingUp } from "lucide-react";
import { buildGoogleAuthorizeUrl, getGoogleRedirectUri } from "../lib/googleAuthConfig";

const GOOGLE_CALLBACK_URL = getGoogleRedirectUri();

export function GoogleLandingPage() {
  const handleGoogleLogin = () => {
    const authorizeUrl = buildGoogleAuthorizeUrl();
    if (!authorizeUrl) {
      window.alert("Google login is not configured. Set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI.");
      return;
    }
    window.location.assign(authorizeUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-blue-500/20 bg-slate-900/80 backdrop-blur-xl" style={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}>
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-emerald-400 shadow-lg shadow-cyan-500/50">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white">Automation</p>
              <p className="hidden sm:block text-xs text-cyan-300">Instagram CRM</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 md:gap-6">
            <a href="/pricing" className="hidden sm:inline text-sm text-blue-300 hover:text-cyan-300 transition-colors font-medium">Pricing</a>
            <a href="/privacy" className="hidden md:inline text-sm text-blue-300 hover:text-cyan-300 transition-colors font-medium">Privacy</a>
            <Button 
              size="sm" 
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/50 transition-all hover:scale-110 active:scale-95"
              onClick={handleGoogleLogin}
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden text-xs">Sign Up</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(30, 41, 59, 0.5) 100%)" }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 hover:bg-cyan-500/20 transition-all">
                <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-300 font-semibold">Join 500+ brands scaling faster</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
                  Turn Instagram Chats Into Sales
                </h1>
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg">
                  Connect with your audience, automate responses, and build a pipeline of leads from your Instagram comments and DMs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 hover:from-cyan-400 hover:via-blue-700 hover:to-emerald-400 text-white font-bold text-base shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  onClick={handleGoogleLogin}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Sign Up with Google
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="hidden sm:flex items-center gap-2 text-sm text-blue-300">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Free for 14 days</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-500/20">
                {[
                  { label: "No credit card", icon: "💳" },
                  { label: "14-day free trial", icon: "⚡" },
                  { label: "Cancel anytime", icon: "✨" }
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="text-2xl">{item.icon}</div>
                    <p className="text-xs text-blue-300 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual - Feature Card */}
            <div className="relative h-80 sm:h-96 lg:h-[520px] group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-600/15 to-emerald-600/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <Card className="relative h-full rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-slate-800/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 overflow-hidden group-hover:border-cyan-500/60 transition-all" style={{ backgroundColor: "rgba(30, 41, 59, 0.4)" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl" />
                
                <div className="relative z-10 space-y-8">
                  {/* Testimonial 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/50 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">Sarah Johnson</p>
                        <p className="text-xs text-cyan-400">@sarahjohn_co</p>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm hover:bg-blue-500/20 transition-colors">
                      <p className="text-sm text-blue-100 leading-relaxed">
                        "We went from 200 replies/month to 2,000 with automated responses. Game changer for our DMs! 🚀"
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="space-y-4 pt-6 border-t border-cyan-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">Marcus Chen</p>
                        <p className="text-xs text-cyan-400">@marcuschen.media</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm hover:bg-emerald-500/20 transition-colors">
                      <p className="text-sm text-blue-100 leading-relaxed">
                        "The pipeline view is incredible. I can see every lead at a glance and follow up instantly! 💰"
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden border-y border-blue-500/20">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything You Need</h2>
            <p className="text-lg text-blue-200">Powerful tools designed for creators and brands who want to scale fast.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: MessageSquare,
                title: "Smart Automation",
                description: "Set up auto-replies and filter comments by sentiment, keywords, or engagement.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Lead Management",
                description: "Organize prospects into pipelines and watch them move from comment to customer.",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: Rocket,
                title: "Easy Integration",
                description: "Sign in with Google and connect Instagram instantly. Start within minutes.",
                color: "from-emerald-500 to-cyan-500"
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <Card className="relative border border-blue-500/30 bg-slate-800/40 backdrop-blur-xl hover:border-cyan-500/60 transition-all group-hover:shadow-2xl group-hover:shadow-cyan-500/20" style={{ backgroundColor: "rgba(30, 41, 59, 0.3)" }}>
                    <CardContent className="p-8">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg transition-transform group-hover:scale-110`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-blue-200 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Trusted by Growing Brands</h2>
            <p className="text-lg text-blue-200">See why creators and agencies love Automation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Emma Wilson", role: "Beauty Brand Owner", text: "This tool saved me 10 hours a week. Amazing!" },
              { name: "Raj Patel", role: "Digital Agency", text: "Engagement up 35%. Clients are ecstatic." },
              { name: "Lisa Rodriguez", role: "Founder, @lisacosmetics", text: "Deal velocity improved significantly!" },
              { name: "James Park", role: "Content Creator", text: "Setup took 5 minutes. It just works!" },
              { name: "Sophia Liu", role: "E-commerce Store", text: "Tripled our sales from Instagram DMs." },
              { name: "David Brown", role: "Marketing Manager", text: "Best support team ever. Highly recommend." }
            ].map((testimonial, i) => (
              <Card key={i} className="border border-blue-500/30 bg-slate-800/40 backdrop-blur-xl hover:border-cyan-500/60 transition-all" style={{ backgroundColor: "rgba(30, 41, 59, 0.3)" }}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed text-sm">{testimonial.text}</p>
                  <div className="border-t border-blue-500/20 pt-4">
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-cyan-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden border-y border-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-emerald-600/10" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Automate Your Instagram?</h2>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of brands turning conversations into customers. Start your free trial today.
          </p>
          <Button 
            size="lg" 
            className="h-14 px-10 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-600 hover:from-cyan-400 hover:via-emerald-400 hover:to-blue-700 text-white font-bold text-base shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Free Trial Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-900/80 py-12 md:py-16 relative z-10" style={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-8 md:mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-400">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Automation</p>
                  <p className="text-xs text-cyan-400">Instagram CRM</p>
                </div>
              </div>
              <p className="text-sm text-blue-300 leading-relaxed">Turn Instagram conversations into your best sales channel.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/pricing" className="text-blue-300 hover:text-cyan-300 transition-colors">Pricing</a></li>
                <li><a href="#features" className="text-blue-300 hover:text-cyan-300 transition-colors">Features</a></li>
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">About</a></li>
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">Blog</a></li>
                <li><a href="mailto:hello@automation.app" className="text-blue-300 hover:text-cyan-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm">Resources</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4 text-sm">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-blue-300 hover:text-cyan-300 transition-colors">Privacy</a></li>
                <li><a href="/terms" className="text-blue-300 hover:text-cyan-300 transition-colors">Terms</a></li>
                <li><a href="#" className="text-blue-300 hover:text-cyan-300 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-500/20 pt-8">
            <p className="text-center text-sm text-blue-300">© 2024 Automation. All rights reserved. Built for creators and brands that scale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
