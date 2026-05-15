-- Migration 0005: scheduling_tokens table for self-scheduling links
-- Gerada via drizzle-kit generate, trimmed para apenas o diff incremental
-- (0001–0004 foram escritas manualmente sem snapshot drizzle)

CREATE TABLE "scheduling_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"therapist_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"token" text NOT NULL,
	"week_start" text NOT NULL,
	"week_end" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"appointment_id" text,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scheduling_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "scheduling_tokens" ADD CONSTRAINT "scheduling_tokens_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "scheduling_tokens" ADD CONSTRAINT "scheduling_tokens_therapist_id_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."therapists"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "scheduling_tokens" ADD CONSTRAINT "scheduling_tokens_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "scheduling_tokens" ADD CONSTRAINT "scheduling_tokens_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "scheduling_tokens_therapist_patient_week_idx" ON "scheduling_tokens" USING btree ("therapist_id","patient_id","week_start");
