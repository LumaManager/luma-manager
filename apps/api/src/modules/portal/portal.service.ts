import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import {
  portalInviteAcceptRequestSchema,
  type PortalAppointmentDetail,
  type PortalAppointmentsResponse,
  type PortalBootstrap,
  type PortalCall,
  type PortalDocumentDetail,
  type PortalDocumentsResponse,
  type PortalInvite,
  type PortalInviteAcceptRequest,
  type PortalInviteAcceptResponse,
  type PortalPaymentDetail,
  type PortalPaymentsResponse,
  type PortalProfile
} from "@terapia/contracts";

type PortalAccount = {
  portalToken: string;
  inviteToken: string;
  inviteAccepted: boolean;
  patient: PortalProfile["patient"];
  emergencyContactLabel: string;
  communicationPreferenceLabel: string;
  legalGuardianLabel: string;
  activeConsents: string[];
  careGuidelines: string[];
  nextAppointmentId: string;
};

type PortalDocumentRecord = {
  id: string;
  title: string;
  kindLabel: string;
  statusLabel: string;
  issuedAtLabel: string;
  dueLabel: string;
  canSign: boolean;
  signCtaLabel: string;
  previewSections: PortalDocumentDetail["previewSections"];
  consentItems: PortalDocumentDetail["consentItems"];
  timeline: PortalDocumentDetail["timeline"];
};

type PortalPaymentRecord = {
  id: string;
  title: string;
  statusLabel: string;
  amountLabel: string;
  dueLabel: string;
  methodLabel: string;
  beneficiaryLabel: string;
  referenceLabel: string;
  canPay: boolean;
  timeline: PortalPaymentDetail["timeline"];
};

type PortalAppointmentRecord = {
  id: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
  modalityLabel: string;
  therapistName: string;
  practiceName: string;
  locationLabel: string;
  joinWindowLabel: string;
  notes: string[];
  timeline: PortalAppointmentDetail["timeline"];
};

const account: PortalAccount = {
  portalToken: "portal_maria_001",
  inviteToken: "invite_maria_001",
  inviteAccepted: false,
  patient: {
    id: "portal_patient_maria",
    fullName: "Maria Souza",
    firstName: "Maria",
    email: "maria.souza@email.com",
    phone: "(11) 99871-2204",
    therapistName: "Ana Almeida",
    practiceName: "Instituto Vivace Psicologia"
  },
  emergencyContactLabel: "Paula Souza · irmã · (11) 99721-8804",
  communicationPreferenceLabel: "WhatsApp e e-mail",
  legalGuardianLabel: "Não se aplica",
  activeConsents: [
    "Consentimento de atendimento remoto",
    "Política de privacidade e comunicação",
    "Autorização de lembretes operacionais"
  ],
  careGuidelines: [
    "Entrar com 5 minutos de antecedência quando a sessão for online.",
    "Se houver indisponibilidade técnica, responder pelo mesmo canal do convite.",
    "O portal não exibe prontuário nem conteúdo clínico detalhado."
  ],
  nextAppointmentId: "portal_appt_1032"
};

