import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PLAN_TIER_MAP = {
  free: "free",
  pro: "premium",
  platinum: "premium_plus",
}

const PLAN_RANK = {
  free: 0,
  premium: 1,
  premium_plus: 2,
}

export function PricingPage({
  onGetStarted,
  onBackToHome,
  onLogin,
  onCreateAccount,
  onSelectPlan,
  currentSubscription = null,
  checkoutState = null,
  pricingContext = null,
}) {
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
        buttonColor: "bg-slate-900 text-white",
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
        buttonColor: "bg-slate-900 text-white",
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
        buttonColor: "bg-slate-900 text-white",
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
        buttonColor: "bg-slate-900 text-white",
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
        buttonColor: "bg-slate-900  text-white",
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
        buttonColor: "bg-slate-900 text-white",
        popular: false,
      },
    },
  };

  const currentPlans = pricingPlans[billingCycle];
  const currentTier = currentSubscription?.tier || currentSubscription?.subscriptionTier || ""
  const currentPlanName = currentSubscription?.planName || "Free"
  const currentBillingCycle = currentSubscription?.billingCycle || "monthly"
  const currentPlanRank = PLAN_RANK[currentTier] ?? -1
  const pricingMessage =
    checkoutState?.message ||
    (pricingContext?.reason === "dm_limit"
      ? `You have reached the DM send cap on your ${currentPlanName} plan. Upgrade to unlock more sends per automation.`
      : pricingContext?.reason === "automation_limit"
        ? `You have reached the automation cap on your ${currentPlanName} plan. Upgrade to create more rules for this Instagram account.`
        : currentSubscription
          ? `Current status: ${currentPlanName} plan · ${currentSubscription?.limits?.automationLimit || 1} automation${currentSubscription?.limits?.automationLimit === 1 ? "" : "s"} · ${currentSubscription?.limits?.dmLimitPerAutomation || 10} DMs per automation.`
          : "")

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans antialiased">
      {/* Sticky Top Navigation Bar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 md:px-10">
          {/* Logo */}
          <button onClick={onBackToHome} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-all group-hover:bg-slate-800">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">InstaLead</span>
          </button>

          

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-slate-600  rounded-full border-2 hover:bg-slate-50 font-bold" onClick={onLogin || onGetStarted}>
              Log in
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-5 md:px-7 h-11 font-bold shadow-lg" onClick={onCreateAccount || onGetStarted}>
              GetStarted
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="p-4 sm:p-8">
        {/* Main Outer Banner Frame Container */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20 pb-64 px-6 relative overflow-hidden shadow-[0_30px_70px_rgba(15,23,42,0.3)]"
        >
          
          {/* =========================================================================
              LEFT-SIDE LAYERED TRANSLUCENT PANELS
             ========================================================================= */}
          <div 
            className="absolute left-0 top-30 bottom-0 w-[40%] bg-white/[0.08] backdrop-blur-md border-r border-white/10 pointer-events-none hidden md:block"
            style={{
              borderRadius: '0 3.5rem 3.5rem 0',
              maskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)'
            }}
          />
          <div 
            className="absolute left-[4%] top-12 bottom-12 w-[30%] bg-white/[0.06] backdrop-blur-sm border-r border-white/5 pointer-events-none hidden md:block"
            style={{
              borderRadius: '0 2.5rem 2.5rem 0',
              maskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)'
            }}
          />
          <div 
            className="absolute left-[8%] top-24 bottom-24 w-[15%] bg-white/[0.03] backdrop-blur-[2px] border-r border-white-[0.02] pointer-events-none hidden md:block"
            style={{
              borderRadius: '0 1.5rem 1.5rem 0',
              maskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)'
            }}
          />

          {/* =========================================================================
              RIGHT-SIDE LAYERED TRANSLUCENT PANELS
             ========================================================================= */}
          <div 
            className="absolute right-0 top-30 bottom-0 w-[40%] bg-white/[0.08] backdrop-blur-md border-l border-white/10 pointer-events-none hidden md:block"
            style={{
              borderRadius: '3.5rem 0 0 3.5rem',
              maskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)'
            }}
          />
          <div 
            className="absolute right-[4%] top-12 bottom-12 w-[30%] bg-white/[0.06] backdrop-blur-sm border-l border-white/5 pointer-events-none hidden md:block"
            style={{
              borderRadius: '2.5rem 0 0 2.5rem',
              maskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)'
            }}
          />
          <div 
            className="absolute right-[8%] top-24 bottom-24 w-[15%] bg-white/[0.03] backdrop-blur-[2px] border-l border-white-[0.02] pointer-events-none hidden md:block"
            style={{
              borderRadius: '0 1.5rem 1.5rem 0',
              maskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)'
            }}
          />

          {/* =========================================================================
              CONTENT WRAPPER (Hero Title)
             ========================================================================= */}
          <div className="relative z-10 w-full flex flex-col items-center">
            
            <div className="text-center mt-4 mb-16 max-w-4xl">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]"
              >
                Pick the workspace size that <br></br> matches your growth
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto"
              >
                Choose a plan that fits your business needs and budget. No hidden fees, no surprises—just straightforward pricing for powerful DM automation.
              </motion.p>
              {pricingMessage ? (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="mt-4 text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto"
                >
                  {pricingMessage}
                </motion.p>
              ) : null}

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 flex justify-center"
              >
                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 inline-flex shadow-inner">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all duration-300 ${
                      billingCycle === "monthly"
                        ? "bg-white text-slate-950 shadow-md"
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`rounded-full px-8 py-2.5 text-sm font-bold transition-all duration-300 ${
                      billingCycle === "yearly"
                        ? "bg-white text-slate-950 shadow-md"
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

      {/* PRICING CARDS - Positioned with negative margin to overlap the banner */}
      <div className="max-w-7xl mx-auto px-6 -mt-44 relative z-20 pb-20">
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {Object.entries(currentPlans).map(([planKey, plan], index) => {
            const tier = PLAN_TIER_MAP[planKey] || "free"
            const isCurrentPlan =
              Boolean(currentTier) &&
              tier === currentTier &&
              (tier === "free" || billingCycle === currentBillingCycle)
            const isLowerOrIncluded = Boolean(currentTier) && PLAN_RANK[tier] < currentPlanRank
            const isCheckoutPending = checkoutState?.pendingPlanKey === `${tier}:${billingCycle}`
            const buttonText = isCurrentPlan
              ? "Current Plan"
              : isLowerOrIncluded
                ? `Included in ${currentPlanName}`
                : isCheckoutPending
                  ? "Opening checkout..."
                  : plan.buttonText
            const buttonDisabled = isCurrentPlan || isLowerOrIncluded || isCheckoutPending
            const handlePlanAction = () => {
              if (tier === "free") {
                ;(onCreateAccount || onGetStarted)?.()
                return
              }

              if (typeof onSelectPlan === "function") {
                onSelectPlan({ tier, billingCycle })
                return
              }

              ;(onCreateAccount || onGetStarted)?.()
            }

            return (
            <motion.div
              key={`${billingCycle}-${plan.name}`}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card
                className={`overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col h-full ${
                  plan.popular ? "ring-4 ring-[#2563eb]/10" : ""
                }`}
              >
                <CardContent className="flex h-full flex-col p-8 md:p-10">
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-inner">
                        <Sparkles className="h-5 w-5 fill-current" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{plan.name} Plan</h3>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                      
                    </div>
                    <p className="mt-2 text-sm text-[#8d6780]">{plan.period}</p>
                    <div className="mt-4 rounded-[22px] bg-white/72 px-4 py-4 text-sm text-[#715667]">
                      <p>Connect <strong>{plan.accounts}</strong></p>
                      <p className="mt-1">Send up to <strong>{plan.dms}</strong></p>
                    </div>
                  </div>

                  <div className="flex-1 mb-10 border-t border-slate-50 pt-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                            <Check className="h-3 w-3" strokeWidth={4} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`h-14 rounded-full font-bold text-base transition-all ${
                      plan.popular 
                      ? "bg-slate-900 text-white  shadow-xl shadow-slate-500/20" 
                      : "bg-transparent text-slate-900 border-2 border-slate-100 hover:border-slate-900 "
                    }`}
                    onClick={handlePlanAction}
                    disabled={buttonDisabled}
                  >
                    {buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )})}
        </div>
        </div>
      </div>
    </div>
  );
}
