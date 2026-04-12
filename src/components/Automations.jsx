import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageSquare, Mail, Gift, Plus, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateAutomationModal } from "./CreateAutomationModal";

const iconMap = {
  MessageSquare,
  Mail,
  Gift,
  Zap,
};

const defaultSummary = {
  autoRepliesToday: 0,
  averageResponseTime: "0 sec",
  timeSaved: "0 hrs",
  timeSavedLabel: "Create your first rule to start saving time",
};

const defaultTip = {
  title: "No automations yet",
  body: "Create your first automation rule to start replying faster inside InstaLead.",
};

function mapTemplate(template, index) {
  return {
    id: template.id || `${index + 1}`,
    name: template.name,
    description: template.description,
    trigger: template.trigger,
    response: template.response,
    icon: iconMap[template.iconName || template.icon] || MessageSquare,
    iconName: template.iconName || template.icon || "MessageSquare",
    category: template.category,
    enabled: Boolean(template.enabled),
  };
}

export function Automations({ summary, initialTemplates, tip }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState(() =>
    (initialTemplates || []).map(mapTemplate)
  );

  useEffect(() => {
    setTemplates((initialTemplates || []).map(mapTemplate));
  }, [initialTemplates]);

  const toggleTemplate = (id) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleCreateAutomation = (automation) => {
    const newTemplate = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `automation-${Date.now()}`,
      name: automation.name.trim(),
      description: automation.description.trim(),
      trigger: automation.trigger.trim(),
      response: automation.response.trim(),
      icon: iconMap[automation.icon] || MessageSquare,
      iconName: automation.icon,
      category: automation.category,
      enabled: true,
    };

    setTemplates((prev) => [...prev, newTemplate]);
  };

  const enabledCount = templates.filter((t) => t.enabled).length;
  const stats = {
    ...defaultSummary,
    ...summary,
  };
  const tipContent = {
    ...defaultTip,
    ...tip,
  };

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
            <p className="text-3xl" style={{ fontWeight: 700 }}>{stats.autoRepliesToday}</p>
            <p className="text-sm text-gray-600 mt-1">Avg response: {stats.averageResponseTime}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Time Saved</p>
            <p className="text-3xl" style={{ fontWeight: 700 }}>{stats.timeSaved}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.timeSavedLabel}</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.length > 0 ? templates.map((template) => {
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
          }) : (
            <Card className="border border-dashed border-gray-300 bg-white md:col-span-2">
              <CardContent className="py-12 text-center">
                <h3 className="text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>
                  No automation rules yet
                </h3>
                <p className="text-gray-600 mb-5">
                  Create your first automation to start handling common Instagram replies automatically.
                </p>
                <Button
                  className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Automation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>💡 {tipContent.title}</h3>
          <p className="text-gray-700">
            {tipContent.body}
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
