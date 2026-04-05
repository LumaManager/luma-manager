import { randomUUID } from "node:crypto";

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type {
  AgendaAvailabilityUpdateRequest,
  AgendaResponse,
  AppointmentCalendarStatus,
  AppointmentCancelRequest,
  AppointmentCall,
  AppointmentCreateRequest,
  AppointmentCreateResponse,
  AppointmentDetail,
  AppointmentModality,
  AppointmentRescheduleRequest,
  AuthSession,
  CalendarView,
  ScheduleBlock,
  ScheduleBlockCreateRequest,
  ScheduleBlockCreateResponse,
  ScheduleBlockUpdateRequest
} from "@terapia/contracts";
import {
  appointmentCancelRequestSchema,
  appointmentCreateRequestSchema,
  appointmentRescheduleRequestSchema,
  agendaAvailabilityUpdateRequestSchema,
  scheduleBlockCreateRequestSchema,
  scheduleBlockUpdateRequestSchema
} from "@terapia/contracts";

type AppointmentRecord = {
  consentStates: AppointmentDetail["consentStates"];
  createdViaLabel: string;
  durationMinutes: number;
  endsAt: string;
  id: string;
  note: string;
  patientAgeLabel: string;
  patientContactLabel: string;
  patientId: string;
  patientName: string;
  patientPaymentOriginLabel: string;
  patientPrimaryContact: string;
  patientResponsibleLabel: string;
  paymentStatusLabel: string;
  paymentValueLabel: string;
  roomState: AppointmentDetail["roomState"];
  roomStatusLabel: string;
  startsAt: string;
  status: AppointmentCalendarStatus;
  timeline: AppointmentDetail["timeline"];
  modality: AppointmentModality;
};

type CallStateRecord = {
  connectionState: AppointmentCall["connection"]["state"];
  patientPresence: AppointmentCall["participants"]["patientPresence"];
  providerLabel: string;
  therapistJoined: boolean;
};

type BlockRecord = {
  dayKey: string;
  endsAt: string;
  id: string;
  startsAt: string;
  subtitle: string;
  title: string;
  tone: ScheduleBlock["tone"];
};

type AvailabilityWindowRecord = {
  endTime: string;
  id: string;
  startTime: string;
};

type AvailabilityRuleRecord = {
  enabled: boolean;
  weekday: number;
  windows: AvailabilityWindowRecord[];
};

type AgendaQuery = {
  date: string;
  modality: "all" | AppointmentModality;
  status:
    | "all"
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  view: CalendarView;
};

const DEFAULT_DATE = "2026-03-30";
const CURRENT_TIMESTAMP = "2026-03-30T13:22:00-03:00";
const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] as const;
const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] as const;
const patientDirectory: Record<
  string,
  {
    ageLabel: string;
    email: string;
    fullName: string;
    legalGuardianLabel: string;
    paymentOriginLabel: string;
    phone: string;
  }
> = {
  patient_maria_souza: {
    fullName: "Maria Souza",
    ageLabel: "34 anos",
    email: "maria.souza@email.com",
    phone: "(11) 98888-1101",
    legalGuardianLabel: "Nao se aplica",
    paymentOriginLabel: "Particular"
  },
  patient_lucas_santos: {
    fullName: "Lucas Santos",
    ageLabel: "37 anos",
    email: "lucas.santos@email.com",
    phone: "(11) 97777-2012",
    legalGuardianLabel: "Nao se aplica",
    paymentOriginLabel: "Particular"
  },
  patient_renata_costa: {
    fullName: "Renata Costa",
    ageLabel: "30 anos",
    email: "renata.costa@email.com",
    phone: "(11) 96666-3313",
    legalGuardianLabel: "Nao se aplica",
    paymentOriginLabel: "Particular"
  },
  patient_julia_prado: {
    fullName: "Julia Prado",
    ageLabel: "17 anos",
    email: "julia.prado@email.com",
    phone: "(11) 95555-4414",
    legalGuardianLabel: "Mae responsavel cadastrada",
    paymentOriginLabel: "Particular"
  },
  patient_caio_oliveira: {
    fullName: "Caio Oliveira",
    ageLabel: "34 anos",
    email: "caio.oliveira@email.com",
    phone: "(11) 94444-5515",
    legalGuardianLabel: "Nao se aplica",
    paymentOriginLabel: "Particular"
  }
};

