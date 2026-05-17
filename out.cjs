var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// test_render.jsx
var import_react3 = __toESM(require("react"));
var import_server = require("react-dom/server");

// src/components/ui/card.jsx
var React2 = __toESM(require("react"));

// src/components/ui/utils.js
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/ui/card.jsx
function Card({ className, ...props }) {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ React2.createElement(
    "h4",
    {
      "data-slot": "card-title",
      className: cn("leading-none", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ React2.createElement(
    "p",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6 [&:last-child]:pb-6", className),
      ...props
    }
  );
}

// src/components/ui/badge.jsx
var React3 = __toESM(require("react"));
var import_react_slot_1_1 = require("@radix-ui/react-slot@1.1.2");
var import_class_variance_authority_0_7 = require("class-variance-authority@0.7.1");
var badgeVariants = (0, import_class_variance_authority_0_7.cva)(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? import_react_slot_1_1.Slot : "span";
  return /* @__PURE__ */ React3.createElement(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}

// src/components/ui/button.jsx
var React4 = __toESM(require("react"));
var import_react_slot_1_12 = require("@radix-ui/react-slot@1.1.2");
var import_class_variance_authority_0_72 = require("class-variance-authority@0.7.1");
var buttonVariants = (0, import_class_variance_authority_0_72.cva)(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? import_react_slot_1_12.Slot : "button";
  return /* @__PURE__ */ React4.createElement(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/Automations.jsx
var import_lucide_react2 = require("lucide-react");
var import_react2 = require("react");

// src/components/CreateAutomationModal.jsx
var import_react = require("react");
var import_react_hook_form = require("react-hook-form");
var z = __toESM(require("zod"));

// src/components/ui/input.jsx
var React5 = __toESM(require("react"));
var Input = React5.forwardRef(function Input2({ className, type, ...props }, ref) {
  return /* @__PURE__ */ React5.createElement(
    "input",
    {
      ref,
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
});

// src/components/ui/label.jsx
var React6 = __toESM(require("react"));
var LabelPrimitive = __toESM(require("@radix-ui/react-label@2.1.2"));
function Label({ className, ...props }) {
  return /* @__PURE__ */ React6.createElement(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/textarea.jsx
var React7 = __toESM(require("react"));
var Textarea = React7.forwardRef(function Textarea2({ className, ...props }, ref) {
  return /* @__PURE__ */ React7.createElement(
    "textarea",
    {
      ref,
      "data-slot": "textarea",
      className: cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
});

// src/components/ui/select.jsx
var React8 = __toESM(require("react"));
var SelectPrimitive = __toESM(require("@radix-ui/react-select@2.1.6"));
var import_lucide_react_0_487 = require("lucide-react@0.487.0");
function Select({ ...props }) {
  return /* @__PURE__ */ React8.createElement(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({ ...props }) {
  return /* @__PURE__ */ React8.createElement(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({ className, size = "default", children, ...props }) {
  return /* @__PURE__ */ React8.createElement(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    },
    children,
    /* @__PURE__ */ React8.createElement(SelectPrimitive.Icon, { asChild: true }, /* @__PURE__ */ React8.createElement(import_lucide_react_0_487.ChevronDownIcon, { className: "size-4 opacity-50" }))
  );
}
function SelectContent({ className, children, position = "popper", ...props }) {
  return /* @__PURE__ */ React8.createElement(SelectPrimitive.Portal, null, /* @__PURE__ */ React8.createElement(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props
    },
    /* @__PURE__ */ React8.createElement(SelectScrollUpButton, null),
    /* @__PURE__ */ React8.createElement(
      SelectPrimitive.Viewport,
      {
        className: cn(
          "p-1",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
        )
      },
      children
    ),
    /* @__PURE__ */ React8.createElement(SelectScrollDownButton, null)
  ));
}
function SelectItem({ className, children, ...props }) {
  return /* @__PURE__ */ React8.createElement(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props
    },
    /* @__PURE__ */ React8.createElement("span", { className: "absolute right-2 flex size-3.5 items-center justify-center" }, /* @__PURE__ */ React8.createElement(SelectPrimitive.ItemIndicator, null, /* @__PURE__ */ React8.createElement(import_lucide_react_0_487.CheckIcon, { className: "size-4" }))),
    /* @__PURE__ */ React8.createElement(SelectPrimitive.ItemText, null, children)
  );
}
function SelectScrollUpButton({ className, ...props }) {
  return /* @__PURE__ */ React8.createElement(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props
    },
    /* @__PURE__ */ React8.createElement(import_lucide_react_0_487.ChevronUpIcon, { className: "size-4" })
  );
}
function SelectScrollDownButton({ className, ...props }) {
  return /* @__PURE__ */ React8.createElement(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props
    },
    /* @__PURE__ */ React8.createElement(import_lucide_react_0_487.ChevronDownIcon, { className: "size-4" })
  );
}

// src/components/CreateAutomationModal.jsx
var import_lucide_react = require("lucide-react");
var requiredText = (label, maxLength) => {
  const baseField = typeof maxLength === "number" ? z.string().min(1, `${label} is required`).max(maxLength, `${label} is too long`) : z.string().min(1, `${label} is required`);
  return z.preprocess(
    (value) => typeof value === "string" ? value.trim() : "",
    baseField
  );
};
var automationSchema = z.object({
  name: requiredText("Name", 50),
  description: requiredText("Description"),
  trigger: requiredText("Trigger keyword"),
  response: z.preprocess(
    (value) => typeof value === "string" ? value.trim() : "",
    z.string().min(10, "Add a fuller reply so the automation is actually useful")
  ),
  category: requiredText("Category"),
  icon: requiredText("Icon"),
  mediaId: requiredText("Instagram post")
});
function CreateAutomationModal({ onClose, onSave, availablePosts = [], isSaving = false }) {
  const normalizedPosts = (0, import_react.useMemo)(
    () => availablePosts.map((post) => ({
      ...post,
      id: String(post.id)
    })),
    [availablePosts]
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
  } = (0, import_react_hook_form.useForm)({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      trigger: "",
      response: "",
      category: "Sales",
      icon: "MessageSquare",
      mediaId: normalizedPosts[0]?.id || ""
    }
  });
  (0, import_react.useEffect)(() => {
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
            message: issue.message
          });
        }
      });
      return;
    }
    const selectedPost = normalizedPosts.find((post) => post.id === String(validation.data.mediaId)) || null;
    const cleanedPayload = {
      ...validation.data,
      mediaCaption: selectedPost?.caption || "",
      mediaThumbnail: selectedPost?.thumbnail || "",
      mediaPermalink: selectedPost?.permalink || "",
      mediaType: selectedPost?.mediaType || ""
    };
    await onSave(cleanedPayload);
  };
  const icons = [
    { value: "MessageSquare", label: "Message", icon: import_lucide_react.MessageSquare },
    { value: "Mail", label: "Mail", icon: import_lucide_react.Mail },
    { value: "Gift", label: "Gift", icon: import_lucide_react.Gift },
    { value: "Zap", label: "Zap", icon: import_lucide_react.Zap }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-4 py-6 backdrop-blur-sm sm:items-center" }, /* @__PURE__ */ React.createElement(Card, { className: "relative my-auto flex max-h-[calc(100vh-3rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff7fb_45%,#fff1f8_100%)] shadow-[0_40px_120px_-65px_rgba(15,23,42,0.85)]" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
    },
    /* @__PURE__ */ React.createElement(import_lucide_react.X, { className: "w-5 h-5" })
  ), /* @__PURE__ */ React.createElement(CardHeader, { className: "border-b border-slate-200 pb-6" }, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-2xl tracking-tight" }, "Create Custom Automation"), /* @__PURE__ */ React.createElement(CardDescription, { className: "max-w-xl leading-6" }, "Set the post, keywords, and reply you want ready the moment new conversations begin.")), /* @__PURE__ */ React.createElement(CardContent, { className: "flex min-h-0 flex-1 flex-col p-0" }, /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(onValidSubmit), className: "flex min-h-0 flex-1 flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-6 overflow-y-auto px-6 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "mediaId" }, "Instagram Post"), /* @__PURE__ */ React.createElement(
    import_react_hook_form.Controller,
    {
      control,
      name: "mediaId",
      render: ({ field }) => /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Select the post this automation should watch" })), /* @__PURE__ */ React.createElement(SelectContent, null, normalizedPosts.length > 0 ? normalizedPosts.map((post) => /* @__PURE__ */ React.createElement(SelectItem, { key: post.id, value: String(post.id) }, (post.caption || "Instagram post").slice(0, 60))) : /* @__PURE__ */ React.createElement(SelectItem, { value: "__no_posts__", disabled: true }, "No posts available yet")))
    }
  ), errors.mediaId && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.mediaId.message), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "This automation stays focused on the post you choose here.")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "name" }, "Automation Name"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "name",
      type: "text",
      placeholder: "e.g., Order Confirmation",
      className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]",
      ...register("name")
    }
  ), errors.name && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.name.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "description" }, "Description"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "description",
      type: "text",
      placeholder: "e.g., Respond to order confirmation requests",
      className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]",
      ...register("description")
    }
  ), errors.description && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.description.message)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "category" }, "Category"), /* @__PURE__ */ React.createElement(
    import_react_hook_form.Controller,
    {
      control,
      name: "category",
      render: ({ field }) => /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "Sales" }, "Sales"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Lead Gen" }, "Lead Gen"), /* @__PURE__ */ React.createElement(SelectItem, { value: "Support" }, "Support")))
    }
  ), errors.category && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.category.message)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "icon" }, "Icon"), /* @__PURE__ */ React.createElement(
    import_react_hook_form.Controller,
    {
      control,
      name: "icon",
      render: ({ field }) => /* @__PURE__ */ React.createElement(Select, { onValueChange: field.onChange, value: field.value }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, icons.map((icon) => /* @__PURE__ */ React.createElement(SelectItem, { key: icon.value, value: icon.value }, icon.label))))
    }
  ), errors.icon && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.icon.message))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "trigger" }, "Trigger Keywords"), /* @__PURE__ */ React.createElement(
    Input,
    {
      id: "trigger",
      type: "text",
      placeholder: "e.g., order, status, tracking, shipped",
      className: "h-12 rounded-2xl border-[#f2d2e2] bg-white/95 px-4 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]",
      ...register("trigger")
    }
  ), errors.trigger && /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm font-medium text-red-500" }, errors.trigger.message), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "Separate multiple keywords with commas")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "response" }, "Reply Message"), /* @__PURE__ */ React.createElement(
    Textarea,
    {
      id: "response",
      placeholder: "e.g., Thanks for reaching out! Your order is on the way. Track it here: [tracking-link]",
      className: "min-h-[140px] rounded-[24px] border-[#f2d2e2] bg-white/95 px-4 py-3 shadow-[0_18px_40px_-34px_rgba(229,69,146,0.45)] focus-visible:border-theme-primary focus-visible:ring-[rgba(229,69,146,0.18)]",
      ...register("response"),
      rows: 4
    }
  ), errors.response && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-500" }, errors.response.message), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, "This message is used when the selected keywords are matched."))), /* @__PURE__ */ React.createElement("div", { className: "sticky bottom-0 flex gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "button",
      variant: "outline",
      className: "flex-1 rounded-2xl border-[#f2d2e2] bg-white hover:bg-[#fff4fa]",
      onClick: onClose,
      disabled: isSaving
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      type: "submit",
      className: "brand-button-gradient flex-1 rounded-2xl text-white",
      disabled: isSaving || normalizedPosts.length === 0
    },
    isSaving ? "Saving..." : "Create Automation"
  ))))));
}

