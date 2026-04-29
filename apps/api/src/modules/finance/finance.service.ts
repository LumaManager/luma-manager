// apps/api/src/modules/finance/finance.service.ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type {
  AuthSession,
  ChargeCreateRequest,
  ChargeCreateResponse,
  ChargeDetail,
  ChargePaymentRequest,
  FinanceChargeListItem,
  FinanceChargeStatus,
  FinanceExportResponse,
  FinanceListFilters,
  FinanceListResponse,
  FinanceOriginType,
  FinanceSummary
} from "@terapia/contracts";
import { chargeCreateRequestSchema, chargePaymentRequestSchema } from "@terapia/contracts";

import { buildMockChargeDetail, buildMockFinanceList, isMockEmail } from "@/modules/mock";
import type { ChargeEventRow, ChargeWithPatient } from "./finance.repository";
import { FinanceRepository } from "./finance.repository";

// ---------------------------------------------------------------------------
// Internal enriched type
// ---------------------------------------------------------------------------

type ChargeRecord = ChargeWithPatient & {
  events: ChargeEventRow[];
};

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const PT_MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const m = parseInt(month ?? "1", 10) - 1;
  return `${parseInt(day ?? "1", 10)} ${PT_MONTHS[m] ?? ""} ${year ?? ""}`;
}

function formatTimestamp(ts: Date): string {
  const m = ts.getMonth();
  const d = ts.getDate();
  const hh = String(ts.getHours()).padStart(2, "0");
  const mm = String(ts.getMinutes()).padStart(2, "0");
  return `${d} ${PT_MONTHS[m] ?? ""} ${ts.getFullYear()} · ${hh}:${mm}`;
}

function chargeStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendente",
    paid: "Pago",
    overdue: "Vencido",
    canceled: "Cancelado"
  };
  return map[status] ?? status;
}

function chargeOriginLabel(originType: string): string {
  return originType === "insurance" ? "Convênio" : "Particular";
}

function chargePaymentMethodLabel(originType: string, paymentNote: string): string {
  if (paymentNote.length > 0) return paymentNote;
  return originType === "insurance" ? "Repasse externo" : "Pix recomendado";
}

function buildHighlights(charge: ChargeWithPatient): ChargeDetail["highlights"] {
  return [
    { label: "Origem", value: chargeOriginLabel(charge.originType) },
    { label: "Sessão vinculada", value: charge.appointmentId.length > 0 ? "Sim" : "Não" },
    {
      label: "Estado",
      value:
        ({
          pending: "Aguardando pagamento",
          paid: "Recebido",
          overdue: "Exige tratativa financeira",
          canceled: "Cancelado"
        } as Record<string, string>)[charge.status] ?? charge.status
    }
  ];
}

const eventTitles: Record<string, string> = {
  created: "Cobrança criada",
  payment_registered: "Pagamento registrado",
  overdue_flagged: "Prazo expirou sem baixa",
  canceled: "Cobrança cancelada"
};

function buildTimeline(events: ChargeEventRow[]): ChargeDetail["timeline"] {
  return events.map((ev) => ({
    id: ev.id,
    title: eventTitles[ev.eventType] ?? ev.eventType,
    description: ev.description,
    occurredAtLabel: formatTimestamp(ev.occurredAt),
    actorLabel: ev.actorId === "system" ? "Sistema" : "Terapeuta"
  }));
}

function chargeAppointmentLabel(charge: ChargeWithPatient): string {
  if (!charge.appointmentId || !charge.appointmentDate) return "Sem sessão vinculada";
  const time = charge.appointmentStartTime ? charge.appointmentStartTime.slice(0, 5) : "";
  return `Sessão ${formatDate(charge.appointmentDate)} · ${time}`;
}

// ---------------------------------------------------------------------------
// Period date helpers
// ---------------------------------------------------------------------------

