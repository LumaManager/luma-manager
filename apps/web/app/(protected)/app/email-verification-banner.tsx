"use client";

import { useState } from "react";
import { X } from "lucide-react";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function EmailVerificationBanner({ email }: { email: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent]           = useState(false);

  if (dismissed) return null;

  async function handleResend() {
    try {
      const response = await fetch(`${getApiBaseUrl()}/v1/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (response.ok) setSent(true);
    } catch {
      // silently fail — user can navigate to /verificar-email to retry
    }
  }

  return (
    <div role="alert" className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
      <span>
        {sent ? (
          "E-mail de confirmação reenviado. Verifique sua caixa de entrada."
        ) : (
          <>
            Confirme seu e-mail para garantir o acesso.{" "}
            <button onClick={handleResend} className="font-medium underline hover:no-underline">
              Reenviar link
            </button>
          </>
        )}
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fechar aviso"
        className="shrink-0 text-amber-600 hover:text-amber-900"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
