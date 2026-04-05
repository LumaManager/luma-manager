import Link from "next/link";
import type { InternalTenantDetail } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

export function InternalTenantDetailPage({ detail }: { detail: InternalTenantDetail }) {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="warning">Tenant detail</Badge>
          <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">{detail.planLabel}</Badge>
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">{detail.name}</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(255,255,255,0.7)]">
          Leitura operacional do tenant sem prontuario, transcript ou conteudo clinico em texto claro.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
            <CardHeader>
              <p className="text-lg font-semibold">Metadados do tenant</p>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <InfoItem label="Owner" value={detail.ownerLabel} />
              <InfoItem label="Criado em" value={detail.createdAtLabel} />
              <InfoItem label="Usuarios" value={detail.userCountLabel} />
              <InfoItem label="Pacientes" value={detail.patientCountLabel} />
              <InfoItem label="Integracoes" value={detail.integrationHealthLabel} />
              <InfoItem label="Docs críticos" value={detail.criticalDocumentsLabel} />
            </CardContent>
          </Card>

          <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
            <CardHeader>
              <p className="text-lg font-semibold">Eventos recentes nao clinicos</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.recentNonClinicalEvents.map((event) => (
                <div key={event.id} className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
                  <p className="font-semibold">{event.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.68)]">{event.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[rgba(255,255,255,0.46)]">{event.occurredAtLabel}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
            <CardHeader>
              <p className="text-lg font-semibold">Estado atual</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="Operação" value={detail.operationalStatusLabel} />
              <InfoItem label="Onboarding" value={detail.onboardingStatusLabel} />
              <InfoItem label="Billing" value={detail.billingStatusLabel} />
            </CardContent>
          </Card>

          <Card className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white shadow-none">
            <CardHeader>
              <p className="text-lg font-semibold">Areas relacionadas</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">
                <Link href={detail.linkedAreas.supportHref}>Abrir suporte</Link>
              </Button>
              <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">
                <Link href={detail.linkedAreas.billingHref}>Abrir billing</Link>
              </Button>
              <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">
                <Link href={detail.linkedAreas.auditHref}>Abrir auditoria</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.68)]">{value}</p>
    </div>
  );
}