const appointmentSeed: AppointmentRecord[] = [
  {
    id: "appt_1018",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientAgeLabel: "34 anos",
    patientContactLabel: "maria.souza@email.com",
    patientPrimaryContact: "(11) 98888-1101",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-03-23T13:30:00-03:00",
    endsAt: "2026-03-23T14:20:00-03:00",
    durationMinutes: 50,
    status: "completed",
    modality: "telehealth",
    roomState: "closed",
    roomStatusLabel: "Sala encerrada",
    createdViaLabel: "Criada pela agenda semanal",
    note: "Sessão de continuidade semanal.",
    paymentStatusLabel: "Pago",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido e vigente."
      },
      {
        label: "Teleatendimento",
        state: "ok",
        description: "Assinatura revalidada em 19 Mar."
      },
      {
        label: "IA documental",
        state: "ok",
        description: "Capability pronta, sem reter bruto."
      }
    ],
    timeline: [
      {
        id: "timeline_1018_a",
        title: "Sessão concluída",
        occurredAtLabel: "23 Mar · 14:22",
        description: "Atendimento encerrado sem incidentes operacionais."
      },
      {
        id: "timeline_1018_b",
        title: "Sala encerrada",
        occurredAtLabel: "23 Mar · 14:25",
        description: "Janela de acesso finalizada automaticamente."
      }
    ]
  },
  {
    id: "appt_1032",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientAgeLabel: "34 anos",
    patientContactLabel: "maria.souza@email.com",
    patientPrimaryContact: "(11) 98888-1101",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-03-30T13:30:00-03:00",
    endsAt: "2026-03-30T14:20:00-03:00",
    durationMinutes: 50,
    status: "confirmed",
    modality: "telehealth",
    roomState: "ready",
    roomStatusLabel: "Sala pronta para entrada",
    createdViaLabel: "Criada pela agenda semanal",
    note: "Checar devolutiva breve sobre rotina da semana.",
    paymentStatusLabel: "Pago",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido e vigente."
      },
      {
        label: "Teleatendimento",
        state: "ok",
        description: "Termo atualizado e sem pendencias."
      },
      {
        label: "IA documental",
        state: "ok",
        description: "Paciente optou por resumo textual, sem audio bruto."
      }
    ],
    timeline: [
      {
        id: "timeline_1032_a",
        title: "Sessão confirmada",
        occurredAtLabel: "Hoje · 09:05",
        description: "Paciente confirmou comparecimento pelo portal."
      },
      {
        id: "timeline_1032_b",
        title: "Sala provisionada",
        occurredAtLabel: "Hoje · 09:10",
        description: "Sala virtual pronta dentro da janela operacional."
      }
    ]
  },
  {
    id: "appt_1038",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientAgeLabel: "37 anos",
    patientContactLabel: "lucas.santos@email.com",
    patientPrimaryContact: "(11) 97777-2012",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-03-30T15:00:00-03:00",
    endsAt: "2026-03-30T15:50:00-03:00",
    durationMinutes: 50,
    status: "confirmed",
    modality: "in_person",
    roomState: "not_provisioned",
    roomStatusLabel: "Não se aplica ao presencial",
    createdViaLabel: "Criada no onboarding operacional",
    note: "Acolher primeira semana e revisar combinados de frequencia.",
    paymentStatusLabel: "Em aberto",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido."
      },
      {
        label: "Teleatendimento",
        state: "pending",
        description: "Não bloqueia esta sessão porque a modalidade é presencial."
      },
      {
        label: "IA documental",
        state: "pending",
        description: "Reenvio solicitado hoje."
      }
    ],
    timeline: [
      {
        id: "timeline_1038_a",
        title: "Sessão confirmada",
        occurredAtLabel: "Hoje · 10:40",
        description: "Paciente confirmou horário presencial."
      },
      {
        id: "timeline_1038_b",
        title: "Cobrança criada",
        occurredAtLabel: "Hoje · 10:42",
        description: "Pagamento ainda não foi conciliado."
      }
    ]
  },
  {
    id: "appt_1045",
    patientId: "patient_renata_costa",
    patientName: "Renata Costa",
    patientAgeLabel: "30 anos",
    patientContactLabel: "renata.costa@email.com",
    patientPrimaryContact: "(11) 96666-3313",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-03-30T17:10:00-03:00",
    endsAt: "2026-03-30T18:00:00-03:00",
    durationMinutes: 50,
    status: "confirmed",
    modality: "telehealth",
    roomState: "ready",
    roomStatusLabel: "Sala provisionada com bloqueio documental",
    createdViaLabel: "Criada pela agenda semanal",
    note: "Sessão online condicionada à revalidação do termo de teleatendimento.",
    paymentStatusLabel: "Pago",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido."
      },
      {
        label: "Teleatendimento",
        state: "critical",
        description: "Termo vence hoje e bloqueia o início da sessão online."
      },
      {
        label: "IA documental",
        state: "ok",
        description: "Resumo por texto habilitado."
      }
    ],
    timeline: [
      {
        id: "timeline_1045_a",
        title: "Termo reenviado",
        occurredAtLabel: "Hoje · 11:48",
        description: "Solicitação de revalidação enviada ao paciente."
      },
      {
        id: "timeline_1045_b",
        title: "Sala provisionada",
        occurredAtLabel: "Hoje · 11:50",
        description: "Sala pronta, mas aguardando documento impeditivo."
      }
    ]
  },
  {
    id: "appt_1052",
    patientId: "patient_maria_souza",
    patientName: "Maria Souza",
    patientAgeLabel: "34 anos",
    patientContactLabel: "maria.souza@email.com",
    patientPrimaryContact: "(11) 98888-1101",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-04-01T09:00:00-03:00",
    endsAt: "2026-04-01T09:50:00-03:00",
    durationMinutes: 50,
    status: "scheduled",
    modality: "telehealth",
    roomState: "not_provisioned",
    roomStatusLabel: "Sala será provisionada na janela de entrada",
    createdViaLabel: "Criada na dashboard",
    note: "Sessão recorrente de quarta-feira.",
    paymentStatusLabel: "Pagamento previsto por Pix",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido."
      },
      {
        label: "Teleatendimento",
        state: "ok",
        description: "Termo vigente."
      },
      {
        label: "IA documental",
        state: "ok",
        description: "Fluxo textual habilitado."
      }
    ],
    timeline: [
      {
        id: "timeline_1052_a",
        title: "Sessão criada",
        occurredAtLabel: "Ontem · 18:12",
        description: "Criada a partir do atalho Nova sessão."
      }
    ]
  },
  {
    id: "appt_1056",
    patientId: "patient_lucas_santos",
    patientName: "Lucas Santos",
    patientAgeLabel: "37 anos",
    patientContactLabel: "lucas.santos@email.com",
    patientPrimaryContact: "(11) 97777-2012",
    patientResponsibleLabel: "Não se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-04-02T14:00:00-03:00",
    endsAt: "2026-04-02T14:50:00-03:00",
    durationMinutes: 50,
    status: "scheduled",
    modality: "in_person",
    roomState: "not_provisioned",
    roomStatusLabel: "Não se aplica ao presencial",
    createdViaLabel: "Criada na ficha do paciente",
    note: "Segunda sessão presencial para consolidar horário fixo.",
    paymentStatusLabel: "Não configurado",
    paymentValueLabel: "R$ 220,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite valido."
      },
      {
        label: "Teleatendimento",
        state: "pending",
        description: "Fica pendente para uso futuro."
      },
      {
        label: "IA documental",
        state: "pending",
        description: "Aceite opcional ainda não coletado."
      }
    ],
    timeline: [
      {
        id: "timeline_1056_a",
        title: "Sessão criada",
        occurredAtLabel: "Hoje · 08:15",
        description: "Horário reservado como follow-up da consulta de hoje."
      }
    ]
  },
  {
    id: "appt_1058",
    patientId: "patient_caio_oliveira",
    patientName: "Caio Oliveira",
    patientAgeLabel: "34 anos",
    patientContactLabel: "caio.oliveira@email.com",
    patientPrimaryContact: "(11) 94444-5515",
    patientResponsibleLabel: "Nao se aplica",
    patientPaymentOriginLabel: "Particular",
    startsAt: "2026-04-03T11:00:00-03:00",
    endsAt: "2026-04-03T11:50:00-03:00",
    durationMinutes: 50,
    status: "cancelled",
    modality: "in_person",
    roomState: "closed",
    roomStatusLabel: "Sessao cancelada",
    createdViaLabel: "Criada pela agenda semanal",
    note: "Horario mantido para historico, sem ocupar slot operacional ativo.",
    paymentStatusLabel: "Sem cobranca",
    paymentValueLabel: "R$ 0,00",
    consentStates: [
      {
        label: "LGPD",
        state: "ok",
        description: "Aceite arquivado."
      },
      {
        label: "Teleatendimento",
        state: "pending",
        description: "Nao aplicavel a esta sessao."
      },
      {
        label: "IA documental",
        state: "pending",
        description: "Nao aplicavel."
      }
    ],
    timeline: [
      {
        id: "timeline_1058_a",
        title: "Sessao cancelada",
        occurredAtLabel: "03 Abr · 09:10",
        description: "Paciente solicitou cancelamento antes da janela de atendimento."
      }
    ]
  }
];

const recurringAvailabilitySeed = {
  1: [
    ["09:00", "12:00"],
    ["13:00", "18:00"]
  ],
  2: [
    ["09:00", "12:00"],
    ["13:00", "18:00"]
  ],
  3: [
    ["09:00", "12:00"],
    ["13:00", "18:00"]
  ],
  4: [
    ["09:00", "12:00"],
    ["13:00", "18:00"]
  ],
  5: [
    ["09:00", "12:00"],
    ["13:00", "16:00"]
  ]
} as const;

const punctualBlockSeed: BlockRecord[] = [
  {
    id: "block_supervisao_1031",
    dayKey: "2026-03-31",
    startsAt: "2026-03-31T11:00:00-03:00",
    endsAt: "2026-03-31T12:30:00-03:00",
    title: "Supervisão",
    subtitle: "Bloqueio pontual para reunião clínica",
    tone: "warning" as const
  },
  {
    id: "block_treinamento_0402",
    dayKey: "2026-04-02",
    startsAt: "2026-04-02T16:00:00-03:00",
    endsAt: "2026-04-02T18:00:00-03:00",
    title: "Treinamento interno",
    subtitle: "Agenda fechada para atividade interna",
    tone: "critical" as const
  }
];

@Injectable()
export class AppointmentsService {
  private readonly appointments = [...appointmentSeed];
  private readonly blocks = [...punctualBlockSeed];
  private readonly availabilityRules = createAvailabilityRules();
  private readonly callState = new Map<string, CallStateRecord>(
    appointmentSeed.map((appointment) => [appointment.id, createInitialCallState(appointment)])
  );

