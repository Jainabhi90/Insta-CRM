import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check } from "lucide-react";

export function PricingPage({ onGetStarted, onBackToHome, onLogin, onCreateAccount }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricingPlans = {
    monthly: {
      free: {
        name: "Free",
        price: "₹0",
        period: "Free",
        accounts: "1 Instagram Account",
        dms: "1,000 DMs per month",
        features: [
          "Access Last 10 Posts",
          "Link Unlimited Posts",
          "Posts & Reels Auto-Reply",
          "Facebook Automations",
          "Story Automations",
          "Next Post",
          "Inbox Starters",
        ],
        buttonText: "Get Started for Free",
        buttonColor: "bg-[#2563eb] hover:bg-[#1d4ed8]",
        popular: false,
      },
      pro: {
        name: "Pro",
        price: "₹199",
        period: "Per month",
        accounts: "3 Instagram Accounts",
        dms: "25,000 DMs per month",
        features: [
          "Everything in Free, plus:",
          "Remove InstaLead Branding",
          "Comment Auto-Reply",
          "Universal Triggers",
          "Flow Automation",
          "Lead Gen [NEW]",
          "DM Planner [NEW]",
          "Follower Growth Tool",
          "Reminder DMs",
          "Access to Rewind",
          "Referral Program",
          "Inbox Automation",
          "Advertising Automation",
          "IG Live Automation",
          "Slow Down Mode",
          "Priority Support",
        ],
        buttonText: "Upgrade to Pro",
        buttonColor: "bg-[#f97316] hover:bg-[#ea580c]",
        popular: true,
      },
      platinum: {
        name: "Platinum+",
        price: "₹499",
        period: "Per month",
        accounts: "10 Instagram Accounts",
        dms: "300,000 DMs per month",
        features: [
          "Everything in Pro, plus:",
          "Early Access New Features",
          "Live Chat with InstaLead team",
          "DM Overflow Queue",
          "Teams [Coming Soon]",
        ],
        buttonText: "Upgrade to Platinum+",
        buttonColor: "bg-gray-700 hover:bg-gray-800",
        popular: false,
      },
    },
    yearly: {
      free: {
        name: "Free",
        price: "₹0",
        period: "Free",
        accounts: "1 Instagram Account",
        dms: "1,000 DMs per month",
        features: [
          "Access Last 10 Posts",
          "Link Unlimited Posts",
          "Posts & Reels Auto-Reply",
          "Facebook Automations",
          "Story Automations",
          "Next Post",
          "Inbox Starters",
        ],
        buttonText: "Get Started for Free",
        buttonColor: "bg-[#2563eb] hover:bg-[#1d4ed8]",
        popular: false,
      },
      pro: {
        name: "Pro",
        price: "₹1,999",
        period: "Per year (Save ₹389)",
        accounts: "3 Instagram Accounts",
        dms: "25,000 DMs per month",
        features: [
          "Everything in Free, plus:",
          "Remove InstaLead Branding",
          "Comment Auto-Reply",
          "Universal Triggers",
          "Flow Automation",
          "Lead Gen [NEW]",
          "DM Planner [NEW]",
          "Follower Growth Tool",
          "Reminder DMs",
          "Access to Rewind",
          "Referral Program",
          "Inbox Automation",
          "Advertising Automation",
          "IG Live Automation",
          "Slow Down Mode",
          "Priority Support",
        ],
        buttonText: "Upgrade to Pro",
        buttonColor: "bg-[#f97316] hover:bg-[#ea580c]",
        popular: true,
      },
      platinum: {
        name: "Platinum+",
        price: "₹4,999",
        period: "Per year (Save ₹989)",
        accounts: "10 Instagram Accounts",
        dms: "300,000 DMs per month",
        features: [
          "Everything in Pro, plus:",
          "Early Access New Features",
          "Live Chat with InstaLead team",
          "DM Overflow Queue",
          "Teams [Coming Soon]",
        ],
        buttonText: "Upgrade to Platinum+",
        buttonColor: "bg-gray-700 hover:bg-gray-800",
        popular: false,
      },
    },
  };

  const currentPlans = pricingPlans[billingCycle];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBackToHome} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-lg" />
            <span className="text-xl" style={{ fontWeight: 600 }}>InstaLead</span>
          </button>
          <nav className="flex items-center gap-6">
            <button 
              onClick={onBackToHome}
              className="text-gray-600 hover:text-[#2563eb] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Home
            </button>
            <Button variant="outline" onClick={onLogin || onGetStarted}>
              Log In
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#2563eb] text-white"
                  : "bg-transparent text-gray-700 hover:text-gray-900"
              }`}
              style={{ fontWeight: 500 }}
            >
              Monthly Pricing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[#2563eb] text-white"
                  : "bg-transparent text-gray-700 hover:text-gray-900"
              }`}
              style={{ fontWeight: 500 }}
            >
              Yearly Pricing
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow flex flex-col">
            <CardContent className="pt-8 pb-8 flex flex-col flex-1">
              <div className="mb-6">
                <h3 className="text-2xl mb-3" style={{ fontWeight: 600, color: "#2563eb" }}>
                  {currentPlans.free.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl" style={{ fontWeight: 700 }}>
                    {currentPlans.free.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{currentPlans.free.period}</p>
                <div className="text-sm mb-2">
                  <p>Connect <strong>{currentPlans.free.accounts}</strong></p>
                  <p>and send up to <strong>{currentPlans.free.dms}</strong></p>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <p className="mb-3" style={{ fontWeight: 600 }}>Free includes:</p>
                <ul className="space-y-2">
                  {currentPlans.free.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#2563eb] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${currentPlans.free.buttonColor} mt-auto`}
                onClick={onCreateAccount || onGetStarted}
                size="lg"
              >
                Connect Instagram
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-[#f97316] hover:shadow-xl transition-shadow relative bg-gradient-to-b from-orange-50/50 to-white flex flex-col">
            {currentPlans.pro.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
            )}
            <CardContent className="pt-8 pb-8 flex flex-col flex-1">
              <div className="mb-6">
                <h3 className="text-2xl mb-3" style={{ fontWeight: 600, color: "#f97316" }}>
                  {currentPlans.pro.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl" style={{ fontWeight: 700 }}>
                    {currentPlans.pro.price}
                  </span>
                  <span className="text-gray-500 text-lg">INR</span>
                </div>
                <p className="text-gray-600 mb-4">{currentPlans.pro.period}</p>
                <div className="text-sm mb-2">
                  <p>Connect up to <strong>{currentPlans.pro.accounts}</strong></p>
                  <p>& send up to <strong>{currentPlans.pro.dms}</strong></p>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <ul className="space-y-2">
                  {currentPlans.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.includes("Everything in") ? (
                        <span className="text-sm" style={{ fontWeight: 600 }}>{feature}</span>
                      ) : (
                        <>
                          <Check className="w-5 h-5 text-[#f97316] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${currentPlans.pro.buttonColor} mt-auto`}
                onClick={onCreateAccount || onGetStarted}
                size="lg"
              >
                Connect Instagram
              </Button>
            </CardContent>
          </Card>

          {/* Platinum+ Plan */}
          <Card className="border-2 border-gray-300 hover:shadow-lg transition-shadow flex flex-col">
            <CardContent className="pt-8 pb-8 flex flex-col flex-1">
              <div className="mb-6">
                <h3 className="text-2xl mb-3" style={{ fontWeight: 600, color: "#374151" }}>
                  {currentPlans.platinum.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl" style={{ fontWeight: 700 }}>
                    {currentPlans.platinum.price}
                  </span>
                  <span className="text-gray-500 text-lg">INR</span>
                </div>
                <p className="text-gray-600 mb-4">{currentPlans.platinum.period}</p>
                <div className="text-sm mb-2">
                  <p>Connect up to <strong>{currentPlans.platinum.accounts}</strong></p>
                  <p>& send up to <strong>{currentPlans.platinum.dms}</strong></p>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <ul className="space-y-2">
                  {currentPlans.platinum.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.includes("Everything in") ? (
                        <span className="text-sm" style={{ fontWeight: 600 }}>{feature}</span>
                      ) : (
                        <>
                          <Check className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full ${currentPlans.platinum.buttonColor} mt-auto`}
                onClick={onCreateAccount || onGetStarted}
                size="lg"
              >
                Connect Instagram
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
