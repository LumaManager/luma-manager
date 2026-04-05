import { Injectable, NotFoundException } from "@nestjs/common";
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

type ChargeRecord = {
  chargeId: string;
  code: string;
  patientId: string;
  patientName: string;
  patientContactLabel: string;
  appointmentId: string;
  appointmentLabel: string;
  appointmentHref: string;
  amountCents: number;
  dueAtIso: string;
  dueAtLabel: string;
  paidAtLabel: string;
  originType: FinanceOriginType;
  originLabel: string;
  status: FinanceChargeStatus;
  statusLabel: string;
  lastEventAtIso: string;
  lastEventAtLabel: string;
  lastEventLabel: string;
  exportReferenceLabel: string;
  paymentMethodLabel: string;
  notes: string;
  highlights: ChargeDetail["highlights"];
  timeline: ChargeDetail["timeline"];
};

const seedCharges: ChargeRecord[] = [
  {
    chargeId: "charge_101",
    code: "CHG-2026-101",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientContactLabel: "lucas.santos@email.com · (11) 97777-2012",
    appointmentId: "appt_1038",
    appointmentLabel: "Sessao 30 Mar 2026 · 15:00",
    appointmentHref: "/app/appointments/appt_1038",
    amountCents: 22000,
    dueAtIso: "2026-03-30T18:00:00-03:00",
    dueAtLabel: "Hoje, 18:00",
    paidAtLabel: "Nao registrado",
    originType: "private",
    originLabel: "Particular",
    status: "pending",
    statusLabel: "Pendente",
    lastEventAtIso: "2026-03-30T09:05:00-03:00",
    lastEventAtLabel: "Hoje · 09:05",
    lastEventLabel: "Cobranca criada",
    exportReferenceLabel: "Particular · atendimento avulso",
    paymentMethodLabel: "Pix recomendado",
    notes: "Cobranca criada automaticamente a partir da sessao de hoje.",
    highlights: [
      { label: "Origem", value: "Particular" },
      { label: "Sessao vinculada", value: "Sim" },
      { label: "Estado", value: "Aguardando pagamento" }
    ],
    timeline: [
      {
        id: "timeline_charge_101_1",
        title: "Cobranca criada",
        description: "Gerada para a sessao presencial de hoje.",
        occurredAtLabel: "Hoje · 09:05",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    chargeId: "charge_401",
    code: "CHG-2026-401",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    patientContactLabel: "caio.oliveira@email.com · (11) 94444-5515",
    appointmentId: "appt_0999",
    appointmentLabel: "Sessao 12 Mar 2026 · 11:00",
    appointmentHref: "/app/appointments/appt_0999",
    amountCents: 22000,
    dueAtIso: "2026-03-20T18:00:00-03:00",
    dueAtLabel: "20 Mar 2026",
    paidAtLabel: "Nao registrado",
    originType: "private",
    originLabel: "Particular",
    status: "overdue",
    statusLabel: "Vencido",
    lastEventAtIso: "2026-03-21T08:00:00-03:00",
    lastEventAtLabel: "21 Mar · 08:00",
    lastEventLabel: "Prazo expirou sem baixa",
    exportReferenceLabel: "Particular · tratamento pausado",
    paymentMethodLabel: "Pix ou transferencia",
    notes: "Paciente inativo com sessao anterior ainda em aberto.",
    highlights: [
      { label: "Origem", value: "Particular" },
      { label: "Sessao vinculada", value: "Sim" },
      { label: "Estado", value: "Exige tratativa financeira" }
    ],
    timeline: [
      {
        id: "timeline_charge_401_1",
        title: "Cobranca venceu",
        description: "Prazo expirou e a cobranca passou para fila critica.",
        occurredAtLabel: "21 Mar · 08:00",
        actorLabel: "Sistema"
      },
      {
        id: "timeline_charge_401_2",
        title: "Cobranca criada",
        description: "Gerada a partir da ultima sessao concluida.",
        occurredAtLabel: "12 Mar · 12:05",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    chargeId: "charge_601",
    code: "CHG-2026-601",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientContactLabel: "maria.souza@email.com · (11) 98888-1101",
    appointmentId: "appt_1018",
    appointmentLabel: "Sessao 23 Mar 2026 · 13:30",
    appointmentHref: "/app/appointments/appt_1018",
    amountCents: 22000,
    dueAtIso: "2026-03-23T18:00:00-03:00",
    dueAtLabel: "23 Mar 2026",
    paidAtLabel: "23 Mar 2026",
    originType: "private",
    originLabel: "Particular",
    status: "paid",
    statusLabel: "Pago",
    lastEventAtIso: "2026-03-23T16:10:00-03:00",
    lastEventAtLabel: "23 Mar · 16:10",
    lastEventLabel: "Pagamento conciliado",
    exportReferenceLabel: "Particular · acompanhamento semanal",
    paymentMethodLabel: "Pix",
    notes: "Pagamento confirmado automaticamente no mesmo dia.",
    highlights: [
      { label: "Origem", value: "Particular" },
      { label: "Sessao vinculada", value: "Sim" },
      { label: "Estado", value: "Recebido" }
    ],
    timeline: [
      {
        id: "timeline_charge_601_1",
        title: "Pagamento registrado",
        description: "Baixa automatica confirmada para a cobranca.",
        occurredAtLabel: "23 Mar · 16:10",
        actorLabel: "Sistema"
      }
    ]
  },
  {
    chargeId: "charge_701",
    code: "CHG-2026-701",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientContactLabel: "renata.costa@email.com · (11) 96666-3313",
    appointmentId: "appt_1045",
    appointmentLabel: "Sessao 30 Mar 2026 · 17:10",
    appointmentHref: "/app/appointments/appt_1045",
    amountCents: 26000,
    dueAtIso: "2026-04-02T18:00:00-03:00",
    dueAtLabel: "02 Abr 2026",
    paidAtLabel: "Nao registrado",
    originType: "insurance",
    originLabel: "Convenio",
    status: "pending",
    statusLabel: "Pendente",
    lastEventAtIso: "2026-03-29T17:40:00-03:00",
    lastEventAtLabel: "29 Mar · 17:40",
    lastEventLabel: "Cobranca criada para lote de convenio",
    exportReferenceLabel: "Convenio · classificacao operacional",
    paymentMethodLabel: "Repasse externo",
    notes: "Convênio tratado apenas como classificacao operacional no MVP.",
    highlights: [
      { label: "Origem", value: "Convenio" },
      { label: "Sessao vinculada", value: "Sim" },
      { label: "Estado", value: "Aguardando repasse" }
    ],
    timeline: [
      {
        id: "timeline_charge_701_1",
        title: "Cobranca criada",
        description: "Item separado no financeiro por classificacao de convenio.",
        occurredAtLabel: "29 Mar · 17:40",
        actorLabel: "Terapeuta"
      }
    ]
  },
  {
    chargeId: "charge_801",
    code: "CHG-2026-801",
    patientId: "patient_julia_prado",
    patientName: "Julia Prado",
    patientContactLabel: "julia.prado@email.com · (11) 95555-4414",
    appointmentId: "",
    appointmentLabel: "Sem sessao vinculada",
    appointmentHref: "",
    amountCents: 18000,
    dueAtIso: "2026-04-03T18:00:00-03:00",
    dueAtLabel: "03 Abr 2026",
    paidAtLabel: "Nao registrado",
    originType: "private",
    originLabel: "Particular",
    status: "pending",
    statusLabel: "Pendente",
    lastEventAtIso: "2026-03-29T14:12:00-03:00",
    lastEventAtLabel: "29 Mar · 14:12",
    lastEventLabel: "Cobranca operacional criada",
    exportReferenceLabel: "Particular · onboarding inicial",
    paymentMethodLabel: "Pix",
    notes: "Item operacional sem sessao vinculada para organizar taxa inicial.",
    highlights: [
      { label: "Origem", value: "Particular" },
      { label: "Sessao vinculada", value: "Nao" },
      { label: "Estado", value: "Em aberto" }
    ],
    timeline: [
      {
        id: "timeline_charge_801_1",
        title: "Cobranca criada",
        description: "Registro manual aberto sem sessao vinculada.",
        occurredAtLabel: "29 Mar · 14:12",
        actorLabel: "Terapeuta"
      }
    ]
  }
];

const patientCatalog = [
  { value: "patient_maria_souza", label: "Maria Souza" },
  { value: "patient_lucas_santos", label: "Lucas Santos" },
  { value: "patient_renata_costa", label: "Renata Costa" },
  { value: "patient_julia_prado", label: "Julia Prado" },
  { value: "patient_caio_oliveira", label: "Caio Oliveira" }
] as const;

const appointmentCatalog = [
  { value: "appt_1032", label: "Maria Souza · 30 Mar 2026 · 13:30", patientId: "patient_maria_souza" },
  { value: "appt_1038", label: "Lucas Santos · 30 Mar 2026 · 15:00", patientId: "patient_lucas_santos" },
  { value: "appt_1045", label: "Renata Costa · 30 Mar 2026 · 17:10", patientId: "patient_renata_costa" }
] as const;

@Injectable()
export class FinanceService {
  private readonly chargesByEmail = new Map<string, ChargeRecord[]>();

  listCharges(session: AuthSession, query: Partial<Record<string, string>>): FinanceListResponse {
    const records = this.getRecordsForSession(session);
    const filters: FinanceListFilters = {
      search: query.search?.trim() ?? "",
      status: this.isStatusFilter(query.status) ? query.status : "all",
      originType: this.isOriginFilter(query.originType) ? query.originType : "all",
      period: this.isPeriodFilter(query.period) ? query.period : "current_month",
      overdueOnly: query.overdueOnly === "true",
      withoutAppointmentOnly: query.withoutAppointmentOnly === "true"
    };

    const filtered = records
      .filter((record) => this.matchesFilters(record, filters))
      .sort((left, right) => this.priorityWeight(right) - this.priorityWeight(left));

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize)) ? Number(query.pageSize) : 25;
    const start = (page - 1) * pageSize;

    return {
      summary: this.buildSummary(filtered, filters.period),
      items: filtered.slice(start, start + pageSize).map((record) => this.toListItem(record)),
      total: filtered.length,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100],
      patientOptions: [...patientCatalog],
      appointmentOptions: [...appointmentCatalog]
    };
  }

  getChargeDetail(session: AuthSession, chargeId: string): ChargeDetail {
    const record = this.getRecord(session, chargeId);
    return this.toDetail(record);
  }

  getSummary(session: AuthSession, query: Partial<Record<string, string>>): FinanceSummary {
    const data = this.listCharges(session, query);
    return data.summary;
  }

  exportCharges(session: AuthSession, query: Partial<Record<string, string>>): FinanceExportResponse {
    const data = this.listCharges(session, query);
    return {
      filename: `financeiro-${data.summary.periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
      rowCount: data.items.length,
      periodLabel: data.summary.periodLabel
    };
  }

  createCharge(session: AuthSession, input: ChargeCreateRequest): ChargeCreateResponse {
    const payload = chargeCreateRequestSchema.parse(input);
    const records = this.getRecordsForSession(session);
    const patient = patientCatalog.find((item) => item.value === payload.patientId);
    const appointment = appointmentCatalog.find((item) => item.value === payload.appointmentId);
    const chargeId = `charge_${Date.now()}`;

    const record: ChargeRecord = {
      chargeId,
      code: `CHG-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, "0")}`,
      patientId: payload.patientId,
      patientName: patient?.label ?? "Paciente novo",
      patientContactLabel: "contato pendente",
      appointmentId: appointment?.value ?? "",
      appointmentLabel: appointment?.label ?? "Sem sessao vinculada",
      appointmentHref: appointment ? `/app/appointments/${appointment.value}` : "",
      amountCents: payload.amountCents,
      dueAtIso: `${payload.dueDate}T18:00:00-03:00`,
      dueAtLabel: payload.dueDate,
      paidAtLabel: "Nao registrado",
      originType: payload.originType,
      originLabel: payload.originType === "private" ? "Particular" : "Convenio",
      status: "pending",
      statusLabel: "Pendente",
      lastEventAtIso: new Date().toISOString(),
      lastEventAtLabel: "Agora",
      lastEventLabel: "Cobranca criada",
      exportReferenceLabel: payload.originType === "private" ? "Particular" : "Convenio",
      paymentMethodLabel: payload.originType === "private" ? "Pix recomendado" : "Repasse externo",
      notes: "Cobranca criada manualmente pelo terapeuta.",
      highlights: [
        { label: "Origem", value: payload.originType === "private" ? "Particular" : "Convenio" },
        { label: "Sessao vinculada", value: appointment ? "Sim" : "Nao" },
        { label: "Estado", value: "Pendente" }
      ],
      timeline: [
        {
          id: `timeline_${chargeId}_1`,
          title: "Cobranca criada",
          description: "Novo item financeiro registrado no drawer da lista.",
          occurredAtLabel: "Agora",
          actorLabel: "Terapeuta"
        }
      ]
    };

    records.unshift(record);

    return {
      chargeId,
      redirectTo: `/app/finance/charges/${chargeId}`
    };
  }

  registerPayment(
    session: AuthSession,
    chargeId: string,
    input: ChargePaymentRequest
  ): ChargeDetail {
    const payload = chargePaymentRequestSchema.parse(input);
    const record = this.getRecord(session, chargeId);

    record.status = "paid";
    record.statusLabel = "Pago";
    record.paidAtLabel = payload.paidAt;
    record.lastEventAtIso = new Date().toISOString();
    record.lastEventAtLabel = "Agora";
    record.lastEventLabel = "Pagamento registrado";
    record.paymentMethodLabel = payload.note.length > 0 ? payload.note : "Baixa manual";
    record.timeline.unshift({
      id: `timeline_${chargeId}_${record.timeline.length + 1}`,
      title: "Pagamento registrado",
      description: `Baixa manual registrada no valor de ${formatCurrency(payload.amountCents)}.`,
      occurredAtLabel: "Agora",
      actorLabel: "Terapeuta"
    });

    return this.toDetail(record);
  }

  cancelCharge(session: AuthSession, chargeId: string): ChargeDetail {
    const record = this.getRecord(session, chargeId);

    record.status = "canceled";
    record.statusLabel = "Cancelado";
    record.lastEventAtIso = new Date().toISOString();
    record.lastEventAtLabel = "Agora";
    record.lastEventLabel = "Cobranca cancelada";
    record.timeline.unshift({
      id: `timeline_${chargeId}_${record.timeline.length + 1}`,
      title: "Cobranca cancelada",
      description: "Cancelamento manual registrado para preservar rastreabilidade.",
      occurredAtLabel: "Agora",
      actorLabel: "Terapeuta"
    });

    return this.toDetail(record);
  }

  private getRecordsForSession(session: AuthSession) {
    const key = session.therapist.email;

    if (!this.chargesByEmail.has(key)) {
      this.chargesByEmail.set(
        key,
        seedCharges.map((record) => ({
          ...record,
          highlights: [...record.highlights],
          timeline: [...record.timeline]
        }))
      );
    }

    return this.chargesByEmail.get(key) ?? [];
  }

  private getRecord(session: AuthSession, chargeId: string) {
    const record = this.getRecordsForSession(session).find((item) => item.chargeId === chargeId);

    if (!record) {
      throw new NotFoundException("Cobranca nao encontrada.");
    }

    return record;
  }

  private matchesFilters(record: ChargeRecord, filters: FinanceListFilters) {
    const query = filters.search.toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      `${record.patientName} ${record.code} ${record.amountCents}`.toLowerCase().includes(query);
    const matchesStatus = filters.status === "all" || record.status === filters.status;
    const matchesOrigin = filters.originType === "all" || record.originType === filters.originType;
    const matchesPeriod = this.matchesPeriod(record, filters.period);
    const matchesOverdue = !filters.overdueOnly || record.status === "overdue";
    const matchesAppointment = !filters.withoutAppointmentOnly || record.appointmentId.length === 0;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesOrigin &&
      matchesPeriod &&
      matchesOverdue &&
      matchesAppointment
    );
  }

  private matchesPeriod(record: ChargeRecord, period: FinanceListFilters["period"]) {
    const date = Date.parse(record.dueAtIso);
    const currentMonthStart = Date.parse("2026-03-01T00:00:00-03:00");
    const currentMonthEnd = Date.parse("2026-03-31T23:59:59-03:00");
    const next30Start = Date.parse("2026-03-30T00:00:00-03:00");
    const next30End = Date.parse("2026-04-29T23:59:59-03:00");
    const last30Start = Date.parse("2026-02-28T00:00:00-03:00");
    const last30End = Date.parse("2026-03-30T23:59:59-03:00");

    if (period === "all") return true;
    if (period === "current_month") return date >= currentMonthStart && date <= currentMonthEnd;
    if (period === "next_30_days") return date >= next30Start && date <= next30End;
    return date >= last30Start && date <= last30End;
  }

  private buildSummary(records: ChargeRecord[], period: FinanceListFilters["period"]): FinanceSummary {
    const totals = records.reduce(
      (acc, record) => {
        acc.charged += record.amountCents;
        if (record.status === "paid") acc.received += record.amountCents;
        if (record.status === "pending") acc.open += record.amountCents;
        if (record.status === "overdue") acc.overdue += record.amountCents;
        return acc;
      },
      { charged: 0, received: 0, open: 0, overdue: 0 }
    );

    return {
      periodLabel:
        period === "all"
          ? "Tudo"
          : period === "next_30_days"
            ? "Proximos 30 dias"
            : period === "last_30_days"
              ? "Ultimos 30 dias"
              : "Mes atual",
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
    return {
      chargeId: record.chargeId,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      appointmentId: record.appointmentId,
      appointmentLabel: record.appointmentLabel,
      appointmentHref: record.appointmentHref,
      originType: record.originType,
      originLabel: record.originLabel,
      amountLabel: formatCurrency(record.amountCents),
      amountCents: record.amountCents,
      dueAtLabel: record.dueAtLabel,
      status: record.status,
      statusLabel: record.statusLabel,
      lastEventAtLabel: record.lastEventAtLabel,
      lastEventLabel: record.lastEventLabel,
      canRegisterPayment: record.status === "pending" || record.status === "overdue",
      canCancel: record.status === "pending" || record.status === "overdue",
      chargeHref: `/app/finance/charges/${record.chargeId}`
    };
  }

  private toDetail(record: ChargeRecord): ChargeDetail {
    return {
      chargeId: record.chargeId,
      code: record.code,
      patientId: record.patientId,
      patientName: record.patientName,
      patientHref: `/app/patients/${record.patientId}`,
      patientContactLabel: record.patientContactLabel,
      appointmentId: record.appointmentId,
      appointmentLabel: record.appointmentLabel,
      appointmentHref: record.appointmentHref,
      amountLabel: formatCurrency(record.amountCents),
      amountCents: record.amountCents,
      dueAtLabel: record.dueAtLabel,
      paidAtLabel: record.paidAtLabel,
      originType: record.originType,
      originLabel: record.originLabel,
      status: record.status,
      statusLabel: record.statusLabel,
      lastEventAtLabel: record.lastEventAtLabel,
      lastEventLabel: record.lastEventLabel,
      exportReferenceLabel: record.exportReferenceLabel,
      paymentMethodLabel: record.paymentMethodLabel,
      notes: record.notes,
      highlights: record.highlights,
      timeline: record.timeline,
      primaryActions: {
        canRegisterPayment: record.status === "pending" || record.status === "overdue",
        canCancel: record.status === "pending" || record.status === "overdue"
      }
    };
  }

  private priorityWeight(record: ChargeRecord) {
    const statusWeight = {
      canceled: 0,
      paid: 1,
      pending: 3,
      overdue: 5
    } satisfies Record<FinanceChargeStatus, number>;

    return statusWeight[record.status] + Math.round(record.amountCents / 10000);
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value / 100);
}
