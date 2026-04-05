import { z } from "zod";

export const therapistAccountStatusSchema = z.enum([
  "draft",
  "pending_setup",
  "ready_for_operations",
  "restricted"
]);

export const alertToneSchema = z.enum(["critical", "warning", "info", "success"]);

export const navKeySchema = z.enum([
  "dashboard",
  "patients",
  "agenda",
  "clinicalReview",
  "finance",
  "documents",
  "settings"
]);

export const accountCapabilitiesSchema = z.object({
  audioTranscription: z.boolean(),
  brazilOnlyProcessing: z.boolean(),
  patientPortalPayments: z.boolean(),
  stepUpAuthentication: z.boolean()
});

export const therapistProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  crp: z.string(),
  practiceName: z.string(),
  roleLabel: z.string(),
  timezone: z.string()
});

export const globalAlertSchema = z.object({
  id: z.string(),
  tone: alertToneSchema,
  title: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
  href: z.string()
});

export const navigationBadgeSchema = z
  .object({
    dashboard: z.number().int().nonnegative().optional(),
    patients: z.number().int().nonnegative().optional(),
    agenda: z.number().int().nonnegative().optional(),
    clinicalReview: z.number().int().nonnegative().optional(),
    finance: z.number().int().nonnegative().optional(),
    documents: z.number().int().nonnegative().optional(),
    settings: z.number().int().nonnegative().optional()
  })
  .partial();

export const featureFlagsSchema = z.object({
  voiceModeAvailable: z.boolean(),
  mfaEnforced: z.boolean(),
  patientPortalEnabled: z.boolean(),
  analyticsEnabled: z.boolean()
});

export const appShellBootstrapSchema = z.object({
  tenant: z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
    status: therapistAccountStatusSchema
  }),
  therapistProfile: therapistProfileSchema,
  timezone: z.string(),
  globalAlerts: z.array(globalAlertSchema),
  navigationBadges: navigationBadgeSchema,
  featureFlags: featureFlagsSchema,
  capabilities: accountCapabilitiesSchema,
  accountStateLabel: z.string()
});

export const authLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authLoginResponseSchema = z.object({
  challengeId: z.string(),
  requiresMfa: z.literal(true),
  mfaMethod: z.literal("totp"),
  expiresInSeconds: z.number().int().positive(),
  hint: z.string()
});

export const authMfaVerifyRequestSchema = z.object({
  challengeId: z.string(),
  code: z.string().min(6).max(8)
});

export const authSessionSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
  mfaVerified: z.boolean(),
  therapist: therapistProfileSchema,
  accountStatus: therapistAccountStatusSchema,
  capabilities: accountCapabilitiesSchema
});

export const waitlistProfessionalRoleSchema = z.enum([
  "therapist",
  "psychiatrist",
  "clinic_owner",
  "operations",
  "other"
]);

export const waitlistMonthlySessionsRangeSchema = z.enum([
  "up_to_20",
  "21_to_60",
  "61_to_120",
  "121_plus"
]);

export const waitlistBiggestPainSchema = z.enum([
  "post_session_overload",
  "scattered_workflow",
  "documents_and_consents",
  "financial_follow_up",
  "switching_between_tools"
]);

export const waitlistJoinRequestSchema = z.object({
  fullName: z.string().min(2).max(120).optional().or(z.literal("")),
  email: z.string().email(),
  whatsapp: z.string().max(32).optional().or(z.literal("")),
  professionalRole: waitlistProfessionalRoleSchema,
  monthlySessionsRange: waitlistMonthlySessionsRangeSchema.optional(),
  biggestPain: waitlistBiggestPainSchema.optional(),
  sourcePath: z.string().max(120).optional(),
  referrerHost: z.string().max(120).optional().or(z.literal("")),
  utmSource: z.string().max(80).optional().or(z.literal("")),
  utmMedium: z.string().max(80).optional().or(z.literal("")),
  utmCampaign: z.string().max(80).optional().or(z.literal("")),
  utmContent: z.string().max(120).optional().or(z.literal("")),
  utmTerm: z.string().max(120).optional().or(z.literal(""))
});

export const waitlistSummarySchema = z.object({
  totalEntries: z.number().int().nonnegative(),
  therapistEntries: z.number().int().nonnegative(),
  clinicEntries: z.number().int().nonnegative(),
  topPainLabel: z.string(),
  updatedAtLabel: z.string()
});

export const waitlistJoinResponseSchema = z.object({
  success: z.literal(true),
  alreadyJoined: z.boolean(),
  message: z.string(),
  summary: waitlistSummarySchema
});

export const internalWaitlistEntrySchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  roleLabel: z.string(),
  contextStatusLabel: z.string(),
  monthlySessionsLabel: z.string(),
  biggestPainLabel: z.string(),
  sourceLabel: z.string(),
  sourcePath: z.string(),
  utmLabel: z.string(),
  referrerLabel: z.string(),
  contactLabel: z.string(),
  createdAtLabel: z.string(),
  updatedAtLabel: z.string()
});

export const internalWaitlistResponseSchema = z.object({
  summary: z.object({
    totalEntries: z.number().int().nonnegative(),
    enrichedEntries: z.number().int().nonnegative(),
    campaignEntries: z.number().int().nonnegative(),
    directEntries: z.number().int().nonnegative(),
    topPainLabel: z.string(),
    topSourceLabel: z.string(),
    updatedAtLabel: z.string()
  }),
  items: z.array(internalWaitlistEntrySchema)
});

export const onboardingStepKeySchema = z.enum([
  "welcome",
  "profile",
  "operations",
  "tax",
  "contracts",
  "schedule",
  "consents"
]);

export const onboardingStepStatusSchema = z.enum(["pending", "current", "completed"]);

export const onboardingStepSchema = z.object({
  key: onboardingStepKeySchema,
  title: z.string(),
  description: z.string(),
  status: onboardingStepStatusSchema
});

export const onboardingChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  completed: z.boolean(),
  blocking: z.boolean()
});

export const onboardingConsentTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  required: z.boolean()
});

export const onboardingProfileDraftSchema = z.object({
  fullName: z.string(),
  socialName: z.string(),
  crp: z.string(),
  crpState: z.string(),
  cpf: z.string(),
  birthDate: z.string(),
  phone: z.string(),
  professionalEmail: z.string().email(),
  specialty: z.string(),
  miniBio: z.string()
});

export const onboardingOperationsDraftSchema = z.object({
  practiceName: z.string(),
  practicePhone: z.string(),
  timezone: z.string(),
  pixKey: z.string(),
  beneficiaryName: z.string(),
  paymentInstructions: z.string()
});

export const onboardingTaxDraftSchema = z.object({
  regime: z.string(),
  billingDocument: z.string(),
  city: z.string(),
  emissionType: z.string(),
  municipalRegistration: z.string(),
  accountantName: z.string()
});

export const onboardingContractsDraftSchema = z.object({
  termsAccepted: z.boolean(),
  dpaAccepted: z.boolean(),
  privacyAccepted: z.boolean(),
  contractVersion: z.string()
});

export const onboardingScheduleDraftSchema = z.object({
  weekdays: z.array(z.string()),
  startHour: z.string(),
  endHour: z.string(),
  sessionDurationMinutes: z.number().int().positive(),
  gapMinutes: z.number().int().nonnegative(),
  defaultModality: z.string()
});

export const onboardingConsentsDraftSchema = z.object({
  lgpdTemplateId: z.string(),
  telehealthTemplateId: z.string(),
  aiTemplateId: z.string(),
  defaultCollectionPolicy: z.string()
});

export const therapistOnboardingDraftSchema = z.object({
  welcomeAcknowledged: z.boolean(),
  profile: onboardingProfileDraftSchema,
  operations: onboardingOperationsDraftSchema,
  tax: onboardingTaxDraftSchema,
  contracts: onboardingContractsDraftSchema,
  schedule: onboardingScheduleDraftSchema,
  consents: onboardingConsentsDraftSchema
});

