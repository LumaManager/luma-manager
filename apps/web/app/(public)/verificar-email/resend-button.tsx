"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@terapia/ui";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function ResendButton({ email }: { email: string }) {
  const [status, setStatus]       = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function handleResend() {
    if (countdown > 0 || status === "loading") return;

    setStatus("loading");
    try {
      const response = await fetch(`${getApiBaseUrl()}/v1/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error("Resend failed");

      setStatus("sent");
      setCountdown(60);
      intervalRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="text-center">
      <Button
        variant="secondary"
        onClick={handleResend}
        disabled={status === "loading" || countdown > 0}
        className="w-full"
      >
        {status === "loading" && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />}
        {countdown > 0
          ? `Reenviar em ${countdown}s`
          : status === "loading"
            ? "Reenviando..."
            : "Reenviar e-mail"
        }
      </Button>
      {status === "sent"  && <p className="mt-2 text-xs text-green-600">E-mail reenviado!</p>}
      {status === "error" && <p className="mt-2 text-xs text-red-500">Erro ao reenviar. Tente novamente.</p>}
    </div>
  );
}
