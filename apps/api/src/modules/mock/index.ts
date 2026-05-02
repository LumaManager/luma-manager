import type {
  AgendaResponse,
  AppointmentDetail,
  ChargeDetail,
  DocumentDetail,
  DocumentsListResponse,
  FinanceListResponse,
  PatientDetail,
  PatientListResponse
} from "@terapia/contracts";

// ---------------------------------------------------------------------------
// Mock account guard
// ---------------------------------------------------------------------------

export const MOCK_EMAILS = new Set([
  "ana@institutovivace.com.br",
  "ana.ready@institutovivace.com.br"
]);

export function isMockEmail(email: string): boolean {
  return MOCK_EMAILS.has(email);
}

// ---------------------------------------------------------------------------
// Shared patient records
// ---------------------------------------------------------------------------

const PATIENTS = [
  {
    id: "patient_maria_souza",
    fullName: "Maria Souza",
    code: "P-0001",
    email: "maria.souza@email.com",
    phone: "(11) 98765-4321",
    age: "36 anos",
    nextSession: "Hoje, 13:30",
    docs: "ok" as const,
    docsLabel: "OK",
    fin: "ok" as const,
    finLabel: "Sem pendências"
  },
  {
    id: "patient_lucas_santos",
    fullName: "Lucas Santos",
    code: "P-0002",
    email: "lucas.santos@email.com",
    phone: "(11) 97654-3210",
    age: "30 anos",
    nextSession: "Hoje, 15:00",
    docs: "ok" as const,
    docsLabel: "OK",
    fin: "open" as const,
    finLabel: "1 cobrança em aberto"
  },
  {
    id: "patient_renata_costa",
    fullName: "Renata Costa",
    code: "P-0003",
    email: "renata.costa@email.com",
    phone: "(11) 96543-2109",
    age: "38 anos",
    nextSession: "Hoje, 17:10",
    docs: "critical" as const,
    docsLabel: "Bloqueia sessão online",
    fin: "ok" as const,
    finLabel: "Sem pendências"
  },
  {
    id: "patient_julia_prado",
    fullName: "Julia Prado",
    code: "P-0004",
    email: "julia.prado@email.com",
    phone: "(11) 95432-1098",
    age: "33 anos",
    nextSession: "Amanhã, 09:00",
    docs: "pending" as const,
    docsLabel: "1 pendente",
    fin: "overdue" as const,
    finLabel: "1 cobrança vencida"
  },
  {
    id: "patient_caio_oliveira",
    fullName: "Caio Oliveira",
    code: "P-0005",
    email: "caio.oliveira@email.com",
    phone: "(11) 94321-0987",
    age: "37 anos",
    nextSession: "Qui, 11:00",
    docs: "ok" as const,
    docsLabel: "OK",
    fin: "ok" as const,
    finLabel: "Sem pendências"
  }
];

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

export function buildMockPatientList(query: Record<string, string>): PatientListResponse {
  let list = [...PATIENTS];
  if (query.query) {
    const q = query.query.toLowerCase();
    list = list.filter((p) => p.fullName.toLowerCase().includes(q) || p.code.includes(q));
  }
  const validStatus = ["all", "invited", "active", "inactive", "archived"];
  const status = validStatus.includes(query.status ?? "") ? query.status! : "all";
  if (status !== "all") {
    list = list.filter(() => status === "active");
  }

  return {
    items: list.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      externalCode: p.code,
      primaryContact: `${p.email} · ${p.phone}`,
      status: "active",
      nextSessionLabel: p.nextSession,
      documentsState: p.docs,
      documentsCountLabel: p.docsLabel,
      financialState: p.fin,
      financialLabel: p.finLabel,
      hasLegalGuardian: false,
      patientHref: `/app/patients/${p.id}`
    })),
    total: list.length,
    page: 1,
    pageSize: 25,
    filters: {
      query: query.query ?? "",
      status: status as any,
      documents: "all",
      financial: "all",
      upcomingOnly: false,
      legalGuardianOnly: false
    },
    availablePageSizes: [25, 50, 100]
  };
}