const documents = new Map<string, PortalDocumentRecord>([
  [
    "portal_doc_201",
    {
      id: "portal_doc_201",
      title: "Termo de consentimento para atendimento remoto",
      kindLabel: "Consentimento obrigatório",
      statusLabel: "Assinatura pendente",
      issuedAtLabel: "Hoje · 09:10",
      dueLabel: "Antes da sessão de amanhã",
      canSign: true,
      signCtaLabel: "Assinar agora",
      previewSections: [
        {
          id: "doc201_1",
          heading: "Objetivo",
          body: "Formalizar o aceite do atendimento remoto e dos canais operacionais usados no portal."
        },
        {
          id: "doc201_2",
          heading: "Limites",
          body: "O produto não retém áudio bruto nem transcript bruto após o processamento aplicável."
        }
      ],
      consentItems: [
        {
          id: "doc201_c1",
          label: "Concordo com o atendimento remoto no web",
          statusLabel: "Pendente"
        },
        {
          id: "doc201_c2",
          label: "Concordo com lembretes operacionais",
          statusLabel: "Pendente"
        }
      ],
      timeline: [
        {
          id: "doc201_t1",
          title: "Documento emitido",
          description: "O termo foi gerado junto com o convite do portal.",
          occurredAtLabel: "Hoje · 09:10"
        }
      ]
    }
  ],
  [
    "portal_doc_202",
    {
      id: "portal_doc_202",
      title: "Política de comunicação e reagendamento",
      kindLabel: "Política operacional",
      statusLabel: "Assinado",
      issuedAtLabel: "Hoje · 09:10",
      dueLabel: "Concluído",
      canSign: false,
      signCtaLabel: "Já assinado",
      previewSections: [
        {
          id: "doc202_1",
          heading: "Comunicação",
          body: "Os lembretes serão enviados por WhatsApp e e-mail de forma objetiva."
        }
      ],
      consentItems: [
        {
          id: "doc202_c1",
          label: "Aceite registrado",
          statusLabel: "Concluído"
        }
      ],
      timeline: [
        {
          id: "doc202_t1",
          title: "Documento assinado",
          description: "Assinatura dummy já registrada para avaliação do portal.",
          occurredAtLabel: "Hoje · 09:14"
        }
      ]
    }
  ]
]);

const payments = new Map<string, PortalPaymentRecord>([
  [
    "portal_charge_401",
    {
      id: "portal_charge_401",
      title: "Sessão individual - 31 Mar 2026",
      statusLabel: "Pagamento pendente",
      amountLabel: "R$ 180,00",
      dueLabel: "Até amanhã · 13:30",
      methodLabel: "PIX / cartão",
      beneficiaryLabel: "Instituto Vivace Psicologia",
      referenceLabel: "Cobrança vinculada à sessão portal_appt_1032",
      canPay: true,
      timeline: [
        {
          id: "charge401_t1",
          title: "Cobrança emitida",
          description: "Pagamento liberado no portal do paciente.",
          occurredAtLabel: "Hoje · 09:18"
        }
      ]
    }
  ],
  [
    "portal_charge_402",
    {
      id: "portal_charge_402",
      title: "Sessão individual - 24 Mar 2026",
      statusLabel: "Pago",
      amountLabel: "R$ 180,00",
      dueLabel: "Quitado",
      methodLabel: "PIX",
      beneficiaryLabel: "Instituto Vivace Psicologia",
      referenceLabel: "Cobrança de sessão anterior",
      canPay: false,
      timeline: [
        {
          id: "charge402_t1",
          title: "Pagamento confirmado",
          description: "Baixa operacional concluída sem pendências.",
          occurredAtLabel: "24 Mar 2026 · 14:02"
        }
      ]
    }
  ]
]);

const appointments = new Map<string, PortalAppointmentRecord>([
  [
    "portal_appt_1032",
    {
      id: "portal_appt_1032",
      statusLabel: "Confirmada",
      dateLabel: "31 Mar 2026",
      timeLabel: "13:30 - 14:20",
      modalityLabel: "Online",
      therapistName: "Ana Almeida",
      practiceName: "Instituto Vivace Psicologia",
      locationLabel: "Sala virtual protegida",
      joinWindowLabel: "Entrada liberada 10 min antes",
      notes: [
        "A entrada da sessão fica disponível no portal web, sem necessidade de app nativo.",
        "Se houver falha técnica, responda ao canal de suporte informado no convite."
      ],
      timeline: [
        {
          id: "appt1032_t1",
          title: "Convite enviado",
          description: "Portal criado para assinatura e preparação pré-sessão.",
          occurredAtLabel: "Hoje · 09:10"
        },
        {
          id: "appt1032_t2",
          title: "Sessão confirmada",
          description: "Horário reservado e aguardando conclusão dos itens operacionais.",
          occurredAtLabel: "Hoje · 09:21"
        }
      ]
    }
  ],
  [
    "portal_appt_1024",
    {
      id: "portal_appt_1024",
      statusLabel: "Realizada",
      dateLabel: "24 Mar 2026",
      timeLabel: "13:30 - 14:20",
      modalityLabel: "Online",
      therapistName: "Ana Almeida",
      practiceName: "Instituto Vivace Psicologia",
      locationLabel: "Sessão concluída",
      joinWindowLabel: "Encerrada",
      notes: [
        "O portal mantém apenas a trilha operacional da sessão.",
        "Nenhum conteúdo clínico detalhado fica exposto ao paciente aqui."
      ],
      timeline: [
        {
          id: "appt1024_t1",
          title: "Sessão encerrada",
          description: "Participação confirmada e cobrança vinculada quitada.",
          occurredAtLabel: "24 Mar 2026 · 14:20"
        }
      ]
    }
  ]
]);

