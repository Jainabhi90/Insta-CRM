import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, MessageSquare, Mail, Gift, Zap } from "lucide-react";

const automationSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  trigger: z.string().min(1, "Trigger keyword is required"),
  response: z.string().min(10, "Add a fuller reply so the automation is actually useful"),
  category: z.string().min(1, "Category is required"),
  icon: z.string().min(1, "Icon is required"),
});

export function CreateAutomationModal({ onClose, onSave }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger: "",
      response: "",
      category: "Sales",
      icon: "MessageSquare",
    }
  });

  const onValidSubmit = (payload) => {
    const cleanedPayload = {
      ...payload,
      name: payload.name.trim(),
      description: payload.description.trim(),
      trigger: payload.trigger.trim(),
      response: payload.response.trim(),
    };

    onSave(cleanedPayload);
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
          <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Order Confirmation"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g., Respond to order confirmation requests"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Lead Gen">Lead Gen</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-red-500 font-medium">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Controller
                  control={control}
                  name="icon"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  )}
                />
                {errors.icon && <p className="text-sm text-red-500 font-medium">{errors.icon.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Keywords</Label>
              <Input
                id="trigger"
                type="text"
                placeholder="e.g., order, status, tracking, shipped"
                {...register("trigger")}
              />
              {errors.trigger && <p className="text-sm text-red-500 font-medium mt-1">{errors.trigger.message}</p>}
              <p className="text-sm text-gray-500">
                Separate multiple keywords with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">Auto-Reply Message</Label>
              <Textarea
                id="response"
                placeholder="e.g., Thanks for reaching out! Your order is on the way. Track it here: [tracking-link]"
                {...register("response")}
                rows={4}
              />
              {errors.response && <p className="text-sm text-red-500 font-medium">{errors.response.message}</p>}
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
                className="flex-1 bg-theme-primary hover:bg-theme-primary-hover"
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