export function buildMockPatientDetail(patientId: string): PatientDetail | null {
  const p = PATIENTS.find((x) => x.id === patientId);
  if (!p) return null;
  return {
    id: p.id,
    fullName: p.fullName,
    status: "active",
    ageLabel: p.age,
    primaryContact: `${p.email} · ${p.phone}`,
    legalGuardianLabel: "Não se aplica",
    nextSessionLabel: p.nextSession,
    documentsState: p.docs,
    financialState: p.fin,
    clinicalReviewLabel: "Sem pendência clínica urgente",
    createdAtLabel: "Vínculo criado em 15 jan 2026",
    paymentOriginLabel: "Particular",
    primaryAction: { label: "Agendar sessão", href: `/app/agenda?patientId=${p.id}` },
    topActions: {
      scheduleHref: `/app/agenda?patientId=${p.id}`,
      clinicalRecordHref: `/app/patients/${p.id}/clinical-record`
    },
    overviewBlocks: [
      {
        title: "Resumo do vínculo",
        value: "Ativo em acompanhamento",
        description: "Atendimento particular."
      },
      {
        title: "Próxima sessão",
        value: p.nextSession,
        description: "Consulte a agenda para detalhes."
      },
      {
        title: "Financeiro",
        value: p.fin === "ok" ? "Sem pendências" : p.finLabel,
        description: p.fin === "ok" ? "Nenhuma cobrança pendente." : "Regularize antes da próxima sessão."
      }
    ],
    sessions: [],
    documents: [],
    charges: [],
    activity: []
  };
}

// ---------------------------------------------------------------------------
// Agenda / Appointments
// ---------------------------------------------------------------------------

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
const MONTH_LABELS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"] as const;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekMonday(date: string): string {
  const d = new Date(date + "T12:00:00Z");
  const dow = d.getUTCDay();
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

function dateLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  return `${d.getUTCDate()} de ${MONTH_LABELS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

const MOCK_APPTS = [
  { id: "appt_1032", patient: "patient_maria_souza",  name: "Maria Souza",  dayOffset: 0, start: "13:30", end: "14:20", modality: "telehealth",  status: "confirmed" },
  { id: "appt_1038", patient: "patient_lucas_santos", name: "Lucas Santos", dayOffset: 0, start: "15:00", end: "15:50", modality: "in_person",   status: "confirmed" },
  { id: "appt_1045", patient: "patient_renata_costa", name: "Renata Costa", dayOffset: 0, start: "17:10", end: "18:00", modality: "telehealth",  status: "confirmed" },
  { id: "appt_1050", patient: "patient_julia_prado",  name: "Julia Prado",  dayOffset: 1, start: "09:00", end: "09:50", modality: "telehealth",  status: "scheduled" },
  { id: "appt_1055", patient: "patient_caio_oliveira",name: "Caio Oliveira",dayOffset: 2, start: "11:00", end: "11:50", modality: "telehealth",  status: "scheduled" },
  { id: "appt_1060", patient: "patient_maria_souza",  name: "Maria Souza",  dayOffset: 3, start: "13:30", end: "14:20", modality: "telehealth",  status: "scheduled" },
  { id: "appt_1065", patient: "patient_lucas_santos", name: "Lucas Santos", dayOffset: 4, start: "15:00", end: "15:50", modality: "in_person",   status: "scheduled" }
];

export function buildMockAgenda(query: Record<string, string>): AgendaResponse {
  const today = todayStr();
  const targetDate = query.date ?? today;
  const view = query.view === "week" || query.view === "month" ? query.view : "week";

  const monday = weekMonday(targetDate);
  const dayColumns = Array.from({ length: 7 }, (_, i) => {
    const key = addDays(monday, i);
    const d = new Date(key + "T12:00:00Z");
    return {
      key,
      label: DAY_LABELS[d.getUTCDay()]!,
      dateLabel: `${DAY_LABELS[d.getUTCDay()]} ${d.getUTCDate()}`,
      isToday: key === today
    };
  });

  const dateFrom = dayColumns[0]!.key;
  const dateTo = dayColumns[6]!.key;
  const fromD = new Date(dateFrom + "T12:00:00Z");
  const toD = new Date(dateTo + "T12:00:00Z");
  const visibleRangeLabel = `${fromD.getUTCDate()} – ${toD.getUTCDate()} de ${MONTH_LABELS[toD.getUTCMonth()]}, ${toD.getUTCFullYear()}`;

  const timeSlots: string[] = [];
  for (let h = 6; h <= 22; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

  const validStatuses = ["all", "scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"];
  const validModalities = ["all", "telehealth", "in_person"];
  const statusFilter = validStatuses.includes(query.status ?? "") ? (query.status ?? "all") : "all";
  const modalityFilter = validModalities.includes(query.modality ?? "") ? (query.modality ?? "all") : "all";

  // Resolve appointment dates relative to monday of the requested week, applying filters
  const filteredAppts = MOCK_APPTS
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .filter((a) => modalityFilter === "all" || a.modality === modalityFilter);

  const scheduleBlocks = filteredAppts.map((a) => {
    const dayKey = addDays(monday, a.dayOffset);
    const tone = a.status === "confirmed" ? "info" as const : "neutral" as const;
    return {
      id: a.id,
      type: "appointment" as const,
      title: a.name,
      subtitle: `${a.start}–${a.end} · ${a.modality === "telehealth" ? "Teleatendimento" : "Presencial"}`,
      startsAt: `${dayKey}T${a.start}:00`,
      endsAt: `${dayKey}T${a.end}:00`,
      dayKey,
      tone,
      href: `/app/appointments/${a.id}`
    };
  });

  return {
    accountStatus: "ready_for_operations",
    currentView: view as any,
    visibleRangeLabel,
    dayColumns,
    timeSlots,
    availabilityRules: Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      weekdayLabel: DAY_LABELS[weekday]!,
      enabled: weekday >= 1 && weekday <= 5,
      windows:
        weekday >= 1 && weekday <= 5
          ? [{ id: `rule_${weekday}`, startTime: "09:00", endTime: "18:00" }]
          : []
    })),
    filters: { status: statusFilter as any, modality: modalityFilter as any },
    quickActions: [
      { id: "new_appt", label: "Nova sessão", href: "/app/agenda?action=new" },
      { id: "view_patients", label: "Ver pacientes", href: "/app/patients" }
    ],
    scheduleBlocks
  };
}

export function buildMockAppointmentDetail(appointmentId: string): AppointmentDetail | null {
  const a = MOCK_APPTS.find((x) => x.id === appointmentId);
  if (!a) return null;
  const monday = weekMonday(todayStr());
  const dayKey = addDays(monday, a.dayOffset);
  const label = dateLabel(dayKey);
  const timeRange = `${a.start}–${a.end}`;
  return {
    id: a.id,
    patientId: a.patient,
    patientName: a.name,
    patientHref: `/app/patients/${a.patient}`,
    dateKey: dayKey,
    startTime: a.start,
    endTime: a.end,
    dateLabel: label,
    timeRangeLabel: timeRange,
    durationLabel: "50 min",
    modality: a.modality as any,
    modalityLabel: a.modality === "telehealth" ? "Teleatendimento" : "Presencial",
    status: a.status as any,
    statusLabel: a.status === "confirmed" ? "Confirmada" : "Agendada",
    roomStatusLabel: a.modality === "telehealth" ? "Sala pronta" : "Presencial",
    roomState: "ready" as any,
    canReschedule: true,
    canCancel: true,
    primaryAction: { label: "Iniciar sessão", href: `/app/appointments/${a.id}/call`, disabledReason: "" },
    sessionData: [
      { label: "Data", value: label },
      { label: "Horário", value: timeRange },
      { label: "Duração", value: "50 min" },
      { label: "Modalidade", value: a.modality === "telehealth" ? "Teleatendimento" : "Presencial" },
      { label: "Status", value: a.status === "confirmed" ? "Confirmada" : "Agendada" }
    ],
    patientSummary: [
      { label: "Nome", value: a.name },
      { label: "Pagamento", value: "Particular" }
    ],
    consentStates: [],
    paymentSummary: [],
    readinessChecklist: [
      { label: "Paciente cadastrado", state: "ok", description: "Cadastro ativo no sistema." }
    ],
    timeline: [
      { id: "created", title: "Sessão criada", occurredAtLabel: "15 abr 2026", description: "Agendamento registrado." }
    ]
  };
}

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

const MOCK_CHARGES = [
  {
    id: "charge_001",
    code: "COB-2026-001",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientEmail: "maria.souza@email.com",
    patientPhone: "(11) 98765-4321",
    appointmentId: "appt_1032",
    appointmentDate: "2026-04-28",
    appointmentTime: "13:30",
    amountCents: 35000,
    dueDate: "2026-04-28",
    status: "paid" as const,
    originType: "private" as const,
    paymentNote: "Pix recebido"
  },
  {
    id: "charge_002",
    code: "COB-2026-002",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientEmail: "lucas.santos@email.com",
    patientPhone: "(11) 97654-3210",
    appointmentId: "appt_1038",
    appointmentDate: "2026-04-28",
    appointmentTime: "15:00",
    amountCents: 35000,
    dueDate: "2026-04-28",
    status: "pending" as const,
    originType: "private" as const,
    paymentNote: ""
  },
  {
    id: "charge_003",
    code: "COB-2026-003",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientEmail: "renata.costa@email.com",
    patientPhone: "(11) 96543-2109",
    appointmentId: "appt_1045",
    appointmentDate: "2026-04-28",
    appointmentTime: "17:10",
    amountCents: 35000,
    dueDate: "2026-04-30",
    status: "pending" as const,
    originType: "private" as const,
    paymentNote: ""
  },
  {
    id: "charge_004",
    code: "COB-2026-004",
    patientId: "patient_julia_prado",
    patientName: "Julia Prado",
    patientEmail: "julia.prado@email.com",
    patientPhone: "(11) 95432-1098",
    appointmentId: "",
    appointmentDate: "",
    appointmentTime: "",
    amountCents: 35000,
    dueDate: "2026-04-20",
    status: "overdue" as const,
    originType: "private" as const,
    paymentNote: ""
  },
  {
    id: "charge_005",
    code: "COB-2026-005",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    patientEmail: "caio.oliveira@email.com",
    patientPhone: "(11) 94321-0987",
    appointmentId: "appt_1055",
    appointmentDate: "2026-04-30",
    appointmentTime: "11:00",
    amountCents: 35000,
    dueDate: "2026-04-30",
    status: "paid" as const,
    originType: "private" as const,
    paymentNote: "Pix recebido"
  },
  {
    id: "charge_006",
    code: "COB-2026-006",
    patientId: "patient_julia_prado",
    patientName: "Julia Prado",
    patientEmail: "julia.prado@email.com",
    patientPhone: "(11) 95432-1098",
    appointmentId: "appt_1050",
    appointmentDate: "2026-04-29",
    appointmentTime: "09:00",
    amountCents: 35000,
    dueDate: "2026-04-15",
    status: "overdue" as const,
    originType: "private" as const,
    paymentNote: ""
  }
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  overdue: "Vencido",
  canceled: "Cancelado"
};

function fmtBrl(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${parseInt(d ?? "1", 10)} ${months[parseInt(m ?? "1", 10) - 1] ?? ""} ${y ?? ""}`;
}