// src/components/Automations.jsx
var iconMap = {
  MessageSquare: import_lucide_react2.MessageSquare,
  Mail: import_lucide_react2.Mail,
  Gift: import_lucide_react2.Gift,
  Zap: import_lucide_react2.Zap
};
var defaultSummary = {
  autoRepliesToday: 0,
  averageResponseTime: "0 sec",
  timeSaved: "0 hrs",
  timeSavedLabel: "Create your first rule to start saving time"
};
var defaultTip = {
  title: "No automations yet",
  body: "Create your first automation rule to start replying faster inside InstaLead."
};
function mapTemplate(template, index) {
  return {
    id: template.id || `${index + 1}`,
    name: template.name,
    description: template.description,
    trigger: template.trigger,
    response: template.response,
    icon: iconMap[template.iconName || template.icon] || import_lucide_react2.MessageSquare,
    iconName: template.iconName || template.icon || "MessageSquare",
    category: template.category,
    enabled: Boolean(template.enabled),
    dmSentCount: Number(template.dmSentCount || 0),
    dmLimitPerAutomation: Number(template.dmLimitPerAutomation || 10)
  };
}
function Automations({
  summary,
  initialTemplates,
  tip,
  limits,
  availablePosts = [],
  onCreateAutomation,
  onToggleAutomation
}) {
  const [showCreateModal, setShowCreateModal] = (0, import_react2.useState)(false);
  const [templates, setTemplates] = (0, import_react2.useState)(
    () => (initialTemplates || []).map(mapTemplate)
  );
  const [status, setStatus] = (0, import_react2.useState)({ type: "", message: "" });
  const [isSaving, setIsSaving] = (0, import_react2.useState)(false);
  const [togglingId, setTogglingId] = (0, import_react2.useState)("");
  (0, import_react2.useEffect)(() => {
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
        setTemplates(
          (prev) => prev.map(
            (template) => template.id === id ? mapTemplate(updatedTemplate, 0) : template
          )
        );
      } else {
        setTemplates(
          (prev) => prev.map(
            (template) => template.id === id ? { ...template, enabled: nextEnabled } : template
          )
        );
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Automation toggle failed."
      });
    } finally {
      setTogglingId("");
    }
  };
  const handleDeleteTemplate = async (id) => {
    const removedTemplate = templates.find((t) => t.id === id);
    if (!removedTemplate) return;
    setDeletingId(id);
    setStatus({ type: "", message: "" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    try {
      if (typeof onDeleteAutomation === "function") {
        await onDeleteAutomation(id);
      }
      setStatus({ type: "success", message: "Automation deleted." });
    } catch (error) {
      setTemplates((prev) => {
        const alreadyPresent = prev.find((t) => t.id === id);
        return alreadyPresent ? prev : [...prev, removedTemplate];
      });
      setStatus({
        type: "error",
        message: error?.message || "Could not delete automation."
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
          id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `automation-${Date.now()}`,
          name: automation.name.trim(),
          description: automation.description.trim(),
          trigger: automation.trigger.trim(),
          response: automation.response.trim(),
          icon: iconMap[automation.icon] || import_lucide_react2.MessageSquare,
          iconName: automation.icon,
          category: automation.category,
          enabled: true
        };
        setTemplates((prev) => [...prev, newTemplate]);
      }
      setShowCreateModal(false);
      setStatus({
        type: "success",
        message: "Automation saved and ready to run."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Automation could not be saved."
      });
    } finally {
      setIsSaving(false);
    }
  };
  const enabledCount = templates.filter((t) => t.enabled).length;
  const stats = {
    ...defaultSummary,
    ...summary
  };
  const fallbackAutomationLimit = Number(limits?.automationLimit || 1);
  const resolvedLimits = {
    planName: limits?.planName || "Free",
    automationLimit: fallbackAutomationLimit,
    automationRemaining: Math.max(
      0,
      Number(limits?.automationRemaining ?? fallbackAutomationLimit - templates.length)
    ),
    dmLimitPerAutomation: Number(limits?.dmLimitPerAutomation || 10)
  };
  const maxAutomationsReached = templates.length >= resolvedLimits.automationLimit;
  const tipContent = {
    ...defaultTip,
    ...tip
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 mt-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-semibold tracking-tight text-slate-900" }, "Automation Playbook"), /* @__PURE__ */ React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Build reply flows and switch rules on when the timing is right.")), /* @__PURE__ */ React.createElement(
    Button,
    {
      className: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm",
      onClick: () => setShowCreateModal(true),
      disabled: maxAutomationsReached
    },
    /* @__PURE__ */ React.createElement(import_lucide_react2.Plus, { className: "w-4 h-4 mr-2" }),
    maxAutomationsReached ? "Automation limit reached" : "New Automation"
  )), status.message ? /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `mb-6 rounded-lg border px-4 py-3 text-sm ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`
    },
    status.message
  ) : null, /* @__PURE__ */ React.createElement("div", { className: "mb-6 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-700" }, resolvedLimits.planName, " plan: ", resolvedLimits.automationRemaining, " automation slot", resolvedLimits.automationRemaining === 1 ? "" : "s", " left. Each automation can send up to ", resolvedLimits.dmLimitPerAutomation, " automatic DMs."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-500 mb-2" }, "Active automations"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-semibold tracking-tight text-gray-900" }, enabledCount, "/", resolvedLimits.automationLimit), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-emerald-600 mt-2" }, "Ready when new replies arrive")), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-500 mb-2" }, "Replies today"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-semibold tracking-tight text-gray-900" }, stats.autoRepliesToday), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mt-2" }, "Average response: ", stats.averageResponseTime)), /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-gray-500 mb-2" }, "Time saved"), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-semibold tracking-tight text-gray-900" }, stats.timeSaved), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mt-2" }, stats.timeSavedLabel))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, templates.length > 0 ? templates.map((template) => {
    const Icon2 = template.icon;
    return /* @__PURE__ */ React.createElement(
      Card,
      {
        key: template.id,
        className: `overflow-hidden border transition-all duration-200 rounded-2xl ${template.enabled ? "border-indigo-200 bg-indigo-50/30 shadow-md ring-1 ring-inset ring-indigo-100" : "border-gray-200 bg-white shadow-sm"}`
      },
      /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: `flex h-10 w-10 items-center justify-center rounded-xl ${template.enabled ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-500"}`
        },
        /* @__PURE__ */ React.createElement(Icon2, { className: "w-5 h-5" })
      ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CardTitle, { className: "text-lg mb-1" }, template.name), /* @__PURE__ */ React.createElement(
        Badge,
        {
          variant: "outline",
          className: template.category === "Sales" ? "border-emerald-200 text-emerald-700 bg-emerald-50" : template.category === "Lead Gen" ? "border-amber-200 text-amber-700 bg-amber-50" : "border-blue-200 text-blue-700 bg-blue-50"
        },
        template.category
      ))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 -mt-1 -mr-2" }, template.dmSentCount >= template.dmLimitPerAutomation ? /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10" }, "DM limit exceeded (", template.dmSentCount, "/", template.dmLimitPerAutomation, ")") : /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10" }, "DMs: ", template.dmSentCount, "/", template.dmLimitPerAutomation), /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8",
          onClick: () => handleDeleteTemplate(template.id),
          title: "Delete automation",
          disabled: deletingId === template.id
        },
        /* @__PURE__ */ React.createElement(Trash2, { className: "h-4 w-4" })
      ))), /* @__PURE__ */ React.createElement(CardDescription, { className: "mt-2" }, template.description)),
      /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 mb-1 font-medium" }, "When user says:"), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700" }, template.trigger)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600 mb-1 font-medium" }, "Auto-reply with:"), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-700" }, template.response)), /* @__PURE__ */ React.createElement("div", { className: "pt-4 mt-2 border-t border-gray-100" }, template.dmSentCount >= template.dmLimitPerAutomation ? /* @__PURE__ */ React.createElement(
        Button,
        {
          className: "w-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed font-medium shadow-none",
          disabled: true
        },
        /* @__PURE__ */ React.createElement(import_lucide_react2.Square, { className: "w-4 h-4 mr-2" }),
        "DM Limit Exceeded"
      ) : template.enabled ? /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "outline",
          className: "w-full text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border-gray-200",
          onClick: () => toggleTemplate(template.id),
          disabled: togglingId === template.id
        },
        /* @__PURE__ */ React.createElement(import_lucide_react2.Square, { className: "w-4 h-4 mr-2" }),
        "Stop Automation"
      ) : /* @__PURE__ */ React.createElement(
        Button,
        {
          className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
          onClick: () => toggleTemplate(template.id),
          disabled: togglingId === template.id
        },
        /* @__PURE__ */ React.createElement(import_lucide_react2.Play, { className: "w-4 h-4 mr-2 fill-current" }),
        "Start Automation"
      ))))
    );
  }) : /* @__PURE__ */ React.createElement(Card, { className: "border border-dashed border-gray-300 bg-white md:col-span-2" }, /* @__PURE__ */ React.createElement(CardContent, { className: "py-12 text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg text-gray-900 mb-2 font-semibold" }, "No automation rules yet"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-5" }, "Create your first automation to start handling common Instagram replies automatically."), /* @__PURE__ */ React.createElement(
    Button,
    {
      className: "bg-slate-900 hover:bg-slate-800",
      onClick: () => setShowCreateModal(true),
      disabled: maxAutomationsReached
    },
    /* @__PURE__ */ React.createElement(import_lucide_react2.Plus, { className: "w-4 h-4 mr-2" }),
    maxAutomationsReached ? "Automation limit reached" : "Create First Automation"
  )))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-semibold leading-6 text-gray-900 mb-2" }, tipContent.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-700" }, tipContent.body))), showCreateModal && /* @__PURE__ */ React.createElement(
    CreateAutomationModal,
    {
      onClose: () => setShowCreateModal(false),
      onSave: handleCreateAutomation,
      availablePosts,
      isSaving
    }
  ));
}

