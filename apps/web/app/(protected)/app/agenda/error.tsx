"use client";

import Link from "next/link";
import { Button } from "@terapia/ui";

export default function AgendaError() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Agenda indisponível</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Não foi possível carregar a agenda. Tente novamente em instantes.
        </p>
      </div>
      <Button asChild variant="secondary">
        <Link href="/app/dashboard">Voltar ao dashboard</Link>
      </Button>
    </div>
  );
}
