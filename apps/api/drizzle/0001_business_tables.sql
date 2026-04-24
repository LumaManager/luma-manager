-- Migration: 0001_business_tables
-- Adiciona todas as tabelas de negócio do MVP do Luma Manager
-- Gerada manualmente em 2026-04-23

--> statement-breakpoint
CREATE TABLE "app_sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "user_agent" text DEFAULT '' NOT NULL,
  "ip_address" text DEFAULT '' NOT NULL,
  "location_label" text DEFAULT '' NOT NULL,
  "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "therapist_profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "social_name" text DEFAULT '' NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "crp" text DEFAULT '' NOT NULL,
  "crp_state" text DEFAULT '' NOT NULL,
  "specialty" text DEFAULT '' NOT NULL,
  "timezone" text DEFAULT 'America/Sao_Paulo' NOT NULL,
  "mini_bio" text DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "therapist_profiles_therapist_id_unique" UNIQUE("therapist_id")
);
--> statement-breakpoint
CREATE TABLE "therapist_practices" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "practice_name" text DEFAULT '' NOT NULL,
  "display_name" text DEFAULT '' NOT NULL,
  "billing_document" text DEFAULT '' NOT NULL,
  "address_line" text DEFAULT '' NOT NULL,
  "city" text DEFAULT '' NOT NULL,
  "state" text DEFAULT '' NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "pix_key" text DEFAULT '' NOT NULL,
  "beneficiary_name" text DEFAULT '' NOT NULL,
  "receipt_instructions" text DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "therapist_practices_therapist_id_unique" UNIQUE("therapist_id")
);
--> statement-breakpoint
CREATE TABLE "therapist_policies" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "session_duration_minutes" integer DEFAULT 50 NOT NULL,
  "gap_minutes" integer DEFAULT 10 NOT NULL,
  "default_modality" text DEFAULT 'telehealth' NOT NULL,
  "cancel_window_hours" integer DEFAULT 24 NOT NULL,
  "allow_self_scheduling" boolean DEFAULT true NOT NULL,
  "telehealth_enabled" boolean DEFAULT true NOT NULL,
  "transcript_default_enabled" boolean DEFAULT true NOT NULL,
  "auto_charge_after_session" boolean DEFAULT false NOT NULL,
  "collection_policy" text DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "therapist_policies_therapist_id_unique" UNIQUE("therapist_id")
);
--> statement-breakpoint
CREATE TABLE "therapist_notification_prefs" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "pref_key" text NOT NULL,
  "in_app" boolean DEFAULT true NOT NULL,
  "email" boolean DEFAULT true NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_rules" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "weekday" integer NOT NULL,
  "enabled" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_windows" (
  "id" text PRIMARY KEY NOT NULL,
  "rule_id" text NOT NULL,
  "start_time" text NOT NULL,
  "end_time" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_blocks" (
  "id" text PRIMARY KEY NOT NULL,
  "therapist_id" text NOT NULL,
  "date" text NOT NULL,
  "start_time" text NOT NULL,
  "end_time" text NOT NULL,
  "title" text NOT NULL,
  "subtitle" text DEFAULT '' NOT NULL,
  "tone" text DEFAULT 'info' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
  "id" text PRIMARY KEY NOT NULL,
  "tenant_id" text NOT NULL,
  "therapist_id" text NOT NULL,
  "external_code" text NOT NULL,
  "full_name" text NOT NULL,
  "email" text DEFAULT '' NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "birth_date" text NOT NULL,
  "payment_origin" text DEFAULT 'private' NOT NULL,
  "status" text DEFAULT 'invited' NOT NULL,
  "portal_enabled" boolean DEFAULT false NOT NULL,
  "portal_email" text DEFAULT '' NOT NULL,
  "portal_password_hash" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_invites" (
  "id" text PRIMARY KEY NOT NULL,
  "patient_id" text NOT NULL,
  "token" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "accepted_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "patient_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "appointments" (
  "id" text PRIMARY KEY NOT NULL,
  "tenant_id" text NOT NULL,
  "therapist_id" text NOT NULL,
  "patient_id" text NOT NULL,
  "date" text NOT NULL,
  "start_time" text NOT NULL,
  "duration_minutes" integer NOT NULL,
  "modality" text DEFAULT 'telehealth' NOT NULL,
  "status" text DEFAULT 'scheduled' NOT NULL,
  "note" text DEFAULT '' NOT NULL,
  "room_state" text DEFAULT 'not_provisioned' NOT NULL,
  "room_url" text DEFAULT '' NOT NULL,
  "room_provider_ref" text DEFAULT '' NOT NULL,
  "transcript_job_id" text DEFAULT '' NOT NULL,
  "booked_by_patient" boolean DEFAULT false NOT NULL,
  "cancel_reason" text DEFAULT '' NOT NULL,
  "cancelled_at" timestamp with time zone,
  "started_at" timestamp with time zone,
  "ended_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_events" (
  "id" text PRIMARY KEY NOT NULL,
  "appointment_id" text NOT NULL,
  "event_type" text NOT NULL,
  "actor_type" text DEFAULT 'therapist' NOT NULL,
  "actor_id" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinical_drafts" (
  "id" text PRIMARY KEY NOT NULL,
  "appointment_id" text NOT NULL,
  "patient_id" text NOT NULL,
  "therapist_id" text NOT NULL,
  "transcript_status" text DEFAULT 'not_started' NOT NULL,
  "draft_status" text DEFAULT 'not_started' NOT NULL,
  "review_state" text DEFAULT 'processing' NOT NULL,
  "draft_summary" text DEFAULT '' NOT NULL,
  "draft_topics" text DEFAULT '' NOT NULL,
  "draft_continuity" text DEFAULT '' NOT NULL,
  "draft_pending" text DEFAULT '' NOT NULL,
  "approved_at" timestamp with time zone,
  "approved_by" text DEFAULT '' NOT NULL,
  "discarded_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "clinical_drafts_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "clinical_draft_versions" (
  "id" text PRIMARY KEY NOT NULL,
  "draft_id" text NOT NULL,
  "summary" text DEFAULT '' NOT NULL,
  "topics" text DEFAULT '' NOT NULL,
  "continuity" text DEFAULT '' NOT NULL,
  "pending" text DEFAULT '' NOT NULL,
  "author_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_charges" (
  "id" text PRIMARY KEY NOT NULL,
  "tenant_id" text NOT NULL,
  "patient_id" text NOT NULL,
  "appointment_id" text DEFAULT '' NOT NULL,
  "code" text NOT NULL,
  "amount_cents" integer NOT NULL,
  "due_date" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "origin_type" text DEFAULT 'private' NOT NULL,
  "paid_at" text DEFAULT '' NOT NULL,
  "paid_amount_cents" integer DEFAULT 0 NOT NULL,
  "payment_note" text DEFAULT '' NOT NULL,
  "export_reference" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_charge_events" (
  "id" text PRIMARY KEY NOT NULL,
  "charge_id" text NOT NULL,
  "event_type" text NOT NULL,
  "actor_id" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
  "id" text PRIMARY KEY NOT NULL,
  "tenant_id" text NOT NULL,
  "patient_id" text NOT NULL,
  "appointment_id" text DEFAULT '' NOT NULL,
  "code" text NOT NULL,
  "document_type" text NOT NULL,
  "template_version" text NOT NULL,
  "delivery_channel" text DEFAULT 'email' NOT NULL,
  "signature_status" text DEFAULT 'not_sent' NOT NULL,
  "consent_status" text DEFAULT 'pending' NOT NULL,
  "criticality" text DEFAULT 'normal' NOT NULL,
  "critical_reason" text DEFAULT '' NOT NULL,
  "file_reference" text DEFAULT '' NOT NULL,
  "signed_by_label" text DEFAULT '' NOT NULL,
  "generated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "last_sent_at" timestamp with time zone,
  "last_event_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_events" (
  "id" text PRIMARY KEY NOT NULL,
  "document_id" text NOT NULL,
  "event_type" text NOT NULL,
  "actor_type" text DEFAULT 'therapist' NOT NULL,
  "actor_id" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "full_name" text DEFAULT '' NOT NULL,
  "professional_role" text DEFAULT '' NOT NULL,
  "crp" text DEFAULT '' NOT NULL,
  "monthly_sessions_range" text DEFAULT '' NOT NULL,
  "biggest_pain" text DEFAULT '' NOT NULL,
  "phone" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'waiting' NOT NULL,
  "approved_at" timestamp with time zone,
  "converted_at" timestamp with time zone,
  "tenant_id" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint

-- Foreign keys: app_sessions
ALTER TABLE "app_sessions" ADD CONSTRAINT "app_sessions_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: therapist_profiles
ALTER TABLE "therapist_profiles" ADD CONSTRAINT "therapist_profiles_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: therapist_practices
ALTER TABLE "therapist_practices" ADD CONSTRAINT "therapist_practices_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: therapist_policies
ALTER TABLE "therapist_policies" ADD CONSTRAINT "therapist_policies_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: therapist_notification_prefs
ALTER TABLE "therapist_notification_prefs" ADD CONSTRAINT "therapist_notification_prefs_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: availability_rules
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: availability_windows
ALTER TABLE "availability_windows" ADD CONSTRAINT "availability_windows_rule_id_availability_rules_id_fk"
  FOREIGN KEY ("rule_id") REFERENCES "public"."availability_rules"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: schedule_blocks
ALTER TABLE "schedule_blocks" ADD CONSTRAINT "schedule_blocks_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: patients
ALTER TABLE "patients" ADD CONSTRAINT "patients_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "patients" ADD CONSTRAINT "patients_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: patient_invites
ALTER TABLE "patient_invites" ADD CONSTRAINT "patient_invites_patient_id_patients_id_fk"
  FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: appointments
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk"
  FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: appointment_events
ALTER TABLE "appointment_events" ADD CONSTRAINT "appointment_events_appointment_id_appointments_id_fk"
  FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: clinical_drafts
ALTER TABLE "clinical_drafts" ADD CONSTRAINT "clinical_drafts_appointment_id_appointments_id_fk"
  FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "clinical_drafts" ADD CONSTRAINT "clinical_drafts_patient_id_patients_id_fk"
  FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "clinical_drafts" ADD CONSTRAINT "clinical_drafts_therapist_id_therapists_id_fk"
  FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: clinical_draft_versions
ALTER TABLE "clinical_draft_versions" ADD CONSTRAINT "clinical_draft_versions_draft_id_clinical_drafts_id_fk"
  FOREIGN KEY ("draft_id") REFERENCES "public"."clinical_drafts"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: finance_charges
ALTER TABLE "finance_charges" ADD CONSTRAINT "finance_charges_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "finance_charges" ADD CONSTRAINT "finance_charges_patient_id_patients_id_fk"
  FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: finance_charge_events
ALTER TABLE "finance_charge_events" ADD CONSTRAINT "finance_charge_events_charge_id_finance_charges_id_fk"
  FOREIGN KEY ("charge_id") REFERENCES "public"."finance_charges"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: documents
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_tenants_id_fk"
  FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_patients_id_fk"
  FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;

-- Foreign keys: document_events
ALTER TABLE "document_events" ADD CONSTRAINT "document_events_document_id_documents_id_fk"
  FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;

-- Useful indexes
CREATE INDEX "idx_patients_tenant" ON "patients"("tenant_id");
CREATE INDEX "idx_patients_therapist" ON "patients"("therapist_id");
CREATE INDEX "idx_appointments_therapist_date" ON "appointments"("therapist_id", "date");
CREATE INDEX "idx_appointments_patient" ON "appointments"("patient_id");
CREATE INDEX "idx_finance_charges_tenant" ON "finance_charges"("tenant_id");
CREATE INDEX "idx_finance_charges_patient" ON "finance_charges"("patient_id");
CREATE INDEX "idx_documents_tenant" ON "documents"("tenant_id");
CREATE INDEX "idx_documents_patient" ON "documents"("patient_id");
CREATE INDEX "idx_availability_rules_therapist" ON "availability_rules"("therapist_id");
CREATE INDEX "idx_clinical_drafts_therapist" ON "clinical_drafts"("therapist_id");
