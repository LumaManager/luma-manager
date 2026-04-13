CREATE TABLE "mfa_secrets" (
	"id" text PRIMARY KEY NOT NULL,
	"therapist_id" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"recovery_codes" text DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mfa_secrets_therapist_id_unique" UNIQUE("therapist_id")
);
--> statement-breakpoint
CREATE TABLE "onboarding_state" (
	"id" text PRIMARY KEY NOT NULL,
	"therapist_id" text NOT NULL,
	"completed_steps" text DEFAULT '[]' NOT NULL,
	"practice_name" text,
	"practice_city" text,
	"practice_state" text,
	"first_patient_created" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "onboarding_state_therapist_id_unique" UNIQUE("therapist_id")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"brazil_only_processing" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "therapists" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text DEFAULT 'owner' NOT NULL,
	"status" text DEFAULT 'pending_onboarding' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "therapists_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "mfa_secrets" ADD CONSTRAINT "mfa_secrets_therapist_id_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_state" ADD CONSTRAINT "onboarding_state_therapist_id_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "therapists" ADD CONSTRAINT "therapists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;