// src/lib/mockWorkspace.js
var CONTENT_PROFILES = [
  {
    label: "Skincare Studio",
    topics: [
      "Morning glow routine for Indian skin",
      "3-step night repair routine",
      "Niacinamide mistakes to avoid",
      "How to layer serums the right way",
      "Before-and-after client transformation",
      "Weekend skin reset checklist"
    ],
    handles: [
      "priya_glows",
      "skinwithananya",
      "mehta_beauty_diary",
      "selfcarewithriya",
      "glowkit_by_mira",
      "clearfaceclub",
      "thedermcorner",
      "sundayserumstudio"
    ]
  },
  {
    label: "Marketing Coach",
    topics: [
      "5 hooks that double Reel watch time",
      "Content calendar for busy founders",
      "DM script that converts cold leads",
      "Ad creative ideas for low-budget brands",
      "How to make offers feel irresistible",
      "Client acquisition playbook for creators"
    ],
    handles: [
      "amit_buildsbrands",
      "growthwithsneha",
      "adsbyrohit",
      "creatorcoachneha",
      "vikram_conversionlab",
      "funnelwithkavya",
      "contentwitharjun",
      "scalewithmahima"
    ]
  },
  {
    label: "D2C Fashion",
    topics: [
      "Summer co-ord drop now live",
      "Behind the scenes from our shoot day",
      "Best-selling kurti styling ideas",
      "How our fabric feels on real customers",
      "Limited stock launch alert",
      "Festive collection preview"
    ],
    handles: [
      "shopwithdiya",
      "stylebykashish",
      "closetwithisha",
      "urbanwear_rahul",
      "drapedbynaina",
      "labelmeher",
      "ootdwithtanu",
      "thewardrobecut"
    ]
  }
];
var POST_THUMBNAILS = [
  "https://images.unsplash.com/photo-1647004693489-ff8bf278edc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBwb3N0JTIwc2tpbmNhcmUlMjBiZWF1dHl8ZW58MXx8fHwxNzcwNDYwNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc3MDM3MjI5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1691096674730-2b5fb28b726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBlY29tbWVyY2V8ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1672327114747-261be18f4907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBpbmRpYW58ZW58MXx8fHwxNzcwNDYwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1669743281584-b9125947f9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MDQzNjExMXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1589451431369-f569890dfd84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMG1vdGl2YXRpb258ZW58MXx8fHwxNzcwMzg2ODczfDA&ixlib=rb-4.1.0&q=80&w=1080"
];
var BASE_LEADS = [
  { lastInteraction: "2 mins ago", leadScore: 92, interactions: 8 },
  { lastInteraction: "15 mins ago", leadScore: 85, interactions: 5 },
  { lastInteraction: "1 hour ago", leadScore: 78, interactions: 4 },
  { lastInteraction: "3 hours ago", leadScore: 65, interactions: 3 },
  { lastInteraction: "5 hours ago", leadScore: 58, interactions: 2 },
  { lastInteraction: "1 day ago", leadScore: 45, interactions: 2 },
  { lastInteraction: "2 days ago", leadScore: 38, interactions: 1 },
  { lastInteraction: "3 days ago", leadScore: 25, interactions: 1 }
];
var BASE_AUTOMATIONS = [
  {
    name: "Price Inquiry",
    description: "Auto-respond when users ask about pricing",
    triggerPrefix: "price, cost, kitne ka, how much",
    responsePrefix: "Thanks for your interest! Check the latest catalog and DM 'BUY' to place your order.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: true
  },
  {
    name: "Lead Magnet",
    description: "Collect emails for free guides and offers",
    triggerPrefix: "guide, free, download, ebook",
    responsePrefix: "Share your email and we will send the resource instantly.",
    iconName: "Gift",
    category: "Lead Gen",
    enabled: true
  },
  {
    name: "Availability Check",
    description: "Respond to stock or booking questions",
    triggerPrefix: "available, stock, slot, in stock",
    responsePrefix: "Yes, this is currently available. Reply with your preference and we will help you next.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: false
  },
  {
    name: "Customer Support",
    description: "Handle common support questions",
    triggerPrefix: "help, support, issue, problem",
    responsePrefix: "We are on it. Share the issue details and our team will review it shortly.",
    iconName: "Mail",
    category: "Support",
    enabled: true
  },
  {
    name: "Shipping Info",
    description: "Answer delivery questions fast",
    triggerPrefix: "shipping, delivery, dispatch, tracking",
    responsePrefix: "We ship pan-India and share tracking updates as soon as the order moves.",
    iconName: "MessageSquare",
    category: "Sales",
    enabled: false
  },
  {
    name: "Offer Push",
    description: "Share the current promotion instantly",
    triggerPrefix: "discount, offer, sale, coupon",
    responsePrefix: "A live offer is available right now. Use the current promo code before it expires.",
    iconName: "Zap",
    category: "Sales",
    enabled: true
  }
];
var BASE_POST_METRICS = [
  { views: 15420, likes: 2847, comments: 156, shares: 89, postedAt: "2 days ago" },
  { views: 12340, likes: 1923, comments: 89, shares: 45, postedAt: "4 days ago" },
  { views: 18750, likes: 3621, comments: 203, shares: 134, postedAt: "1 week ago" },
  { views: 9870, likes: 1456, comments: 67, shares: 32, postedAt: "1 week ago" },
  { views: 7650, likes: 1234, comments: 45, shares: 28, postedAt: "2 weeks ago" },
  { views: 6540, likes: 987, comments: 34, shares: 19, postedAt: "2 weeks ago" }
];
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}
function rotate(list, offset) {
  return list.map((_, index) => list[(index + offset) % list.length]);
}
function formatCompactNumber(value) {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
}
function buildRevenueLabel(seed) {
  const revenue = 24 + seed % 29;
  return `\u20B9${revenue.toFixed(1)}K`;
}
function createWorkspaceModel(owner) {
  const seed = hashString(`${owner.id}:${owner.name}`);
  const contentProfile = CONTENT_PROFILES[seed % CONTENT_PROFILES.length];
  const handles = rotate(contentProfile.handles, seed % contentProfile.handles.length);
  const topics = rotate(contentProfile.topics, seed % contentProfile.topics.length);
  const leads = BASE_LEADS.map((lead, index) => {
    const scoreDelta = (seed + index * 7) % 9 - 4;
    return {
      id: `${owner.id}-lead-${index}`,
      handle: `@${handles[index % handles.length]}`,
      lastInteraction: lead.lastInteraction,
      leadScore: clamp(lead.leadScore + scoreDelta, 18, 98),
      sourcePost: topics[index % topics.length],
      interactions: lead.interactions + (seed + index) % 2
    };
  });
  const automations = BASE_AUTOMATIONS.map((automation, index) => ({
    id: `${owner.id}-automation-${index}`,
    name: automation.name,
    description: automation.description,
    trigger: `${automation.triggerPrefix}, ${topics[index % topics.length].toLowerCase()}`,
    response: `${automation.responsePrefix} Mention "${topics[(index + 1) % topics.length]}" for the fastest follow-up.`,
    iconName: automation.iconName,
    category: automation.category,
    enabled: automation.enabled
  }));
  const posts = BASE_POST_METRICS.map((post, index) => {
    const views = post.views + seed % 900 + index * 180;
    const likes = post.likes + seed % 230 + index * 34;
    const comments = post.comments + seed % 16 + index * 3;
    const shares = post.shares + seed % 9 + index * 2;
    const engagement = likes + comments + shares;
    return {
      id: `${owner.id}-post-${index}`,
      thumbnail: POST_THUMBNAILS[index % POST_THUMBNAILS.length],
      caption: topics[index % topics.length],
      views,
      likes,
      comments,
      shares,
      engagement,
      postedAt: post.postedAt
    };
  });
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const averageEngagement = (posts.reduce((sum, post) => sum + post.engagement / post.views * 100, 0) / posts.length).toFixed(1);
  return {
    workspaceLabel: contentProfile.label,
    leadSummary: {
      totalLeads: 180 + seed % 140,
      weeklyGrowth: `+${8 + seed % 9}% this week`,
      hotLeads: leads.filter((lead) => lead.leadScore >= 80).length + 18 + seed % 10,
      hotLeadLabel: "Score 80+",
      responseRate: `${89 + seed % 8}%`,
      responseTrend: `+${3 + seed % 6}% improvement`,
      estimatedRevenue: buildRevenueLabel(seed),
      revenueLabel: "This month"
    },
    automationSummary: {
      autoRepliesToday: 60 + seed % 120,
      averageResponseTime: `${6 + seed % 5} sec`,
      timeSaved: `${(1.8 + seed % 18 / 10).toFixed(1)} hrs`,
      timeSavedLabel: "Just today"
    },
    performanceSummary: {
      totalViews: formatCompactNumber(totalViews),
      totalLikes: formatCompactNumber(totalLikes),
      totalComments: totalComments.toString(),
      averageEngagement: `${averageEngagement}%`,
      likesTrend: `+${12 + seed % 12}% vs last month`,
      commentsTrend: `+${7 + seed % 9}% growth`,
      engagementLabel: "Industry avg: 3.5%"
    },
    performanceInsight: {
      title: "Smart Insight",
      body: `Posts around "${topics[0]}" are driving the strongest engagement for ${owner.name}. Double down on that format and keep the CTA focused on DMs.`,
      note: `Your current mix suggests repeatable traction in the ${contentProfile.label.toLowerCase()} content bucket.`
    },
    automationTip: {
      title: "Pro Tip",
      body: `Pair "Price Inquiry" with the topic "${topics[0]}" so your highest-intent leads get an instant reply without extra ops work.`
    },
    leads,
    automations,
    posts
  };
}

// test_render.jsx
var workspace = createWorkspaceModel({ id: "1", name: "test" });
try {
  (0, import_server.renderToString)(
    /* @__PURE__ */ import_react3.default.createElement(
      Automations,
      {
        summary: workspace.automationSummary,
        initialTemplates: workspace.automations,
        tip: workspace.automationTip,
        limits: workspace.automationLimits,
        availablePosts: workspace.posts
      }
    )
  );
  console.log("Render successful!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
