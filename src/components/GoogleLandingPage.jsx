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
    <div
      className="isolate min-h-screen overflow-x-hidden text-slate-900"
      style={{ backgroundColor: "#f8fafc", color: "#0f172a" }}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="gl-blob gl-blob-left" />
        <div className="gl-blob gl-blob-right" />
        <div className="gl-grid" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <Sparkles className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-900">InstaLead</p>
              <p className="text-xs text-slate-500">Google Onboarding</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <a href="/pricing" className="hidden text-slate-600 transition-colors hover:text-slate-900 sm:inline">
              Pricing
            </a>
            <a href="/privacy" className="hidden text-slate-600 transition-colors hover:text-slate-900 md:inline">
              Privacy
            </a>
            <Button
              size="sm"
              className="rounded-full !bg-slate-200 px-4 font-semibold !text-slate-900 shadow-sm transition-transform hover:scale-[1.03] hover:!bg-slate-300"
              onClick={handleGoogleLogin}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
          <div className="gl-rise space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <Zap className="h-4 w-4 text-slate-500" />
              Built for creators scaling from DMs
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Premium Instagram CRM,
                <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                  one Google sign-in away
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Same product flow, now with a cleaner off-white and gray presentation for a more professional feel.
                Connect Google, then plug in Instagram and start converting comment intent into revenue.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="h-14 rounded-full !bg-slate-200 px-8 text-base font-semibold !text-slate-900 shadow-sm transition-transform hover:scale-[1.02] hover:!bg-slate-300"
                onClick={handleGoogleLogin}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Continue with Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-slate-500" />
                Free 14-day trial, no credit card
              </div>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Average setup", value: "3 mins" },
                { label: "Brands onboarded", value: "500+" },
                { label: "Reply speed uplift", value: "9x" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="gl-float relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-slate-300/40 via-transparent to-slate-200/60 blur-2xl" />
            <Card className="relative rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,.08)] backdrop-blur-xl">
              <CardContent className="space-y-6 p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Live Pipeline</p>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    Revenue Mode
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { stage: "Comment Trigger", lead: "@stylebyria", value: "Warm", tone: "from-slate-700 to-slate-900" },
                    { stage: "Auto DM Sent", lead: "@urbanbrewco", value: "Hot", tone: "from-slate-700 to-slate-800" },
                    { stage: "Manual Follow-up", lead: "@mynaturebox", value: "Closing", tone: "from-slate-600 to-slate-700" },
                  ].map((row, index) => (
                    <div
                      key={row.lead}
                      className="gl-stagger rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-medium text-slate-900">{row.stage}</p>
                        <span className={`rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-semibold text-white ${row.tone}`}>
                          {row.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{row.lead}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Auto replies", amount: "2.4k" },
                    { label: "Active leads", amount: "418" },
                    { label: "Won today", amount: "27" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{metric.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Core stack</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Designed with space, clarity, and restraint</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Comment-to-DM automation",
                description: "Trigger personalized replies from post comments and keep brand voice consistent.",
                accent: "from-sky-500/35 to-blue-600/30",
              },
              {
                icon: Target,
                title: "Lead scoring board",
                description: "Sort hot leads first with intent signals so your team closes faster.",
                accent: "from-orange-500/35 to-orange-700/25",
              },
              {
                icon: BarChart3,
                title: "Revenue analytics",
                description: "Track which campaign conversations produce pipeline and actual sales.",
                accent: "from-emerald-500/30 to-teal-700/25",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-slate-300"
                >
                  <CardContent className="relative p-6">
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl ${feature.accent}`} />
                    <div className="relative">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                      <p className="mt-3 text-slate-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,.08)] sm:p-12">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Launch fast</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Make your onboarding feel calm and polished</h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              This version uses a minimal off-white and gray system with more space, cleaner contrast, and subtle motion.
            </p>
            <Button
              size="lg"
              className="mt-8 h-14 rounded-full !bg-slate-200 px-10 text-base font-semibold !text-slate-900 shadow-sm transition-transform hover:scale-[1.02] hover:!bg-slate-300"
              onClick={handleGoogleLogin}
            >
              Start with Google
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 md:flex-row md:px-6">
          <p>© 2026 InstaLead. Built for modern Instagram teams.</p>
          <div className="flex items-center gap-5">
            <a href="/terms" className="transition-colors hover:text-slate-900">Terms</a>
            <a href="/privacy" className="transition-colors hover:text-slate-900">Privacy</a>
          </div>
        </div>
      </footer>

      <style>{`
        .gl-blob {
          position: absolute;
          border-radius: 999px;
          filter: blur(68px);
          opacity: 0.12;
          animation: glPulse 9s ease-in-out infinite;
        }

        .gl-blob-left {
          width: 360px;
          height: 360px;
          left: -120px;
          top: 120px;
          background: radial-gradient(circle at 30% 30%, rgba(148, 163, 184, 0.9), rgba(148, 163, 184, 0));
        }

        .gl-blob-right {
          width: 380px;
          height: 380px;
          right: -130px;
          top: 280px;
          animation-delay: 1.7s;
          background: radial-gradient(circle at 60% 40%, rgba(203, 213, 225, 0.85), rgba(203, 213, 225, 0));
        }

        .gl-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(148, 163, 184, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.035) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(circle at center, black 25%, transparent 78%);
        }

        .gl-rise {
          animation: glRise 700ms ease-out both;
        }

        .gl-float {
          animation: glFloat 6s ease-in-out infinite;
        }

        .gl-stagger {
          animation: glRise 680ms ease-out both;
        }

        @keyframes glPulse {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-10px) scale(1.05);
            opacity: 0.5;
          }
        }

        @keyframes glRise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