@Injectable()
export class PortalService {
  getInvite(token: string): PortalInvite {
    this.assertInvite(token);

    return {
      inviteToken: account.inviteToken,
      status: account.inviteAccepted ? "accepted" : "pending",
      patientFirstName: account.patient.firstName,
      therapistName: account.patient.therapistName,
      practiceName: account.patient.practiceName,
      appointmentDateLabel: "31 Mar 2026 · 13:30",
      modalityLabel: "Sessão online no web",
      expiresAtLabel: "Expira em 48h",
      checklist: [
        {
          id: "invite_step_1",
          label: "Confirmar seus dados básicos",
          description: "Nome, e-mail e telefone para lembretes operacionais."
        },
        {
          id: "invite_step_2",
          label: "Assinar o consentimento obrigatório",
          description: "Sem prontuário ou diagnóstico aqui, apenas operação e aceite."
        },
        {
          id: "invite_step_3",
          label: "Revisar pagamento e acesso à sessão",
          description: "Tudo pelo portal responsivo, sem app móvel."
        }
      ]
    };
  }

  acceptInvite(token: string, input: PortalInviteAcceptRequest): PortalInviteAcceptResponse {
    this.assertInvite(token);
    const payload = portalInviteAcceptRequestSchema.parse(input);

    account.inviteAccepted = true;
    account.patient.fullName = payload.fullName;
    account.patient.firstName = payload.fullName.split(" ")[0] ?? payload.fullName;
    account.patient.email = payload.email;
    account.patient.phone = payload.phone;

    return {
      portalToken: account.portalToken,
      redirectTo: "/portal"
    };
  }

  getBootstrap(portalToken: string | undefined): PortalBootstrap {
    this.assertPortalSession(portalToken);

    return {
      patient: account.patient,
      supportLabel: "Suporte operacional · WhatsApp do consultório",
      nextAppointmentLabel: "Próxima sessão: 31 Mar 2026 · 13:30",
      navigation: [
        { key: "appointments", label: "Sessões", href: "/portal/appointments" },
        { key: "documents", label: "Documentos", href: "/portal/documents" },
        { key: "payments", label: "Pagamentos", href: "/portal/payments" },
        { key: "profile", label: "Perfil", href: "/portal/profile" }
      ],
      alerts: this.buildAlerts()
    };
  }

  getAppointments(portalToken: string | undefined): PortalAppointmentsResponse {
    this.assertPortalSession(portalToken);

    const items = [...appointments.values()].map((item) => ({
      id: item.id,
      statusLabel: item.statusLabel,
      dateLabel: item.dateLabel,
      timeLabel: item.timeLabel,
      modalityLabel: item.modalityLabel,
      therapistName: item.therapistName,
      locationLabel: item.locationLabel,
      checklistLabel: this.getChecklistLabel(item.id),
      href: `/portal/appointments/${item.id}`,
      callHref: item.statusLabel === "Confirmada" ? `/portal/appointments/${item.id}/call` : null
    }));

    return {
      items,
      nextAppointmentId: account.nextAppointmentId,
      pendingTasks: this.buildPendingTasks()
    };
  }

