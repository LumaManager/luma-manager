import Link from "next/link";
import { ArrowRight, CalendarPlus2, UserPlus2 } from "lucide-react";

import { Badge, Button } from "@terapia/ui";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 rounded-[32px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.78)] p-7 shadow-[var(--shadow-panel)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <Badge tone="info">Visão do dia</Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] xl:text-4xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
              Veja o que exige atenção hoje. A superfície prioriza atendimento próximo, backlog
              clínico, pendências que bloqueiam operação e atalhos para entrar no fluxo certo sem
              hesitação.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link className="text-white" href="/app/patients">
              <UserPlus2 className="h-4 w-4" />
              Novo paciente
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link className="text-[var(--color-text)]" href="/app/agenda">
              <CalendarPlus2 className="h-4 w-4" />
              Nova sessão
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link className="text-[var(--color-text)]" href="/app/clinical-review">
              Abrir revisão clínica
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