function getPeriodBounds(period: FinanceListFilters["period"]): { start: string; end: string } | null {
  if (period === "all") return null;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === "current_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: toIso(start), end: toIso(end) };
  }

  if (period === "next_30_days") {
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    return { start: toIso(now), end: toIso(end) };
  }

  // last_30_days
  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  return { start: toIso(start), end: toIso(now) };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class FinanceService {
  constructor(@Inject(FinanceRepository) private readonly repo: FinanceRepository) {}

  async listCharges(
    session: AuthSession,
    query: Partial<Record<string, string>>
  ): Promise<FinanceListResponse> {
    if (isMockEmail(session.therapist.email)) return buildMockFinanceList(query);

    const [charges, patientOptions, appointmentOptions] = await Promise.all([
      this.repo.listWithPatient(session.tenant.id),
      this.repo.listDistinctPatients(session.tenant.id),
      this.repo.listLinkableAppointments(session.tenant.id)
    ]);

    const allEvents = await this.repo.listEventsForCharges(charges.map((c) => c.id));
    const eventsByCharge = new Map<string, ChargeEventRow[]>();
    for (const ev of allEvents) {
      const list = eventsByCharge.get(ev.chargeId) ?? [];
      list.push(ev);
      eventsByCharge.set(ev.chargeId, list);
    }

    const records: ChargeRecord[] = charges.map((c) => ({
      ...c,
      events: eventsByCharge.get(c.id) ?? []
    }));

    const filters: FinanceListFilters = {
      search: query.search?.trim() ?? "",
      status: this.isStatusFilter(query.status) ? query.status : "all",
      originType: this.isOriginFilter(query.originType) ? query.originType : "all",
      period: this.isPeriodFilter(query.period) ? query.period : "current_month",
      overdueOnly: query.overdueOnly === "true",
      withoutAppointmentOnly: query.withoutAppointmentOnly === "true"
    };

    const filtered = records
      .filter((r) => this.matchesFilters(r, filters))
      .sort((a, b) => this.priorityWeight(b) - this.priorityWeight(a));

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize)) ? Number(query.pageSize) : 25;
    const start = (page - 1) * pageSize;

    return {
      summary: this.buildSummary(filtered, filters.period),
      items: filtered.slice(start, start + pageSize).map((r) => this.toListItem(r)),
      total: filtered.length,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100],
      patientOptions,
      appointmentOptions
    };
  }

  async getChargeDetail(session: AuthSession, chargeId: string): Promise<ChargeDetail> {
    if (isMockEmail(session.therapist.email)) {
      const mock = buildMockChargeDetail(chargeId);
      if (mock) return mock;
      throw new NotFoundException("Cobrança não encontrada.");
    }

    const charge = await this.repo.findByIdWithPatient(session.tenant.id, chargeId);
    if (!charge) throw new NotFoundException("Cobrança não encontrada.");

    const events = await this.repo.listEvents(chargeId);
    return this.toDetail({ ...charge, events });
  }

  async getSummary(
    session: AuthSession,
    query: Partial<Record<string, string>>
  ): Promise<FinanceSummary> {
    return (await this.listCharges(session, query)).summary;
  }

  async exportCharges(
    session: AuthSession,
    query: Partial<Record<string, string>>
  ): Promise<FinanceExportResponse> {
    const data = await this.listCharges(session, query);
    return {
      filename: `financeiro-${data.summary.periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
      rowCount: data.items.length,
      periodLabel: data.summary.periodLabel
    };
  }

  async createCharge(session: AuthSession, input: ChargeCreateRequest): Promise<ChargeCreateResponse> {
    const payload = chargeCreateRequestSchema.parse(input);
    const count = await this.repo.countForTenant(session.tenant.id);
    const code = `CHG-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const charge = await this.repo.create({
      tenantId: session.tenant.id,
      patientId: payload.patientId,
      appointmentId: payload.appointmentId ?? "",
      code,
      amountCents: payload.amountCents,
      dueDate: payload.dueDate,
      originType: payload.originType,
      exportReference: payload.originType === "private" ? "Particular" : "Convênio"
    });

    await this.repo.addEvent({
      chargeId: charge.id,
      eventType: "created",
      actorId: session.therapist.id,
      description: "Cobrança criada manualmente pelo terapeuta."
    });

    return { chargeId: charge.id, redirectTo: `/app/finance/charges/${charge.id}` };
  }

  async registerPayment(
    session: AuthSession,
    chargeId: string,
    input: ChargePaymentRequest
  ): Promise<ChargeDetail> {
    const payload = chargePaymentRequestSchema.parse(input);
    const charge = await this.repo.findByIdWithPatient(session.tenant.id, chargeId);
    if (!charge) throw new NotFoundException("Cobrança não encontrada.");

    await this.repo.updateStatus(chargeId, {
      status: "paid",
      paidAt: payload.paidAt,
      paidAmountCents: payload.amountCents,
      paymentNote: payload.note
    });

    await this.repo.addEvent({
      chargeId,
      eventType: "payment_registered",
      actorId: session.therapist.id,
      description: `Baixa manual registrada no valor de ${formatCurrency(payload.amountCents)}.`
    });

    const updated = await this.repo.findByIdWithPatient(session.tenant.id, chargeId);
    const events = await this.repo.listEvents(chargeId);
    return this.toDetail({ ...updated!, events });
  }

  async cancelCharge(session: AuthSession, chargeId: string): Promise<ChargeDetail> {
    const charge = await this.repo.findByIdWithPatient(session.tenant.id, chargeId);
    if (!charge) throw new NotFoundException("Cobrança não encontrada.");

    await this.repo.updateStatus(chargeId, { status: "canceled" });

    await this.repo.addEvent({
      chargeId,
      eventType: "canceled",
      actorId: session.therapist.id,
      description: "Cancelamento manual registrado para preservar rastreabilidade."
    });

    const updated = await this.repo.findByIdWithPatient(session.tenant.id, chargeId);
    const events = await this.repo.listEvents(chargeId);
    return this.toDetail({ ...updated!, events });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private matchesFilters(record: ChargeRecord, filters: FinanceListFilters): boolean {
    const query = filters.search.toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      `${record.patientName} ${record.code} ${record.amountCents}`.toLowerCase().includes(query);
    const matchesStatus = filters.status === "all" || record.status === filters.status;
    const matchesOrigin = filters.originType === "all" || record.originType === filters.originType;
    const matchesPeriod = this.matchesPeriod(record.dueDate, filters.period);
    const matchesOverdue = !filters.overdueOnly || record.status === "overdue";
    const matchesAppointment =
      !filters.withoutAppointmentOnly || record.appointmentId.length === 0;

    return matchesQuery && matchesStatus && matchesOrigin && matchesPeriod && matchesOverdue && matchesAppointment;
  }

  private matchesPeriod(dueDate: string, period: FinanceListFilters["period"]): boolean {
    const bounds = getPeriodBounds(period);
    if (!bounds) return true;
    return dueDate >= bounds.start && dueDate <= bounds.end;
  }

  private buildSummary(records: ChargeRecord[], period: FinanceListFilters["period"]): FinanceSummary {
    const totals = records.reduce(
      (acc, r) => {
        acc.charged += r.amountCents;
        if (r.status === "paid") acc.received += r.amountCents;
        if (r.status === "pending") acc.open += r.amountCents;
        if (r.status === "overdue") acc.overdue += r.amountCents;
        return acc;
      },
      { charged: 0, received: 0, open: 0, overdue: 0 }
    );

    const periodLabel =
      period === "all"
        ? "Tudo"
        : period === "next_30_days"
          ? "Próximos 30 dias"
          : period === "last_30_days"
            ? "Últimos 30 dias"
            : "Mês atual";

    return {
      periodLabel,
      totalChargedLabel: formatCurrency(totals.charged),
      totalReceivedLabel: formatCurrency(totals.received),
      totalOpenLabel: formatCurrency(totals.open),
      totalOverdueLabel: formatCurrency(totals.overdue),
      totalChargedCents: totals.charged,
      totalReceivedCents: totals.received,
      totalOpenCents: totals.open,
      totalOverdueCents: totals.overdue
    };
  }

  private toListItem(record: ChargeRecord): FinanceChargeListItem {
    const latestEvent = record.events[0];

    return {
      chargeId: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      appointmentId: record.appointmentId,
      appointmentLabel: chargeAppointmentLabel(record),
      appointmentHref: record.appointmentId ? `/app/appointments/${record.appointmentId}` : "",
      originType: record.originType as FinanceOriginType,
      originLabel: chargeOriginLabel(record.originType),
      amountLabel: formatCurrency(record.amountCents),
      amountCents: record.amountCents,
      dueAtLabel: formatDate(record.dueDate),
      status: record.status as FinanceChargeStatus,
      statusLabel: chargeStatusLabel(record.status),
      lastEventAtLabel: latestEvent ? formatTimestamp(latestEvent.occurredAt) : "",
      lastEventLabel: latestEvent ? (eventTitles[latestEvent.eventType] ?? latestEvent.eventType) : "",
      canRegisterPayment: record.status === "pending" || record.status === "overdue",
      canCancel: record.status === "pending" || record.status === "overdue",
      chargeHref: `/app/finance/charges/${record.id}`
    };
  }

  private toDetail(record: ChargeRecord): ChargeDetail {
    const latestEvent = record.events[0];

    return {
      chargeId: record.id,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      patientContactLabel: `${record.patientEmail} · ${record.patientPhone}`,
      appointmentId: record.appointmentId,
      appointmentLabel: chargeAppointmentLabel(record),
      appointmentHref: record.appointmentId ? `/app/appointments/${record.appointmentId}` : "",
      amountLabel: formatCurrency(record.amountCents),
      amountCents: record.amountCents,
      dueAtLabel: formatDate(record.dueDate),
      paidAtLabel: record.paidAt ? formatDate(record.paidAt) : "Não registrado",
      originType: record.originType as FinanceOriginType,
      originLabel: chargeOriginLabel(record.originType),
      status: record.status as FinanceChargeStatus,
      statusLabel: chargeStatusLabel(record.status),
      lastEventAtLabel: latestEvent ? formatTimestamp(latestEvent.occurredAt) : "",
      lastEventLabel: latestEvent ? (eventTitles[latestEvent.eventType] ?? latestEvent.eventType) : "",
      exportReferenceLabel: record.exportReference,
      paymentMethodLabel: chargePaymentMethodLabel(record.originType, record.paymentNote),
      notes: record.paymentNote,
      highlights: buildHighlights(record),
      timeline: buildTimeline(record.events),
      primaryActions: {
        canRegisterPayment: record.status === "pending" || record.status === "overdue",
        canCancel: record.status === "pending" || record.status === "overdue"
      }
    };
  }

  private priorityWeight(record: ChargeRecord): number {
    const statusWeight: Record<string, number> = {
      canceled: 0, paid: 1, pending: 3, overdue: 5
    };
    return (statusWeight[record.status] ?? 0) + Math.round(record.amountCents / 10000);
  }

  private isStatusFilter(value: string | undefined): value is FinanceListFilters["status"] {
    return ["all", "pending", "paid", "overdue", "canceled"].includes(value ?? "");
  }

  private isOriginFilter(value: string | undefined): value is FinanceListFilters["originType"] {
    return ["all", "private", "insurance"].includes(value ?? "");
  }

  private isPeriodFilter(value: string | undefined): value is FinanceListFilters["period"] {
    return ["all", "current_month", "next_30_days", "last_30_days"].includes(value ?? "");
  }
}