export function buildMockFinanceList(query: Partial<Record<string, string>>): FinanceListResponse {
  const status = query.status ?? "all";
  const filtered = MOCK_CHARGES.filter((c) => status === "all" || c.status === status);

  const summary = {
    periodLabel: "Mês atual",
    totalChargedLabel: fmtBrl(filtered.reduce((s, c) => s + c.amountCents, 0)),
    totalReceivedLabel: fmtBrl(filtered.filter((c) => c.status === "paid").reduce((s, c) => s + c.amountCents, 0)),
    totalOpenLabel: fmtBrl(filtered.filter((c) => c.status === "pending").reduce((s, c) => s + c.amountCents, 0)),
    totalOverdueLabel: fmtBrl(filtered.filter((c) => c.status === "overdue").reduce((s, c) => s + c.amountCents, 0)),
    totalChargedCents: filtered.reduce((s, c) => s + c.amountCents, 0),
    totalReceivedCents: filtered.filter((c) => c.status === "paid").reduce((s, c) => s + c.amountCents, 0),
    totalOpenCents: filtered.filter((c) => c.status === "pending").reduce((s, c) => s + c.amountCents, 0),
    totalOverdueCents: filtered.filter((c) => c.status === "overdue").reduce((s, c) => s + c.amountCents, 0)
  };

  return {
    summary,
    items: filtered.map((c) => ({
      chargeId: c.id,
      code: c.code,
      patientId: c.patientId,
      patientName: c.patientName,
      patientHref: `/app/patients/${c.patientId}`,
      appointmentId: c.appointmentId,
      appointmentLabel: c.appointmentId ? `Sessão ${fmtDate(c.appointmentDate)} · ${c.appointmentTime}` : "Sem sessão vinculada",
      appointmentHref: c.appointmentId ? `/app/appointments/${c.appointmentId}` : "",
      originType: c.originType,
      originLabel: "Particular",
      amountLabel: fmtBrl(c.amountCents),
      amountCents: c.amountCents,
      dueAtLabel: fmtDate(c.dueDate),
      status: c.status,
      statusLabel: STATUS_LABELS[c.status] ?? c.status,
      lastEventAtLabel: "28 Abr 2026 · 09:00",
      lastEventLabel: c.status === "paid" ? "Pagamento registrado" : "Cobrança criada",
      canRegisterPayment: c.status === "pending" || c.status === "overdue",
      canCancel: c.status === "pending" || c.status === "overdue",
      chargeHref: `/app/finance/charges/${c.id}`
    })),
    total: filtered.length,
    page: 1,
    pageSize: 25,
    filters: {
      search: "",
      status: status as any,
      originType: "all",
      period: "current_month",
      overdueOnly: false,
      withoutAppointmentOnly: false
    },
    availablePageSizes: [25, 50, 100],
    patientOptions: PATIENTS.map((p) => ({ value: p.id, label: p.fullName })),
    appointmentOptions: MOCK_APPTS.map((a) => ({
      value: a.id,
      label: `${a.name} · ${a.start}–${a.end}`
    }))
  };
}

