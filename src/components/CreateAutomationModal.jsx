import { Button } from "./ui/button";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, MessageSquare, Mail, Gift, Zap } from "lucide-react";

const requiredText = (label, maxLength) => {
  const baseField =
    typeof maxLength === "number"
      ? z.string().min(1, `${label} is required`).max(maxLength, `${label} is too long`)
      : z.string().min(1, `${label} is required`);

  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    baseField,
  );
};

const automationSchema = z.object({
  name: requiredText("Name", 50),
  description: requiredText("Description"),
  trigger: requiredText("Trigger keyword"),
  response: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().min(10, "Add a fuller reply so the automation is actually useful"),
  ),
  category: requiredText("Category"),
  icon: requiredText("Icon"),
  mediaId: requiredText("Instagram post"),
});

export function CreateAutomationModal({ onClose, onSave, availablePosts = [], isSaving = false }) {
  const normalizedPosts = useMemo(
    () =>
      availablePosts.map((post) => ({
        ...post,
        id: String(post.id),
      })),
    [availablePosts],
  );

  const {
    register,
    handleSubmit,
    control,
    getValues,
    clearErrors,
    setError,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      trigger: "",
      response: "",
      category: "Sales",
      icon: "MessageSquare",
      mediaId: normalizedPosts[0]?.id || "",
    },
  });

  useEffect(() => {
    if (normalizedPosts.length === 0) {
      setValue("mediaId", "", { shouldValidate: true });
      return;
    }

    const currentMediaId = String(getValues("mediaId") || "");
    const currentPostStillExists = normalizedPosts.some((post) => post.id === currentMediaId);

    if (!currentPostStillExists) {
      setValue("mediaId", normalizedPosts[0].id, { shouldValidate: true });
    }
  }, [getValues, normalizedPosts, setValue]);

  const onValidSubmit = async (payload) => {
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
      normalizedPosts.find((post) => post.id === String(validation.data.mediaId)) || null;

    const cleanedPayload = {
      ...validation.data,
      mediaCaption: selectedPost?.caption || "",
      mediaThumbnail: selectedPost?.thumbnail || "",
      mediaPermalink: selectedPost?.permalink || "",
      mediaType: selectedPost?.mediaType || "",
    };

    await onSave(cleanedPayload);
  };

  const icons = [
    { value: "MessageSquare", label: "Message", icon: MessageSquare },
    { value: "Mail", label: "Mail", icon: Mail },
    { value: "Gift", label: "Gift", icon: Gift },
    { value: "Zap", label: "Zap", icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <Card className="relative flex max-h-[min(calc(100vh-2rem),920px)] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff7fb_45%,#fff1f8_100%)] shadow-[0_40px_120px_-65px_rgba(15,23,42,0.85)]">
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

        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <form onSubmit={handleSubmit(onValidSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="mediaId">Instagram Post</Label>
                <Controller
                  control={control}
                  name="mediaId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]">
                        <SelectValue placeholder="Select the post this automation should watch" />
                      </SelectTrigger>
                      <SelectContent>
                        {normalizedPosts.length > 0 ? (
                          normalizedPosts.map((post) => (
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
                {errors.mediaId && <p className="text-sm font-medium text-red-500">{errors.mediaId.message}</p>}
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
                  className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm font-medium text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="e.g., Respond to order confirmation requests"
                  className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]"
                  {...register("description")}
                />
                {errors.description && <p className="text-sm font-medium text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]">
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
                  {errors.category && <p className="text-sm font-medium text-red-500">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Controller
                    control={control}
                    name="icon"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]">
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
                  {errors.icon && <p className="text-sm font-medium text-red-500">{errors.icon.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Keywords</Label>
                <Input
                  id="trigger"
                  type="text"
                  placeholder="e.g., order, status, tracking, shipped"
                  className="h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]"
                  {...register("trigger")}
                />
                {errors.trigger && <p className="mt-1 text-sm font-medium text-red-500">{errors.trigger.message}</p>}
                <p className="text-sm text-slate-500">
                  Separate multiple keywords with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Reply Message</Label>
                <Textarea
                  id="response"
                  placeholder="e.g., Thanks for reaching out! Your order is on the way. Track it here: [tracking-link]"
                  className="min-h-[140px] rounded-[24px] border-[#f2d2e2] bg-white/95 px-4 py-3 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]"
                  {...register("response")}
                  rows={4}
                />
                {errors.response && <p className="text-sm font-medium text-red-500">{errors.response.message}</p>}
                <p className="text-sm text-slate-500">
                  This message is used when the selected keywords are matched.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl border-[#f2d2e2] bg-white hover:bg-[#fff4fa]"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="brand-button-gradient flex-1 rounded-2xl text-white"
                disabled={isSaving || normalizedPosts.length === 0}
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
