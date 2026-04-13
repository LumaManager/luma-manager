// apps/api/src/db/schema.ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  status: text("status").notNull().default("active"),
  brazilOnlyProcessing: boolean("brazil_only_processing").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const therapists = pgTable("therapists", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("owner"), // owner | member
  status: text("status").notNull().default("pending_onboarding"), // pending_onboarding | active | suspended
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const mfaSecrets = pgTable("mfa_secrets", {
  id: text("id").primaryKey(),
  therapistId: text("therapist_id").notNull().references(() => therapists.id).unique(),
  encryptedSecret: text("encrypted_secret").notNull(), // AES-GCM encrypted TOTP secret
  verified: boolean("verified").notNull().default(false),
  recoveryCodes: text("recovery_codes").notNull().default("[]"), // JSON array
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

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
