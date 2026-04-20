import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  ArrowRight,
  BarChart3,
  Check,
  MessageSquare,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

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
    <div className="min-h-screen overflow-x-hidden bg-[#070c17] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-140px] top-24 h-96 w-96 rounded-full bg-[#2563eb]/25 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[28rem] w-[28rem] rounded-full bg-[#f97316]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.07)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(circle_at_center,black_25%,transparent_78%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-blue-200/15 bg-[#070c17]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#f97316] shadow-[0_0_40px_rgba(37,99,235,.35)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">InstaLead</p>
              <p className="text-xs text-blue-100/70">Instagram CRM</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <button onClick={onGoToPricing} className="hidden text-blue-100/80 transition-colors hover:text-white sm:inline">
              Pricing
            </button>
            {!isGoogleAuthenticated ? (
              <>
                <button onClick={() => scrollToSection("features")} className="hidden text-blue-100/80 transition-colors hover:text-white md:inline">
                  Features
                </button>
                <button onClick={onToggleTheme} className="hidden text-blue-100/80 transition-colors hover:text-white lg:inline">
                  Theme
                </button>
                <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={onLogin}>
                  Login
                </Button>
                <Button className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#f97316] font-semibold" onClick={onGoToGoogleLanding}>
                  Google Onboarding
                </Button>
              </>
            ) : (
              <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={onLogout}>
                Logout
              </Button>
            )}
            <Button className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#f97316] font-semibold" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-sm text-blue-100">
              <Zap className="h-4 w-4 text-[#f97316]" />
              Join 500+ brands scaling faster
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Stop losing sales in your
                <span className="block bg-gradient-to-r from-[#7dd3fc] via-[#60a5fa] to-[#f97316] bg-clip-text text-transparent">
                  Instagram DMs
                </span>
              </h1>
              <p className="max-w-xl text-lg text-blue-100/80">
                Premium onboarding for creators and brands that want a serious CRM feel, not a basic landing page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-14 rounded-full bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#f97316] px-8 text-base font-semibold shadow-[0_18px_50px_rgba(37,99,235,.42)]" onClick={onCreateAccount || onGetStarted}>
                <Rocket className="mr-2 h-5 w-5" />
                Connect Instagram
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="inline-flex items-center gap-2 text-sm text-blue-100/75">
                <Check className="h-4 w-4 text-emerald-300" />
                Free 14-day trial, no credit card
              </div>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Average setup", value: "3 mins" },
                { label: "Creators onboarded", value: "500+" },
                { label: "Reply speed uplift", value: "9x" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-blue-200/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-wide text-blue-100/55">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-[#2563eb]/35 via-transparent to-[#f97316]/25 blur-2xl" />
            <Card className="relative rounded-[28px] border border-blue-200/15 bg-[#0d1627]/90 shadow-[0_25px_80px_rgba(3,8,24,.6)] backdrop-blur-xl">
              <CardContent className="space-y-6 p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-blue-100/55">Live Pipeline</p>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs text-emerald-200">
                    Revenue Mode
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { stage: "Comment Trigger", lead: "@stylebyria", value: "Warm" },
                    { stage: "Auto DM Sent", lead: "@urbanbrewco", value: "Hot" },
                    { stage: "Manual Follow-up", lead: "@mynaturebox", value: "Closing" },
                  ].map((row, index) => (
                    <div key={row.lead} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" style={{ animationDelay: `${index * 120}ms` }}>
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-medium text-blue-100">{row.stage}</p>
                        <span className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#f97316] px-2.5 py-1 text-xs font-semibold text-white">
                          {row.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-blue-100/75">{row.lead}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Auto replies", amount: "2.4k" },
                    { label: "Active leads", amount: "418" },
                    { label: "Won today", amount: "27" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                      <p className="text-[11px] uppercase tracking-wide text-blue-100/55">{metric.label}</p>
                      <p className="mt-1 text-lg font-semibold">{metric.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100/55">Core stack</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Startup-grade feel, not a template</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: "Comment-to-DM automation",
                description: "Trigger personalized replies from post comments and keep brand voice consistent.",
              },
              {
                icon: Target,
                title: "Lead scoring board",
                description: "Sort hot leads first with intent signals so your team closes faster.",
              },
              {
                icon: BarChart3,
                title: "Revenue analytics",
                description: "Track which campaign conversations produce pipeline and actual sales.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="overflow-hidden rounded-2xl border border-blue-200/15 bg-[#0d1627]/85 backdrop-blur-xl transition-transform hover:-translate-y-1 hover:border-blue-200/30">
                  <CardContent className="p-6">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                      <Icon className="h-5 w-5 text-blue-100" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-blue-100/75">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
          <div className="rounded-[30px] border border-blue-200/20 bg-gradient-to-r from-[#10203c] to-[#18132c] p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,.45)] sm:p-12">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100/60">Launch fast</p>
            <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">Make your onboarding feel premium from first click</h3>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100/75">
              Same dark-blue + orange identity as your updated Google landing page so the experience feels unified and polished.
            </p>
            <Button size="lg" className="mt-8 h-14 rounded-full bg-gradient-to-r from-[#2563eb] to-[#f97316] px-10 text-base font-semibold shadow-[0_18px_46px_rgba(37,99,235,.4)]" onClick={onCreateAccount || onGetStarted}>
              Start now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-blue-200/15 bg-[#070c17] py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-blue-100/65 md:flex-row md:px-6">
          <p>© 2026 InstaLead. Built for modern Instagram teams.</p>
          <div className="flex items-center gap-5">
            <a href="/terms" className="transition-colors hover:text-white">Terms</a>
            <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
