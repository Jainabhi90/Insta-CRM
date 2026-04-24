import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, Sparkles } from "lucide-react";

export function PricingPage({ onGetStarted, onBackToHome, onLogin, onCreateAccount }) {
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
    <div className="brand-shell-bg min-h-screen text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/75 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button onClick={onBackToHome} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary via-[#f472b6] to-theme-accent text-white shadow-[0_22px_46px_-30px_rgba(214,64,134,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold">InstaLead</p>
              <p className="text-xs text-[#8d6780]">Pricing</p>
            </div>
          </button>
          <nav className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full border-[#f2d2e2] bg-white/85 text-slate-900 hover:bg-[#fff3f9]" onClick={onLogin || onGetStarted}>
              Log in
            </Button>
            <Button className="brand-button-gradient rounded-full px-5 font-semibold" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#9a728a]">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pick the workspace size that
            <span className="mt-2 block bg-gradient-to-r from-theme-primary via-[#ec4899] to-theme-accent bg-clip-text text-transparent">
              matches your growth
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#715667]">
            Same CRM flow, softer visual language, and enough room to scale from one account to a full portfolio.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="brand-panel-soft inline-flex rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "brand-button-gradient"
                  : "text-[#8d6780] hover:bg-[#fff3f9]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billingCycle === "yearly"
                  ? "brand-button-gradient"
                  : "text-[#8d6780] hover:bg-[#fff3f9]"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {Object.values(currentPlans).map((plan) => (
            <Card
              key={plan.name}
              className={`overflow-hidden rounded-[30px] border-0 ${
                plan.popular ? "brand-hero-card" : "brand-panel"
              }`}
            >
              <CardContent className="flex h-full flex-col p-7">
                <div className="mb-6">
                  {plan.popular ? (
                    <div className="mb-4 inline-flex rounded-full bg-[#fde8f2] px-3 py-1 text-xs font-semibold text-[#9f3f70]">
                      Most popular
                    </div>
                  ) : null}
                  <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#8d6780]">{plan.period}</p>
                  <div className="mt-4 rounded-[22px] bg-white/72 px-4 py-4 text-sm text-[#715667]">
                    <p>Connect <strong>{plan.accounts}</strong></p>
                    <p className="mt-1">Send up to <strong>{plan.dms}</strong></p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a728a]">Included</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-[#715667]">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#fde8f2] text-theme-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`mt-8 h-12 rounded-full font-semibold ${plan.buttonColor}`}
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