export const therapistOnboardingBootstrapSchema = z.object({
  accountStatus: therapistAccountStatusSchema,
  currentStep: onboardingStepKeySchema,
  steps: z.array(onboardingStepSchema),
  blockingItems: z.array(onboardingChecklistItemSchema),
  consentTemplates: z.array(onboardingConsentTemplateSchema),
  estimatedMinutesLabel: z.string(),
  modeLabel: z.string(),
  draft: therapistOnboardingDraftSchema
});

export const onboardingStartResponseSchema = z.object({
  onboarding: therapistOnboardingBootstrapSchema
});

export const onboardingWelcomePayloadSchema = z.object({
  welcomeAcknowledged: z.boolean()
});

export const onboardingProfilePayloadSchema = onboardingProfileDraftSchema;
export const onboardingOperationsPayloadSchema = onboardingOperationsDraftSchema;
export const onboardingTaxPayloadSchema = onboardingTaxDraftSchema;
export const onboardingContractsPayloadSchema = onboardingContractsDraftSchema;
export const onboardingSchedulePayloadSchema = onboardingScheduleDraftSchema;
export const onboardingConsentsPayloadSchema = onboardingConsentsDraftSchema;

export const onboardingCompleteStepRequestSchema = z.discriminatedUnion("step", [
  z.object({
    step: z.literal("welcome"),
    payload: onboardingWelcomePayloadSchema
  }),
  z.object({
    step: z.literal("profile"),
    payload: onboardingProfilePayloadSchema
  }),
  z.object({
    step: z.literal("operations"),
    payload: onboardingOperationsPayloadSchema
  }),
  z.object({
    step: z.literal("tax"),
    payload: onboardingTaxPayloadSchema
  }),
  z.object({
    step: z.literal("contracts"),
    payload: onboardingContractsPayloadSchema
  }),
  z.object({
    step: z.literal("schedule"),
    payload: onboardingSchedulePayloadSchema
  }),
  z.object({
    step: z.literal("consents"),
    payload: onboardingConsentsPayloadSchema
  })
]);

export const onboardingCompleteStepResponseSchema = z.object({
  onboarding: therapistOnboardingBootstrapSchema,
  accountStatus: therapistAccountStatusSchema
});

export const quickActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  href: z.string(),
  icon: z.enum(["user-plus", "calendar-plus", "calendar", "clipboard-list", "wallet"]),
  emphasis: z.enum(["primary", "secondary"])
});

export const appointmentStatusSchema = z.enum([
  "confirmed",
  "waiting_room",
  "in_progress",
  "documentation_due",
  "cancelled"
]);

export const appointmentSummarySchema = z.object({
  id: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: appointmentStatusSchema,
  locationLabel: z.string(),
  paymentLabel: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string()
});

export const appointmentCalendarStatusSchema = z.enum([
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show"
]);

export const appointmentModalitySchema = z.enum([
  "telehealth",
  "in_person"
]);

export const calendarViewSchema = z.enum(["day", "week", "month"]);

export const scheduleBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["appointment", "availability", "block"]),
  title: z.string(),
  subtitle: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  dayKey: z.string(),
  tone: alertToneSchema,
  href: z.string().optional()
});

export const agendaDayColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  dateLabel: z.string(),
  isToday: z.boolean()
});

export const agendaAvailabilityWindowSchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string()
});

export const agendaAvailabilityRuleSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  weekdayLabel: z.string(),
  enabled: z.boolean(),
  windows: z.array(agendaAvailabilityWindowSchema)
});

export const agendaResponseSchema = z.object({
  accountStatus: therapistAccountStatusSchema,
  currentView: calendarViewSchema,
  visibleRangeLabel: z.string(),
  dayColumns: z.array(agendaDayColumnSchema),
  timeSlots: z.array(z.string()),
  availabilityRules: z.array(agendaAvailabilityRuleSchema),
  filters: z.object({
    status: z.enum(["all", "scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]),
    modality: z.enum(["all", "telehealth", "in_person"])
  }),
  quickActions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      href: z.string()
    })
  ),
  scheduleBlocks: z.array(scheduleBlockSchema)
});

export const appointmentCreateRequestSchema = z.object({
  patientId: z.string().min(1),
  date: z.string().min(8),
  startTime: z.string().min(4),
  durationMinutes: z.number().int().positive(),
  modality: appointmentModalitySchema,
  note: z.string()
});

export const appointmentRescheduleRequestSchema = z.object({
  date: z.string().min(8),
  startTime: z.string().min(4),
  durationMinutes: z.number().int().positive(),
  modality: appointmentModalitySchema,
  note: z.string()
});

export const appointmentCancelRequestSchema = z.object({
  reason: z.string().min(3).max(280)
});

export const scheduleBlockCreateRequestSchema = z.object({
  date: z.string().min(8),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
  title: z.string().min(3).max(48),
  subtitle: z.string().min(3).max(96),
  tone: alertToneSchema
});

export const scheduleBlockUpdateRequestSchema = scheduleBlockCreateRequestSchema;

export const agendaAvailabilityUpdateRequestSchema = z.object({
  rules: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      enabled: z.boolean(),
      windows: z.array(
        z.object({
          startTime: z.string().min(4),
          endTime: z.string().min(4)
        })
      )
    })
  )
});

export const appointmentCreateResponseSchema = z.object({
  id: z.string(),
  href: z.string()
});

export const scheduleBlockCreateResponseSchema = z.object({
  id: z.string()
});

export const appointmentDetailSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  dateKey: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  dateLabel: z.string(),
  timeRangeLabel: z.string(),
  durationLabel: z.string(),
  modality: appointmentModalitySchema,
  modalityLabel: z.string(),
  status: appointmentCalendarStatusSchema,
  statusLabel: z.string(),
  roomStatusLabel: z.string(),
  roomState: z.enum(["not_provisioned", "ready", "open", "closed", "failed"]),
  canReschedule: z.boolean(),
  canCancel: z.boolean(),
  primaryAction: z.object({
    label: z.string(),
    href: z.string(),
    disabledReason: z.string()
  }),
  sessionData: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  patientSummary: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  consentStates: z.array(
    z.object({
      label: z.string(),
      state: z.enum(["ok", "pending", "critical"]),
      description: z.string()
    })
  ),
  paymentSummary: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  readinessChecklist: z.array(
    z.object({
      label: z.string(),
      state: z.enum(["ok", "attention", "blocked"]),
      description: z.string()
    })
  ),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      occurredAtLabel: z.string(),
      description: z.string()
    })
  )
});

export const callExperienceStateSchema = z.enum([
  "unavailable",
  "prejoin",
  "waiting_patient",
  "waiting_therapist",
  "live",
  "reconnecting",
  "ending",
  "ended",
  "failed"
]);

export const callParticipantPresenceSchema = z.enum([
  "absent",
  "waiting_room",
  "joined",
  "left"
]);

export const devicePermissionStateSchema = z.enum(["granted", "prompt", "denied"]);

export const transcriptOperationalStateSchema = z.enum([
  "active",
  "disabled_by_consent",
  "disabled_by_policy",
  "temporarily_unavailable"
]);

export const callConnectionStateSchema = z.enum([
  "ready",
  "waiting_remote",
  "stable",
  "reconnecting",
  "failed"
]);

