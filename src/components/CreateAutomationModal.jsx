import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
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
  mediaId: z.string().min(1, "Select a post for this automation"),
});

export function CreateAutomationModal({ onClose, onSave, availablePosts = [], isSaving = false }) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      trigger: "",
      response: "",
      category: "Sales",
      icon: "MessageSquare",
      mediaId: availablePosts[0]?.id || "",
    }
  });

  const onValidSubmit = (payload) => {
    clearErrors();

    const validation = automationSchema.safeParse(payload);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName, {
            type: "manual",
            message: issue.message,
          });
        }
      });

      return;
    }

    const selectedPost =
      availablePosts.find((post) => String(post.id) === String(payload.mediaId)) || null

    const cleanedPayload = {
      ...validation.data,
      name: validation.data.name.trim(),
      description: validation.data.description.trim(),
      trigger: validation.data.trigger.trim(),
      response: validation.data.response.trim(),
      mediaCaption: selectedPost?.caption || "",
      mediaThumbnail: selectedPost?.thumbnail || "",
      mediaPermalink: selectedPost?.permalink || "",
      mediaType: selectedPost?.mediaType || "",
    };

    onSave(cleanedPayload);
  };

  const icons = [
    { value: "MessageSquare", label: "Message", icon: MessageSquare },
    { value: "Mail", label: "Mail", icon: Mail },
    { value: "Gift", label: "Gift", icon: Gift },
    { value: "Zap", label: "Zap", icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <Card className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_40px_120px_-65px_rgba(15,23,42,0.85)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="border-b border-slate-200 pb-6">
          <CardTitle className="text-2xl tracking-tight">Create Custom Automation</CardTitle>
          <CardDescription className="max-w-xl leading-6">
            Set the post, keywords, and reply you want ready the moment new conversations begin.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mediaId">Instagram Post</Label>
              <Controller
                control={control}
                name="mediaId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the post this automation should watch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePosts.length > 0 ? (
                        availablePosts.map((post) => (
                          <SelectItem key={post.id} value={String(post.id)}>
                            {(post.caption || "Instagram post").slice(0, 60)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__no_posts__" disabled>
                          No posts available yet
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.mediaId && <p className="text-sm text-red-500 font-medium">{errors.mediaId.message}</p>}
              <p className="text-sm text-slate-500">
                This automation stays focused on the post you choose here.
              </p>
            </div>

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
              <p className="text-sm text-slate-500">
                Separate multiple keywords with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">Reply Message</Label>
              <Textarea
                id="response"
                placeholder="e.g., Thanks for reaching out! Your order is on the way. Track it here: [tracking-link]"
                {...register("response")}
                rows={4}
              />
              {errors.response && <p className="text-sm text-red-500 font-medium">{errors.response.message}</p>}
              <p className="text-sm text-slate-500">
                This message is used when the selected keywords are matched.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-2xl bg-slate-900 hover:bg-slate-800"
                disabled={isSaving || availablePosts.length === 0}
              >
                {isSaving ? "Saving..." : "Create Automation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