  getAppointmentDetail(portalToken: string | undefined, appointmentId: string): PortalAppointmentDetail {
    this.assertPortalSession(portalToken);
    const appointment = this.getAppointmentById(appointmentId);

    return {
      id: appointment.id,
      patientName: account.patient.fullName,
      therapistName: appointment.therapistName,
      practiceName: appointment.practiceName,
      statusLabel: appointment.statusLabel,
      dateLabel: appointment.dateLabel,
      timeLabel: appointment.timeLabel,
      modalityLabel: appointment.modalityLabel,
      locationLabel: appointment.locationLabel,
      joinWindowLabel: appointment.joinWindowLabel,
      prepItems: this.buildPrepItems(appointment.id),
      documents: [...documents.values()].map((item) => ({
        id: item.id,
        title: item.title,
        statusLabel: item.statusLabel,
        href: `/portal/documents/${item.id}`
      })),
      payments: [...payments.values()].map((item) => ({
        id: item.id,
        title: item.title,
        statusLabel: item.statusLabel,
        amountLabel: item.amountLabel,
        href: `/portal/payments/${item.id}`
      })),
      notes: appointment.notes,
      primaryCta: {
        label: appointment.statusLabel === "Confirmada" ? "Entrar na sessão" : "Ver sessão",
        href:
          appointment.statusLabel === "Confirmada"
            ? `/portal/appointments/${appointment.id}/call`
            : `/portal/appointments/${appointment.id}`,
        enabled: appointment.statusLabel === "Confirmada"
      },
      timeline: appointment.timeline
    };
  }

  getCall(portalToken: string | undefined, appointmentId: string): PortalCall {
    this.assertPortalSession(portalToken);
    const appointment = this.getAppointmentById(appointmentId);
    const allReady = this.buildPrepItems(appointmentId).every((item) => item.tone === "success");

    return {
      appointmentId,
      patientName: account.patient.firstName,
      therapistName: appointment.therapistName,
      sessionLabel: `${appointment.dateLabel} · ${appointment.timeLabel}`,
      roomLabel: "Sala virtual Vivace",
      status: allReady ? "waiting_room" : "prejoin",
      deviceChecklist: [
        {
          id: "camera",
          label: "Câmera disponível",
          statusLabel: "OK",
          tone: "success"
        },
        {
          id: "microphone",
          label: "Microfone disponível",
          statusLabel: "OK",
          tone: "success"
        },
        {
          id: "network",
          label: "Conexão estável",
          statusLabel: "Revisar antes de entrar",
          tone: "warning"
        }
      ],
      notices: allReady
        ? [
            {
              id: "call_ready",
              title: "Tudo pronto para entrar",
              description: "Sua sessão aparece sem expor dados clínicos no portal.",
              tone: "success"
            }
          ]
        : [
            {
              id: "call_blocked",
              title: "Conclua os itens operacionais antes de entrar",
              description: "Documento pendente ou pagamento em aberto ainda bloqueia a entrada.",
              tone: "warning"
            }
          ]
    };
  }

  getDocuments(portalToken: string | undefined): PortalDocumentsResponse {
    this.assertPortalSession(portalToken);
    const items = [...documents.values()].map((item) => ({
      id: item.id,
      title: item.title,
      kindLabel: item.kindLabel,
      statusLabel: item.statusLabel,
      issuedAtLabel: item.issuedAtLabel,
      dueLabel: item.dueLabel,
      href: `/portal/documents/${item.id}`,
      canSign: item.canSign,
      signCtaLabel: item.signCtaLabel
    }));

    return {
      items,
      summary: {
        pendingCount: items.filter((item) => item.canSign).length,
        signedCount: items.filter((item) => !item.canSign).length
      }
    };
  }

  getDocumentDetail(portalToken: string | undefined, documentId: string): PortalDocumentDetail {
    this.assertPortalSession(portalToken);
    const document = this.getDocumentById(documentId);

    return {
      id: document.id,
      title: document.title,
      kindLabel: document.kindLabel,
      statusLabel: document.statusLabel,
      issuedAtLabel: document.issuedAtLabel,
      dueLabel: document.dueLabel,
      patientName: account.patient.fullName,
      therapistName: account.patient.therapistName,
      previewSections: document.previewSections,
      consentItems: document.consentItems,
      timeline: document.timeline,
      canSign: document.canSign,
      signCtaLabel: document.signCtaLabel
    };
  }

