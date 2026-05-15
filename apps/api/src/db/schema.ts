// apps/api/src/db/schema.ts
import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// TENANTS
// ---------------------------------------------------------------------------

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  status: text("status").notNull().default("active"), // active | suspended | cancelled
  brazilOnlyProcessing: boolean("brazil_only_processing").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// THERAPISTS (auth identity)
// ---------------------------------------------------------------------------

export const therapists = pgTable("therapists", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("owner"), // owner | member
  status: text("status").notNull().default("pending_onboarding"), // pending_onboarding | active | suspended
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true })
});

// ---------------------------------------------------------------------------
// MFA
// ---------------------------------------------------------------------------

export const mfaSecrets = pgTable("mfa_secrets", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  encryptedSecret: text("encrypted_secret").notNull(), // AES-GCM encrypted TOTP secret
  verified: boolean("verified").notNull().default(false),
  recoveryCodes: text("recovery_codes").notNull().default("[]"), // JSON array of hashed codes
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// ONBOARDING
// ---------------------------------------------------------------------------

export const onboardingState = pgTable("onboarding_state", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  completedSteps: text("completed_steps").notNull().default("[]"), // JSON array of step IDs
  practiceName: text("practice_name"),
  practiceCity: text("practice_city"),
  practiceState: text("practice_state"),
  firstPatientCreated: boolean("first_patient_created").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// APP SESSIONS (for security / active-session listing)
// ---------------------------------------------------------------------------

export const appSessions = pgTable("app_sessions", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  userAgent: text("user_agent").notNull().default(""),
  ipAddress: text("ip_address").notNull().default(""),
  locationLabel: text("location_label").notNull().default(""), // e.g. "São Paulo, BR"
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// THERAPIST PROFILE (professional & personal data)
// ---------------------------------------------------------------------------

export const therapistProfiles = pgTable("therapist_profiles", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  socialName: text("social_name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  crp: text("crp").notNull().default(""),        // e.g. "06/12345"
  crpState: text("crp_state").notNull().default(""),
  specialty: text("specialty").notNull().default(""),
  timezone: text("timezone").notNull().default("America/Sao_Paulo"),
  miniBio: text("mini_bio").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// THERAPIST PRACTICE (billing & practice info)
// ---------------------------------------------------------------------------

export const therapistPractices = pgTable("therapist_practices", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  practiceName: text("practice_name").notNull().default(""),
  displayName: text("display_name").notNull().default(""),
  billingDocument: text("billing_document").notNull().default(""), // CPF or CNPJ
  addressLine: text("address_line").notNull().default(""),
  city: text("city").notNull().default(""),
  state: text("state").notNull().default(""),
  phone: text("phone").notNull().default(""),
  pixKey: text("pix_key").notNull().default(""),
  beneficiaryName: text("beneficiary_name").notNull().default(""),
  receiptInstructions: text("receipt_instructions").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// THERAPIST POLICIES (scheduling & session rules)
// ---------------------------------------------------------------------------

export const therapistPolicies = pgTable("therapist_policies", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  sessionDurationMinutes: integer("session_duration_minutes").notNull().default(50),
  gapMinutes: integer("gap_minutes").notNull().default(10),
  defaultModality: text("default_modality").notNull().default("telehealth"), // telehealth | in_person
  cancelWindowHours: integer("cancel_window_hours").notNull().default(24),
  allowSelfScheduling: boolean("allow_self_scheduling").notNull().default(true),
  telehealthEnabled: boolean("telehealth_enabled").notNull().default(true),
  transcriptDefaultEnabled: boolean("transcript_default_enabled").notNull().default(true),
  autoChargeAfterSession: boolean("auto_charge_after_session").notNull().default(false),
  collectionPolicy: text("collection_policy").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// THERAPIST NOTIFICATION PREFERENCES
// ---------------------------------------------------------------------------

export const therapistNotificationPrefs = pgTable("therapist_notification_prefs", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  // session_reminder | document_signed | consent_revoked | charge_received |
  // charge_overdue | clinical_review_pending | security_alert
  prefKey: text("pref_key").notNull(),
  inApp: boolean("in_app").notNull().default(true),
  email: boolean("email").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// AVAILABILITY RULES (weekly recurring schedule)
// ---------------------------------------------------------------------------

export const availabilityRules = pgTable("availability_rules", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  weekday: integer("weekday").notNull(), // 0 = Sunday … 6 = Saturday
  enabled: boolean("enabled").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// one rule has many windows (e.g. 08:00-12:00 and 14:00-18:00 on Mondays)
export const availabilityWindows = pgTable("availability_windows", {
  id: text("id").primaryKey(),
  ruleId: text("rule_id").notNull().references(() => availabilityRules.id),
  startTime: text("start_time").notNull(), // "HH:MM"
  endTime: text("end_time").notNull()      // "HH:MM"
});

// ---------------------------------------------------------------------------
// SCHEDULE BLOCKS (manual one-off blocks: vacations, meetings, etc.)
// ---------------------------------------------------------------------------

export const scheduleBlocks = pgTable("schedule_blocks", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  date: text("date").notNull(),            // "YYYY-MM-DD"
  startTime: text("start_time").notNull(), // "HH:MM"
  endTime: text("end_time").notNull(),     // "HH:MM"
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  tone: text("tone").notNull().default("info"), // critical | warning | info | success
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// PATIENTS
// ---------------------------------------------------------------------------

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  externalCode: text("external_code").notNull(), // "P-0001" — human-readable, unique per tenant
  fullName: text("full_name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  birthDate: text("birth_date").notNull(),        // "YYYY-MM-DD"
  paymentOrigin: text("payment_origin").notNull().default("private"), // private | insurance
  status: text("status").notNull().default("invited"), // invited | active | inactive | archived
  // portal access
  portalEnabled: boolean("portal_enabled").notNull().default(false),
  portalEmail: text("portal_email").notNull().default(""),
  portalPasswordHash: text("portal_password_hash").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// PATIENT INVITES (portal onboarding token)
// ---------------------------------------------------------------------------

export const patientInvites = pgTable("patient_invites", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// APPOINTMENTS
// ---------------------------------------------------------------------------

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  patientId: text("patient_id").notNull().references(() => patients.id),
  date: text("date").notNull(),            // "YYYY-MM-DD"
  startTime: text("start_time").notNull(), // "HH:MM"
  durationMinutes: integer("duration_minutes").notNull(),
  modality: text("modality").notNull().default("telehealth"), // telehealth | in_person
  // status: scheduled → confirmed → in_progress → completed | cancelled | no_show
  status: text("status").notNull().default("scheduled"),
  note: text("note").notNull().default(""),
  // video room
  roomState: text("room_state").notNull().default("not_provisioned"), // not_provisioned | ready | open | closed | failed
  roomUrl: text("room_url").notNull().default(""),
  roomProviderRef: text("room_provider_ref").notNull().default(""),
  // transcript
  transcriptJobId: text("transcript_job_id").notNull().default(""),
  // booking metadata
  bookedByPatient: boolean("booked_by_patient").notNull().default(false),
  cancelReason: text("cancel_reason").notNull().default(""),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// APPOINTMENT EVENTS (timeline / audit)
// ---------------------------------------------------------------------------

export const appointmentEvents = pgTable("appointment_events", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id").notNull().references(() => appointments.id),
  // created | rescheduled | confirmed | started | ended | cancelled | no_show
  eventType: text("event_type").notNull(),
  actorType: text("actor_type").notNull().default("therapist"), // therapist | patient | system
  actorId: text("actor_id").notNull().default(""),
  description: text("description").notNull().default(""),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// CLINICAL DRAFTS (AI review pipeline — one record per appointment)
// ---------------------------------------------------------------------------

export const clinicalDrafts = pgTable("clinical_drafts", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id").notNull().references(() => appointments.id).unique(),
  patientId: text("patient_id").notNull().references(() => patients.id),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  // pipeline statuses
  transcriptStatus: text("transcript_status").notNull().default("not_started"),
  // not_started | processing | ready | failed | disabled
  draftStatus: text("draft_status").notNull().default("not_started"),
  // not_started | waiting_transcript | generating | ready | failed | disabled
  reviewState: text("review_state").notNull().default("processing"),
  // processing | ready_for_review | in_review | blocked | approved | discarded
  // editable content (updated by therapist before approval)
  draftSummary: text("draft_summary").notNull().default(""),
  draftTopics: text("draft_topics").notNull().default(""),
  draftContinuity: text("draft_continuity").notNull().default(""),
  draftPending: text("draft_pending").notNull().default(""),
  // outcome
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: text("approved_by").notNull().default(""),
  discardedAt: timestamp("discarded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// CLINICAL DRAFT VERSIONS (immutable snapshots on each save/approval)
// ---------------------------------------------------------------------------

export const clinicalDraftVersions = pgTable("clinical_draft_versions", {
  id: text("id").primaryKey(),
  draftId: text("draft_id").notNull().references(() => clinicalDrafts.id),
  summary: text("summary").notNull().default(""),
  topics: text("topics").notNull().default(""),
  continuity: text("continuity").notNull().default(""),
  pending: text("pending").notNull().default(""),
  authorId: text("author_id").notNull(), // therapist id
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// FINANCE CHARGES
// ---------------------------------------------------------------------------

export const financeCharges = pgTable("finance_charges", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  patientId: text("patient_id").notNull().references(() => patients.id),
  appointmentId: text("appointment_id").notNull().default(""), // "" = not linked
  code: text("code").notNull(),                // "CB-0042" — human-readable
  amountCents: integer("amount_cents").notNull(),
  dueDate: text("due_date").notNull(),         // "YYYY-MM-DD"
  status: text("status").notNull().default("pending"), // pending | paid | overdue | canceled
  originType: text("origin_type").notNull().default("private"), // private | insurance
  paidAt: text("paid_at").notNull().default(""),        // "YYYY-MM-DD"
  paidAmountCents: integer("paid_amount_cents").notNull().default(0),
  paymentNote: text("payment_note").notNull().default(""),
  exportReference: text("export_reference").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// FINANCE CHARGE EVENTS (timeline)
// ---------------------------------------------------------------------------

export const financeChargeEvents = pgTable("finance_charge_events", {
  id: text("id").primaryKey(),
  chargeId: text("charge_id").notNull().references(() => financeCharges.id),
  // created | payment_registered | overdue_flagged | canceled
  eventType: text("event_type").notNull(),
  actorId: text("actor_id").notNull().default(""),
  description: text("description").notNull().default(""),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// DOCUMENTS (consentimentos, contratos, LGPD)
// ---------------------------------------------------------------------------

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  patientId: text("patient_id").notNull().references(() => patients.id),
  appointmentId: text("appointment_id").notNull().default(""), // "" = not linked
  code: text("code").notNull(),               // "DOC-0001"
  documentType: text("document_type").notNull(),
  // lgpd | telehealth | transcript_ai | therapy_contract | operational
  templateVersion: text("template_version").notNull(),
  deliveryChannel: text("delivery_channel").notNull().default("email"),
  signatureStatus: text("signature_status").notNull().default("not_sent"),
  // not_sent | pending | signed | expired | revoked
  consentStatus: text("consent_status").notNull().default("pending"),
  // valid | pending | revoked | not_applicable
  criticality: text("criticality").notNull().default("normal"),
  // normal | attention | critical
  criticalReason: text("critical_reason").notNull().default(""),
  fileReference: text("file_reference").notNull().default(""),
  signedByLabel: text("signed_by_label").notNull().default(""),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  lastSentAt: timestamp("last_sent_at", { withTimezone: true }),
  lastEventAt: timestamp("last_event_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// DOCUMENT EVENTS (timeline)
// ---------------------------------------------------------------------------

export const documentEvents = pgTable("document_events", {
  id: text("id").primaryKey(),
  documentId: text("document_id").notNull().references(() => documents.id),
  // generated | sent | signed | revoked | expired | resent
  eventType: text("event_type").notNull(),
  actorType: text("actor_type").notNull().default("therapist"), // therapist | patient | system
  actorId: text("actor_id").notNull().default(""),
  description: text("description").notNull().default(""),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// WAITLIST (marketing)
// ---------------------------------------------------------------------------

export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull().default(""),
  professionalRole: text("professional_role").notNull().default(""),
  // psychologist | psychiatrist | other_therapist | other
  crp: text("crp").notNull().default(""),
  monthlySessionsRange: text("monthly_sessions_range").notNull().default(""),
  // lt_10 | 10_to_20 | 21_to_40 | gt_40
  biggestPain: text("biggest_pain").notNull().default(""),
  // scheduling | records | billing | session_notes | all
  phone: text("phone").notNull().default(""),
  status: text("status").notNull().default("waiting"), // waiting | approved | rejected | converted
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  convertedAt: timestamp("converted_at", { withTimezone: true }),
  tenantId: text("tenant_id").notNull().default(""), // filled when converted → therapist account
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// EMAIL VERIFICATION TOKENS
// ---------------------------------------------------------------------------

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id:           text("id").primaryKey(),
  therapistId:  text("therapist_id").notNull().references(() => therapists.id),
  token:        text("token").notNull().unique(),
  expiresAt:    timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt:       timestamp("used_at", { withTimezone: true })
});

// ---------------------------------------------------------------------------
// AUDIT LOGS (LGPD — rastreabilidade de acesso a dados de saúde)
// ---------------------------------------------------------------------------

export const auditLogs = pgTable("audit_logs", {
  id:          text("id").primaryKey(),
  therapistId: text("therapist_id").notNull(),
  tenantId:    text("tenant_id").notNull(),
  action:      text("action").notNull(),      // "login" | "logout" | "read" | "create" | "update" | "delete"
  resource:    text("resource").notNull(),    // "patient" | "clinical_record" | "document" | "appointment" | "billing" | "auth"
  resourceId:  text("resource_id"),
  patientId:   text("patient_id"),
  ipAddress:   text("ip_address").notNull().default(""),
  userAgent:   text("user_agent").notNull().default(""),
  metadata:    text("metadata"),              // JSON serializado
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// ---------------------------------------------------------------------------
// SCHEDULING TOKENS (no-auth patient booking links)
// ---------------------------------------------------------------------------

export const schedulingTokens = pgTable(
  "scheduling_tokens",
  {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    therapistId: text("therapist_id").notNull().references(() => therapists.id),
    patientId: text("patient_id").notNull().references(() => patients.id),
    token: text("token").notNull().unique(),
    weekStart: text("week_start").notNull(),
    weekEnd: text("week_end").notNull(),
    status: text("status").notNull().default("pending"),
    appointmentId: text("appointment_id").references(() => appointments.id),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    therapistPatientWeekIdx: uniqueIndex("scheduling_tokens_therapist_patient_week_idx").on(
      table.therapistId,
      table.patientId,
      table.weekStart
    )
  })
);