  listAgenda(session: AuthSession, rawQuery: Record<string, string>): AgendaResponse {
    this.assertAgendaReadable(session);

    const query = this.parseAgendaQuery(rawQuery);
    const range = this.buildRange(query.view, query.date);
    const dayColumns = range.days.map((day) => ({
      key: formatDayKey(day),
      label: DAY_NAMES[day.getUTCDay()] ?? "Dia",
      dateLabel: `${pad(day.getUTCDate())} ${MONTH_NAMES[day.getUTCMonth()]}`,
      isToday: formatDayKey(day) === DEFAULT_DATE
    }));

    const appointmentBlocks = this.appointments
      .filter((appointment) => isDayInRange(appointment.startsAt.slice(0, 10), range.dayKeys))
      .filter((appointment) => {
        if (query.status !== "all" && appointment.status !== query.status) {
          return false;
        }

        if (query.modality !== "all" && appointment.modality !== query.modality) {
          return false;
        }

        return true;
      })
      .map<ScheduleBlock>((appointment) => ({
        id: appointment.id,
        type: "appointment",
        title: appointment.patientName,
        subtitle: `${getTimeLabel(appointment.startsAt)} · ${getStatusLabel(appointment.status)} · ${getModalityLabel(appointment.modality)}`,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        dayKey: appointment.startsAt.slice(0, 10),
        tone: getAppointmentTone(appointment.status),
        href: `/app/agenda?date=${appointment.startsAt.slice(0, 10)}&view=${query.view}&appointment=${appointment.id}`
      }));

    const availabilityBlocks = range.days.flatMap<ScheduleBlock>((day) => {
      const weekday = day.getUTCDay();
      const windows = this.availabilityRules.find((rule) => rule.weekday === weekday);
      const dayKey = formatDayKey(day);

      if (!windows || !windows.enabled) {
        return [];
      }

      return windows.windows.map((window) => ({
        id: `availability_${dayKey}_${window.id}`,
        type: "availability",
        title: "Disponível",
        subtitle: "Janela recorrente do consultório",
        startsAt: `${dayKey}T${window.startTime}:00-03:00`,
        endsAt: `${dayKey}T${window.endTime}:00-03:00`,
        dayKey,
        tone: "success"
      }));
    });

    const blockItems = this.blocks
      .filter((block) => isDayInRange(block.dayKey, range.dayKeys))
      .map<ScheduleBlock>((block) => ({
        id: block.id,
        type: "block",
        title: block.title,
        subtitle: block.subtitle,
        startsAt: block.startsAt,
        endsAt: block.endsAt,
        dayKey: block.dayKey,
        tone: block.tone,
        href: `/app/agenda?date=${block.dayKey}&view=${query.view}&block=${block.id}`
      }));

    return {
      accountStatus: session.accountStatus,
      currentView: query.view,
      visibleRangeLabel: getVisibleRangeLabel(query.view, range.days),
      dayColumns,
      timeSlots: buildTimeSlots(),
      availabilityRules: this.availabilityRules.map((rule) => ({
        weekday: rule.weekday,
        weekdayLabel: DAY_NAMES[rule.weekday] ?? "Dia",
        enabled: rule.enabled,
        windows: rule.windows
      })),
      filters: {
        status: query.status,
        modality: query.modality
      },
      quickActions: [
        {
          id: "new-session",
          label: "Nova sessão",
          href: "/app/agenda"
        },
        {
          id: "today",
          label: "Voltar para hoje",
          href: `/app/agenda?date=${DEFAULT_DATE}&view=week`
        },
        {
          id: "patient-list",
          label: "Abrir pacientes",
          href: "/app/patients"
        }
      ],
      scheduleBlocks: [...availabilityBlocks, ...blockItems, ...appointmentBlocks]
    };
  }

  createAppointment(
    session: AuthSession,
    input: AppointmentCreateRequest
  ): AppointmentCreateResponse {
    this.assertAgendaWritable(session);

    const payload = appointmentCreateRequestSchema.parse(input);
    const patient = patientDirectory[payload.patientId];

    if (!patient) {
      throw new BadRequestException("Paciente inválido para agendamento.");
    }

    const startsAt = `${payload.date}T${payload.startTime}:00-03:00`;
    const endsAt = buildEndTimestamp(payload.date, payload.startTime, payload.durationMinutes);

    this.assertNoConflict(startsAt, endsAt, payload.date);

    const appointmentId = `appt_${randomUUID().slice(0, 8)}`;

    this.appointments.unshift({
      id: appointmentId,
      patientId: payload.patientId,
      patientName: patient.fullName,
      patientAgeLabel: patient.ageLabel,
      patientContactLabel: patient.email,
      patientPrimaryContact: patient.phone,
      patientResponsibleLabel: patient.legalGuardianLabel,
      patientPaymentOriginLabel: patient.paymentOriginLabel,
      startsAt,
      endsAt,
      durationMinutes: payload.durationMinutes,
      status: "scheduled",
      modality: payload.modality,
      roomState: payload.modality === "telehealth" ? "not_provisioned" : "not_provisioned",
      roomStatusLabel:
        payload.modality === "telehealth"
          ? "Sala será provisionada na janela de entrada"
          : "Não se aplica ao presencial",
      createdViaLabel: "Criada no drawer da agenda",
      note: payload.note || "Sessão criada manualmente pela agenda.",
      paymentStatusLabel: "Não configurado",
      paymentValueLabel: "R$ 220,00",
      consentStates: [
        {
          label: "LGPD",
          state: "ok",
          description: "Aceite atual registrado no cadastro."
        },
        {
          label: "Teleatendimento",
          state: payload.modality === "telehealth" ? "ok" : "pending",
          description:
            payload.modality === "telehealth"
              ? "Sem bloqueio atual para teleatendimento."
              : "Não bloqueia esta sessão porque a modalidade é presencial."
        },
        {
          label: "IA documental",
          state: "pending",
          description: "Fluxo de texto/ditado continua disponivel mesmo sem audio."
        }
      ],
      timeline: [
        {
          id: `timeline_${appointmentId}_created`,
          title: "Sessão criada",
          occurredAtLabel: "Agora",
          description: "Agendamento gerado pela agenda operacional."
        }
      ]
    });
    this.callState.set(
      appointmentId,
      createInitialCallState({
        id: appointmentId,
        patientId: payload.patientId,
        patientName: patient.fullName,
        patientAgeLabel: patient.ageLabel,
        patientContactLabel: patient.email,
        patientPrimaryContact: patient.phone,
        patientResponsibleLabel: patient.legalGuardianLabel,
        patientPaymentOriginLabel: patient.paymentOriginLabel,
        startsAt,
        endsAt,
        durationMinutes: payload.durationMinutes,
        status: "scheduled",
        modality: payload.modality,
        roomState: payload.modality === "telehealth" ? "not_provisioned" : "not_provisioned",
        roomStatusLabel:
          payload.modality === "telehealth"
            ? "Sala será provisionada na janela de entrada"
            : "Não se aplica ao presencial",
        createdViaLabel: "Criada no drawer da agenda",
        note: payload.note || "Sessão criada manualmente pela agenda.",
        paymentStatusLabel: "Não configurado",
        paymentValueLabel: "R$ 220,00",
        consentStates: [
          {
            label: "LGPD",
            state: "ok",
            description: "Aceite atual registrado no cadastro."
          },
          {
            label: "Teleatendimento",
            state: payload.modality === "telehealth" ? "ok" : "pending",
            description:
              payload.modality === "telehealth"
                ? "Sem bloqueio atual para teleatendimento."
                : "Não bloqueia esta sessão porque a modalidade é presencial."
          },
          {
            label: "IA documental",
            state: "pending",
            description: "Fluxo de texto/ditado continua disponivel mesmo sem audio."
          }
        ],
        timeline: []
      })
    );

    return {
      id: appointmentId,
      href: `/app/appointments/${appointmentId}`
    };
  }