  signDocument(portalToken: string | undefined, documentId: string) {
    this.assertPortalSession(portalToken);
    const document = this.getDocumentById(documentId);

    if (!document.canSign) {
      return {
        success: true,
        redirectTo: `/portal/documents/${documentId}`
      };
    }

    document.canSign = false;
    document.statusLabel = "Assinado";
    document.dueLabel = "Concluído";
    document.signCtaLabel = "Já assinado";
    document.consentItems = document.consentItems.map((item) => ({
      ...item,
      statusLabel: "Concluído"
    }));
    document.timeline = [
      {
        id: `${documentId}_signed`,
        title: "Assinatura registrada",
        description: "O aceite foi salvo no fluxo dummy do portal.",
        occurredAtLabel: "Agora"
      },
      ...document.timeline
    ];

    return {
      success: true,
      redirectTo: `/portal/documents/${documentId}`
    };
  }

  getPayments(portalToken: string | undefined): PortalPaymentsResponse {
    this.assertPortalSession(portalToken);
    const items = [...payments.values()].map((item) => ({
      id: item.id,
      title: item.title,
      statusLabel: item.statusLabel,
      amountLabel: item.amountLabel,
      dueLabel: item.dueLabel,
      methodLabel: item.methodLabel,
      href: `/portal/payments/${item.id}`,
      canPay: item.canPay
    }));

    return {
      items,
      summary: {
        openAmountLabel: "R$ 180,00",
        paidAmountLabel: "R$ 180,00",
        pendingCount: items.filter((item) => item.canPay).length
      }
    };
  }

  getPaymentDetail(portalToken: string | undefined, chargeId: string): PortalPaymentDetail {
    this.assertPortalSession(portalToken);
    const payment = this.getPaymentById(chargeId);

    return {
      id: payment.id,
      title: payment.title,
      statusLabel: payment.statusLabel,
      amountLabel: payment.amountLabel,
      dueLabel: payment.dueLabel,
      methodLabel: payment.methodLabel,
      beneficiaryLabel: payment.beneficiaryLabel,
      referenceLabel: payment.referenceLabel,
      timeline: payment.timeline,
      canPay: payment.canPay
    };
  }

  confirmPayment(portalToken: string | undefined, chargeId: string) {
    this.assertPortalSession(portalToken);
    const payment = this.getPaymentById(chargeId);

    if (!payment.canPay) {
      return {
        success: true,
        redirectTo: `/portal/payments/${chargeId}`
      };
    }

    payment.canPay = false;
    payment.statusLabel = "Pago";
    payment.dueLabel = "Baixa registrada";
    payment.timeline = [
      {
        id: `${chargeId}_paid`,
        title: "Pagamento confirmado",
        description: "Confirmação dummy registrada para avaliação visual.",
        occurredAtLabel: "Agora"
      },
      ...payment.timeline
    ];

    return {
      success: true,
      redirectTo: `/portal/payments/${chargeId}`
    };
  }

  getProfile(portalToken: string | undefined): PortalProfile {
    this.assertPortalSession(portalToken);

    return {
      patient: account.patient,
      emergencyContactLabel: account.emergencyContactLabel,
      communicationPreferenceLabel: account.communicationPreferenceLabel,
      legalGuardianLabel: account.legalGuardianLabel,
      activeConsents: account.activeConsents,
      careGuidelines: account.careGuidelines
    };
  }

  private assertInvite(token: string) {
    if (token !== account.inviteToken) {
      throw new NotFoundException("Convite do portal nao encontrado.");
    }
  }

  private assertPortalSession(portalToken: string | undefined) {
    if (!portalToken || portalToken !== account.portalToken) {
      throw new UnauthorizedException("Sessao do portal invalida ou ausente.");
    }
  }