export const appointmentCallSchema = z.object({
  appointment: z.object({
    id: z.string(),
    patientName: z.string(),
    dateLabel: z.string(),
    timeRangeLabel: z.string(),
    durationLabel: z.string(),
    detailHref: z.string()
  }),
  experienceState: callExperienceStateSchema,
  experienceLabel: z.string(),
  roomSummary: z.object({
    state: z.enum(["not_provisioned", "ready", "open", "closed", "failed"]),
    label: z.string(),
    providerLabel: z.string(),
    joinUrlLabel: z.string()
  }),
  joinWindow: z.object({
    therapistOpensAtLabel: z.string(),
    patientOpensAtLabel: z.string(),
    scheduledStartLabel: z.string(),
    scheduledEndLabel: z.string(),
    canJoinNow: z.boolean(),
    blockedReason: z.string()
  }),
  readiness: z.object({
    outcome: z.enum(["ready", "attention", "blocked"]),
    items: z.array(
      z.object({
        label: z.string(),
        state: z.enum(["ok", "attention", "blocked"]),
        description: z.string()
      })
    )
  }),
  transcript: z.object({
    state: transcriptOperationalStateSchema,
    label: z.string(),
    description: z.string()
  }),
  devices: z.object({
    cameraPermission: devicePermissionStateSchema,
    microphonePermission: devicePermissionStateSchema,
    availableCameras: z.array(z.string()),
    availableMicrophones: z.array(z.string()),
    previewAvailable: z.boolean(),
    microphoneLevel: z.number().int().min(0).max(100)
  }),
  callPermissions: z.object({
    canProvisionRoom: z.boolean(),
    canCheckIn: z.boolean(),
    canEndSession: z.boolean()
  }),
  connection: z.object({
    state: callConnectionStateSchema,
    label: z.string(),
    description: z.string()
  }),
  participants: z.object({
    therapistJoined: z.boolean(),
    patientPresence: callParticipantPresenceSchema,
    patientLabel: z.string()
  }),
  sidePanel: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  notices: z.array(
    z.object({
      id: z.string(),
      tone: alertToneSchema,
      title: z.string(),
      description: z.string()
    })
  )
});

export const clinicalTranscriptStatusSchema = z.enum([
  "not_started",
  "processing",
  "ready",
  "failed",
  "disabled"
]);

export const clinicalDraftStatusSchema = z.enum([
  "not_started",
  "waiting_transcript",
  "generating",
  "ready",
  "failed",
  "disabled"
]);

export const clinicalReviewStateSchema = z.enum([
  "processing",
  "ready_for_review",
  "in_review",
  "blocked",
  "approved",
  "discarded"
]);

export const clinicalSlaStateSchema = z.enum(["within_sla", "attention", "overdue"]);

export const clinicalReviewQueueItemSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  sessionLabel: z.string(),
  modalityLabel: z.string(),
  transcriptStatus: clinicalTranscriptStatusSchema,
  draftStatus: clinicalDraftStatusSchema,
  reviewState: clinicalReviewStateSchema,
  slaState: clinicalSlaStateSchema,
  slaLabel: z.string(),
  endedAtLabel: z.string(),
  openHref: z.string()
});

export const clinicalReviewQueueFiltersSchema = z.object({
  search: z.string(),
  reviewState: z.enum([
    "all",
    "processing",
    "ready_for_review",
    "in_review",
    "blocked"
  ]),
  transcriptStatus: z.enum([
    "all",
    "not_started",
    "processing",
    "ready",
    "failed",
    "disabled"
  ]),
  draftStatus: z.enum([
    "all",
    "not_started",
    "waiting_transcript",
    "generating",
    "ready",
    "failed",
    "disabled"
  ]),
  slaState: z.enum(["all", "within_sla", "attention", "overdue"]),
  failuresOnly: z.boolean(),
  thisWeekOnly: z.boolean(),
  transcriptDisabledOnly: z.boolean()
});

export const clinicalReviewQueueResponseSchema = z.object({
  items: z.array(clinicalReviewQueueItemSchema),
  total: z.number().int().nonnegative(),
  filters: clinicalReviewQueueFiltersSchema,
  nextItemHref: z.string(),
  availablePageSizes: z.array(z.number().int().positive())
});

export const clinicalDraftContentSchema = z.object({
  summary: z.string(),
  topics: z.string(),
  continuity: z.string(),
  pending: z.string()
});

export const clinicalTranscriptBlockSchema = z.object({
  id: z.string(),
  timestampLabel: z.string(),
  speakerLabel: z.string(),
  text: z.string()
});

export const clinicalVersionSchema = z.object({
  id: z.string(),
  label: z.string(),
  statusLabel: z.string(),
  authorLabel: z.string(),
  createdAtLabel: z.string()
});

export const clinicalReviewDetailSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  sessionLabel: z.string(),
  transcriptStatus: clinicalTranscriptStatusSchema,
  draftStatus: clinicalDraftStatusSchema,
  reviewState: clinicalReviewStateSchema,
  transcriptStatusLabel: z.string(),
  draftStatusLabel: z.string(),
  reviewStateLabel: z.string(),
  transcriptBlocks: z.array(clinicalTranscriptBlockSchema),
  draftContent: clinicalDraftContentSchema,
  versionHistory: z.array(clinicalVersionSchema),
  latestApprovedRecordMeta: z.string(),
  pipelineHighlights: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  primaryActions: z.object({
    saveDraftEnabled: z.boolean(),
    approveEnabled: z.boolean(),
    discardEnabled: z.boolean()
  })
});

export const clinicalReviewDraftUpdateRequestSchema = z.object({
  summary: z.string(),
  topics: z.string(),
  continuity: z.string(),
  pending: z.string()
});

export const clinicalRecordVersionSchema = z.object({
  id: z.string(),
  label: z.string(),
  approvedAtLabel: z.string(),
  approvedByLabel: z.string()
});

export const clinicalRecordTimelineItemSchema = z.object({
  id: z.string(),
  sessionLabel: z.string(),
  approvalLabel: z.string(),
  approvedByLabel: z.string(),
  reviewHref: z.string(),
  isLatest: z.boolean()
});

export const clinicalRecordEntrySchema = z.object({
  id: z.string(),
  sessionLabel: z.string(),
  approvedAtLabel: z.string(),
  approvedByLabel: z.string(),
  currentVersionLabel: z.string(),
  content: clinicalDraftContentSchema,
  versions: z.array(clinicalRecordVersionSchema)
});

export const patientClinicalRecordSchema = z.object({
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  totalApprovedRecords: z.number().int().nonnegative(),
  latestApprovedRecordMeta: z.string(),
  pendingReviewMeta: z.object({
    exists: z.boolean(),
    label: z.string(),
    href: z.string()
  }),
  entries: z.array(clinicalRecordEntrySchema),
  timeline: z.array(clinicalRecordTimelineItemSchema),
  selectedEntry: clinicalRecordEntrySchema
});

export const clinicalReviewSummarySchema = z.object({
  totalPending: z.number().int().nonnegative(),
  overdueCount: z.number().int().nonnegative(),
  oldestPendingLabel: z.string(),
  nextItemHref: z.string(),
  queueHref: z.string()
});

export const documentSummarySchema = z.object({
  totalPending: z.number().int().nonnegative(),
  criticalCount: z.number().int().nonnegative(),
  affectedPatientsLabel: z.string(),
  documentsHref: z.string()
});

export const financialSummarySchema = z.object({
  openAmountLabel: z.string(),
  openCharges: z.number().int().nonnegative(),
  overdueCharges: z.number().int().nonnegative(),
  financeHref: z.string(),
  overdueHref: z.string()
});

export const patientSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  nextSessionLabel: z.string(),
  statusLabel: z.string(),
  tag: z.string(),
  patientHref: z.string(),
  clinicalRecordHref: z.string()
});

export const patientOperationalStatusSchema = z.enum([
  "invited",
  "active",
  "inactive",
  "archived"
]);

export const patientDocumentsStateSchema = z.enum(["ok", "pending", "critical"]);
export const patientFinancialStateSchema = z.enum(["ok", "open", "overdue"]);

export const patientListItemSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  externalCode: z.string(),
  primaryContact: z.string(),
  status: patientOperationalStatusSchema,
  nextSessionLabel: z.string(),
  documentsState: patientDocumentsStateSchema,
  documentsCountLabel: z.string(),
  financialState: patientFinancialStateSchema,
  financialLabel: z.string(),
  hasLegalGuardian: z.boolean(),
  patientHref: z.string()
});

export const patientListFiltersSchema = z.object({
  query: z.string(),
  status: z.enum(["all", "invited", "active", "inactive", "archived"]),
  documents: z.enum(["all", "ok", "pending", "critical"]),
  financial: z.enum(["all", "ok", "open", "overdue"]),
  upcomingOnly: z.boolean(),
  legalGuardianOnly: z.boolean()
});