  createBlock(
    session: AuthSession,
    input: ScheduleBlockCreateRequest
  ): ScheduleBlockCreateResponse {
    this.assertAgendaWritable(session);

    const payload = scheduleBlockCreateRequestSchema.parse(input);

    if (payload.endTime <= payload.startTime) {
      throw new BadRequestException("O horário final do bloqueio precisa ficar depois do início.");
    }

    const startsAt = `${payload.date}T${payload.startTime}:00-03:00`;
    const endsAt = `${payload.date}T${payload.endTime}:00-03:00`;

    this.assertNoAppointmentOverlap(startsAt, endsAt, payload.date);
    this.assertNoBlockOverlap(startsAt, endsAt, payload.date);

    const blockId = `block_${randomUUID().slice(0, 8)}`;

    this.blocks.unshift({
      id: blockId,
      dayKey: payload.date,
      startsAt,
      endsAt,
      title: payload.title,
      subtitle: payload.subtitle,
      tone: payload.tone
    });

    return {
      id: blockId
    };
  }

  updateAvailability(
    session: AuthSession,
    input: AgendaAvailabilityUpdateRequest
  ): { ok: true } {
    this.assertAgendaWritable(session);

    const payload = agendaAvailabilityUpdateRequestSchema.parse(input);

    for (const rule of payload.rules) {
      const target = this.availabilityRules.find((current) => current.weekday === rule.weekday);

      if (!target) {
        continue;
      }

      if (!rule.enabled) {
        target.enabled = false;
        target.windows = [];
        continue;
      }

      const normalizedWindows = normalizeAvailabilityWindows(
        rule.windows.map((window, index) => ({
          id: `${rule.weekday}_${index}`,
          startTime: window.startTime,
          endTime: window.endTime
        }))
      );

      target.enabled = normalizedWindows.length > 0;
      target.windows = normalizedWindows;
    }

    return {
      ok: true
    };
  }

  updateBlock(
    session: AuthSession,
    blockId: string,
    input: ScheduleBlockUpdateRequest
  ): ScheduleBlockCreateResponse {
    this.assertAgendaWritable(session);

    const block = this.getBlockRecord(blockId);
    const payload = scheduleBlockUpdateRequestSchema.parse(input);

    if (payload.endTime <= payload.startTime) {
      throw new BadRequestException("O horário final do bloqueio precisa ficar depois do início.");
    }

    const startsAt = `${payload.date}T${payload.startTime}:00-03:00`;
    const endsAt = `${payload.date}T${payload.endTime}:00-03:00`;

    this.assertNoAppointmentOverlap(startsAt, endsAt, payload.date);
    this.assertNoBlockOverlap(startsAt, endsAt, payload.date, block.id);

    block.dayKey = payload.date;
    block.startsAt = startsAt;
    block.endsAt = endsAt;
    block.title = payload.title;
    block.subtitle = payload.subtitle;
    block.tone = payload.tone;

    return {
      id: block.id
    };
  }

  deleteBlock(session: AuthSession, blockId: string): ScheduleBlockCreateResponse {
    this.assertAgendaWritable(session);

    const index = this.blocks.findIndex((block) => block.id === blockId);

    if (index < 0) {
      throw new NotFoundException("Bloqueio não encontrado.");
    }

    const [removed] = this.blocks.splice(index, 1);

    if (!removed) {
      throw new NotFoundException("Bloqueio não encontrado.");
    }

    return {
      id: removed.id
    };
  }

  rescheduleAppointment(
    session: AuthSession,
    appointmentId: string,
    input: AppointmentRescheduleRequest
  ): AppointmentDetail {
    this.assertAgendaWritable(session);

    const appointment = this.getAppointmentRecord(appointmentId);
    const payload = appointmentRescheduleRequestSchema.parse(input);

    if (appointment.status === "completed" || appointment.status === "cancelled" || appointment.status === "in_progress") {
      throw new BadRequestException("A sessão atual não pode mais ser reagendada.");
    }

    const startsAt = `${payload.date}T${payload.startTime}:00-03:00`;
    const endsAt = buildEndTimestamp(payload.date, payload.startTime, payload.durationMinutes);

    this.assertNoConflict(startsAt, endsAt, payload.date, appointment.id);

    appointment.startsAt = startsAt;
    appointment.endsAt = endsAt;
    appointment.durationMinutes = payload.durationMinutes;
    appointment.modality = payload.modality;
    appointment.note = payload.note;
    appointment.roomState = "not_provisioned";
    appointment.roomStatusLabel =
      payload.modality === "telehealth"
        ? "Sala será provisionada na janela de entrada"
        : "Não se aplica ao presencial";

    const callState = this.getCallState(appointmentId);
    this.callState.set(appointmentId, {
      ...createInitialCallState(appointment),
      providerLabel: callState.providerLabel
    });

    appointment.timeline.unshift({
      id: `timeline_${appointment.id}_rescheduled_${Date.now()}`,
      title: "Sessão reagendada",
      occurredAtLabel: "Agora",
      description: `Novo horário: ${getLongDateLabel(appointment.startsAt)} · ${getTimeLabel(appointment.startsAt)} · ${getModalityLabel(appointment.modality)}.`
    });

    return this.getAppointmentDetail(session, appointmentId);
  }

  cancelAppointment(
    session: AuthSession,
    appointmentId: string,
    input: AppointmentCancelRequest
  ): AppointmentDetail {
    this.assertAgendaWritable(session);

    const appointment = this.getAppointmentRecord(appointmentId);
    const payload = appointmentCancelRequestSchema.parse(input);

    if (appointment.status === "completed") {
      throw new BadRequestException("Uma sessão concluída não pode ser cancelada.");
    }

    if (appointment.status === "cancelled") {
      throw new BadRequestException("A sessão já está cancelada.");
    }

    appointment.status = "cancelled";
    appointment.roomState = "closed";
    appointment.roomStatusLabel = "Sessão cancelada";

    this.callState.set(appointmentId, {
      connectionState: "ready",
      patientPresence: "left",
      providerLabel: this.getCallState(appointmentId).providerLabel,
      therapistJoined: false
    });

    appointment.timeline.unshift({
      id: `timeline_${appointment.id}_cancelled_${Date.now()}`,
      title: "Sessão cancelada",
      occurredAtLabel: "Agora",
      description: `Motivo registrado: ${payload.reason}`
    });

    return this.getAppointmentDetail(session, appointmentId);
  }

