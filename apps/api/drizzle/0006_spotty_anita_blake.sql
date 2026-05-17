CREATE TABLE "consent_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"therapist_id" text NOT NULL,
	"document_type" text DEFAULT 'recording_consent' NOT NULL,
	"document_version" text NOT NULL,
	"token" text NOT NULL,
	"token_expires_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"signed_at" timestamp with time zone,
	"signer_ip" text,
	"signer_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "consent_documents_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "therapist_legal_acceptances" (
	"id" text PRIMARY KEY NOT NULL,
	"therapist_id" text NOT NULL,
	"document_type" text NOT NULL,
	"document_version" text DEFAULT '1.0' NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "recording_consent_id" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "recording_daily_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "recording_status" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "transcript_draft" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "transcript_approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "transcript_approved_by" text;--> statement-breakpoint
ALTER TABLE "consent_documents" ADD CONSTRAINT "consent_documents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_documents" ADD CONSTRAINT "consent_documents_therapist_id_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "therapist_legal_acceptances" ADD CONSTRAINT "therapist_legal_acceptances_therapist_id_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;