export const patientListResponseSchema = z.object({
  items: z.array(patientListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  filters: patientListFiltersSchema,
  availablePageSizes: z.array(z.number().int().positive())
});

export const patientCreateRequestSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  birthDate: z.string().min(8),
  paymentOrigin: z.enum(["private", "insurance"]),
  sendInviteNow: z.boolean()
});

export const patientOverviewBlockSchema = z.object({
  title: z.string(),
  value: z.string(),
  description: z.string()
});

export const patientSessionItemSchema = z.object({
  id: z.string(),
  dateLabel: z.string(),
  statusLabel: z.string(),
  modalityLabel: z.string(),
  paymentLabel: z.string(),
  href: z.string()
});

export const patientDocumentItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  statusLabel: z.string(),
  updatedAtLabel: z.string()
});

export const patientChargeItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  statusLabel: z.string(),
  amountLabel: z.string()
});

export const patientActivityItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  occurredAtLabel: z.string(),
  description: z.string()
});

export const patientDetailSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  status: patientOperationalStatusSchema,
  ageLabel: z.string(),
  primaryContact: z.string(),
  legalGuardianLabel: z.string(),
  nextSessionLabel: z.string(),
  documentsState: patientDocumentsStateSchema,
  financialState: patientFinancialStateSchema,
  clinicalReviewLabel: z.string(),
  createdAtLabel: z.string(),
  paymentOriginLabel: z.string(),
  primaryAction: z.object({
    label: z.string(),
    href: z.string()
  }),
  topActions: z.object({
    scheduleHref: z.string(),
    clinicalRecordHref: z.string()
  }),
  overviewBlocks: z.array(patientOverviewBlockSchema),
  sessions: z.array(patientSessionItemSchema),
  documents: z.array(patientDocumentItemSchema),
  charges: z.array(patientChargeItemSchema),
  activity: z.array(patientActivityItemSchema)
});

export const documentTypeSchema = z.enum([
  "lgpd",
  "telehealth",
  "transcript_ai",
  "therapy_contract",
  "operational"
]);

export const documentSignatureStatusSchema = z.enum([
  "not_sent",
  "pending",
  "signed",
  "expired",
  "revoked"
]);

export const documentConsentStatusSchema = z.enum([
  "valid",
  "pending",
  "revoked",
  "not_applicable"
]);

export const documentCriticalitySchema = z.enum(["normal", "attention", "critical"]);
export const documentDeliveryChannelSchema = z.enum(["email"]);

export const documentSummaryMetricsSchema = z.object({
  criticalCount: z.number().int().nonnegative(),
  pendingSignatureCount: z.number().int().nonnegative(),
  revokedCount: z.number().int().nonnegative(),
  affectedPatientsLabel: z.string()
});

export const documentPatientOptionSchema = z.object({
  value: z.string(),
  label: z.string()
});

export const documentTemplateOptionSchema = z.object({
  documentType: documentTypeSchema,
  label: z.string(),
  description: z.string(),
  defaultVersion: z.string(),
  versionOptions: z.array(z.string())
});

export const documentsListFiltersSchema = z.object({
  search: z.string(),
  patientId: z.string(),
  documentType: z.enum(["all", "lgpd", "telehealth", "transcript_ai", "therapy_contract", "operational"]),
  signatureStatus: z.enum(["all", "not_sent", "pending", "signed", "expired", "revoked"]),
  consentStatus: z.enum(["all", "valid", "pending", "revoked", "not_applicable"]),
  criticality: z.enum(["all", "normal", "attention", "critical"]),
  onlyCritical: z.boolean(),
  thisWeekOnly: z.boolean(),
  onlyRevoked: z.boolean()
});

export const documentListItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  documentType: documentTypeSchema,
  documentTitle: z.string(),
  templateVersion: z.string(),
  generatedAtLabel: z.string(),
  signatureStatus: documentSignatureStatusSchema,
  signatureStatusLabel: z.string(),
  consentStatus: documentConsentStatusSchema,
  consentStatusLabel: z.string(),
  lastEventAtLabel: z.string(),
  lastEventLabel: z.string(),
  criticality: documentCriticalitySchema,
  criticalityLabel: z.string(),
  criticalReason: z.string(),
  signedByLabel: z.string(),
  blockedFlowLabels: z.array(z.string()),
  canResend: z.boolean(),
  canGenerateNewVersion: z.boolean(),
  openHref: z.string()
});

export const documentsListResponseSchema = z.object({
  summary: documentSummaryMetricsSchema,
  items: z.array(documentListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  filters: documentsListFiltersSchema,
  availablePageSizes: z.array(z.number().int().positive()),
  patientOptions: z.array(documentPatientOptionSchema),
  templateOptions: z.array(documentTemplateOptionSchema)
});

export const documentPreviewSectionSchema = z.object({
  title: z.string(),
  body: z.string()
});

export const documentOperationalImpactSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tone: z.enum(["critical", "warning", "info", "success", "neutral"])
});

export const documentTimelineEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  occurredAtLabel: z.string(),
  actorLabel: z.string()
});

export const documentCreateRequestSchema = z.object({
  patientId: z.string().min(1),
  documentType: documentTypeSchema,
  templateVersion: z.string().min(1),
  deliveryChannel: documentDeliveryChannelSchema
});

export const documentCreateResponseSchema = z.object({
  documentId: z.string(),
  redirectTo: z.string()
});

export const documentDetailSchema = z.object({
  id: z.string(),
  code: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  patientContactLabel: z.string(),
  documentType: documentTypeSchema,
  documentTitle: z.string(),
  templateVersion: z.string(),
  generatedAtLabel: z.string(),
  lastSentAtLabel: z.string(),
  lastEventAtLabel: z.string(),
  lastEventLabel: z.string(),
  sessionContextLabel: z.string(),
  deliveryChannelLabel: z.string(),
  fileReferenceLabel: z.string(),
  signatureStatus: documentSignatureStatusSchema,
  signatureStatusLabel: z.string(),
  consentStatus: documentConsentStatusSchema,
  consentStatusLabel: z.string(),
  criticality: documentCriticalitySchema,
  criticalityLabel: z.string(),
  criticalReason: z.string(),
  signedByLabel: z.string(),
  legalRepresentativeLabel: z.string(),
  blockedFlowLabels: z.array(z.string()),
  previewSections: z.array(documentPreviewSectionSchema),
  operationalImpacts: z.array(documentOperationalImpactSchema),
  timeline: z.array(documentTimelineEventSchema),
  primaryActions: z.object({
    canResend: z.boolean(),
    canRevoke: z.boolean(),
    canGenerateNewVersion: z.boolean()
  }),
  nextGenerationDefaults: documentCreateRequestSchema
});

export const financeChargeStatusSchema = z.enum(["pending", "paid", "overdue", "canceled"]);
export const financeOriginTypeSchema = z.enum(["private", "insurance"]);
export const financePeriodSchema = z.enum(["all", "current_month", "next_30_days", "last_30_days"]);

export const financeSummarySchema = z.object({
  periodLabel: z.string(),
  totalChargedLabel: z.string(),
  totalReceivedLabel: z.string(),
  totalOpenLabel: z.string(),
  totalOverdueLabel: z.string(),
  totalChargedCents: z.number().int().nonnegative(),
  totalReceivedCents: z.number().int().nonnegative(),
  totalOpenCents: z.number().int().nonnegative(),
  totalOverdueCents: z.number().int().nonnegative()
});

export const financePatientOptionSchema = z.object({
  value: z.string(),
  label: z.string()
});

export const financeAppointmentOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  patientId: z.string()
});

export const financeListFiltersSchema = z.object({
  search: z.string(),
  status: z.enum(["all", "pending", "paid", "overdue", "canceled"]),
  originType: z.enum(["all", "private", "insurance"]),
  period: financePeriodSchema,
  overdueOnly: z.boolean(),
  withoutAppointmentOnly: z.boolean()
});

