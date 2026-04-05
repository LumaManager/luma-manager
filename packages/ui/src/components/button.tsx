import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/cn";

const buttonVariants = {
  primary:
    "bg-[var(--color-primary)] text-white visited:text-white active:text-white shadow-sm hover:bg-[color-mix(in_srgb,var(--color-primary)_88%,black)] hover:text-white [&_svg]:text-white",
  secondary:
    "border border-[var(--color-border-strong)] bg-white text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]",
  ghost: "text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]"
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, className, style, variant = "primary", ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        className
      )}
      ref={ref}
      style={variant === "primary" ? { ...style, color: "#ffffff" } : style}
      {...props}
    />
  );
});
