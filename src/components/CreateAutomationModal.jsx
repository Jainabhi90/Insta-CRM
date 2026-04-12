import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, MessageSquare, Mail, Gift, Zap } from "lucide-react";

export function CreateAutomationModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger: "",
    response: "",
    category: "Sales",
    icon: "MessageSquare",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      trigger: formData.trigger.trim(),
      response: formData.response.trim(),
    };

    if (!payload.name || !payload.description || !payload.trigger || !payload.response) {
      setErrorMessage("Complete all fields before creating the automation.");
      return;
    }

    if (payload.response.length < 10) {
      setErrorMessage("Add a fuller reply so the automation is actually useful.");
      return;
    }

    setErrorMessage("");
    onSave(payload);
    onClose();
  };

  const icons = [
    { value: "MessageSquare", label: "Message", icon: MessageSquare },
    { value: "Mail", label: "Mail", icon: Mail },
    { value: "Gift", label: "Gift", icon: Gift },
    { value: "Zap", label: "Zap", icon: Zap },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-2xl">Create Custom Automation</CardTitle>
          <CardDescription>
            Set up a new auto-reply template for your Instagram DMs
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Order Confirmation"
                value={formData.name}
                onChange={(e) => {
                  setErrorMessage("");
                  setFormData({ ...formData, name: e.target.value });
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g., Respond to order confirmation requests"
                value={formData.description}
                onChange={(e) => {
                  setErrorMessage("");
                  setFormData({ ...formData, description: e.target.value });
                }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setErrorMessage("");
                    setFormData({ ...formData, category: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Lead Gen">Lead Gen</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => {
                    setErrorMessage("");
                    setFormData({ ...formData, icon: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Keywords</Label>
              <Input
                id="trigger"
                type="text"
                placeholder="e.g., order, status, tracking, shipped"
                value={formData.trigger}
                onChange={(e) => {
                  setErrorMessage("");
                  setFormData({ ...formData, trigger: e.target.value });
                }}
                required
              />
              <p className="text-sm text-gray-500">
                Separate multiple keywords with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">Auto-Reply Message</Label>
              <Textarea
                id="response"
                placeholder="e.g., Thanks for reaching out! Your order is on the way. Track it here: [tracking-link]"
                value={formData.response}
                onChange={(e) => {
                  setErrorMessage("");
                  setFormData({ ...formData, response: e.target.value });
                }}
                rows={4}
                required
              />
              <p className="text-sm text-gray-500">
                This message will be sent automatically when triggers are detected
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8]"
              >
                Create Automation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