  private getAppointmentById(appointmentId: string) {
    const appointment = appointments.get(appointmentId);

    if (!appointment) {
      throw new NotFoundException("Sessao do portal nao encontrada.");
    }

    return appointment;
  }

  private getDocumentById(documentId: string) {
    const document = documents.get(documentId);

    if (!document) {
      throw new NotFoundException("Documento do portal nao encontrado.");
    }

    return document;
  }

  private getPaymentById(chargeId: string) {
    const payment = payments.get(chargeId);

    if (!payment) {
      throw new NotFoundException("Pagamento do portal nao encontrado.");
    }

    return payment;
  }

  private buildAlerts(): PortalBootstrap["alerts"] {
    const alerts: PortalBootstrap["alerts"] = [];

    if ([...documents.values()].some((item) => item.canSign)) {
      alerts.push({
        id: "portal_docs_pending",
        tone: "warning",
        title: "Você ainda tem um documento obrigatório para assinar",
        description: "Esse aceite libera a entrada da próxima sessão online.",
        ctaLabel: "Assinar documento",
        href: "/portal/documents/portal_doc_201"
      });
    }

    if ([...payments.values()].some((item) => item.canPay)) {
      alerts.push({
        id: "portal_payment_pending",
        tone: "info",
        title: "Há uma cobrança aberta vinculada à próxima sessão",
        description: "O portal mantém o pagamento claro e separado do conteúdo clínico.",
        ctaLabel: "Revisar pagamento",
        href: "/portal/payments/portal_charge_401"
      });
    }

    alerts.push({
      id: "portal_next_session",
      tone: "success",
      title: "Sua próxima sessão já está no portal",
      description: "Tudo o que você precisa para entrar está reunido em uma única área.",
      ctaLabel: "Abrir sessão",
      href: "/portal/appointments/portal_appt_1032"
    });

    return alerts;
  }

  private buildPendingTasks(): PortalAppointmentsResponse["pendingTasks"] {
    const tasks: PortalAppointmentsResponse["pendingTasks"] = [];

    if ([...documents.values()].some((item) => item.canSign)) {
      tasks.push({
        id: "task_doc_sign",
        title: "Assinar consentimento remoto",
        description: "Documento obrigatório antes da próxima sessão.",
        href: "/portal/documents/portal_doc_201",
        ctaLabel: "Assinar"
      });
    }

    if ([...payments.values()].some((item) => item.canPay)) {
      tasks.push({
        id: "task_payment",
        title: "Revisar cobrança da próxima sessão",
        description: "Pagamento centralizado no portal e vinculado ao atendimento.",
        href: "/portal/payments/portal_charge_401",
        ctaLabel: "Revisar"
      });
    }

    return tasks;
  }

  private buildPrepItems(appointmentId: string): PortalAppointmentDetail["prepItems"] {
    const documentReady = ![...documents.values()].some((item) => item.canSign);
    const paymentReady = ![...payments.values()].some(
      (item) => item.canPay && item.id === "portal_charge_401"
    );

    return [
      {
        id: `${appointmentId}_prep_1`,
        label: "Documento obrigatório",
        statusLabel: documentReady ? "Concluído" : "Pendente",
        tone: documentReady ? "success" : "warning"
      },
      {
        id: `${appointmentId}_prep_2`,
        label: "Pagamento da sessão",
        statusLabel: paymentReady ? "Regularizado" : "Em aberto",
        tone: paymentReady ? "success" : "warning"
      },
      {
        id: `${appointmentId}_prep_3`,
        label: "Acesso ao navegador",
        statusLabel: "Pronto no web",
        tone: "success"
      }
    ];
  }

  private getChecklistLabel(appointmentId: string) {
    const pendingCount = this.buildPrepItems(appointmentId).filter(
      (item) => item.tone !== "success"
    ).length;
    return pendingCount === 0
      ? "Pronto para entrar"
      : `${pendingCount} pendência(s) antes da sessão`;
  }
}
