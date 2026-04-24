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
  { label: "Set up", value: "3 mins" },
  { label: "Brands", value: "500+" },
  { label: "Reply lift", value: "9x" },
];

const featureCards = [
  {
    icon: MessageCircle,
    title: "Comment-to-DM journeys",
    description: "Catch intent from comments, trigger the right next step, and keep follow-up beautifully structured.",
  },
  {
    icon: Target,
    title: "Lead scoring workspace",
    description: "Surface who is warm, who is ready, and who needs a second touch without spreadsheet chaos.",
  },
  {
    icon: BarChart3,
    title: "Post-level signal tracking",
    description: "See which content is producing quality conversations instead of vanity noise.",
  },
];

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
    <div className="brand-shell-bg isolate min-h-screen overflow-x-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-18 h-80 w-80 rounded-full bg-[rgba(229,69,146,0.16)] blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-[26rem] w-[26rem] rounded-full bg-[rgba(192,132,252,0.18)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(214,165,193,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(214,165,193,.14)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black_20%,transparent_76%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary via-[#f472b6] to-theme-accent text-white shadow-[0_22px_46px_-30px_rgba(214,64,134,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">InstaLead</p>
              <p className="text-xs text-[#8d6780]">Google onboarding</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <a href="/pricing" className="hidden text-[#8d6780] transition-colors hover:text-slate-900 sm:inline">
              Pricing
            </a>
            <a href="/privacy" className="hidden text-[#8d6780] transition-colors hover:text-slate-900 md:inline">
              Privacy
            </a>
            <Button
              size="sm"
              className="brand-button-gradient rounded-full px-5 font-semibold"
              onClick={handleGoogleLogin}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-18 pt-16 md:px-6 lg:grid-cols-[1.02fr_.98fr] lg:pt-24">
          <div className="animate-rise-in space-y-8">
            <div className="brand-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm">
              <Zap className="h-4 w-4 text-theme-primary" />
              Built for creators scaling from comments and DMs
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                A softer, smarter Instagram CRM
                <span className="mt-2 block bg-gradient-to-r from-theme-primary via-[#ec4899] to-theme-accent bg-clip-text text-transparent">
                  that starts with Google
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#715667]">
                Connect Google once, add your Instagram accounts into the same workspace, and keep every lead, comment, DM, and automation feeling organized from day one.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="brand-button-gradient h-14 rounded-full px-8 text-base font-semibold"
                onClick={handleGoogleLogin}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Continue with Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="inline-flex items-center gap-2 text-sm text-[#8d6780]">
                <CheckCircle2 className="h-4 w-4 text-theme-primary" />
                Free 14-day trial, no credit card
              </div>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {previewMetrics.map((item, index) => (
                <div
                  key={item.label}
                  className={`brand-panel-soft rounded-[24px] p-4 animate-rise-in ${
                    index === 1 ? "animate-rise-in-delay" : index === 2 ? "animate-rise-in-delay-2" : ""
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide text-[#9a728a]">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-rise-in-delay relative">
            <div className="brand-hero-card overflow-hidden rounded-[34px] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a728a]">
                    Live workspace
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Revenue-ready command view</p>
                </div>
                <span className="rounded-full bg-[#fde8f2] px-3 py-1 text-xs font-semibold text-[#9f3f70]">
                  Pink mode
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {previewRows.map((row, index) => (
                  <div
                    key={row.lead}
                    className="brand-panel-soft rounded-[26px] p-4 animate-rise-in"
                    style={{ animationDelay: `${index * 130}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{row.stage}</p>
                      <span className="rounded-full bg-gradient-to-r from-theme-primary to-theme-accent px-3 py-1 text-xs font-semibold text-white">
                        {row.badge}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#7e5b71]">{row.lead}</p>
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
                    <p className="mt-1 text-lg font-semibold text-slate-900">{metric.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-[#9a728a]">Why it feels better</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              One product language across the whole workspace
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8f2] text-theme-primary ring-1 ring-[rgba(229,69,146,0.12)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-[#715667]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
          <div className="brand-panel overflow-hidden rounded-[34px] p-8 text-center sm:p-12">
            <p className="text-sm uppercase tracking-[0.24em] text-[#9a728a]">Start softly, scale fast</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Bring Instagram into a calmer operating system
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[#715667]">
              Move from scattered replies to one polished CRM flow with Google onboarding, workspace switching, and a cleaner visual language from the first click.
            </p>
            <Button
              size="lg"
              className="brand-button-gradient mt-8 h-14 rounded-full px-10 text-base font-semibold"
              onClick={handleGoogleLogin}
            >
              Start with Google
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