  getAppointmentDetail(session: AuthSession, appointmentId: string): AppointmentDetail {
    this.assertAgendaReadable(session);

    const appointment = this.getAppointmentRecord(appointmentId);

    const readinessChecklist = buildReadinessChecklist(session, appointment);
    const blockingItem = readinessChecklist.find((item) => item.state === "blocked");
    const attentionItem = readinessChecklist.find((item) => item.state === "attention");

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientHref: `/app/patients/${appointment.patientId}`,
      dateKey: appointment.startsAt.slice(0, 10),
      startTime: getTimeLabel(appointment.startsAt),
      endTime: getTimeLabel(appointment.endsAt),
      dateLabel: getLongDateLabel(appointment.startsAt),
      timeRangeLabel: `${getTimeLabel(appointment.startsAt)} - ${getTimeLabel(appointment.endsAt)}`,
      durationLabel: `${appointment.durationMinutes} min`,
      modality: appointment.modality,
      modalityLabel: getModalityLabel(appointment.modality),
      status: appointment.status,
      statusLabel: getStatusLabel(appointment.status),
      roomStatusLabel: appointment.roomStatusLabel,
      roomState: appointment.roomState,
      canReschedule: appointment.status === "scheduled" || appointment.status === "confirmed",
      canCancel:
        appointment.status === "scheduled" ||
        appointment.status === "confirmed" ||
        appointment.status === "in_progress",
      primaryAction: buildPrimaryAction(appointment, blockingItem?.description ?? "", attentionItem?.description ?? ""),
      sessionData: [
        {
          label: "Data",
          value: getLongDateLabel(appointment.startsAt)
        },
        {
          label: "Horário",
          value: `${getTimeLabel(appointment.startsAt)} - ${getTimeLabel(appointment.endsAt)}`
        },
        {
          label: "Duração",
          value: `${appointment.durationMinutes} min`
        },
        {
          label: "Modalidade",
          value: getModalityLabel(appointment.modality)
        },
        {
          label: "Origem",
          value: appointment.createdViaLabel
        },
        {
          label: "Observação operacional",
          value: appointment.note
        }
      ],
      patientSummary: [
        {
          label: "Idade",
          value: appointment.patientAgeLabel
        },
        {
          label: "Contato principal",
          value: `${appointment.patientPrimaryContact} · ${appointment.patientContactLabel}`
        },
        {
          label: "Responsável legal",
          value: appointment.patientResponsibleLabel
        },
        {
          label: "Cadastro",
          value: "Abrir ficha do paciente"
        }
      ],
      consentStates: appointment.consentStates,
      paymentSummary: [
        {
          label: "Origem do pagamento",
          value: appointment.patientPaymentOriginLabel
        },
        {
          label: "Status",
          value: appointment.paymentStatusLabel
        },
        {
          label: "Valor",
          value: appointment.paymentValueLabel
        },
        {
          label: "Cobrança vinculada",
          value:
            appointment.paymentStatusLabel === "Não configurado"
              ? "Criar cobrança no fluxo financeiro"
              : "Disponível no financeiro"
        }
      ],
      readinessChecklist,
      timeline: appointment.timeline
    };
  }

  getAppointmentCall(session: AuthSession, appointmentId: string): AppointmentCall {
    this.assertAgendaReadable(session);

    const appointment = this.getAppointmentRecord(appointmentId);
    const callState = this.getCallState(appointmentId);
    const joinWindow = buildJoinWindow(appointment);
    const transcript = buildTranscriptState(session, appointment);
    const readiness = buildCallReadiness(session, appointment, joinWindow, transcript);
    const experience = buildExperienceState(appointment, callState, joinWindow, readiness.outcome);

    return {
      appointment: {
        id: appointment.id,
        patientName: appointment.patientName,
        dateLabel: getLongDateLabel(appointment.startsAt),
        timeRangeLabel: `${getTimeLabel(appointment.startsAt)} - ${getTimeLabel(appointment.endsAt)}`,
        durationLabel: `${appointment.durationMinutes} min`,
        detailHref: `/app/appointments/${appointment.id}`
      },
      experienceState: experience.state,
      experienceLabel: experience.label,
      roomSummary: {
        state: appointment.roomState,
        label: appointment.roomStatusLabel,
        providerLabel: callState.providerLabel,
        joinUrlLabel:
          appointment.roomState === "ready" || appointment.roomState === "open"
            ? `sala://${appointment.id}`
            : "Aguardando provisionamento"
      },
      joinWindow,
      readiness,
      transcript,
      devices: {
        cameraPermission: "granted",
        microphonePermission: "granted",
        availableCameras: ["FaceTime HD", "USB Logitech Brio"],
        availableMicrophones: ["Microfone do MacBook", "Headset Jabra Speak"],
        previewAvailable: true,
        microphoneLevel: callState.therapistJoined ? 68 : 41
      },
      callPermissions: {
        canProvisionRoom:
          appointment.modality === "telehealth" &&
          joinWindow.canJoinNow &&
          appointment.roomState === "not_provisioned" &&
          readiness.outcome !== "blocked",
        canCheckIn:
          appointment.modality === "telehealth" &&
          joinWindow.canJoinNow &&
          (appointment.roomState === "ready" || appointment.roomState === "open") &&
          !callState.therapistJoined &&
          readiness.outcome !== "blocked",
        canEndSession:
          appointment.modality === "telehealth" &&
          callState.therapistJoined &&
          appointment.status === "in_progress"
      },
      connection: buildConnectionState(callState.connectionState),
      participants: {
        therapistJoined: callState.therapistJoined,
        patientPresence: callState.patientPresence,
        patientLabel: getPatientPresenceLabel(callState.patientPresence)
      },
      sidePanel: [
        {
          label: "Paciente",
          value: appointment.patientName
        },
        {
          label: "Pagamento",
          value: appointment.paymentStatusLabel
        },
        {
          label: "Transcript",
          value: transcript.label
        },
        {
          label: "Pendencia critica",
          value:
            appointment.consentStates.find((item) => item.state === "critical")?.description ??
            "Nenhuma pendencia impeditiva"
        }
      ],
      notices: buildCallNotices(appointment, callState, transcript, joinWindow)
    };
  }

  provisionRoom(session: AuthSession, appointmentId: string): AppointmentCall {
    this.assertAgendaWritable(session);
    const appointment = this.getAppointmentRecord(appointmentId);

    if (appointment.modality !== "telehealth") {
      throw new BadRequestException("Somente sessoes de teleatendimento podem provisionar sala.");
    }

    const joinWindow = buildJoinWindow(appointment);

    if (!joinWindow.canJoinNow) {
      throw new BadRequestException(joinWindow.blockedReason || "A sala ainda nao pode ser provisionada.");
    }

    appointment.roomState = "ready";
    appointment.roomStatusLabel = "Sala pronta para entrada";
    appointment.timeline.unshift({
      id: `timeline_${appointment.id}_room`,
      title: "Sala provisionada",
      occurredAtLabel: "Agora",
      description: "A sala do atendimento foi provisionada no web."
    });

    return this.getAppointmentCall(session, appointmentId);
  }

  checkIn(session: AuthSession, appointmentId: string): AppointmentCall {
    this.assertAgendaWritable(session);
    const appointment = this.getAppointmentRecord(appointmentId);
    const callState = this.getCallState(appointmentId);
    const call = this.getAppointmentCall(session, appointmentId);

    if (!call.callPermissions.canCheckIn) {
      throw new BadRequestException(
        call.joinWindow.blockedReason || "A sessao ainda nao pode ser iniciada."
      );
    }

    callState.therapistJoined = true;
    callState.connectionState = callState.patientPresence === "absent" ? "waiting_remote" : "stable";
    appointment.roomState = "open";
    appointment.roomStatusLabel =
      callState.patientPresence === "absent" ? "Sala aberta aguardando paciente" : "Sala ao vivo";
    appointment.status = "in_progress";
    appointment.timeline.unshift({
      id: `timeline_${appointment.id}_checkin`,
      title: "Terapeuta entrou na sala",
      occurredAtLabel: "Agora",
      description:
        callState.patientPresence === "absent"
          ? "A chamada foi aberta e aguarda a entrada do paciente."
          : "A chamada iniciou com paciente presente na waiting room."
    });

    return this.getAppointmentCall(session, appointmentId);
  }

  endSession(session: AuthSession, appointmentId: string): AppointmentCall {
    this.assertAgendaWritable(session);
    const appointment = this.getAppointmentRecord(appointmentId);
    const callState = this.getCallState(appointmentId);

    if (!callState.therapistJoined && appointment.status !== "in_progress") {
      throw new BadRequestException("Nao existe chamada ativa para encerrar.");
    }

    callState.therapistJoined = false;
    callState.connectionState = "ready";
    callState.patientPresence = callState.patientPresence === "absent" ? "absent" : "left";
    appointment.roomState = "closed";
    appointment.roomStatusLabel = "Sala encerrada com handoff para pos-sessao";
    appointment.status = "completed";
    appointment.timeline.unshift({
      id: `timeline_${appointment.id}_ended`,
      title: "Atendimento encerrado",
      occurredAtLabel: "Agora",
      description:
        "A chamada foi encerrada pelo terapeuta e o fluxo operacional seguinte ja pode ser iniciado."
    });

    return this.getAppointmentCall(session, appointmentId);
  }

  private assertAgendaReadable(session: AuthSession) {
    if (session.accountStatus === "pending_setup") {
      throw new ForbiddenException(
        "Conclua a ativacao da conta antes de operar agenda e sessoes."
      );
    }
  }

  private assertAgendaWritable(session: AuthSession) {
    if (session.accountStatus !== "ready_for_operations") {
      throw new ForbiddenException(
        "A conta atual esta em modo de leitura. Agendamento e alteracoes ficam bloqueados."
      );
    }
  }

  private parseAgendaQuery(rawQuery: Record<string, string>): AgendaQuery {
    const view = rawQuery.view;
    const currentView: CalendarView =
      view === "day" || view === "week" || view === "month" ? view : "week";
    const status = rawQuery.status;
    const modality = rawQuery.modality;

    return {
      date: /^\d{4}-\d{2}-\d{2}$/.test(rawQuery.date ?? "") ? (rawQuery.date as string) : DEFAULT_DATE,
      view: currentView,
      status:
        status === "scheduled" ||
        status === "confirmed" ||
        status === "in_progress" ||
        status === "completed" ||
        status === "cancelled" ||
        status === "no_show"
          ? status
          : "all",
      modality: modality === "telehealth" || modality === "in_person" ? modality : "all"
    };
  }

  private assertNoConflict(startsAt: string, endsAt: string, dayKey: string, ignoredAppointmentId?: string) {
    this.assertNoAppointmentOverlap(startsAt, endsAt, dayKey, ignoredAppointmentId);

    const blockConflict = this.blocks.some((block) => {
      if (block.dayKey !== dayKey) {
        return false;
      }

      return hasOverlap(startsAt, endsAt, block.startsAt, block.endsAt);
    });

    if (blockConflict) {
      throw new BadRequestException(
        "O horário escolhido colide com um bloqueio de agenda já configurado."
      );
    }
  }

  private assertNoAppointmentOverlap(
    startsAt: string,
    endsAt: string,
    dayKey: string,
    ignoredAppointmentId?: string
  ) {
    const appointmentConflict = this.appointments.some((appointment) => {
      if (ignoredAppointmentId && appointment.id === ignoredAppointmentId) {
        return false;
      }

      if (appointment.startsAt.slice(0, 10) !== dayKey) {
        return false;
      }

      if (appointment.status === "cancelled" || appointment.status === "completed") {
        return false;
      }

      return hasOverlap(startsAt, endsAt, appointment.startsAt, appointment.endsAt);
    });

    if (appointmentConflict) {
      throw new BadRequestException(
        "Já existe uma sessão ocupando esse horário. Ajuste o intervalo antes de salvar."
      );
    }
  }

  private assertNoBlockOverlap(
    startsAt: string,
    endsAt: string,
    dayKey: string,
    ignoredBlockId?: string
  ) {
    const blockConflict = this.blocks.some((block) => {
      if (ignoredBlockId && block.id === ignoredBlockId) {
        return false;
      }

      if (block.dayKey !== dayKey) {
        return false;
      }

      return hasOverlap(startsAt, endsAt, block.startsAt, block.endsAt);
    });

    if (blockConflict) {
      throw new BadRequestException(
        "Já existe um bloqueio ocupando esse intervalo. Ajuste a janela antes de salvar."
      );
    }
  }

  private buildRange(view: CalendarView, dateInput: string) {
    const focusDate = parseDay(dateInput);

    if (view === "day") {
      return {
        days: [focusDate],
        dayKeys: new Set([formatDayKey(focusDate)])
      };
    }

    if (view === "month") {
      const monthStart = new Date(Date.UTC(focusDate.getUTCFullYear(), focusDate.getUTCMonth(), 1));
      const monthEnd = new Date(Date.UTC(focusDate.getUTCFullYear(), focusDate.getUTCMonth() + 1, 0));
      const firstGridDay = addDays(monthStart, -getMondayOffset(monthStart));
      const lastGridDay = addDays(monthEnd, 6 - getMondayBasedWeekday(monthEnd));
      const days = enumerateDays(firstGridDay, lastGridDay);

      return {
        days,
        dayKeys: new Set(days.map((day) => formatDayKey(day)))
      };
    }

    const weekStart = addDays(focusDate, -getMondayOffset(focusDate));
    const weekEnd = addDays(weekStart, 6);
    const days = enumerateDays(weekStart, weekEnd);

    return {
      days,
      dayKeys: new Set(days.map((day) => formatDayKey(day)))
    };
  }

  private getAppointmentRecord(appointmentId: string) {
    const appointment = this.appointments.find((item) => item.id === appointmentId);

    if (!appointment) {
      throw new NotFoundException("Sessão não encontrada.");
    }

    return appointment;
  }

  private getCallState(appointmentId: string) {
    const state = this.callState.get(appointmentId);

    if (!state) {
      throw new NotFoundException("Estado da chamada não encontrado.");
    }

    return state;
  }

  private getBlockRecord(blockId: string) {
    const block = this.blocks.find((item) => item.id === blockId);

    if (!block) {
      throw new NotFoundException("Bloqueio não encontrado.");
    }

    return block;
  }
}

