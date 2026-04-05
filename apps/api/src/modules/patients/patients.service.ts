import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  AuthSession,
  PatientCreateRequest,
  PatientDetail,
  PatientDocumentItem,
  PatientFinancialState,
  PatientListFilters,
  PatientListItem,
  PatientListResponse,
  PatientOperationalStatus,
  PatientSessionItem
} from "@terapia/contracts";
import { patientCreateRequestSchema } from "@terapia/contracts";

type PatientRecord = {
  id: string;
  fullName: string;
  externalCode: string;
  email: string;
  phone: string;
  birthDate: string;
  ageLabel: string;
  status: PatientOperationalStatus;
  nextSessionLabel: string;
  nextSessionAt: string | null;
  documentsState: "ok" | "pending" | "critical";
  documentsCountLabel: string;
  financialState: PatientFinancialState;
  financialLabel: string;
  hasLegalGuardian: boolean;
  legalGuardianLabel: string;
  createdAtLabel: string;
  paymentOriginLabel: string;
  clinicalReviewLabel: string;
  overviewBlocks: PatientDetail["overviewBlocks"];
  sessions: PatientSessionItem[];
  documents: PatientDocumentItem[];
  charges: PatientDetail["charges"];
  activity: PatientDetail["activity"];
};

const basePatients: PatientRecord[] = [
  {
    id: "patient_maria_souza",
    fullName: "Maria Souza",
    externalCode: "PAC-001",
    email: "maria.souza@email.com",
    phone: "(11) 98888-1101",
    birthDate: "1992-03-14",
    ageLabel: "34 anos",
    status: "active",
    nextSessionLabel: "Hoje, 13:30",
    nextSessionAt: "2026-03-30T13:30:00-03:00",
    documentsState: "ok",
    documentsCountLabel: "OK",
    financialState: "ok",
    financialLabel: "Pagamento confirmado",
    hasLegalGuardian: false,
    legalGuardianLabel: "Nao se aplica",
    createdAtLabel: "Vinculo criado em 05 Mar 2026",
    paymentOriginLabel: "Particular",
    clinicalReviewLabel: "Rascunho gerado hoje",
    overviewBlocks: [
      {
        title: "Resumo do vinculo",
        value: "Paciente ativa em acompanhamento semanal",
        description: "Particular com rotina de teleatendimento nas quartas."
      },
      {
        title: "Proxima sessao",
        value: "Hoje, 13:30",
        description: "Sala online pronta e pagamento confirmado."
      },
      {
        title: "Financeiro",
        value: "Sem pendencias",
        description: "Ultima cobranca conciliada automaticamente."
      }
    ],
    sessions: [
      {
        id: "appt_1032",
        dateLabel: "30 Mar 2026 · 13:30",
        statusLabel: "Waiting room",
        modalityLabel: "Teleatendimento",
        paymentLabel: "Pago",
        href: "/app/appointments/appt_1032"
      },
      {
        id: "appt_1018",
        dateLabel: "23 Mar 2026 · 13:30",
        statusLabel: "Concluida",
        modalityLabel: "Teleatendimento",
        paymentLabel: "Pago",
        href: "/app/appointments/appt_1018"
      }
    ],
    documents: [
      {
        id: "doc_001",
        title: "Termo LGPD",
        statusLabel: "Assinado",
        updatedAtLabel: "Assinado em 05 Mar"
      },
      {
        id: "doc_002",
        title: "Termo de teleatendimento",
        statusLabel: "Assinado",
        updatedAtLabel: "Revalidado em 19 Mar"
      }
    ],
    charges: [
      {
        id: "charge_001",
        label: "Sessao 30 Mar",
        statusLabel: "Paga",
        amountLabel: "R$ 220,00"
      }
    ],
    activity: [
      {
        id: "activity_001",
        title: "Rascunho clinico gerado",
        occurredAtLabel: "Ha 1h",
        description: "Resumo em topicos aguardando sua aprovacao."
      }
    ]
  },
  {
    id: "patient_lucas_santos",
    fullName: "Lucas Santos",
    externalCode: "PAC-002",
    email: "lucas.santos@email.com",
    phone: "(11) 97777-2012",
    birthDate: "1988-09-07",
    ageLabel: "37 anos",
    status: "active",
    nextSessionLabel: "Hoje, 15:00",
    nextSessionAt: "2026-03-30T15:00:00-03:00",
    documentsState: "pending",
    documentsCountLabel: "1 pendencia",
    financialState: "open",
    financialLabel: "Cobranca de hoje em aberto",
    hasLegalGuardian: false,
    legalGuardianLabel: "Nao se aplica",
    createdAtLabel: "Vinculo criado em 12 Mar 2026",
    paymentOriginLabel: "Particular",
    clinicalReviewLabel: "Sem pendencia",
    overviewBlocks: [
      {
        title: "Resumo do vinculo",
        value: "Primeira avaliacao em andamento",
        description: "Paciente ativo com ajuste de rotina de pagamentos."
      },
      {
        title: "Proxima sessao",
        value: "Hoje, 15:00",
        description: "Sessao presencial com cobranca pendente."
      },
      {
        title: "Financeiro",
        value: "Em aberto",
        description: "A cobranca da sessao de hoje ainda nao foi conciliada."
      }
    ],
    sessions: [
      {
        id: "appt_1038",
        dateLabel: "30 Mar 2026 · 15:00",
        statusLabel: "Confirmada",
        modalityLabel: "Presencial",
        paymentLabel: "Em aberto",
        href: "/app/appointments/appt_1038"
      }
    ],
    documents: [
      {
        id: "doc_101",
        title: "Consentimento de IA documental",
        statusLabel: "Pendente",
        updatedAtLabel: "Reenvio hoje"
      }
    ],
    charges: [
      {
        id: "charge_101",
        label: "Sessao 30 Mar",
        statusLabel: "Em aberto",
        amountLabel: "R$ 220,00"
      }
    ],
    activity: [
      {
        id: "activity_101",
        title: "Cobranca criada",
        occurredAtLabel: "Ha 25 min",
        description: "A cobranca da sessao de hoje foi gerada e aguarda pagamento."
      }
    ]
  },
  {
    id: "patient_renata_costa",
    fullName: "Renata Costa",
    externalCode: "PAC-003",
    email: "renata.costa@email.com",
    phone: "(11) 96666-3313",
    birthDate: "1996-01-19",
    ageLabel: "30 anos",
    status: "active",
    nextSessionLabel: "Hoje, 17:10",
    nextSessionAt: "2026-03-30T17:10:00-03:00",
    documentsState: "critical",
    documentsCountLabel: "Bloqueia sessao online",
    financialState: "ok",
    financialLabel: "OK",
    hasLegalGuardian: false,
    legalGuardianLabel: "Nao se aplica",
    createdAtLabel: "Vinculo criado em 02 Fev 2026",
    paymentOriginLabel: "Particular",
    clinicalReviewLabel: "Sem pendencia",
    overviewBlocks: [
      {
        title: "Resumo do vinculo",
        value: "Paciente ativa em seguimento",
        description: "Termo de teleatendimento precisa de revalidacao."
      },
      {
        title: "Documentos",
        value: "Critico",
        description: "Sem o aceite atualizado a sessao online fica em risco."
      },
      {
        title: "Financeiro",
        value: "Sem pendencias",
        description: "Ultimo pagamento foi conciliado corretamente."
      }
    ],
    sessions: [
      {
        id: "appt_1045",
        dateLabel: "30 Mar 2026 · 17:10",
        statusLabel: "Confirmada",
        modalityLabel: "Teleatendimento",
        paymentLabel: "Pago",
        href: "/app/appointments/appt_1045"
      }
    ],
    documents: [
      {
        id: "doc_201",
        title: "Termo de teleatendimento",
        statusLabel: "Critico",
        updatedAtLabel: "Vence hoje"
      }
    ],
    charges: [
      {
        id: "charge_201",
        label: "Sessao 30 Mar",
        statusLabel: "Paga",
        amountLabel: "R$ 220,00"
      }
    ],
    activity: [
      {
        id: "activity_201",
        title: "Termo reenviado",
        occurredAtLabel: "Ha 12 min",
        description: "O termo de teleatendimento foi reenviado para assinatura."
      }
    ]
  },
  {
    id: "patient_julia_prado",
    fullName: "Julia Prado",
    externalCode: "PAC-004",
    email: "julia.prado@email.com",
    phone: "(11) 95555-4414",
    birthDate: "2008-11-03",
    ageLabel: "17 anos",
    status: "invited",
    nextSessionLabel: "Sem sessao futura",
    nextSessionAt: null,
    documentsState: "pending",
    documentsCountLabel: "Convite pendente",
    financialState: "ok",
    financialLabel: "Sem cobranca",
    hasLegalGuardian: true,
    legalGuardianLabel: "Mae responsavel cadastrada",
    createdAtLabel: "Convite criado em 29 Mar 2026",
    paymentOriginLabel: "Particular",
    clinicalReviewLabel: "Sem pendencia",
    overviewBlocks: [
      {
        title: "Resumo do vinculo",
        value: "Paciente convidada",
        description: "Fluxo do paciente ainda nao foi concluido."
      },
      {
        title: "Responsavel legal",
        value: "Obrigatorio",
        description: "Mae responsavel ja cadastrada para prosseguir."
      },
      {
        title: "Proximo passo",
        value: "Reenviar convite",
        description: "Sem ativacao do paciente nao ha sessao nem documentos finais."
      }
    ],
    sessions: [],
    documents: [
      {
        id: "doc_301",
        title: "Convite inicial",
        statusLabel: "Pendente",
        updatedAtLabel: "Enviado ontem"
      }
    ],
    charges: [],
    activity: [
      {
        id: "activity_301",
        title: "Paciente convidada",
        occurredAtLabel: "Ontem",
        description: "Convite inicial enviado para e-mail e telefone."
      }
    ]
  },
  {
    id: "patient_caio_oliveira",
    fullName: "Caio Oliveira",
    externalCode: "PAC-005",
    email: "caio.oliveira@email.com",
    phone: "(11) 94444-5515",
    birthDate: "1991-07-28",
    ageLabel: "34 anos",
    status: "inactive",
    nextSessionLabel: "Sem sessao futura",
    nextSessionAt: null,
    documentsState: "ok",
    documentsCountLabel: "OK",
    financialState: "overdue",
    financialLabel: "1 cobranca vencida",
    hasLegalGuardian: false,
    legalGuardianLabel: "Nao se aplica",
    createdAtLabel: "Vinculo criado em 10 Jan 2026",
    paymentOriginLabel: "Particular",
    clinicalReviewLabel: "Sem pendencia",
    overviewBlocks: [
      {
        title: "Resumo do vinculo",
        value: "Paciente inativo",
        description: "Sem sessao futura agendada no momento."
      },
      {
        title: "Financeiro",
        value: "Vencido",
        description: "Existe uma cobranca vencida que ainda precisa de tratativa."
      },
      {
        title: "Proximo passo",
        value: "Retomar contato",
        description: "Apos resolver financeiro, avaliar necessidade de nova sessao."
      }
    ],
    sessions: [
      {
        id: "appt_0999",
        dateLabel: "12 Mar 2026 · 11:00",
        statusLabel: "Concluida",
        modalityLabel: "Presencial",
        paymentLabel: "Vencida",
        href: "/app/appointments/appt_0999"
      }
    ],
    documents: [
      {
        id: "doc_401",
        title: "Politica de cancelamento",
        statusLabel: "Assinado",
        updatedAtLabel: "12 Jan"
      }
    ],
    charges: [
      {
        id: "charge_401",
        label: "Sessao 12 Mar",
        statusLabel: "Vencida",
        amountLabel: "R$ 220,00"
      }
    ],
    activity: [
      {
        id: "activity_401",
        title: "Cobranca vencida",
        occurredAtLabel: "Ha 7 dias",
        description: "A cobranca da ultima sessao ainda nao foi liquidada."
      }
    ]
  }
];