export function buildMockChargeDetail(chargeId: string): ChargeDetail | null {
  const c = MOCK_CHARGES.find((x) => x.id === chargeId);
  if (!c) return null;
  return {
    chargeId: c.id,
    code: c.code,
    patientId: c.patientId,
    patientName: c.patientName,
    patientHref: `/app/patients/${c.patientId}`,
    patientContactLabel: `${c.patientEmail} · ${c.patientPhone}`,
    appointmentId: c.appointmentId,
    appointmentLabel: c.appointmentId ? `Sessão ${fmtDate(c.appointmentDate)} · ${c.appointmentTime}` : "Sem sessão vinculada",
    appointmentHref: c.appointmentId ? `/app/appointments/${c.appointmentId}` : "",
    amountLabel: fmtBrl(c.amountCents),
    amountCents: c.amountCents,
    dueAtLabel: fmtDate(c.dueDate),
    paidAtLabel: c.status === "paid" ? fmtDate(c.dueDate) : "Não registrado",
    originType: c.originType,
    originLabel: "Particular",
    status: c.status,
    statusLabel: STATUS_LABELS[c.status] ?? c.status,
    lastEventAtLabel: "28 Abr 2026 · 09:00",
    lastEventLabel: c.status === "paid" ? "Pagamento registrado" : "Cobrança criada",
    exportReferenceLabel: "Particular",
    paymentMethodLabel: c.paymentNote || "Pix recomendado",
    notes: c.paymentNote,
    highlights: [
      { label: "Origem", value: "Particular" },
      { label: "Sessão vinculada", value: c.appointmentId ? "Sim" : "Não" },
      { label: "Estado", value: ({ pending: "Aguardando pagamento", paid: "Recebido", overdue: "Exige tratativa financeira", canceled: "Cancelado" } as Record<string, string>)[c.status] ?? c.status }
    ],
    timeline: [
      { id: "ev_created", title: "Cobrança criada", description: "Gerada automaticamente após a sessão.", occurredAtLabel: "28 Abr 2026 · 08:00", actorLabel: "Sistema" },
      ...(c.status === "paid" ? [{ id: "ev_paid", title: "Pagamento registrado", description: "Pix confirmado.", occurredAtLabel: "28 Abr 2026 · 09:00", actorLabel: "Terapeuta" }] : []),
      ...(c.status === "overdue" ? [{ id: "ev_overdue", title: "Prazo expirou sem baixa", description: "Cobrança marcada como vencida.", occurredAtLabel: "21 Abr 2026 · 00:00", actorLabel: "Sistema" }] : [])
    ],
    primaryActions: {
      canRegisterPayment: c.status === "pending" || c.status === "overdue",
      canCancel: c.status === "pending" || c.status === "overdue"
    }
  };
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

const MOCK_DOCS = [
  {
    id: "doc_001",
    code: "DOC-2026-001",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientEmail: "renata.costa@email.com",
    patientPhone: "(11) 96543-2109",
    documentType: "telehealth",
    templateVersion: "v2.3",
    signatureStatus: "pending" as const,
    consentStatus: "pending" as const,
    criticality: "critical" as const,
    criticalReason: "Teleatendimento bloqueado sem aceite atualizado.",
    signedByLabel: ""
  },
  {
    id: "doc_002",
    code: "DOC-2026-002",
    patientId: "patient_julia_prado",
    patientName: "Julia Prado",
    patientEmail: "julia.prado@email.com",
    patientPhone: "(11) 95432-1098",
    documentType: "lgpd",
    templateVersion: "v1.2",
    signatureStatus: "pending" as const,
    consentStatus: "pending" as const,
    criticality: "attention" as const,
    criticalReason: "Aceite LGPD pendente.",
    signedByLabel: ""
  },
  {
    id: "doc_003",
    code: "DOC-2026-003",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientEmail: "maria.souza@email.com",
    patientPhone: "(11) 98765-4321",
    documentType: "lgpd",
    templateVersion: "v1.2",
    signatureStatus: "signed" as const,
    consentStatus: "valid" as const,
    criticality: "normal" as const,
    criticalReason: "",
    signedByLabel: "Assinado por Maria Souza em 10 Jan 2026"
  },
  {
    id: "doc_004",
    code: "DOC-2026-004",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientEmail: "lucas.santos@email.com",
    patientPhone: "(11) 97654-3210",
    documentType: "therapy_contract",
    templateVersion: "v1.0",
    signatureStatus: "signed" as const,
    consentStatus: "valid" as const,
    criticality: "normal" as const,
    criticalReason: "",
    signedByLabel: "Assinado por Lucas Santos em 12 Jan 2026"
  },
  {
    id: "doc_005",
    code: "DOC-2026-005",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    patientEmail: "caio.oliveira@email.com",
    patientPhone: "(11) 94321-0987",
    documentType: "telehealth",
    templateVersion: "v2.3",
    signatureStatus: "signed" as const,
    consentStatus: "valid" as const,
    criticality: "normal" as const,
    criticalReason: "",
    signedByLabel: "Assinado por Caio Oliveira em 15 Jan 2026"
  }
];

const DOC_TITLES: Record<string, string> = {
  lgpd: "Termo LGPD do paciente",
  telehealth: "Termo de teleatendimento",
  transcript_ai: "Termo de transcript e IA documental",
  therapy_contract: "Contrato terapêutico",
  operational: "Documento operacional"
};

const SIG_LABELS: Record<string, string> = { not_sent: "Não enviado", pending: "Pendente", signed: "Assinado", expired: "Expirado", revoked: "Revogado" };
const CON_LABELS: Record<string, string> = { valid: "Válido", pending: "Pendente", revoked: "Revogado", not_applicable: "Não aplicável" };
const CRIT_LABELS: Record<string, string> = { normal: "Sem bloqueio", attention: "Acompanha operação", critical: "Bloqueia sessão online" };

const TEMPLATE_OPTIONS: DocumentsListResponse["templateOptions"] = [
  { documentType: "lgpd", label: "Termo LGPD do paciente", description: "Base mínima de tratamento de dados pessoais.", defaultVersion: "v1.2", versionOptions: ["v1.2","v1.1"] },
  { documentType: "telehealth", label: "Termo de teleatendimento", description: "Regras de atendimento online.", defaultVersion: "v2.3", versionOptions: ["v2.3","v2.2"] },
  { documentType: "transcript_ai", label: "Termo de transcript e IA", description: "Uso assistivo de IA documental.", defaultVersion: "v1.0", versionOptions: ["v1.0"] },
  { documentType: "therapy_contract", label: "Contrato terapêutico", description: "Partes do contrato e regras operacionais.", defaultVersion: "v1.0", versionOptions: ["v1.0"] }
];

export function buildMockDocumentsList(query: Partial<Record<string, string>>): DocumentsListResponse {
  let list = [...MOCK_DOCS];
  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter((d) => d.patientName.toLowerCase().includes(q) || d.code.includes(q));
  }
  if (query.patientId) list = list.filter((d) => d.patientId === query.patientId);

  const criticalCount = list.filter((d) => d.criticality === "critical").length;
  const pendingSignatureCount = list.filter((d) => d.signatureStatus === "pending").length;
  const revokedCount = list.filter((d) => d.signatureStatus === "revoked" || d.consentStatus === "revoked").length;

  return {
    summary: {
      criticalCount,
      pendingSignatureCount,
      revokedCount,
      affectedPatientsLabel: `${new Set(list.filter((d) => d.criticality !== "normal").map((d) => d.patientId)).size} pacientes com impacto`
    },
    items: list.map((d) => ({
      id: d.id,
      code: d.code,
      patientId: d.patientId,
      patientName: d.patientName,
      patientHref: `/app/patients/${d.patientId}`,
      documentType: d.documentType as any,
      documentTitle: DOC_TITLES[d.documentType] ?? "Documento",
      templateVersion: d.templateVersion,
      generatedAtLabel: "Gerado em 10 Jan 2026",
      signatureStatus: d.signatureStatus,
      signatureStatusLabel: SIG_LABELS[d.signatureStatus] ?? d.signatureStatus,
      consentStatus: d.consentStatus,
      consentStatusLabel: CON_LABELS[d.consentStatus] ?? d.consentStatus,
      lastEventAtLabel: "28 Abr 2026 · 09:00",
      lastEventLabel: d.signatureStatus === "signed" ? "Documento assinado" : "Documento enviado",
      criticality: d.criticality,
      criticalityLabel: CRIT_LABELS[d.criticality] ?? d.criticality,
      criticalReason: d.criticalReason,
      signedByLabel: d.signedByLabel,
      blockedFlowLabels: d.signatureStatus === "signed" ? [] : d.documentType === "telehealth" ? ["Teleatendimento"] : [],
      canResend: d.signatureStatus === "pending" || d.signatureStatus === "expired",
      canGenerateNewVersion: true,
      openHref: `/app/documents/${d.id}`
    })),
    total: list.length,
    page: 1,
    pageSize: 25,
    filters: {
      search: query.search ?? "",
      patientId: query.patientId ?? "",
      documentType: "all",
      signatureStatus: "all",
      consentStatus: "all",
      criticality: "all",
      onlyCritical: false,
      thisWeekOnly: false,
      onlyRevoked: false
    },
    availablePageSizes: [25, 50, 100],
    patientOptions: PATIENTS.map((p) => ({ value: p.id, label: p.fullName })),
    templateOptions: TEMPLATE_OPTIONS
  };
}

