"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ChargeDetail, ChargePaymentRequest } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";
import { ArrowRight, Clock3, CreditCard, FolderOpen, ReceiptText, X } from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type ChargeDetailPageProps = {
  initialData: ChargeDetail;
};

export function ChargeDetailPageView({ initialData }: ChargeDetailPageProps) {
  const router = useRouter();
  const [detail, setDetail] = useState(initialData);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [paymentForm, setPaymentForm] = useState<ChargePaymentRequest>({
    paidAt: "2026-03-30",
    amountCents: detail.amountCents,
    note: detail.paymentMethodLabel === "Não registrado" ? "" : detail.paymentMethodLabel
  });

  async function registerPayment() {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(`/api/charges/${detail.chargeId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentForm)
      });

      if (!response.ok) {
        setFeedback("Não foi possível registrar o pagamento agora.");
        return;
      }

      const payload = (await response.json()) as ChargeDetail;
      setDetail(payload);
      setFeedback("Pagamento registrado com sucesso.");
      setIsPaymentOpen(false);
      router.refresh();
    });
  }

  async function cancelCharge() {
    if (!window.confirm("Cancelar esta cobrança e manter o histórico rastreável?")) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(`/api/charges/${detail.chargeId}/cancel`, {
        method: "POST"
      });

      if (!response.ok) {
        setFeedback("Não foi possível cancelar a cobrança agora.");
        return;
      }

      const payload = (await response.json()) as ChargeDetail;
      setDetail(payload);
      setFeedback("Cobranca cancelada.");
      router.refresh();
    });
  }

  return (
    <>
      <div className="space-y-6">
        <nav className="text-sm text-[var(--color-text-muted)]">
          <Link className="font-medium text-[var(--color-primary)]" href="/app/finance">
            Financeiro
          </Link>
          <span className="mx-2">/</span>
          <span>{detail.code}</span>
        </nav>

        <OperationalHero
          actions={
            <>
              <Button
                onClick={() => setIsPaymentOpen(true)}
                type="button"
                disabled={!detail.primaryActions.canRegisterPayment || isPending}
              >
                <CreditCard className="h-4 w-4" />
                Registrar pagamento
              </Button>
              <Button
                onClick={() => void cancelCharge()}
                type="button"
                variant="secondary"
                disabled={!detail.primaryActions.canCancel || isPending}
              >
                Cancelar cobrança
              </Button>
              <Button asChild type="button" variant="secondary">
                <Link href={detail.patientHref}>
                  <FolderOpen className="h-4 w-4" />
                  Abrir paciente
                </Link>
              </Button>
              {detail.appointmentHref.length > 0 ? (
                <Button asChild type="button" variant="ghost">
                  <Link href={detail.appointmentHref}>
                    Abrir sessão
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </>
          }
          badges={
            <>
              <Badge tone={detail.originType === "private" ? "info" : "warning"}>
                {detail.originLabel}
              </Badge>
              <StatusBadge status={detail.status} text={detail.statusLabel} />
            </>
          }
          description={`${detail.code} · ${detail.patientName} · ${detail.dueAtLabel}`}
          stats={[
            {
              detail: "Resumo financeiro desta cobrança.",
              label: "Valor",
              tone: "info",
              value: detail.amountLabel
            },
            {
              detail: "Prazo operacional para cobrança.",
              label: "Vencimento",
              tone: detail.status === "overdue" ? "critical" : "neutral",
              value: detail.dueAtLabel
            },
            {
              detail: detail.notes,
              label: "Origem",
              tone: detail.originType === "private" ? "info" : "warning",
              value: detail.originLabel
            }
          ]}
          title={detail.patientName}
        />

        {feedback ? (
          <div className="rounded-2xl border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
            {feedback}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4" />
                  <p className="text-lg font-semibold">Highlights da cobrança</p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {detail.highlights.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <p className="text-lg font-semibold">Historico financeiro</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {detail.timeline.map((event) => (
                  <div
                    className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                    key={event.id}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">{event.title}</p>
                      <Badge tone="neutral">{event.actorLabel}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                      {event.description}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      {event.occurredAtLabel}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Contexto</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem label="Paciente" value={detail.patientName} />
                <InfoItem label="Contato" value={detail.patientContactLabel} />
                <InfoItem label="Sessão vinculada" value={detail.appointmentLabel} />
                <InfoItem label="Referência de exportação" value={detail.exportReferenceLabel} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Pagamento</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem label="Valor" value={detail.amountLabel} />
                <InfoItem label="Vencimento" value={detail.dueAtLabel} />
                <InfoItem label="Pago em" value={detail.paidAtLabel} />
                <InfoItem label="Método/observação" value={detail.paymentMethodLabel} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SidePanel
        description="Registre baixa manual quando o fluxo não vier automaticamente do gateway."
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Registrar pagamento"
      >
        <div className="space-y-4">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Data do pagamento
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  paidAt: event.target.value
                }))
              }
              type="date"
              value={paymentForm.paidAt}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Valor pago
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  amountCents: Math.round(Number(event.target.value.replace(",", ".")) * 100)
                }))
              }
              type="number"
              min="1"
              step="0.01"
              value={(paymentForm.amountCents / 100).toString()}
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Metodo / observacao
            </span>
            <input
              className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  note: event.target.value
                }))
              }
              placeholder="Ex.: Pix confirmado manualmente"
              value={paymentForm.note}
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={() => void registerPayment()} type="button" disabled={isPending}>
            Registrar baixa
          </Button>
          <Button onClick={() => setIsPaymentOpen(false)} type="button" variant="ghost">
            Fechar
          </Button>
        </div>
      </SidePanel>
    </>
  );
}

function StatusBadge({
  status,
  text
}: {
  status: ChargeDetail["status"];
  text: string;
}) {
  const tone =
    status === "paid" ? "success" : status === "pending" ? "warning" : status === "overdue" ? "critical" : "neutral";

  return <Badge tone={tone}>{text}</Badge>;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}

function SidePanel({
  children,
  description,
  isOpen,
  onClose,
  title
}: {
  children: React.ReactNode;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(12,24,27,0.24)] p-4">
      <button aria-label="Fechar painel" className="absolute inset-0" onClick={onClose} type="button" />
      <div className="relative h-full w-full max-w-xl overflow-y-auto rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-[0_30px_90px_rgba(12,24,27,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