@Injectable()
export class PatientsService {
  private readonly patientsByEmail = new Map<string, PatientRecord[]>();

  listPatients(
    session: AuthSession,
    query: Partial<{
      query: string;
      status: string;
      documents: string;
      financial: string;
      upcomingOnly: string;
      legalGuardianOnly: string;
      page: string;
      pageSize: string;
    }>
  ): PatientListResponse {
    const items = this.getRecordsForSession(session);
    const filters: PatientListFilters = {
      query: query.query?.trim() ?? "",
      status: this.isStatusFilter(query.status) ? query.status : "all",
      documents: this.isDocumentsFilter(query.documents) ? query.documents : "all",
      financial: this.isFinancialFilter(query.financial) ? query.financial : "all",
      upcomingOnly: query.upcomingOnly === "true",
      legalGuardianOnly: query.legalGuardianOnly === "true"
    };

    const filtered = items.filter((item) => this.matchesFilters(item, filters));
    filtered.sort((left, right) => left.fullName.localeCompare(right.fullName, "pt-BR"));

    const page = Math.max(Number(query.page ?? "1") || 1, 1);
    const pageSize = [25, 50, 100].includes(Number(query.pageSize))
      ? Number(query.pageSize)
      : 25;

    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize).map((record) =>
      this.toListItem(record)
    );

