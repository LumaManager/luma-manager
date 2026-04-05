import type { InternalBootstrap } from "@terapia/contracts";
import { Badge, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalOverviewPage({ bootstrap }: { bootstrap: InternalBootstrap }) {
  const stats = [
    ["Tenants ativos", String(bootstrap.platformOpsSummary.activeTenants), "Base operando agora"],
    ["Onboarding pendente", String(bootstrap.platformOpsSummary.onboardingPending), "Contas que exigem ativação"],
    ["Falhas de integração", String(bootstrap.platformOpsSummary.integrationFailures), "Fila técnica sem payload clínico"],
    ["Problemas de billing", String(bootstrap.platformOpsSummary.billingIssues), "Assinatura SaaS e cobrança interna"],
    ["Incidentes abertos", String(bootstrap.platformOpsSummary.openIncidents), "Trilha operacional em andamento"],
    ["Alertas de compliance", String(bootstrap.platformOpsSummary.complianceAlerts), "Governança e acesso sensível"]
  ] as const;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="warning">Visão geral</Badge>
          <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
            Operação, não BI
          </Badge>
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">O que exige ação interna agora?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Esta visão resume tenants, onboarding, billing, auditoria e incidentes sem expor conteúdo clínico. A leitura aqui é metadata-first.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {stats.map(([title, value, description]) => (
          <Card key={title} className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-white shadow-none">
            <CardHeader>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.62)]">
                {title}
              </p>
              <p className="text-3xl font-semibold tracking-[-0.03em]">{value}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[rgba(255,255,255,0.68)]">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