function getAppointmentTone(status: AppointmentCalendarStatus): ScheduleBlock["tone"] {
  switch (status) {
    case "cancelled":
      return "critical";
    case "completed":
      return "success";
    case "in_progress":
      return "info";
    case "no_show":
      return "warning";
    case "scheduled":
      return "success";
    case "confirmed":
      return "info";
  }
}

function getStatusLabel(status: AppointmentCalendarStatus) {
  switch (status) {
    case "scheduled":
      return "Agendada";
    case "confirmed":
      return "Confirmada";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluída";
    case "cancelled":
      return "Cancelada";
    case "no_show":
      return "No-show";
  }
}

function getModalityLabel(modality: AppointmentModality) {
  return modality === "telehealth" ? "Teleatendimento" : "Presencial";
}

function createAvailabilityRules(): AvailabilityRuleRecord[] {
  return Array.from({ length: 7 }, (_, weekday) => {
    const seed = recurringAvailabilitySeed[weekday as keyof typeof recurringAvailabilitySeed] ?? [];

    return {
      weekday,
      enabled: seed.length > 0,
      windows: seed.map(([startTime, endTime], index) => ({
        id: `${weekday}_${index}`,
        startTime,
        endTime
      }))
    };
  });
}

function normalizeAvailabilityWindows(windows: AvailabilityWindowRecord[]) {
  const cleaned = windows
    .filter((window) => window.startTime.length > 0 && window.endTime.length > 0)
    .filter((window) => window.endTime > window.startTime)
    .sort((left, right) => left.startTime.localeCompare(right.startTime));

  for (let index = 1; index < cleaned.length; index += 1) {
    if (cleaned[index - 1]!.endTime > cleaned[index]!.startTime) {
      throw new BadRequestException(
        "A disponibilidade recorrente tem janelas sobrepostas. Ajuste os intervalos antes de salvar."
      );
    }
  }

  return cleaned;
}

