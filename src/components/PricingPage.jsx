import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, Sparkles, Moon, Sun } from "lucide-react";

export function PricingPage({ onGetStarted, onBackToHome, onLogin, onCreateAccount, isDarkTheme, onToggleTheme }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricingPlans = {
    monthly: {
      free: {
        name: "Starter",
        price: "₹0",
        period: "Free forever",
        accounts: "1 Instagram Account",
        dms: "1,000 DMs per month",
        features: [
          "Access last 10 posts",
          "Link unlimited posts",
          "Posts & reels auto-reply",
          "Story automations",
          "Next post",
          "Inbox starters",
        ],
        buttonText: "Start free",
        buttonColor: "brand-button-gradient",
        popular: false,
      },
      pro: {
        name: "Pro",
        price: "₹199",
        period: "Per month",
        accounts: "3 Instagram Accounts",
        dms: "25,000 DMs per month",
        features: [
          "Everything in Starter",
          "Remove InstaLead branding",
          "Comment auto-reply",
          "Universal triggers",
          "Flow automation",
          "Lead gen",
          "DM planner",
          "Inbox automation",
          "Priority support",
        ],
        buttonText: "Upgrade to Pro",
        buttonColor: "bg-slate-900 hover:bg-slate-800 text-white",
        popular: true,
      },
      platinum: {
        name: "Scale",
        price: "₹499",
        period: "Per month",
        accounts: "10 Instagram Accounts",
        dms: "300,000 DMs per month",
        features: [
          "Everything in Pro",
          "Early access features",
          "Live chat with InstaLead",
          "DM overflow queue",
          "Teams (coming soon)",
        ],
        buttonText: "Choose Scale",
        buttonColor: "bg-white text-slate-900 hover:bg-[#fff3f9]",
        popular: false,
      },
    },
    yearly: {
      free: {
        name: "Starter",
        price: "₹0",
        period: "Free forever",
        accounts: "1 Instagram Account",
        dms: "1,000 DMs per month",
        features: [
          "Access last 10 posts",
          "Link unlimited posts",
          "Posts & reels auto-reply",
          "Story automations",
          "Next post",
          "Inbox starters",
        ],
        buttonText: "Start free",
        buttonColor: "brand-button-gradient",
        popular: false,
      },
      pro: {
        name: "Pro",
        price: "₹1,999",
        period: "Per year (save ₹389)",
        accounts: "3 Instagram Accounts",
        dms: "25,000 DMs per month",
        features: [
          "Everything in Starter",
          "Remove InstaLead branding",
          "Comment auto-reply",
          "Universal triggers",
          "Flow automation",
          "Lead gen",
          "DM planner",
          "Inbox automation",
          "Priority support",
        ],
        buttonText: "Upgrade to Pro",
        buttonColor: "bg-slate-900 hover:bg-slate-800 text-white",
        popular: true,
      },
      platinum: {
        name: "Scale",
        price: "₹4,999",
        period: "Per year (save ₹989)",
        accounts: "10 Instagram Accounts",
        dms: "300,000 DMs per month",
        features: [
          "Everything in Pro",
          "Early access features",
          "Live chat with InstaLead",
          "DM overflow queue",
          "Teams (coming soon)",
        ],
        buttonText: "Choose Scale",
        buttonColor: "bg-white text-slate-900 hover:bg-[#fff3f9]",
        popular: false,
      },
    },
  };

  const currentPlans = pricingPlans[billingCycle];

  return (
    <div className={`brand-shell-bg min-h-screen selection:bg-blue-100 ${isDarkTheme ? 'dark text-white' : 'text-[#1B4965]'}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${isDarkTheme
          ? 'bg-[#0B1F3B]/90 border-[#1B4965]/30'
          : 'bg-white/90 border-[#1B4965]/10'
        }`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button onClick={onBackToHome} className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-theme-accent text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className={`text-base font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>InstaLead</p>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDarkTheme ? 'text-[#BEE9E8]/60' : 'text-[#1B4965]/60'}`}>Pricing</p>
            </div>
          </button>
          <nav className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-2 transition-colors ${isDarkTheme
                  ? 'text-white hover:text-white'
                  : 'text-[#1B4965]/70 hover:text-[#1B4965]'
                }`}
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant="outline" className="rounded-full border-[#1B4965]/20 dark:border-[#BEE9E8]/30 bg-white/85 dark:bg-white/10 text-[#1B4965] dark:text-white hover:bg-[#F0F9FF] dark:hover:bg-white/20 transition-colors" onClick={onLogin || onGetStarted}>
              Log in
            </Button>
            <Button className="brand-button-gradient rounded-full font-semibold px-6" onClick={onCreateAccount || onGetStarted}>
              Google Onboarding
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6">
        <div className="text-center">
          <p className="mx-auto mt-4 max-w-2xl text-3xl  text-[#BEE9E8]/70  font-bold">
            Professional CRM tools with a clean, calm interface. Scale your business from one account to a full portfolio with ease.
          </p>
          <p className="text-sm uppercase tracking-[0.24em] text-[#62B6CB] font-bold">Transparent Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl text-gray-900">
            Pick the workspace size that
            <span className="mt-2 block bg-gradient-to-r from-theme-primary to-theme-accent bg-clip-text text-transparent">
              matches your growth
            </span>
          </h1>
          
        </div>

        <div className="mt-10 flex justify-center">
          <div className="bg-[#1B4965]/5 inline-flex rounded-full p-1 border border-[#1B4965]/10">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all ${billingCycle === "monthly"
                  ? "brand-button-gradient text-white shadow-md"
                  : "text-[#1B4965]/60 hover:text-[#1B4965]"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all ${billingCycle === "yearly"
                  ? "brand-button-gradient text-white shadow-md"
                  : "text-[#1B4965]/60 hover:text-[#1B4965]"
                }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-32 grid gap-6 lg:grid-cols-3">
          {Object.values(currentPlans).map((plan) => (
            <Card
              key={plan.name}
              className={`overflow-hidden rounded-[30px] border-0 transition-transform hover:scale-[1.02] duration-300 ${plan.popular ? "ring-2 ring-theme-primary shadow-2xl" : "brand-panel"
                }`}
            >
              <CardContent className="flex h-full flex-col p-8">
                <div className="mb-6">
                  {plan.popular ? (
                    <div className="mb-4 inline-flex rounded-full bg-[#E0F2FE] px-4 py-1 text-xs font-bold uppercase tracking-wider text-theme-primary">
                      Most popular
                    </div>
                  ) : null}
                  <h3 className="text-2xl font-bold text-[#0B1F3B]">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tight text-[#0B1F3B]">{plan.price}</span>
                    <span className="text-lg font-medium text-[#0B1F3B]/60">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#62B6CB] font-bold">{plan.period}</p>
                  <div className="mt-6 rounded-[22px] bg-[#F8FAFC] border border-[#1B4965]/5 px-6 py-4 text-sm text-[#0B1F3B]/80 font-medium">
                    <p className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-theme-primary" />
                      Connect <strong>{plan.accounts}</strong>
                    </p>
                    <p className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-theme-primary" />
                      Send up to <strong>{plan.dms}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#0B1F3B]/40">What's included</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[#0B1F3B] font-medium">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F0F9FF] text-theme-primary border border-theme-primary/10">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`mt-10 h-14 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 ${plan.popular
                      ? "brand-button-gradient hover:opacity-90 text-[#0B1F3B]"
                      : "brand-button-gradient text-[#0B1F3B]"
                    }`}
                  onClick={onCreateAccount || onGetStarted}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
