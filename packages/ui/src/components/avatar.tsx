import * as React from "react";

import { cn } from "../lib/cn";

type AvatarProps = {
  name: string;
  className?: string;
};

export function Avatar({ className, name }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.12)] text-sm font-semibold text-[var(--color-primary)]",
        className
      )}
    >
      {initials}
    </div>
  );
}