function createInitialCallState(appointment: AppointmentRecord): CallStateRecord {
  return {
    therapistJoined: false,
    patientPresence:
      appointment.id === "appt_1032"
        ? "waiting_room"
        : appointment.status === "completed"
          ? "left"
          : "absent",
    connectionState: "ready",
    providerLabel: "Infraestrutura WebRTC gerenciada · direção BR"
  };
}

function buildJoinWindow(appointment: AppointmentRecord): AppointmentCall["joinWindow"] {
  const endsAt = new Date(appointment.endsAt).getTime();
  const now = new Date(CURRENT_TIMESTAMP).getTime();
  const therapistOpensAt = new Date(new Date(appointment.startsAt).getTime() - 15 * 60 * 1000);
  let blockedReason = "";

  if (appointment.modality !== "telehealth") {
    blockedReason = "Esta sessao e presencial. A rota de chamada nao se aplica.";
  } else if (appointment.status === "cancelled") {
    blockedReason = "A sessao foi cancelada e nao pode mais abrir sala.";
  } else if (appointment.status === "completed") {
    blockedReason = "A sessao ja foi encerrada.";
  } else if (appointment.consentStates.some((item) => item.label === "Teleatendimento" && item.state === "critical")) {
    blockedReason = "O consentimento de teleatendimento esta critico e bloqueia a entrada.";
  } else if (now < therapistOpensAt.getTime()) {
    blockedReason = "A sala ainda esta indisponivel para entrada do terapeuta.";
  } else if (now > endsAt) {
    blockedReason = "A janela da sessao ja terminou.";
  }

  return {
    therapistOpensAtLabel: shiftTimeLabel(appointment.startsAt, -15),
    patientOpensAtLabel: shiftTimeLabel(appointment.startsAt, -10),
    scheduledStartLabel: getTimeLabel(appointment.startsAt),
    scheduledEndLabel: getTimeLabel(appointment.endsAt),
    canJoinNow: blockedReason.length === 0,
    blockedReason
  };
}

function buildTranscriptState(
  session: AuthSession,
  appointment: AppointmentRecord
): AppointmentCall["transcript"] {
  if (!session.capabilities.audioTranscription) {
    return {
      state: "disabled_by_policy",
      label: "Desativado por politica",
      description:
        "Esta conta opera o core web sem transcript automatico. O fluxo pos-sessao continua por texto/ditado."
    };
  }

  const aiConsent = appointment.consentStates.find((item) => item.label === "IA documental");

  if (!aiConsent || aiConsent.state !== "ok") {
    return {
      state: "disabled_by_consent",
      label: "Desativado por consentimento",
      description:
        "A chamada pode ocorrer normalmente, mas nao havera transcript automatico nesta sessao."
    };
  }

  return {
    state: "active",
    label: "Ativo",
    description: "Transcript operacional habilitado com descarte automatico do bruto."
  };
}

function buildCallReadiness(
  session: AuthSession,
  appointment: AppointmentRecord,
  joinWindow: AppointmentCall["joinWindow"],
  transcript: AppointmentCall["transcript"]
): AppointmentCall["readiness"] {
  const items: AppointmentCall["readiness"]["items"] = [
    {
      label: "Sessao dentro da janela",
      state: joinWindow.canJoinNow ? "ok" : "blocked",
      description: joinWindow.canJoinNow
        ? "A janela do terapeuta esta aberta."
        : joinWindow.blockedReason || "A janela ainda nao esta liberada."
    },
    {
      label: "Teleatendimento autorizado",
      state:
        appointment.modality !== "telehealth"
          ? "blocked"
          : appointment.consentStates.some((item) => item.label === "Teleatendimento" && item.state === "critical")
            ? "blocked"
            : "ok",
      description:
        appointment.modality !== "telehealth"
          ? "Esta sessao nao usa sala online."
          : appointment.consentStates.some((item) => item.label === "Teleatendimento" && item.state === "critical")
            ? "O termo de teleatendimento precisa ser resolvido antes da entrada."
            : "Consentimento valido para a sessao online."
    },
    {
      label: "Sala pronta",
      state:
        appointment.roomState === "ready" || appointment.roomState === "open"
          ? "ok"
          : appointment.roomState === "failed"
            ? "blocked"
            : "attention",
      description:
        appointment.roomState === "ready" || appointment.roomState === "open"
          ? "Sala apta para entrada."
          : appointment.roomState === "failed"
            ? "Houve falha no provisionamento da sala."
            : "A sala ainda precisa ser provisionada."
    },
    {
      label: "Dispositivos disponiveis",
      state: "ok",
      description: "Camera e microfone liberados para o navegador nesta simulacao."
    },
    {
      label: "Transcript",
      state: transcript.state === "active" ? "ok" : "attention",
      description: transcript.description
    },
    {
      label: "Conta do terapeuta apta",
      state: session.accountStatus === "ready_for_operations" ? "ok" : "blocked",
      description:
        session.accountStatus === "ready_for_operations"
          ? "Conta apta para teleatendimento."
          : "A conta atual nao esta apta para abrir sessoes."
    }
  ];

  return {
    outcome: items.some((item) => item.state === "blocked")
      ? "blocked"
      : items.some((item) => item.state === "attention")
        ? "attention"
        : "ready",
    items
  };
}

function buildExperienceState(
  appointment: AppointmentRecord,
  callState: CallStateRecord,
  joinWindow: AppointmentCall["joinWindow"],
  readinessOutcome: AppointmentCall["readiness"]["outcome"]
) {
  if (appointment.status === "completed" || appointment.roomState === "closed") {
    return {
      state: "ended" as const,
      label: "Encerrada"
    };
  }

  if (appointment.roomState === "failed") {
    return {
      state: "failed" as const,
      label: "Falha"
    };
  }

  if (callState.connectionState === "reconnecting") {
    return {
      state: "reconnecting" as const,
      label: "Reconectando"
    };
  }

  if (readinessOutcome === "blocked" && !callState.therapistJoined) {
    return {
      state: "unavailable" as const,
      label: "Ainda indisponivel"
    };
  }

  if (callState.therapistJoined && callState.patientPresence === "absent") {
    return {
      state: "waiting_patient" as const,
      label: "Aguardando paciente"
    };
  }

  if (callState.therapistJoined) {
    return {
      state: "live" as const,
      label: "Ao vivo"
    };
  }

  if (joinWindow.canJoinNow) {
    return {
      state: "prejoin" as const,
      label: "Pre-entrada"
    };
  }

  return {
    state: "unavailable" as const,
    label: "Ainda indisponivel"
  };
}

function buildConnectionState(state: CallStateRecord["connectionState"]): AppointmentCall["connection"] {
  switch (state) {
    case "stable":
      return {
        state,
        label: "Conexao estavel",
        description: "Midia trafegando sem alertas."
      };
    case "waiting_remote":
      return {
        state,
        label: "Aguardando paciente",
        description: "Sala aberta e pronta para o participante remoto."
      };
    case "reconnecting":
      return {
        state,
        label: "Reconectando",
        description: "Tentando restabelecer a conexao automaticamente."
      };
    case "failed":
      return {
        state,
        label: "Falha de conexao",
        description: "Nao foi possivel manter a conexao da sala."
      };
    default:
      return {
        state: "ready",
        label: "Pronto para entrar",
        description: "Dispositivos e sala preparados para a entrada."
      };
  }
}