export const financeChargeListItemSchema = z.object({
  chargeId: z.string(),
  code: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  appointmentId: z.string(),
  appointmentLabel: z.string(),
  appointmentHref: z.string(),
  originType: financeOriginTypeSchema,
  originLabel: z.string(),
  amountLabel: z.string(),
  amountCents: z.number().int().nonnegative(),
  dueAtLabel: z.string(),
  status: financeChargeStatusSchema,
  statusLabel: z.string(),
  lastEventAtLabel: z.string(),
  lastEventLabel: z.string(),
  canRegisterPayment: z.boolean(),
  canCancel: z.boolean(),
  chargeHref: z.string()
});

export const financeListResponseSchema = z.object({
  summary: financeSummarySchema,
  items: z.array(financeChargeListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  filters: financeListFiltersSchema,
  availablePageSizes: z.array(z.number().int().positive()),
  patientOptions: z.array(financePatientOptionSchema),
  appointmentOptions: z.array(financeAppointmentOptionSchema)
});

export const chargeCreateRequestSchema = z.object({
  patientId: z.string().min(1),
  amountCents: z.number().int().positive(),
  dueDate: z.string().min(8),
  originType: financeOriginTypeSchema,
  appointmentId: z.string().optional().or(z.literal(""))
});

export const chargeCreateResponseSchema = z.object({
  chargeId: z.string(),
  redirectTo: z.string()
});

export const chargePaymentRequestSchema = z.object({
  paidAt: z.string().min(8),
  amountCents: z.number().int().positive(),
  note: z.string().max(240)
});

export const chargeTimelineEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  occurredAtLabel: z.string(),
  actorLabel: z.string()
});

export const chargeDetailSchema = z.object({
  chargeId: z.string(),
  code: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientHref: z.string(),
  patientContactLabel: z.string(),
  appointmentId: z.string(),
  appointmentLabel: z.string(),
  appointmentHref: z.string(),
  amountLabel: z.string(),
  amountCents: z.number().int().nonnegative(),
  dueAtLabel: z.string(),
  paidAtLabel: z.string(),
  originType: financeOriginTypeSchema,
  originLabel: z.string(),
  status: financeChargeStatusSchema,
  statusLabel: z.string(),
  lastEventAtLabel: z.string(),
  lastEventLabel: z.string(),
  exportReferenceLabel: z.string(),
  paymentMethodLabel: z.string(),
  notes: z.string(),
  highlights: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ),
  timeline: z.array(chargeTimelineEventSchema),
  primaryActions: z.object({
    canRegisterPayment: z.boolean(),
    canCancel: z.boolean()
  })
});

export const financeExportResponseSchema = z.object({
  filename: z.string(),
  rowCount: z.number().int().nonnegative(),
  periodLabel: z.string()
});

export const settingsSectionKeySchema = z.enum([
  "profile",
  "practice",
  "security",
  "policies",
  "notifications"
]);

export const settingsSectionLinkSchema = z.object({
  key: settingsSectionKeySchema,
  title: z.string(),
  description: z.string(),
  href: z.string()
});

export const settingsRemediationItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  blocking: z.boolean(),
  ctaLabel: z.string(),
  href: z.string()
});

export const settingsSensitiveChangeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  occurredAtLabel: z.string(),
  actorLabel: z.string(),
  tone: alertToneSchema
});

export const settingsProfileSectionSchema = z.object({
  fullName: z.string(),
  socialName: z.string(),
  professionalEmail: z.string().email(),
  phone: z.string(),
  crp: z.string(),
  crpState: z.string(),
  specialty: z.string(),
  timezone: z.string(),
  miniBio: z.string(),
  publicFieldsSummary: z.string(),
  stepUpRequiredFields: z.array(z.string())
});

export const settingsPracticeSectionSchema = z.object({
  practiceName: z.string(),
  displayName: z.string(),
  billingDocument: z.string(),
  addressLine: z.string(),
  city: z.string(),
  state: z.string(),
  phone: z.string(),
  pixKey: z.string(),
  beneficiaryName: z.string(),
  receiptInstructions: z.string(),
  stepUpRequiredFields: z.array(z.string())
});

export const settingsSecuritySessionSchema = z.object({
  id: z.string(),
  label: z.string(),
  lastSeenLabel: z.string(),
  locationLabel: z.string(),
  current: z.boolean(),
  statusLabel: z.string()
});

export const settingsSecuritySectionSchema = z.object({
  loginEmail: z.string().email(),
  mfaStatusLabel: z.string(),
  recoveryCodesLabel: z.string(),
  lastCriticalEventLabel: z.string(),
  activeSessions: z.array(settingsSecuritySessionSchema),
  passwordRotationRequested: z.boolean(),
  revokeOtherSessions: z.boolean(),
  rotateRecoveryCodes: z.boolean(),
  stepUpRequiredFields: z.array(z.string())
});

export const settingsPoliciesSectionSchema = z.object({
  sessionDurationMinutes: z.number().int().positive(),
  gapMinutes: z.number().int().nonnegative(),
  defaultModality: appointmentModalitySchema,
  cancelWindowHours: z.number().int().nonnegative(),
  allowSelfScheduling: z.boolean(),
  telehealthEnabled: z.boolean(),
  transcriptDefaultEnabled: z.boolean(),
  autoChargeAfterSession: z.boolean(),
  collectionPolicy: z.string()
});

export const settingsNotificationPreferenceKeySchema = z.enum([
  "session_reminder",
  "document_signed",
  "consent_revoked",
  "charge_received",
  "charge_overdue",
  "clinical_review_pending",
  "security_alert"
]);

export const settingsNotificationPreferenceSchema = z.object({
  key: settingsNotificationPreferenceKeySchema,
  label: z.string(),
  description: z.string(),
  inApp: z.boolean(),
  email: z.boolean(),
  locked: z.boolean()
});

export const settingsNotificationsSectionSchema = z.object({
  inAppEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  preferences: z.array(settingsNotificationPreferenceSchema)
});

export const settingsProfileUpdateRequestSchema = settingsProfileSectionSchema.omit({
  publicFieldsSummary: true,
  stepUpRequiredFields: true
});

export const settingsPracticeUpdateRequestSchema = settingsPracticeSectionSchema.omit({
  stepUpRequiredFields: true
});

export const settingsSecurityUpdateRequestSchema = settingsSecuritySectionSchema.omit({
  mfaStatusLabel: true,
  recoveryCodesLabel: true,
  lastCriticalEventLabel: true,
  activeSessions: true,
  stepUpRequiredFields: true
});

export const settingsPoliciesUpdateRequestSchema = settingsPoliciesSectionSchema;
export const settingsNotificationsUpdateRequestSchema = settingsNotificationsSectionSchema;

export const settingsBootstrapSchema = z.object({
  accountStatus: therapistAccountStatusSchema,
  accountStatusLabel: z.string(),
  mfaStatusLabel: z.string(),
  lastSensitiveChangeLabel: z.string(),
  sections: z.array(settingsSectionLinkSchema),
  remediationItems: z.array(settingsRemediationItemSchema),
  lastSensitiveChanges: z.array(settingsSensitiveChangeSchema),
  profile: settingsProfileSectionSchema,
  practice: settingsPracticeSectionSchema,
  security: settingsSecuritySectionSchema,
  policies: settingsPoliciesSectionSchema,
  notifications: settingsNotificationsSectionSchema
});

export const settingsUpdateResponseSchema = z.object({
  section: settingsSectionKeySchema,
  savedAtLabel: z.string(),
  stepUpRequired: z.boolean(),
  settings: settingsBootstrapSchema
});

export const internalRoleSchema = z.enum([
  "support_ops",
  "billing_ops",
  "compliance_ops",
  "security_admin",
  "platform_admin"
]);

export const internalNavKeySchema = z.enum([
  "overview",
  "waitlist",
  "tenants",
  "support",
  "billing",
  "audit",
  "incidents"
]);

