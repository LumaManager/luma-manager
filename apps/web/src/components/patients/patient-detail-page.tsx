"use client";

import Link from "next/link";
import { useState } from "react";
import type { PatientDetail } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import { CalendarPlus2, ChevronRight, FileStack, NotebookTabs, Wallet } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type PatientDetailPageProps = {
  patient: PatientDetail;
};

const tabs = [
  { key: "summary", label: "Resumo" },
  { key: "sessions", label: "Sessões" },
  { key: "documents", label: "Documentos" },
  { key: "finance", label: "Financeiro" },
  { key: "profile", label: "Cadastro" }
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function PatientDetailPageView({ patient }: PatientDetailPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  return (
    <div className="space-y-6">
      <OperationalHero
        actions={
          <>
            <Button asChild className="text-white visited:text-white active:text-white hover:text-white [&_svg]:text-white">
              <Link href={patient.topActions.scheduleHref}>
                <CalendarPlus2 className="h-4 w-4" />
                Agendar sessão
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={patient.topActions.clinicalRecordHref}>
                <NotebookTabs className="h-4 w-4" />
                Abrir prontuário
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={patient.primaryAction.href}>
                {patient.primaryAction.label}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
        badges={
          <>
            <Badge tone={statusToneMap[patient.status]}>{statusLabelMap[patient.status]}</Badge>
            <StateBadge label={patient.documentsState} type="documents" />
            <StateBadge label={patient.financialState} type="financial" />
            <Badge tone="neutral">{patient.clinicalReviewLabel}</Badge>
          </>
        }
        description={`${patient.ageLabel} · ${patient.primaryContact} · ${patient.legalGuardianLabel}`}
        stats={[
          {
            detail: patient.createdAtLabel,
            label: "Vínculo",
            tone: "neutral",
            value: patient.nextSessionLabel
          },
          {
            detail: "Sinal documental atual do vínculo.",
            label: "Documentos",
            tone:
              patient.documentsState === "critical"
                ? "critical"
                : patient.documentsState === "pending"
                  ? "warning"
                  : "success",
            value:
              patient.documentsState === "critical"
                ? "Crítico"
                : patient.documentsState === "pending"
                  ? "Pendente"
                  : "OK"
          },
          {
            detail: "Sinal financeiro atual do vínculo.",
            label: "Financeiro",
            tone:
              patient.financialState === "overdue"
                ? "critical"
                : patient.financialState === "open"
                  ? "warning"
                  : "success",
            value:
              patient.financialState === "overdue"
                ? "Vencido"
                : patient.financialState === "open"
                  ? "Em aberto"
                  : "OK"
          }
        ]}
        supportingText={patient.createdAtLabel}
        title={patient.fullName}
      />

      <div className="flex flex-wrap gap-2 rounded-[28px] border border-[var(--color-border)] bg-white p-2 shadow-[var(--shadow-panel)]">
        {tabs.map((tab) => (
          <button
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-semibold transition",
              activeTab === tab.key
                ? "bg-[var(--color-primary)] text-white shadow-[0_10px_24px_rgba(15,76,92,0.22)]"
                : "bg-transparent text-[var(--color-text-muted)] hover:bg-[rgba(15,76,92,0.05)]"
            )}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" ? (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Resumo</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Contexto operacional e atalhos sem expor texto clínico detalhado.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {patient.overviewBlocks.map((block) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4"
                  key={block.title}
                >
                  <p className="text-sm font-semibold">{block.title}</p>
                  <p className="mt-3 text-lg font-semibold">{block.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {block.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Acesso rápido ao prontuário</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-[rgba(15,76,92,0.03)] p-4">
                <p className="text-sm font-semibold">Metadata clínica mínima</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {patient.clinicalReviewLabel}. O texto clínico completo continua fora desta tela.
                </p>
              </div>
              <Button asChild variant="secondary">
                <Link href={patient.topActions.clinicalRecordHref}>Abrir prontuário</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {activeTab === "sessions" ? (
        <ListCard
          description="Próxima sessão no topo, seguida do histórico operacional."
          icon={<CalendarPlus2 className="h-4 w-4" />}
          items={patient.sessions.map((session) => ({
            title: session.dateLabel,
            subtitle: `${session.statusLabel} · ${session.modalityLabel} · ${session.paymentLabel}`,
            href: session.href
          }))}
          title="Sessões"
        />
      ) : null}

      {activeTab === "documents" ? (
        <ListCard
          description="Documentos, consentimentos e assinaturas ligados ao paciente."
          icon={<FileStack className="h-4 w-4" />}
          items={patient.documents.map((document) => ({
            title: document.title,
            subtitle: `${document.statusLabel} · ${document.updatedAtLabel}`,
            href: "/app/documents"
          }))}
          title="Documentos"
        />
      ) : null}

      {activeTab === "finance" ? (
        <ListCard
          description="Cobranças e histórico financeiro resumido do paciente."
          icon={<Wallet className="h-4 w-4" />}
          items={patient.charges.map((charge) => ({
            title: charge.label,
            subtitle: `${charge.statusLabel} · ${charge.amountLabel}`,
            href: "/app/finance"
          }))}
          title="Financeiro"
        />
      ) : null}

      {activeTab === "profile" ? (
        <Card>
          <CardHeader>
            <p className="text-lg font-semibold">Cadastro</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Dados cadastrais essenciais e sinais operacionais do vínculo.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <InfoItem label="Contato principal" value={patient.primaryContact} />
            <InfoItem label="Forma de pagamento" value={patient.paymentOriginLabel} />
            <InfoItem label="Responsável legal" value={patient.legalGuardianLabel} />
            <InfoItem label="Criado em" value={patient.createdAtLabel} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ListCard({
  description,
  icon,
  items,
  title
}: {
  description: string;
  icon: React.ReactNode;
  items: Array<{ title: string; subtitle: string; href: string }>;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
            Nenhum item relevante nesta aba por enquanto.
          </div>
        ) : (
          items.map((item) => (
            <Link
              className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--color-border)] px-4 py-4 transition hover:bg-[rgba(15,76,92,0.03)]"
              href={item.href}
              key={`${item.title}-${item.subtitle}`}
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}

function StateBadge({
  label,
  type
}: {
  label: PatientDetail["documentsState"] | PatientDetail["financialState"];
  type: "documents" | "financial";
}) {
  if (type === "documents") {
    const map = {
      ok: { tone: "success", text: "Documentos OK" },
      pending: { tone: "warning", text: "Documentos pendentes" },
      critical: { tone: "critical", text: "Documentos críticos" }
    } as const;

    return <Badge tone={map[label as PatientDetail["documentsState"]].tone}>{map[label as PatientDetail["documentsState"]].text}</Badge>;
  }

  const map = {
    ok: { tone: "success", text: "Financeiro OK" },
    open: { tone: "info", text: "Financeiro em aberto" },
    overdue: { tone: "critical", text: "Financeiro vencido" }
  } as const;

  return <Badge tone={map[label as PatientDetail["financialState"]].tone}>{map[label as PatientDetail["financialState"]].text}</Badge>;
}

const statusLabelMap = {
  invited: "Convidado",
  active: "Ativo",
  inactive: "Inativo",
  archived: "Arquivado"
} as const;

const statusToneMap = {
  invited: "warning",
  active: "success",
  inactive: "neutral",
  archived: "neutral"
} as const;