function buildCallNotices(
  appointment: AppointmentRecord,
  callState: CallStateRecord,
  transcript: AppointmentCall["transcript"],
  joinWindow: AppointmentCall["joinWindow"]
): AppointmentCall["notices"] {
  const notices: AppointmentCall["notices"] = [];

  if (callState.patientPresence === "waiting_room" && !callState.therapistJoined) {
    notices.push({
      id: "patient-waiting",
      tone: "info",
      title: "Paciente aguardando na waiting room",
      description: "Ao entrar, a chamada 1:1 sera liberada sem admissao manual no MVP."
    });
  }

  if (transcript.state !== "active") {
    notices.push({
      id: "transcript-off",
      tone: "warning",
      title: transcript.label,
      description: transcript.description
    });
  }

  if (!joinWindow.canJoinNow && joinWindow.blockedReason) {
    notices.push({
      id: "join-window",
      tone: "critical",
      title: "Entrada bloqueada",
      description: joinWindow.blockedReason
    });
  }

  if (appointment.paymentStatusLabel === "Em aberto") {
    notices.push({
      id: "payment-open",
      tone: "warning",
      title: "Pagamento em aberto",
      description: "Nao bloqueia a chamada por padrao do MVP, mas continua visivel durante o atendimento."
    });
  }

  return notices;
}

function getPatientPresenceLabel(presence: AppointmentCall["participants"]["patientPresence"]) {
  switch (presence) {
    case "waiting_room":
      return "Paciente na waiting room";
    case "joined":
      return "Paciente conectado";
    case "left":
      return "Paciente já saiu";
    default:
      return "Paciente ainda não entrou";
  }
}

function buildReadinessChecklist(
  session: AuthSession,
  appointment: AppointmentRecord
): AppointmentDetail["readinessChecklist"] {
  const hasCriticalConsent = appointment.consentStates.some((item) => item.state === "critical");
  const hasPendingConsent = appointment.consentStates.some((item) => item.state === "pending");
  const roomReady =
    appointment.modality === "in_person" ||
    appointment.roomState === "ready" ||
    appointment.roomState === "open";

  return [
    {
      label: "Paciente vinculado corretamente",
      state: "ok",
      description: "Cadastro do paciente e vínculo com a sessão estão consistentes."
    },
    {
      label: "Janela da sessão",
      state: appointment.status === "completed" || appointment.status === "cancelled" ? "attention" : "ok",
      description:
        appointment.status === "completed" || appointment.status === "cancelled"
          ? "A sessão não está mais em janela ativa."
          : "Horário está dentro da operação planejada da agenda."
    },
    {
      label: "Sala virtual ou contexto presencial",
      state: roomReady ? "ok" : "attention",
      description: roomReady
        ? "A sessão pode iniciar sem bloqueio técnico de sala."
        : "A sala ainda será provisionada quando a janela permitir."
    },
    {
      label: "Consentimentos criticos",
      state: hasCriticalConsent ? "blocked" : hasPendingConsent ? "attention" : "ok",
      description: hasCriticalConsent
        ? "Existe um consentimento impeditivo que precisa ser resolvido antes do atendimento."
        : hasPendingConsent
          ? "Há pendências não impeditivas que merecem revisão."
          : "Sem pendências impeditivas."
    },
    {
      label: "Conta do terapeuta apta",
      state: session.accountStatus === "ready_for_operations" ? "ok" : "blocked",
      description:
        session.accountStatus === "ready_for_operations"
          ? "Conta liberada para operar o atendimento."
          : "A conta atual não está apta para iniciar sessões."
    }
  ];
}

function buildPrimaryAction(
  appointment: AppointmentRecord,
  blockingReason: string,
  attentionReason: string
): AppointmentDetail["primaryAction"] {
  if (appointment.status === "in_progress") {
    return {
      label: "Entrar na sala",
      href: `/app/appointments/${appointment.id}/call`,
      disabledReason: ""
    };
  }

  if (blockingReason) {
    return {
      label: "Resolver pendencia",
      href: appointment.patientId ? `/app/patients/${appointment.patientId}` : "/app/documents",
      disabledReason: blockingReason
    };
  }

  if (appointment.status === "completed") {
    return {
      label: "Ver agenda",
      href: "/app/agenda",
      disabledReason: ""
    };
  }

  if (appointment.status === "cancelled") {
    return {
      label: "Reagendar na agenda",
      href: "/app/agenda",
      disabledReason: ""
    };
  }

  return {
    label: appointment.modality === "telehealth" ? "Iniciar atendimento" : "Abrir contexto da sessão",
    href: appointment.modality === "telehealth" ? `/app/appointments/${appointment.id}/call` : `/app/patients/${appointment.patientId}`,
    disabledReason: attentionReason
  };
}

function buildTimeSlots() {
  return ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
}

function getVisibleRangeLabel(view: CalendarView, days: Date[]) {
  if (view === "day") {
    const day = days[0]!;
    return `${DAY_NAMES[day.getUTCDay()]}, ${pad(day.getUTCDate())} ${MONTH_NAMES[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
  }

  if (view === "month") {
    const focus = days.find((day) => day.getUTCDate() === 1) ?? days[10]!;
    return `${MONTH_NAMES[focus.getUTCMonth()]} ${focus.getUTCFullYear()}`;
  }

  const first = days[0]!;
  const last = days[days.length - 1]!;
  return `${pad(first.getUTCDate())} ${MONTH_NAMES[first.getUTCMonth()]} - ${pad(last.getUTCDate())} ${MONTH_NAMES[last.getUTCMonth()]} ${last.getUTCFullYear()}`;
}

function getLongDateLabel(timestamp: string) {
  const day = parseDay(timestamp.slice(0, 10));
  return `${DAY_NAMES[day.getUTCDay()]}, ${pad(day.getUTCDate())} ${MONTH_NAMES[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
}

function getTimeLabel(timestamp: string) {
  return timestamp.slice(11, 16);
}

function buildEndTimestamp(dayKey: string, startTime: string, durationMinutes: number) {
  const [hours = 0, minutes = 0] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${dayKey}T${pad(endHours)}:${pad(endMinutes)}:00-03:00`;
}

function shiftTimeLabel(timestamp: string, deltaMinutes: number) {
  const [hours = 0, minutes = 0] = timestamp.slice(11, 16).split(":").map(Number);
  const total = hours * 60 + minutes + deltaMinutes;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
}

function hasOverlap(startA: string, endA: string, startB: string, endB: string) {
  return new Date(startA).getTime() < new Date(endB).getTime() &&
    new Date(endA).getTime() > new Date(startB).getTime();
}

function parseDay(dayKey: string) {
  const [year = 2026, month = 3, day = 30] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDayKey(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function addDays(date: Date, days: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

function enumerateDays(start: Date, end: Date) {
  const days: Date[] = [];
  let current = start;

  while (current.getTime() <= end.getTime()) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

function getMondayOffset(date: Date) {
  return getMondayBasedWeekday(date);
}

function getMondayBasedWeekday(date: Date) {
  return (date.getUTCDay() + 6) % 7;
}

function isDayInRange(dayKey: string, dayKeys: Set<string>) {
  return dayKeys.has(dayKey);
}
