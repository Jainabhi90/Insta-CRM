import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { buildGoogleAuthorizeUrl } from "../lib/googleAuthConfig";

const previewRows = [
  { stage: "Comment captured", lead: "@stylebyria", badge: "New" },
  { stage: "Warm lead scored", lead: "@urbanbrewco", badge: "Priority" },
  { stage: "DM flow triggered", lead: "@mynaturebox", badge: "Auto" },
];

const previewMetrics = [
  { label: "Set up", value: "3 mins", desc: "Average time" },
  { label: "Brands", value: "500+", desc: "Trusting us" },
  { label: "Reply lift", value: "9x", desc: "Engagement" },
];

const featureCards = [
  {
    icon: MessageCircle,
    title: "Comment-to-DM",
    description: "Catch intent from comments and trigger automated, structured follow-ups instantly.",
  },
  {
    icon: Target,
    title: "Lead Scoring",
    description: "Surface warm leads and ready buyers without the usual spreadsheet chaos.",
  },
  {
    icon: BarChart3,
    title: "Signal Tracking",
    description: "Identify which content drives quality conversations instead of vanity metrics.",
  },
];

export function GoogleLandingPage() {
  const handleGoogleLogin = () => {
    const authorizeUrl = buildGoogleAuthorizeUrl();
    if (!authorizeUrl) {
      window.alert("Google login is not configured.");
      return;
    }
    window.location.assign(authorizeUrl);
  };

  return (
    <div className="brand-shell-bg min-h-screen overflow-x-hidden text-gray-900 selection:bg-blue-100">
      {/* Premium Background Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[#62B6CB]/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] h-[500px] w-[500px] rounded-full bg-[#1B4965]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-[#BEE9E8]/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              InstaLead
            </span>
          </div>
          <nav className="flex items-center gap-6 py-4">
            <a href="/pricing" className="hidden text-sm font-bold text-gray-600 hover:text-theme-primary transition-colors sm:inline">Pricing</a>
            <a href="/privacy" className="hidden text-sm font-bold text-gray-600 hover:text-theme-primary transition-colors sm:inline">Privacy</a>
            <Button
              onClick={handleGoogleLogin}
              className="brand-button-gradient rounded-full px-6 shadow-xl hover:shadow-blue-200/50 transition-all active:scale-95"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative pt-4">
        {/* Hero Section */}
        <section className="mx-auto flex flex-col items-center justify-center gap-12 px-6 pb-16 max-w-7xl min-h-[calc(100vh-120px)]">
          <div className="space-y-8 flex flex-col items-center text-center">
            <h1 className=" text-center text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-theme-primary to-theme-accent pb-2 leading-none font-bold">Built for creators Scaling <br></br> from <br></br>comments to DMs</h1>
            
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600 font-medium">
               A professional Instagram CRM built for modern creators. Connect Google once, add your Instagram Account, and keep every lead, comment, and automation organized in one clean workspace.
            </p>

            <div className="flex items-center justify-center flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleGoogleLogin}
                className="brand-button-gradient text-lg h-14 rounded-full px-8 shadow-xl hover:shadow-blue-200/50 transition-all active:scale-95"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
               <div className="inline-flex items-center gap-2 text-lg text-[#1B4965]/70">
                <CheckCircle2 className="h-4 w-4 text-theme-primary" />
                Free 14-day trial, no credit card
              </div>
            </div>
          </div>

          {/* Feature Highlight Grid */}
          <div className="flex flex-col space-y-4 justify-center w-full gap-4 mt-8 ">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Maximize your reach, Minimize your effort</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white/60 border border-white p-4 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all text-center" style={{ height: '180px' }}>
                <p className="text-sm font-bold uppercase tracking-widest text-[#62B6CB] mb-2">Reply Lift</p>
                <p className="text-4xl font-black text-gray-900">9x</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl bg-[#0B1F3B] p-4 text-white shadow-xl hover:shadow-2xl transition-all text-center" style={{ height: '180px' }}>
                <p className="text-sm font-bold uppercase tracking-widest text-[#BEE9E8] mb-2">Brands</p>
                <p className="text-4xl font-black text-white">500+</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white/60 border border-white p-4 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all text-center" style={{ height: '180px' }}>
                <p className="text-sm font-bold uppercase tracking-widest text-[#62B6CB] mb-2">Setup Time</p>
                <p className="text-4xl font-black text-gray-900">3 min</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-xl uppercase tracking-[0.24em] text-[#1B4965]/60 font-bold">Why it feels better?</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              One product language across your workspace
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-8">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`brand-panel overflow-hidden rounded-[28px] border-0 animate-rise-in ${
                    index === 1 ? "animate-rise-in-delay" : index === 2 ? "animate-rise-in-delay-2" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F9FF] text-theme-primary ring-1 ring-[#1B4965]/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-[#1B4965]/80 font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Final CTA Card */}
        <section className="mx-auto mt-8 max-w-7xl px-6 py-32">
          <div className="flex item-center justify-center relative overflow-hidden rounded-[50px] bg-[#0B1F3B] p-12 md:p-24 text-center text-white shadow-3xl">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[#62B6CB] opacity-10 blur-[100px]" />
             <div className="relative z-10 space-y-8 flex flex-col items-center gap-4">
                <p className="text-[#62B6CB] font-bold tracking-widest uppercase text-sm">Start softly, Scale fast</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Bring Instagram into a calmer operating system</h1>
                <p className="mx-auto max-w-2xl text-[#BEE9E8]/70 text-lg">Move from scattered replies to one polished CRM flow with Google onboarding, workspace switching, and a professional visual language from the first click.</p>
                <Button
                size="lg"
                onClick={handleGoogleLogin}
                className="brand-button-gradient text-lg h-14 rounded-full px-10 shadow-xl hover:shadow-blue-200/50 transition-all active:scale-95"
              >
                Continue with Google
              </Button>
             </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-[#1B4965]/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2">
           <p className="text-sm font-medium text-[#1B4965]/40">© 2026 InstaLead. Built for modern Instagram teams.</p>
           <span className="text-sm font-medium text-[#1B4965]/40">Terms & Privacy</span>
        </div>
      </footer>
    </div>
  );
}
