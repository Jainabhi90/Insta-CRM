import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageSquare, Mail, Gift, Plus, Zap, Play, Square, Trash2 } from "lucide-react";
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
    sentCount: Number(template.sentCount || 0),
    dmLimit: Number(template.dmLimit || 3),
  };
}

export function Automations({
  summary,
  initialTemplates,
  tip,
  availablePosts = [],
  onCreateAutomation,
  onToggleAutomation,
  onDeleteAutomation,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState(() =>
    (initialTemplates || []).map(mapTemplate)
  );
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    setTemplates((initialTemplates || []).map(mapTemplate));
  }, [initialTemplates]);

  const toggleTemplate = async (id) => {
    const currentTemplate = templates.find((template) => template.id === id);

    if (!currentTemplate) {
      return;
    }

    const nextEnabled = !currentTemplate.enabled;
    setStatus({ type: "", message: "" });
    setTogglingId(id);

    try {
      if (typeof onToggleAutomation === "function") {
        const updatedTemplate = await onToggleAutomation(id, nextEnabled);
        setTemplates((prev) =>
          prev.map((template) =>
            template.id === id ? mapTemplate(updatedTemplate, 0) : template,
          ),
        );
      } else {
        setTemplates((prev) =>
          prev.map((template) =>
            template.id === id ? { ...template, enabled: nextEnabled } : template,
          ),
        );
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Automation toggle failed.",
      });
    } finally {
      setTogglingId("");
    }
  };

  const handleDeleteTemplate = async (id) => {
    const removedTemplate = templates.find((t) => t.id === id);
    if (!removedTemplate) return;

    // Optimistically remove it from the UI immediately
    setDeletingId(id);
    setStatus({ type: "", message: "" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));

    try {
      if (typeof onDeleteAutomation === "function") {
        await onDeleteAutomation(id);
      }
      setStatus({ type: "success", message: "Automation deleted." });
    } catch (error) {
      // Restore the card if deletion failed
      setTemplates((prev) => {
        const alreadyPresent = prev.find((t) => t.id === id);
        return alreadyPresent ? prev : [...prev, removedTemplate];
      });
      setStatus({
        type: "error",
        message: error?.message || "Could not delete automation.",
      });
    } finally {
      setDeletingId("");
    }
  };

  const handleCreateAutomation = async (automation) => {
    setStatus({ type: "", message: "" });
    setIsSaving(true);

    try {
      if (typeof onCreateAutomation === "function") {
        const createdAutomation = await onCreateAutomation(automation);
        setTemplates((prev) => [...prev, mapTemplate(createdAutomation, prev.length)]);
      } else {
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
      }

      setShowCreateModal(false);
      setStatus({
        type: "success",
        message: "Automation saved and ready to run.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Automation could not be saved.",
      });
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 mt-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Automation Playbook</h1>
            <p className="mt-1 text-sm text-slate-500">
              Build reply flows and switch rules on when the timing is right.
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Automation
          </Button>
        </div>

        {status.message ? (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Active automations</p>
            <p className="text-3xl font-semibold tracking-tight text-gray-900">{enabledCount}/{templates.length}</p>
            <p className="text-sm text-emerald-600 mt-2">Ready when new replies arrive</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Replies today</p>
            <p className="text-3xl font-semibold tracking-tight text-gray-900">{stats.autoRepliesToday}</p>
            <p className="text-sm text-gray-500 mt-2">Average response: {stats.averageResponseTime}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Time saved</p>
            <p className="text-3xl font-semibold tracking-tight text-gray-900">{stats.timeSaved}</p>
            <p className="text-sm text-gray-500 mt-2">{stats.timeSavedLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.length > 0 ? templates.map((template) => {
            const Icon = template.icon;
            
            return (
              <Card
                key={template.id}
                className={`overflow-hidden border transition-all duration-200 rounded-2xl ${
                  template.enabled
                    ? "border-indigo-200 bg-indigo-50/30 shadow-md ring-1 ring-inset ring-indigo-100"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          template.enabled
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500"
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
                              ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                              : template.category === "Lead Gen"
                              ? "border-amber-200 text-amber-700 bg-amber-50"
                              : "border-blue-200 text-blue-700 bg-blue-50"
                          }
                        >
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 -mt-1 -mr-2">
                      {template.sentCount >= template.dmLimit ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                          DM limit exceeds ({template.sentCount}/{template.dmLimit})
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          DMs: {template.sentCount}/{template.dmLimit}
                        </span>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        onClick={() => handleDeleteTemplate(template.id)}
                        title="Delete automation"
                        disabled={deletingId === template.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        When user says:
                      </p>
                      <div className="bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                        {template.trigger}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        Auto-reply with:
                      </p>
                      <div className="bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                        {template.response}
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-100">
                      {template.sentCount >= template.dmLimit ? (
                        <Button 
                          className="w-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed font-medium shadow-none"
                          disabled
                        >
                          <Square className="w-4 h-4 mr-2" />
                          DM Limit Exceeded
                        </Button>
                      ) : template.enabled ? (
                        <Button 
                          variant="outline" 
                          className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-200"
                          onClick={() => toggleTemplate(template.id)}
                          disabled={togglingId === template.id}
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop Automation
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          onClick={() => toggleTemplate(template.id)}
                          disabled={togglingId === template.id}
                        >
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Start Automation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="border border-dashed border-gray-300 bg-white md:col-span-2">
              <CardContent className="py-12 text-center">
                <h3 className="text-lg text-gray-900 mb-2 font-semibold">
                  No automation rules yet
                </h3>
                <p className="text-gray-600 mb-5">
                  Create your first automation to start handling common Instagram replies automatically.
                </p>
                <Button
                        className="bg-slate-900 hover:bg-slate-800"
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
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">{tipContent.title}</h3>
          <p className="text-sm text-gray-700">
            {tipContent.body}
          </p>
        </div>
      </div>
      {showCreateModal && (
        <CreateAutomationModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAutomation}
          availablePosts={availablePosts}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
