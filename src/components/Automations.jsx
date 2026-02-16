import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageSquare, Mail, Gift, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { CreateAutomationModal } from "./CreateAutomationModal";

export function Automations() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "Price Inquiry",
      description: "Auto-respond when users ask about pricing",
      trigger: "Price, cost, kitne ka, how much",
      response: "Thanks for your interest! 🎉 Check our catalog: bit.ly/shop-link. DM 'BUY' to place order!",
      icon: MessageSquare,
      category: "Sales",
      enabled: true,
    },
    {
      id: "2",
      name: "Lead Magnet",
      description: "Collect emails for free guides",
      trigger: "Guide, free, download, ebook",
      response: "Great! 📚 Share your email and I'll send the free guide instantly.",
      icon: Gift,
      category: "Lead Gen",
      enabled: true,
    },
    {
      id: "3",
      name: "Availability Check",
      description: "Respond to stock inquiries",
      trigger: "Available, stock, in stock",
      response: "Yes! ✅ It's in stock. DM 'ORDER' with your size/variant to proceed.",
      icon: MessageSquare,
      category: "Sales",
      enabled: false,
    },
    {
      id: "4",
      name: "Customer Support",
      description: "Handle common support questions",
      trigger: "Help, support, issue, problem",
      response: "We're here to help! 💬 Please describe your issue and we'll get back to you in 2 hours.",
      icon: Mail,
      category: "Support",
      enabled: true,
    },
    {
      id: "5",
      name: "Shipping Info",
      description: "Answer shipping questions",
      trigger: "Shipping, delivery, when will I get",
      response: "We ship pan-India! 🚚 Delivery in 3-5 days. Free shipping on orders above ₹499.",
      icon: MessageSquare,
      category: "Sales",
      enabled: false,
    },
    {
      id: "6",
      name: "Discount Inquiry",
      description: "Share current offers",
      trigger: "Discount, offer, sale, coupon",
      response: "Yes! 🎊 Use code INSTA20 for 20% off. Valid till this Sunday!",
      icon: Gift,
      category: "Sales",
      enabled: true,
    },
  ]);

  const toggleTemplate = (id) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleCreateAutomation = (automation) => {
    const iconMap = {
      MessageSquare,
      Mail,
      Gift,
      Zap,
    };

    const newTemplate = {
      id: (templates.length + 1).toString(),
      name: automation.name,
      description: automation.description,
      trigger: automation.trigger,
      response: automation.response,
      icon: iconMap[automation.icon] || MessageSquare,
      category: automation.category,
      enabled: true,
    };

    setTemplates((prev) => [...prev, newTemplate]);
  };

  const enabledCount = templates.filter((t) => t.enabled).length;

  return (
    <>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl mb-2" style={{ fontWeight: 600 }}>Automation Playbook</h1>
              <p className="text-gray-600">
                Simple templates to automate your Instagram replies. No flowcharts needed.
              </p>
            </div>
            <Button 
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Custom
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Active Automations</p>
            <p className="text-3xl" style={{ fontWeight: 700 }}>{enabledCount}/{templates.length}</p>
            <p className="text-sm text-green-600 mt-1">Working 24/7</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Auto-Replies Today</p>
            <p className="text-3xl" style={{ fontWeight: 700 }}>142</p>
            <p className="text-sm text-gray-600 mt-1">Avg response: 8 sec</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Time Saved</p>
            <p className="text-3xl" style={{ fontWeight: 700 }}>3.2 hrs</p>
            <p className="text-sm text-gray-600 mt-1">Just today</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            
            return (
              <Card
                key={template.id}
                className={`border-2 transition-all ${
                  template.enabled
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-gray-200 bg-white"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          template.enabled
                            ? "bg-[#2563eb] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            template.category === "Sales"
                              ? "border-green-300 text-green-700 bg-green-50"
                              : template.category === "Lead Gen"
                              ? "border-orange-300 text-orange-700 bg-orange-50"
                              : "border-blue-300 text-blue-700 bg-blue-50"
                          }
                        >
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={template.enabled}
                      onCheckedChange={() => toggleTemplate(template.id)}
                    />
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1" style={{ fontWeight: 500 }}>
                        When user says:
                      </p>
                      <div className="bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                        {template.trigger}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1" style={{ fontWeight: 500 }}>
                        Auto-reply with:
                      </p>
                      <div className="bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                        {template.response}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>💡 Pro Tip</h3>
          <p className="text-gray-700">
            Templates work best when combined. Enable "Price Inquiry" + "Discount Inquiry" to maximize
            conversions. The more specific your triggers, the better your response rate.
          </p>
        </div>
      </div>
      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAutomation}
        />
      )}
    </>
  );
}