export const internalUserProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  primaryRole: internalRoleSchema,
  roleLabel: z.string(),
  environmentLabel: z.string(),
  sessionSecurityLabel: z.string()
});

export const internalNavigationItemSchema = z.object({
  key: internalNavKeySchema,
  label: z.string(),
  href: z.string()
});

export const internalBannerSchema = z.object({
  id: z.string(),
  tone: alertToneSchema,
  title: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
  href: z.string()
});

export const internalOpsSummarySchema = z.object({
  activeTenants: z.number().int().nonnegative(),
  onboardingPending: z.number().int().nonnegative(),
  integrationFailures: z.number().int().nonnegative(),
  billingIssues: z.number().int().nonnegative(),
  openIncidents: z.number().int().nonnegative(),
  complianceAlerts: z.number().int().nonnegative()
});

export const internalBootstrapSchema = z.object({
  internalUserProfile: internalUserProfileSchema,
  internalRoleSet: z.array(internalRoleSchema),
  internalSecurityStatus: z.string(),
  navigation: z.array(internalNavigationItemSchema),
  banner: internalBannerSchema,
  platformOpsSummary: internalOpsSummarySchema
});

export const internalTenantStatusSchema = z.enum(["active", "attention", "restricted", "inactive"]);
export const internalOnboardingStatusSchema = z.enum(["complete", "pending", "blocked"]);
export const internalBillingStatusSchema = z.enum(["ok", "attention", "delinquent"]);

export const internalTenantListItemSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  planLabel: z.string(),
  operationalStatus: internalTenantStatusSchema,
  onboardingStatus: internalOnboardingStatusSchema,
  billingStatus: internalBillingStatusSchema,
  createdAtLabel: z.string(),
  lastEventLabel: z.string(),
  lastEventAtLabel: z.string(),
  detailHref: z.string()
});

export const internalTenantListResponseSchema = z.object({
  items: z.array(internalTenantListItemSchema),
  total: z.number().int().nonnegative(),
  filters: z.object({
    search: z.string(),
    operationalStatus: z.enum(["all", "active", "attention", "restricted", "inactive"]),
    onboardingStatus: z.enum(["all", "complete", "pending", "blocked"]),
    billingStatus: z.enum(["all", "ok", "attention", "delinquent"])
  })
});

export const internalTenantDetailSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  planLabel: z.string(),
  operationalStatusLabel: z.string(),
  onboardingStatusLabel: z.string(),
  billingStatusLabel: z.string(),
  createdAtLabel: z.string(),
  ownerLabel: z.string(),
  userCountLabel: z.string(),
  patientCountLabel: z.string(),
  integrationHealthLabel: z.string(),
  criticalDocumentsLabel: z.string(),
  recentNonClinicalEvents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      occurredAtLabel: z.string()
    })
  ),
  linkedAreas: z.object({
    supportHref: z.string(),
    billingHref: z.string(),
    auditHref: z.string()
  })
});

export const internalSupportTicketSchema = z.object({
  ticketId: z.string(),
  tenantId: z.string(),
  tenantName: z.string(),
  categoryLabel: z.string(),
  priorityLabel: z.string(),
  statusLabel: z.string(),
  flowLabel: z.string(),
  lastEventLabel: z.string(),
  lastEventAtLabel: z.string()
});

export const internalSupportQueueResponseSchema = z.object({
  items: z.array(internalSupportTicketSchema),
  total: z.number().int().nonnegative()
});

export const internalBillingItemSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  tenantName: z.string(),
  planLabel: z.string(),
  subscriptionStatusLabel: z.string(),
  invoiceLabel: z.string(),
  amountLabel: z.string(),
  lastEventLabel: z.string(),
  lastEventAtLabel: z.string()
});

export const internalBillingResponseSchema = z.object({
  items: z.array(internalBillingItemSchema),
  total: z.number().int().nonnegative()
});

export const internalAuditEventSchema = z.object({
  id: z.string(),
  actorLabel: z.string(),
  tenantLabel: z.string(),
  moduleLabel: z.string(),
  eventLabel: z.string(),
  targetLabel: z.string(),
  occurredAtLabel: z.string(),
  sensitivityLabel: z.string()
});

export const internalAuditResponseSchema = z.object({
  items: z.array(internalAuditEventSchema),
  total: z.number().int().nonnegative()
});

export const internalIncidentSchema = z.object({
  incidentId: z.string(),
  title: z.string(),
  severityLabel: z.string(),
  statusLabel: z.string(),
  ownerLabel: z.string(),
  impactedTenantsLabel: z.string(),
  updatedAtLabel: z.string(),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      occurredAtLabel: z.string()
    })
  )
});

export const internalIncidentsResponseSchema = z.object({
  items: z.array(internalIncidentSchema),
  total: z.number().int().nonnegative()
});

export const portalNavKeySchema = z.enum([
  "appointments",
  "documents",
  "payments",
  "profile"
]);

export const portalNavigationItemSchema = z.object({
  key: portalNavKeySchema,
  label: z.string(),
  href: z.string()
});

export const portalPatientSummarySchema = z.object({
  id: z.string(),
  fullName: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  therapistName: z.string(),
  practiceName: z.string()
});

export const portalAlertSchema = z.object({
  id: z.string(),
  tone: alertToneSchema,
  title: z.string(),
  description: z.string(),
  ctaLabel: z.string(),
  href: z.string()
});

export const portalBootstrapSchema = z.object({
  patient: portalPatientSummarySchema,
  supportLabel: z.string(),
  nextAppointmentLabel: z.string(),
  navigation: z.array(portalNavigationItemSchema),
  alerts: z.array(portalAlertSchema)
});

export const portalInviteSchema = z.object({
  inviteToken: z.string(),
  status: z.enum(["pending", "accepted"]),
  patientFirstName: z.string(),
  therapistName: z.string(),
  practiceName: z.string(),
  appointmentDateLabel: z.string(),
  modalityLabel: z.string(),
  expiresAtLabel: z.string(),
  checklist: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      description: z.string()
    })
  )
});

export const portalInviteAcceptRequestSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true)
});

export const portalInviteAcceptResponseSchema = z.object({
  portalToken: z.string(),
  redirectTo: z.string()
});

export const portalTaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  href: z.string(),
  ctaLabel: z.string()
});

export const portalAppointmentListItemSchema = z.object({
  id: z.string(),
  statusLabel: z.string(),
  dateLabel: z.string(),
  timeLabel: z.string(),
  modalityLabel: z.string(),
  therapistName: z.string(),
  locationLabel: z.string(),
  checklistLabel: z.string(),
  href: z.string(),
  callHref: z.string().nullable()
});

export const portalAppointmentsResponseSchema = z.object({
  items: z.array(portalAppointmentListItemSchema),
  nextAppointmentId: z.string().nullable(),
  pendingTasks: z.array(portalTaskItemSchema)
});

export const portalAppointmentDetailSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  therapistName: z.string(),
  practiceName: z.string(),
  statusLabel: z.string(),
  dateLabel: z.string(),
  timeLabel: z.string(),
  modalityLabel: z.string(),
  locationLabel: z.string(),
  joinWindowLabel: z.string(),
  prepItems: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      statusLabel: z.string(),
      tone: alertToneSchema
    })
  ),
  documents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      statusLabel: z.string(),
      href: z.string()
    })
  ),
  payments: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      statusLabel: z.string(),
      amountLabel: z.string(),
      href: z.string()
    })
  ),
  notes: z.array(z.string()),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
    enabled: z.boolean()
  }),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      occurredAtLabel: z.string()
    })
  )
});

export const portalCallSchema = z.object({
  appointmentId: z.string(),
  patientName: z.string(),
  therapistName: z.string(),
  sessionLabel: z.string(),
  roomLabel: z.string(),
  status: z.enum(["prejoin", "waiting_room", "live", "ended"]),
  deviceChecklist: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      statusLabel: z.string(),
      tone: alertToneSchema
    })
  ),
  notices: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      tone: alertToneSchema
    })
  )
});