    return {
      items: pageItems,
      total: filtered.length,
      page,
      pageSize,
      filters,
      availablePageSizes: [25, 50, 100]
    };
  }

  getPatientDetail(session: AuthSession, patientId: string): PatientDetail {
    const record = this.getRecordsForSession(session).find((item) => item.id === patientId);

    if (!record) {
      throw new NotFoundException("Paciente nao encontrado.");
    }

    return {
      id: record.id,
      fullName: record.fullName,
      status: record.status,
      ageLabel: record.ageLabel,
      primaryContact: `${record.email} · ${record.phone}`,
      legalGuardianLabel: record.legalGuardianLabel,
      nextSessionLabel: record.nextSessionLabel,
      documentsState: record.documentsState,
      financialState: record.financialState,
      clinicalReviewLabel: record.clinicalReviewLabel,
      createdAtLabel: record.createdAtLabel,
      paymentOriginLabel: record.paymentOriginLabel,
      primaryAction: this.getPrimaryAction(record),
      topActions: {
        scheduleHref: "/app/agenda",
        clinicalRecordHref: `/app/patients/${record.id}/clinical-record`
      },
      overviewBlocks: record.overviewBlocks,
      sessions: record.sessions,
      documents: record.documents,
      charges: record.charges,
      activity: record.activity
    };
  }

  createPatient(session: AuthSession, input: PatientCreateRequest) {
    const payload = patientCreateRequestSchema.parse(input);
    const records = this.getRecordsForSession(session);
    const id = `patient_${payload.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${records.length + 1}`;
    const patient: PatientRecord = {
      id,
      fullName: payload.fullName,
      externalCode: `PAC-${String(records.length + 1).padStart(3, "0")}`,
      email: payload.email || "sem-email@pendente.local",
      phone: payload.phone || "Telefone pendente",
      birthDate: payload.birthDate,
      ageLabel: "Idade a revisar",
      status: payload.sendInviteNow ? "invited" : "active",
      nextSessionLabel: "Sem sessao futura",
      nextSessionAt: null,
      documentsState: payload.sendInviteNow ? "pending" : "ok",
      documentsCountLabel: payload.sendInviteNow ? "Convite pendente" : "OK",
      financialState: "ok",
      financialLabel: "Sem cobranca",
      hasLegalGuardian: false,
      legalGuardianLabel: "Nao se aplica",
      createdAtLabel: "Vinculo criado agora",
      paymentOriginLabel: payload.paymentOrigin === "private" ? "Particular" : "Convenio",
      clinicalReviewLabel: "Sem pendencia",
      overviewBlocks: [
        {
          title: "Resumo do vinculo",
          value: payload.sendInviteNow ? "Paciente convidado(a)" : "Paciente ativo(a)",
          description: "Cadastro inicial criado via drawer rapido da lista."
        },
        {
          title: "Proximo passo",
          value: payload.sendInviteNow ? "Aguardar ativacao do convite" : "Agendar primeira sessao",
          description: "A ficha fica pronta para completar dados e seguir na operacao."
        },
        {
          title: "Financeiro",
          value: payload.paymentOrigin === "private" ? "Particular" : "Convenio",
          description: "Origem de pagamento registrada no cadastro inicial."
        }
      ],
      sessions: [],
      documents: [],
      charges: [],
      activity: [
        {
          id: `activity_${id}`,
          title: "Paciente criada pelo terapeuta",
          occurredAtLabel: "Agora",
          description: payload.sendInviteNow
            ? "Convite inicial disparado junto com o cadastro."
            : "Cadastro criado sem envio imediato de convite."
        }
      ]
    };

    records.push(patient);

    return {
      patientId: patient.id,
      redirectTo: `/app/patients/${patient.id}`
    };
  }

  private getRecordsForSession(session: AuthSession) {
    const key = session.therapist.email;

    if (!this.patientsByEmail.has(key)) {
      this.patientsByEmail.set(
        key,
        basePatients.map((item) => ({
          ...item,
          overviewBlocks: [...item.overviewBlocks],
          sessions: [...item.sessions],
          documents: [...item.documents],
          charges: [...item.charges],
          activity: [...item.activity]
        }))
      );
    }

    return this.patientsByEmail.get(key) ?? [];
  }

  private matchesFilters(item: PatientRecord, filters: PatientListFilters) {
    const query = filters.query.toLowerCase();
    const matchesQuery =
      query.length === 0 ||
      item.fullName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      item.externalCode.toLowerCase().includes(query);

    const matchesStatus = filters.status === "all" || item.status === filters.status;
    const matchesDocuments =
      filters.documents === "all" || item.documentsState === filters.documents;
    const matchesFinancial =
      filters.financial === "all" || item.financialState === filters.financial;
    const matchesUpcoming = !filters.upcomingOnly || item.nextSessionAt !== null;
    const matchesGuardian = !filters.legalGuardianOnly || item.hasLegalGuardian;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesDocuments &&
      matchesFinancial &&
      matchesUpcoming &&
      matchesGuardian
    );
  }

  private toListItem(record: PatientRecord): PatientListItem {
    return {
      id: record.id,
      fullName: record.fullName,
      externalCode: record.externalCode,
      primaryContact: `${record.email} · ${record.phone}`,
      status: record.status,
      nextSessionLabel: record.nextSessionLabel,
      documentsState: record.documentsState,
      documentsCountLabel: record.documentsCountLabel,
      financialState: record.financialState,
      financialLabel: record.financialLabel,
      hasLegalGuardian: record.hasLegalGuardian,
      patientHref: `/app/patients/${record.id}`
    };
  }

  private getPrimaryAction(record: PatientRecord) {
    if (record.status === "invited") {
      return {
        label: "Reenviar convite",
        href: "/app/patients"
      };
    }

    if (record.clinicalReviewLabel !== "Sem pendencia") {
      return {
        label: "Abrir revisao",
        href: "/app/clinical-review"
      };
    }

    if (record.nextSessionAt) {
      return {
        label: "Abrir sessao",
        href: record.sessions[0]?.href ?? "/app/agenda"
      };
    }

    return {
      label: "Agendar sessao",
      href: "/app/agenda"
    };
  }

  private isStatusFilter(
    value: string | undefined
  ): value is PatientListFilters["status"] {
    return ["all", "invited", "active", "inactive", "archived"].includes(value ?? "");
  }

  private isDocumentsFilter(
    value: string | undefined
  ): value is PatientListFilters["documents"] {
    return ["all", "ok", "pending", "critical"].includes(value ?? "");
  }

  private isFinancialFilter(
    value: string | undefined
  ): value is PatientListFilters["financial"] {
    return ["all", "ok", "open", "overdue"].includes(value ?? "");
  }
}
