import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  ArrowRight,
  BarChart3,
  Check,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const productCards = [
  {
    icon: MessageSquare,
    title: "Comment-to-DM handoff",
    description: "Send the right next reply without making your team live inside comment sections all day.",
  },
  {
    icon: Target,
    title: "Lead scoring clarity",
    description: "Separate curious browsers from high-intent buyers with a cleaner pipeline view.",
  },
  {
    icon: BarChart3,
    title: "Content intelligence",
    description: "See which posts actually create conversations worth following up on.",
  },
];

export function LandingPage({
  onGetStarted,
  onLogin,
  onCreateAccount,
  onGoToPricing,
  onToggleTheme,
  isGoogleAuthenticated,
  onGoToGoogleLanding,
  onLogout,
}) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="brand-shell-bg min-h-screen overflow-x-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-140px] top-20 h-96 w-96 rounded-full bg-[rgba(229,69,146,0.18)] blur-3xl" />
        <div className="absolute right-[-120px] top-44 h-[28rem] w-[28rem] rounded-full bg-[rgba(192,132,252,0.18)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/75 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary via-[#f472b6] to-theme-accent text-white shadow-[0_22px_46px_-30px_rgba(214,64,134,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">InstaLead</p>
              <p className="text-xs text-[#8d6780]">Instagram CRM</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <button onClick={onGoToPricing} className="hidden text-[#8d6780] transition-colors hover:text-slate-900 sm:inline">
              Pricing
            </button>
            {!isGoogleAuthenticated ? (
              <>
                <button onClick={() => scrollToSection("features")} className="hidden text-[#8d6780] transition-colors hover:text-slate-900 md:inline">
                  Features
                </button>
                <button onClick={onToggleTheme} className="hidden text-[#8d6780] transition-colors hover:text-slate-900 lg:inline">
                  Theme
                </button>
                <Button variant="outline" className="rounded-full border-[#f4cade] bg-white/85 text-slate-900 hover:bg-[#fff3f9]" onClick={onLogin}>
                  Login
                </Button>
                <Button className="brand-button-gradient rounded-full font-semibold" onClick={onGoToGoogleLanding}>
                  Google Onboarding
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full border-[#f4cade] bg-white/85 text-slate-900 hover:bg-[#fff3f9]" onClick={onLogout}>
                Logout
              </Button>
            )}
            <Button className="brand-button-gradient rounded-full font-semibold" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
          <div className="space-y-8">
            <div className="brand-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm">
              <Zap className="h-4 w-4 text-theme-primary" />
              Join 500+ brands building calmer reply flows
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Stop losing sales inside
                <span className="mt-2 block bg-gradient-to-r from-theme-primary via-[#ec4899] to-theme-accent bg-clip-text text-transparent">
                  Instagram DMs
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#715667]">
                Move from scattered comment replies to a polished pink-white CRM experience built for modern creator and brand teams.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="brand-button-gradient h-14 rounded-full px-8 text-base font-semibold"
                onClick={onCreateAccount || onGetStarted}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Connect Instagram
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="inline-flex items-center gap-2 text-sm text-[#8d6780]">
                <Check className="h-4 w-4 text-theme-primary" />
                Free 14-day trial, no credit card
              </div>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Average setup", value: "3 mins" },
                { label: "Creators onboarded", value: "500+" },
                { label: "Reply speed uplift", value: "9x" },
              ].map((item, index) => (
                <div key={item.label} className={`brand-panel-soft rounded-[24px] p-4 ${index ? "animate-rise-in-delay" : "animate-rise-in"}`}>
                  <p className="text-xs uppercase tracking-wide text-[#9a728a]">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="brand-hero-card relative overflow-hidden rounded-[34px] p-7 sm:p-8">
              <div className="absolute right-5 top-5 rounded-full bg-[#fde8f2] px-3 py-1 text-xs font-semibold text-[#9f3f70]">
                Revenue mode
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a728a]">Live Pipeline</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">A dashboard that feels product-led, not patched together</h2>

              <div className="mt-6 space-y-4">
                {[
                  { stage: "Comment Trigger", lead: "@stylebyria", value: "Warm" },
                  { stage: "Auto DM Sent", lead: "@urbanbrewco", value: "Hot" },
                  { stage: "Manual Follow-up", lead: "@mynaturebox", value: "Closing" },
                ].map((row) => (
                  <div key={row.lead} className="brand-panel-soft rounded-[24px] p-4">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium text-slate-900">{row.stage}</p>
                      <span className="rounded-full bg-gradient-to-r from-theme-primary to-theme-accent px-2.5 py-1 text-xs font-semibold text-white">
                        {row.value}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#7e5b71]">{row.lead}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Auto replies", amount: "2.4k" },
                  { label: "Active leads", amount: "418" },
                  { label: "Won today", amount: "27" },
                ].map((metric) => (
                  <div key={metric.label} className="brand-panel-soft rounded-[22px] p-3 text-center">
                    <p className="text-[11px] uppercase tracking-wide text-[#9a728a]">{metric.label}</p>
                    <p className="mt-1 text-lg font-semibold">{metric.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-[#9a728a]">Core stack</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Designed like a modern SaaS, not a placeholder
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {productCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="brand-panel overflow-hidden rounded-[28px] border-0 transition-transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8f2] text-theme-primary ring-1 ring-[rgba(229,69,146,0.12)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-[#715667]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
          <div className="brand-panel overflow-hidden rounded-[34px] p-8 text-center sm:p-12">
            <p className="text-sm uppercase tracking-[0.24em] text-[#9a728a]">Launch fast</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Make Instagram feel like your cleanest sales channel
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[#715667]">
              One bright, consistent product experience from onboarding through dashboard use, with a calmer palette and sharper hierarchy.
            </p>
            <Button size="lg" className="brand-button-gradient mt-8 h-14 rounded-full px-10 text-base font-semibold" onClick={onCreateAccount || onGetStarted}>
              Start now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/70 bg-white/65 py-10 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-[#8d6780] md:flex-row md:px-6">
          <p>© 2026 InstaLead. Built for modern Instagram teams.</p>
          <div className="flex items-center gap-5">
            <a href="/terms" className="transition-colors hover:text-slate-900">Terms</a>
            <a href="/privacy" className="transition-colors hover:text-slate-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