export const portalDocumentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  kindLabel: z.string(),
  statusLabel: z.string(),
  issuedAtLabel: z.string(),
  dueLabel: z.string(),
  href: z.string(),
  canSign: z.boolean(),
  signCtaLabel: z.string()
});

export const portalDocumentsResponseSchema = z.object({
  items: z.array(portalDocumentListItemSchema),
  summary: z.object({
    pendingCount: z.number().int().nonnegative(),
    signedCount: z.number().int().nonnegative()
  })
});

export const portalDocumentDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  kindLabel: z.string(),
  statusLabel: z.string(),
  issuedAtLabel: z.string(),
  dueLabel: z.string(),
  patientName: z.string(),
  therapistName: z.string(),
  previewSections: z.array(
    z.object({
      id: z.string(),
      heading: z.string(),
      body: z.string()
    })
  ),
  consentItems: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      statusLabel: z.string()
    })
  ),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      occurredAtLabel: z.string()
    })
  ),
  canSign: z.boolean(),
  signCtaLabel: z.string()
});

export const portalPaymentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  statusLabel: z.string(),
  amountLabel: z.string(),
  dueLabel: z.string(),
  methodLabel: z.string(),
  href: z.string(),
  canPay: z.boolean()
});

export const portalPaymentsResponseSchema = z.object({
  items: z.array(portalPaymentListItemSchema),
  summary: z.object({
    openAmountLabel: z.string(),
    paidAmountLabel: z.string(),
    pendingCount: z.number().int().nonnegative()
  })
});

export const portalPaymentDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  statusLabel: z.string(),
  amountLabel: z.string(),
  dueLabel: z.string(),
  methodLabel: z.string(),
  beneficiaryLabel: z.string(),
  referenceLabel: z.string(),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      occurredAtLabel: z.string()
    })
  ),
  canPay: z.boolean()
});

export const portalProfileSchema = z.object({
  patient: portalPatientSummarySchema,
  emergencyContactLabel: z.string(),
  communicationPreferenceLabel: z.string(),
  legalGuardianLabel: z.string(),
  activeConsents: z.array(z.string()),
  careGuidelines: z.array(z.string())
});

export const actionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  impactLabel: z.string(),
  href: z.string(),
  ctaLabel: z.string(),
  tone: alertToneSchema
});

export const activityEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  occurredAtLabel: z.string(),
  href: z.string()
});

export const dashboardCardStateSchema = z.object({
  title: z.string(),
  eyebrow: z.string(),
  metric: z.string(),
  description: z.string(),
  tone: alertToneSchema,
  href: z.string(),
  ctaLabel: z.string()
});

export const therapistDashboardSchema = z.object({
  accountStatus: therapistAccountStatusSchema,
  globalBlockingIssues: z.array(globalAlertSchema),
  quickActions: z.array(quickActionSchema),
  upcomingAppointments: z.array(appointmentSummarySchema),
  clinicalReviewSummary: clinicalReviewSummarySchema,
  documentSummary: documentSummarySchema,
  financialSummary: financialSummarySchema,
  recentPatients: z.array(patientSummarySchema),
  todayAgenda: z.array(appointmentSummarySchema),
  actionItems: z.array(actionItemSchema),
  recentActivity: z.array(activityEventSchema),
  cards: z.object({
    upcomingAppointments: dashboardCardStateSchema,
    clinicalReview: dashboardCardStateSchema,
    documents: dashboardCardStateSchema,
    finance: dashboardCardStateSchema,
    recentPatients: dashboardCardStateSchema,
    accountState: dashboardCardStateSchema
  })
});

