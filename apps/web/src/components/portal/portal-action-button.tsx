"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@terapia/ui";

type PortalActionButtonProps = {
  actionPath: string;
  children: string;
  pendingLabel: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function PortalActionButton({
  actionPath,
  children,
  pendingLabel,
  variant = "primary"
}: PortalActionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Button
        className={
          variant === "secondary"
            ? "border-[rgba(10,66,84,0.14)] bg-[rgba(10,66,84,0.08)] text-[var(--color-primary)] hover:bg-[rgba(10,66,84,0.14)]"
            : variant === "ghost"
              ? "bg-transparent text-[var(--color-primary)] hover:bg-[rgba(10,66,84,0.08)]"
              : undefined
        }
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const response = await fetch(actionPath, {
                method: "POST"
              });

              if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { message?: string } | null;
                throw new Error(payload?.message ?? "Não foi possível concluir a ação.");
              }

              const payload = (await response.json()) as { redirectTo?: string };

              if (payload.redirectTo) {
                router.push(payload.redirectTo);
              }

              router.refresh();
            } catch (requestError) {
              setError(
                requestError instanceof Error ? requestError.message : "Erro inesperado no portal."
              );
            }
          });
        }}
        type="button"
        variant={variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "ghost"}
      >
        {isPending ? pendingLabel : children}
      </Button>
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