export function buildMockDocumentDetail(documentId: string): DocumentDetail | null {
  const d = MOCK_DOCS.find((x) => x.id === documentId);
  if (!d) return null;

  const previewSections: DocumentDetail["previewSections"] = d.documentType === "telehealth"
    ? [
        { title: "Escopo do consentimento", body: "Autoriza sessões por videochamada com regras de confidencialidade." },
        { title: "Condições de uso", body: "Ambiente privado, segurança e condições de interrupção da sessão." }
      ]
    : [
        { title: "Base legal do tratamento", body: "Bases legais para tratamento de dados pessoais no contexto clínico." },
        { title: "Direitos do titular", body: "Acesso, correção, exclusão e portabilidade de dados." }
      ];

  const operationalImpacts: DocumentDetail["operationalImpacts"] = d.signatureStatus === "signed"
    ? [{ id: `impact_signed`, title: `${DOC_TITLES[d.documentType]} ativo`, description: "Documento vigente.", tone: "success" }]
    : d.criticality === "critical"
      ? [
          { id: `impact_1`, title: "Entrada na sala bloqueada", description: "Paciente não deve entrar na call.", tone: "critical" },
          { id: `impact_2`, title: "Reenvio disponível", description: "Use o botão de reenvio.", tone: "warning" }
        ]
      : [{ id: `impact_1`, title: "Funcionalidade em espera", description: "Fluxo associado aguarda aceite.", tone: "warning" }];

  return {
    id: d.id,
    code: d.code,
    patientId: d.patientId,
    patientName: d.patientName,
    patientHref: `/app/patients/${d.patientId}`,
    patientContactLabel: `${d.patientEmail} · ${d.patientPhone}`,
    documentType: d.documentType as any,
    documentTitle: DOC_TITLES[d.documentType] ?? "Documento",
    templateVersion: d.templateVersion,
    generatedAtLabel: "Gerado em 10 Jan 2026",
    lastSentAtLabel: d.signatureStatus === "signed" ? "Enviado em 10 Jan 2026" : "Enviado em 28 Abr 2026",
    lastEventAtLabel: "28 Abr 2026 · 09:00",
    lastEventLabel: d.signatureStatus === "signed" ? "Documento assinado" : "Documento enviado",
    sessionContextLabel: "Atendimento registrado no sistema",
    deliveryChannelLabel: "E-mail",
    fileReferenceLabel: "Arquivo PDF versionado no storage gerenciado",
    signatureStatus: d.signatureStatus,
    signatureStatusLabel: SIG_LABELS[d.signatureStatus] ?? d.signatureStatus,
    consentStatus: d.consentStatus,
    consentStatusLabel: CON_LABELS[d.consentStatus] ?? d.consentStatus,
    criticality: d.criticality,
    criticalityLabel: CRIT_LABELS[d.criticality] ?? d.criticality,
    criticalReason: d.criticalReason,
    signedByLabel: d.signedByLabel || "Aguardando assinatura do paciente",
    legalRepresentativeLabel: "Não se aplica",
    blockedFlowLabels: d.signatureStatus === "signed" ? [] : d.documentType === "telehealth" ? ["Teleatendimento"] : [],
    previewSections,
    operationalImpacts,
    timeline: [
      { id: "ev_gen", title: "Documento gerado", description: "Criado a partir do catálogo padrão.", occurredAtLabel: "10 Jan 2026 · 10:00", actorLabel: "Sistema" },
      { id: "ev_sent", title: "Documento enviado", description: "Link enviado por e-mail ao paciente.", occurredAtLabel: "10 Jan 2026 · 10:01", actorLabel: "Sistema" },
      ...(d.signatureStatus === "signed" ? [{ id: "ev_signed", title: "Documento assinado", description: "Aceite do paciente registrado.", occurredAtLabel: "10 Jan 2026 · 14:30", actorLabel: "Paciente" }] : [])
    ],
    primaryActions: {
      canResend: d.signatureStatus === "pending" || d.signatureStatus === "expired",
      canRevoke: d.signatureStatus !== "revoked" && d.signatureStatus !== "signed",
      canGenerateNewVersion: true
    },
    nextGenerationDefaults: {
      patientId: d.patientId,
      documentType: d.documentType,
      templateVersion: d.templateVersion
    }
  };
}