export type AlertTone = z.infer<typeof alertToneSchema>;
export type AppShellBootstrap = z.infer<typeof appShellBootstrapSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type ActionItem = z.infer<typeof actionItemSchema>;
export type AgendaAvailabilityRule = z.infer<typeof agendaAvailabilityRuleSchema>;
export type AgendaAvailabilityUpdateRequest = z.infer<typeof agendaAvailabilityUpdateRequestSchema>;
export type AgendaResponse = z.infer<typeof agendaResponseSchema>;
export type AppointmentSummary = z.infer<typeof appointmentSummarySchema>;
export type AppointmentCalendarStatus = z.infer<typeof appointmentCalendarStatusSchema>;
export type AppointmentCall = z.infer<typeof appointmentCallSchema>;
export type AppointmentCancelRequest = z.infer<typeof appointmentCancelRequestSchema>;
export type AppointmentCreateRequest = z.infer<typeof appointmentCreateRequestSchema>;
export type AppointmentCreateResponse = z.infer<typeof appointmentCreateResponseSchema>;
export type AppointmentDetail = z.infer<typeof appointmentDetailSchema>;
export type AppointmentModality = z.infer<typeof appointmentModalitySchema>;
export type AppointmentRescheduleRequest = z.infer<typeof appointmentRescheduleRequestSchema>;
export type ScheduleBlockCreateRequest = z.infer<typeof scheduleBlockCreateRequestSchema>;
export type ScheduleBlockCreateResponse = z.infer<typeof scheduleBlockCreateResponseSchema>;
export type ScheduleBlockUpdateRequest = z.infer<typeof scheduleBlockUpdateRequestSchema>;
export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AuthMfaVerifyRequest = z.infer<typeof authMfaVerifyRequestSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type WaitlistBiggestPain = z.infer<typeof waitlistBiggestPainSchema>;
export type WaitlistJoinRequest = z.infer<typeof waitlistJoinRequestSchema>;
export type WaitlistJoinResponse = z.infer<typeof waitlistJoinResponseSchema>;
export type WaitlistMonthlySessionsRange = z.infer<typeof waitlistMonthlySessionsRangeSchema>;
export type WaitlistProfessionalRole = z.infer<typeof waitlistProfessionalRoleSchema>;
export type WaitlistSummary = z.infer<typeof waitlistSummarySchema>;
export type InternalWaitlistEntry = z.infer<typeof internalWaitlistEntrySchema>;
export type InternalWaitlistResponse = z.infer<typeof internalWaitlistResponseSchema>;
export type CalendarView = z.infer<typeof calendarViewSchema>;
export type ClinicalReviewSummary = z.infer<typeof clinicalReviewSummarySchema>;
export type ClinicalReviewDetail = z.infer<typeof clinicalReviewDetailSchema>;
export type ClinicalReviewDraftUpdateRequest = z.infer<typeof clinicalReviewDraftUpdateRequestSchema>;
export type ClinicalReviewQueueItem = z.infer<typeof clinicalReviewQueueItemSchema>;
export type ClinicalReviewQueueResponse = z.infer<typeof clinicalReviewQueueResponseSchema>;
export type ClinicalRecordEntry = z.infer<typeof clinicalRecordEntrySchema>;
export type ClinicalRecordTimelineItem = z.infer<typeof clinicalRecordTimelineItemSchema>;
export type ClinicalRecordVersion = z.infer<typeof clinicalRecordVersionSchema>;
export type DocumentConsentStatus = z.infer<typeof documentConsentStatusSchema>;
export type DocumentCreateRequest = z.infer<typeof documentCreateRequestSchema>;
export type DocumentCreateResponse = z.infer<typeof documentCreateResponseSchema>;
export type DocumentCriticality = z.infer<typeof documentCriticalitySchema>;
export type DocumentDeliveryChannel = z.infer<typeof documentDeliveryChannelSchema>;
export type DocumentDetail = z.infer<typeof documentDetailSchema>;
export type DocumentListItem = z.infer<typeof documentListItemSchema>;
export type DocumentOperationalImpact = z.infer<typeof documentOperationalImpactSchema>;
export type DocumentPreviewSection = z.infer<typeof documentPreviewSectionSchema>;
export type DocumentSignatureStatus = z.infer<typeof documentSignatureStatusSchema>;
export type DocumentSummaryMetrics = z.infer<typeof documentSummaryMetricsSchema>;
export type DocumentTimelineEvent = z.infer<typeof documentTimelineEventSchema>;
export type DocumentType = z.infer<typeof documentTypeSchema>;
export type DocumentsListFilters = z.infer<typeof documentsListFiltersSchema>;
export type DocumentsListResponse = z.infer<typeof documentsListResponseSchema>;
export type ChargeCreateRequest = z.infer<typeof chargeCreateRequestSchema>;
export type ChargeCreateResponse = z.infer<typeof chargeCreateResponseSchema>;
export type ChargeDetail = z.infer<typeof chargeDetailSchema>;
export type ChargePaymentRequest = z.infer<typeof chargePaymentRequestSchema>;
export type ChargeTimelineEvent = z.infer<typeof chargeTimelineEventSchema>;
export type FinanceChargeListItem = z.infer<typeof financeChargeListItemSchema>;
export type FinanceChargeStatus = z.infer<typeof financeChargeStatusSchema>;
export type FinanceExportResponse = z.infer<typeof financeExportResponseSchema>;
export type FinanceListFilters = z.infer<typeof financeListFiltersSchema>;
export type FinanceListResponse = z.infer<typeof financeListResponseSchema>;
export type FinanceOriginType = z.infer<typeof financeOriginTypeSchema>;
export type FinancePeriod = z.infer<typeof financePeriodSchema>;
export type FinanceSummary = z.infer<typeof financeSummarySchema>;
export type SettingsBootstrap = z.infer<typeof settingsBootstrapSchema>;
export type SettingsNotificationPreference = z.infer<typeof settingsNotificationPreferenceSchema>;
export type SettingsNotificationsSection = z.infer<typeof settingsNotificationsSectionSchema>;
export type SettingsPoliciesSection = z.infer<typeof settingsPoliciesSectionSchema>;
export type SettingsPoliciesUpdateRequest = z.infer<typeof settingsPoliciesUpdateRequestSchema>;
export type SettingsPracticeSection = z.infer<typeof settingsPracticeSectionSchema>;
export type SettingsPracticeUpdateRequest = z.infer<typeof settingsPracticeUpdateRequestSchema>;
export type SettingsProfileSection = z.infer<typeof settingsProfileSectionSchema>;
export type SettingsProfileUpdateRequest = z.infer<typeof settingsProfileUpdateRequestSchema>;
export type SettingsRemediationItem = z.infer<typeof settingsRemediationItemSchema>;
export type SettingsSectionKey = z.infer<typeof settingsSectionKeySchema>;
export type SettingsSecuritySection = z.infer<typeof settingsSecuritySectionSchema>;
export type SettingsSecurityUpdateRequest = z.infer<typeof settingsSecurityUpdateRequestSchema>;
export type SettingsSensitiveChange = z.infer<typeof settingsSensitiveChangeSchema>;
export type SettingsUpdateResponse = z.infer<typeof settingsUpdateResponseSchema>;
export type SettingsNotificationsUpdateRequest = z.infer<typeof settingsNotificationsUpdateRequestSchema>;
export type InternalAuditEvent = z.infer<typeof internalAuditEventSchema>;
export type InternalAuditResponse = z.infer<typeof internalAuditResponseSchema>;
export type InternalBanner = z.infer<typeof internalBannerSchema>;
export type InternalBillingItem = z.infer<typeof internalBillingItemSchema>;
export type InternalBillingResponse = z.infer<typeof internalBillingResponseSchema>;
export type InternalBootstrap = z.infer<typeof internalBootstrapSchema>;
export type InternalIncident = z.infer<typeof internalIncidentSchema>;
export type InternalIncidentsResponse = z.infer<typeof internalIncidentsResponseSchema>;
export type InternalNavKey = z.infer<typeof internalNavKeySchema>;
export type InternalOpsSummary = z.infer<typeof internalOpsSummarySchema>;
export type InternalRole = z.infer<typeof internalRoleSchema>;
export type InternalSupportQueueResponse = z.infer<typeof internalSupportQueueResponseSchema>;
export type InternalSupportTicket = z.infer<typeof internalSupportTicketSchema>;
export type InternalTenantDetail = z.infer<typeof internalTenantDetailSchema>;
export type InternalTenantListItem = z.infer<typeof internalTenantListItemSchema>;
export type InternalTenantListResponse = z.infer<typeof internalTenantListResponseSchema>;
export type InternalUserProfile = z.infer<typeof internalUserProfileSchema>;
export type PortalAlert = z.infer<typeof portalAlertSchema>;
export type PortalAppointmentDetail = z.infer<typeof portalAppointmentDetailSchema>;
export type PortalAppointmentListItem = z.infer<typeof portalAppointmentListItemSchema>;
export type PortalAppointmentsResponse = z.infer<typeof portalAppointmentsResponseSchema>;
export type PortalBootstrap = z.infer<typeof portalBootstrapSchema>;
export type PortalCall = z.infer<typeof portalCallSchema>;
export type PortalDocumentDetail = z.infer<typeof portalDocumentDetailSchema>;
export type PortalDocumentListItem = z.infer<typeof portalDocumentListItemSchema>;
export type PortalDocumentsResponse = z.infer<typeof portalDocumentsResponseSchema>;
export type PortalInvite = z.infer<typeof portalInviteSchema>;
export type PortalInviteAcceptRequest = z.infer<typeof portalInviteAcceptRequestSchema>;
export type PortalInviteAcceptResponse = z.infer<typeof portalInviteAcceptResponseSchema>;
export type PortalNavKey = z.infer<typeof portalNavKeySchema>;
export type PortalNavigationItem = z.infer<typeof portalNavigationItemSchema>;
export type PortalPatientSummary = z.infer<typeof portalPatientSummarySchema>;
export type PortalPaymentDetail = z.infer<typeof portalPaymentDetailSchema>;
export type PortalPaymentListItem = z.infer<typeof portalPaymentListItemSchema>;
export type PortalPaymentsResponse = z.infer<typeof portalPaymentsResponseSchema>;
export type PortalProfile = z.infer<typeof portalProfileSchema>;
export type PortalTaskItem = z.infer<typeof portalTaskItemSchema>;
export type PatientClinicalRecord = z.infer<typeof patientClinicalRecordSchema>;
export type DashboardCardState = z.infer<typeof dashboardCardStateSchema>;
export type OnboardingCompleteStepRequest = z.infer<typeof onboardingCompleteStepRequestSchema>;
export type OnboardingCompleteStepResponse = z.infer<typeof onboardingCompleteStepResponseSchema>;
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;
export type OnboardingStepKey = z.infer<typeof onboardingStepKeySchema>;
export type OnboardingStepStatus = z.infer<typeof onboardingStepStatusSchema>;
export type PatientChargeItem = z.infer<typeof patientChargeItemSchema>;
export type PatientCreateRequest = z.infer<typeof patientCreateRequestSchema>;
export type PatientDetail = z.infer<typeof patientDetailSchema>;
export type PatientDocumentItem = z.infer<typeof patientDocumentItemSchema>;
export type PatientFinancialState = z.infer<typeof patientFinancialStateSchema>;
export type PatientListFilters = z.infer<typeof patientListFiltersSchema>;
export type PatientListItem = z.infer<typeof patientListItemSchema>;
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;
export type PatientOperationalStatus = z.infer<typeof patientOperationalStatusSchema>;
export type PatientOverviewBlock = z.infer<typeof patientOverviewBlockSchema>;
export type PatientSessionItem = z.infer<typeof patientSessionItemSchema>;
export type PatientSummary = z.infer<typeof patientSummarySchema>;
export type ScheduleBlock = z.infer<typeof scheduleBlockSchema>;
export type TherapistOnboardingBootstrap = z.infer<typeof therapistOnboardingBootstrapSchema>;
export type TherapistOnboardingDraft = z.infer<typeof therapistOnboardingDraftSchema>;
export type TherapistDashboard = z.infer<typeof therapistDashboardSchema>;
export type TherapistAccountStatus = z.infer<typeof therapistAccountStatusSchema>;
export type TherapistProfile = z.infer<typeof therapistProfileSchema>;
