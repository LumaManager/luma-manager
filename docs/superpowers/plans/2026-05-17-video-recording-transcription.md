# Vídeo, Gravação e Transcrição — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-session video calls (Daily.co), automatic session recording with patient consent signing via token-based page, and AI transcription (AssemblyAI with speaker diarization) generating a therapist-reviewed draft for the clinical record.

**Architecture:** Three interdependent systems built in order — (1) consent document system mirroring the scheduling token pattern; (2) Daily.co room provisioning + recording triggered on session entry; (3) server-side-only AssemblyAI transcription triggered by Daily.co webhook, with delete-after-processing pattern for the audio file. The API uses Fastify (not Express) — raw body handling for webhook HMAC requires the `@fastify/rawbody` plugin.

**Tech Stack:** NestJS + Fastify (backend), Drizzle ORM (Postgres), Daily.co REST API, AssemblyAI REST API, Supabase Storage (temporary encrypted buffer), Next.js App Router (frontend).

---

## Context: key patterns in this codebase

- **DB client injection:** `@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient`
- **Drizzle queries:** `db.select({ field: table.col }).from(table).where(and(...)).limit(1)`, INSERT with `.returning()`, UPDATE with `.set()`
- **IDs:** `randomUUID()` from `node:crypto`, stored as `text` (not uuid type)
- **Timestamps:** `new Date()`, stored as `timestamp("col", { withTimezone: true })`
- **Auth in controllers:** `@Headers("authorization") authorization?: string`, then `authService.getSessionFromAuthorizationHeader(authorization)` — no `@UseGuards` decorator
- **Errors:** `NotFoundException`, `BadRequestException`, `UnauthorizedException` from `@nestjs/common`
- **Public routes:** no auth header required — return 400/404 directly
- **Contracts:** all Zod schemas in `packages/contracts/src/index.ts` (single file, 2000+ lines)
- **Existing appointments.repository.ts:** `findById(therapistId, appointmentId)` already fetches `patientPhone`
- **`transcriptJobId`** column already exists on `appointments` table — use it for the AssemblyAI transcript ID
- **No test files exist** in the repo — skip test steps

---

## File Map

### New files
| File | Purpose |
|------|---------|
| `apps/api/src/modules/consent/consent.repository.ts` | CRUD for consent_documents table |
| `apps/api/src/modules/consent/consent.service.ts` | Create doc, sign doc, get public doc |
| `apps/api/src/modules/consent/consent.controller.ts` | Authenticated + public consent routes |
| `apps/api/src/modules/appointments/daily.client.ts` | Thin HTTP wrapper for Daily.co REST API |
| `apps/api/src/modules/recording/recording.service.ts` | Download → Supabase → AssemblyAI → cleanup |
| `apps/api/src/modules/webhooks/webhooks.controller.ts` | POST /webhooks/daily + POST /webhooks/assemblyai |
| `apps/web/app/(public)/consentimento/[token]/page.tsx` | Patient consent signing page |
| `apps/web/app/api/appointments/[appointmentId]/patient-token/route.ts` | Proxy → backend |
| `apps/web/app/api/appointments/[appointmentId]/recording/start/route.ts` | Proxy → backend |
| `apps/web/app/api/appointments/[appointmentId]/approve-transcript/route.ts` | Proxy → backend |
| `apps/web/app/api/patients/[patientId]/consent-documents/route.ts` | Proxy → backend |
| `apps/web/app/api/public/consent/[token]/route.ts` | Public proxy GET+POST → backend |

### Modified files
| File | Change |
|------|--------|
| `apps/api/src/main.ts` | Register `@fastify/rawbody` plugin |
| `apps/api/src/db/schema.ts` | Add `consentDocuments` table + 6 columns on `appointments` |
| `apps/api/src/common/config/env.ts` | 4 new env vars |
| `packages/contracts/src/index.ts` | New schemas + extend `AppointmentDetail` + `AppointmentCall` |
| `apps/api/src/modules/appointments/appointments.repository.ts` | 4 new methods + update `findById` select |
| `apps/api/src/modules/appointments/appointments.service.ts` | Implement 5 previously-stubbed/new methods |
| `apps/api/src/modules/appointments/appointments.controller.ts` | 3 new routes |
| `apps/api/src/app.module.ts` | Register 5 new providers + 2 new controllers |
| `apps/web/src/components/agenda/appointment-detail-page.tsx` | Update `VirtualRoomCard` + add `TranscriptCard` + `RecordingConsentCard` |
| `apps/web/src/components/agenda/appointment-call-page.tsx` | Add consent badge, iframe embed, recording start |

---

## Task 1: Install @fastify/rawbody + update main.ts

**Files:**
- Modify: `apps/api/src/main.ts`

- [ ] **Step 1: Install the plugin**

```bash
cd apps/api && npm install @fastify/rawbody
```

- [ ] **Step 2: Register the plugin in main.ts**

In `apps/api/src/main.ts`, add the import and register the plugin **before** `app.setGlobalPrefix`. Find the line `const app = await NestFactory.create<NestFastifyApplication>(` and add after the app is created:

```typescript
// Add this import at the top of main.ts:
import rawBody from "@fastify/rawbody";

// Add inside the bootstrap() function, right after the app is created (before app.setGlobalPrefix):
await app.register(rawBody, { field: "rawBody", global: true, runFirst: true });
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/main.ts apps/api/package.json apps/api/package-lock.json
git commit -m "feat: add @fastify/rawbody for webhook HMAC validation"
```

---

## Task 2: DB Schema — consent_documents table + appointment recording columns

**Files:**
- Modify: `apps/api/src/db/schema.ts`

- [ ] **Step 1: Add the consent_documents table at the end of schema.ts**

Append to the end of `apps/api/src/db/schema.ts`:

```typescript
// ---------------------------------------------------------------------------
// CONSENT DOCUMENTS
// ---------------------------------------------------------------------------

export const consentDocuments = pgTable("consent_documents", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull().references(() => patients.id),
  therapistId: text("therapist_id").notNull().references(() => therapists.id),
  documentType: text("document_type").notNull().default("recording_consent"),
  documentVersion: text("document_version").notNull(),
  token: text("token").notNull().unique(),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("pending"), // pending | signed | expired
  signedAt: timestamp("signed_at", { withTimezone: true }),
  signerIp: text("signer_ip"),
  signerName: text("signer_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
```

- [ ] **Step 2: Add 6 new columns to the appointments table**

In `apps/api/src/db/schema.ts`, find the appointments table definition. After the line `transcriptJobId: text("transcript_job_id").notNull().default(""),` add:

```typescript
  // recording + transcript
  recordingConsentId: text("recording_consent_id"),
  recordingDailyId: text("recording_daily_id").notNull().default(""),
  recordingStatus: text("recording_status").notNull().default("none"),
  // none | processing | transcribed | transcription_failed | failed
  transcriptDraft: text("transcript_draft"),
  transcriptApprovedAt: timestamp("transcript_approved_at", { withTimezone: true }),
  transcriptApprovedBy: text("transcript_approved_by"),
```

Note: `transcriptJobId` (already exists) will hold the AssemblyAI transcript ID. `recordingDailyId` holds the Daily.co recording ID.

- [ ] **Step 3: Generate migration**

```bash
cd apps/api && npx drizzle-kit generate
```

Expected: a new migration file is created in `apps/api/drizzle/` (e.g., `0007_<slug>.sql`). Inspect it to confirm it adds the `consent_documents` table and the 6 new columns on `appointments`.

- [ ] **Step 4: Apply migration to Railway**

Apply the generated `.sql` file to the Railway Postgres database. You can copy the SQL content and run it via Railway's database console or `psql`.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/db/schema.ts apps/api/drizzle/
git commit -m "feat(db): add consent_documents table and appointment recording columns"
```

---

## Task 3: Contracts — new schemas + extend existing

**Files:**
- Modify: `packages/contracts/src/index.ts`

- [ ] **Step 1: Add new consent schemas**

Find the comment/area near `appointmentCallSchema` in `packages/contracts/src/index.ts` and insert these new schemas before it:

```typescript
export const consentDocumentStatusSchema = z.enum(["not_sent", "pending", "signed"]);

export const consentDocumentPublicSchema = z.object({
  id: z.string(),
  documentVersion: z.string(),
  patientName: z.string(),
  therapistName: z.string(),
  tenantName: z.string(),
  content: z.string()
});
export type ConsentDocumentPublic = z.infer<typeof consentDocumentPublicSchema>;

export const consentSignRequestSchema = z.object({
  signerName: z.string().min(3)
});
export type ConsentSignRequest = z.infer<typeof consentSignRequestSchema>;

export const createConsentDocumentResponseSchema = z.object({
  id: z.string(),
  consentUrl: z.string()
});
export type CreateConsentDocumentResponse = z.infer<typeof createConsentDocumentResponseSchema>;

export const patientTokenResponseSchema = z.object({
  patientUrl: z.string()
});
export type PatientTokenResponse = z.infer<typeof patientTokenResponseSchema>;

export const approveTranscriptResponseSchema = z.object({
  success: z.boolean()
});
export type ApproveTranscriptResponse = z.infer<typeof approveTranscriptResponseSchema>;
```

- [ ] **Step 2: Add transcript status schema**

In the same area, add:

```typescript
export const appointmentTranscriptStatusSchema = z.enum([
  "none",
  "processing",
  "transcribed",
  "approved",
  "failed"
]);
```

- [ ] **Step 3: Extend appointmentDetailSchema**

Find `export const appointmentDetailSchema = z.object({` (around line 548). Add these fields to the object, after the existing fields:

```typescript
  patientPhone: z.string(),
  recordingConsentStatus: consentDocumentStatusSchema,
  recordingConsentLink: z.string(),   // empty string if not_sent or signed
  transcriptStatus: appointmentTranscriptStatusSchema,
  transcriptDraft: z.string().nullable(),
  transcriptApprovedAt: z.string().nullable()
```

- [ ] **Step 4: Extend appointmentCallSchema**

Find `export const appointmentCallSchema = z.object({` (around line 655). Add these fields to the object:

```typescript
  hostToken: z.string(),
  roomUrl: z.string(),
  recordingConsented: z.boolean()
```

- [ ] **Step 5: Commit**

```bash
git add packages/contracts/src/index.ts
git commit -m "feat(contracts): add consent, recording, and transcript schemas"
```

---

## Task 4: Env config — add Daily.co + AssemblyAI variables

**Files:**
- Modify: `apps/api/src/common/config/env.ts`

- [ ] **Step 1: Add 4 new env vars to the Zod schema**

Find the `envSchema` object in `apps/api/src/common/config/env.ts`. Add these fields:

```typescript
  DAILY_API_KEY: z.string().min(1),
  DAILY_WEBHOOK_SECRET: z.string().min(1),
  ASSEMBLYAI_API_KEY: z.string().min(1),
  ASSEMBLYAI_WEBHOOK_TOKEN: z.string().min(1)
```

Note: The `SUPABASE_SERVICE_ROLE_KEY` is already in the env config (used by the existing `SupabaseService`). Do not add it again.

- [ ] **Step 2: Add to Railway environment variables**

In Railway, add these 4 env vars (values from the respective dashboards):
- `DAILY_API_KEY` — dashboard.daily.co → Developers → API Keys
- `DAILY_WEBHOOK_SECRET` — generated when configuring the Daily.co webhook
- `ASSEMBLYAI_API_KEY` — assemblyai.com → Account → API Keys
- `ASSEMBLYAI_WEBHOOK_TOKEN` — any random string you generate (e.g., `openssl rand -hex 32`)

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/common/config/env.ts
git commit -m "feat(config): add Daily.co and AssemblyAI env vars"
```

---

## Task 5: Daily.co HTTP client helper

**Files:**
- Create: `apps/api/src/modules/appointments/daily.client.ts`

- [ ] **Step 1: Create the file**

```typescript
// apps/api/src/modules/appointments/daily.client.ts
import { Logger } from "@nestjs/common";

const DAILY_BASE = "https://api.daily.co/v1";
const logger = new Logger("DailyClient");

async function dailyPost<T>(path: string, body: unknown, apiKey: string): Promise<T> {
  const res = await fetch(`${DAILY_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Daily.co POST ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function dailyGet<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${DAILY_BASE}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Daily.co GET ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// expiry = session end + 30min, as Unix timestamp (seconds)
export function computeRoomExpiry(
  date: string,       // "YYYY-MM-DD"
  startTime: string,  // "HH:MM"
  durationMinutes: number
): number {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startTime.split(":").map(Number);
  const endMs =
    Date.UTC(year!, month! - 1, day!, hour!, minute!) + (durationMinutes + 30) * 60_000;
  return Math.floor(endMs / 1000);
}

export async function createDailyRoom(
  apiKey: string,
  name: string,
  expUnix: number
): Promise<{ url: string; name: string }> {
  try {
    return await dailyPost<{ url: string; name: string }>(
      "/rooms",
      {
        name,
        privacy: "private",
        properties: { exp: expUnix, enable_recording: true, enable_transcription_storage: false }
      },
      apiKey
    );
  } catch (err) {
    // Room name already exists — fetch and return existing room (idempotent)
    if (String(err).includes("409") || String(err).toLowerCase().includes("already exists")) {
      logger.warn(`Room ${name} already exists, fetching existing`);
      return dailyGet<{ url: string; name: string }>(`/rooms/${name}`, apiKey);
    }
    throw err;
  }
}

export async function createMeetingToken(
  apiKey: string,
  roomName: string,
  isOwner: boolean,
  expUnix: number
): Promise<{ token: string }> {
  return dailyPost<{ token: string }>(
    "/meeting-tokens",
    { properties: { room_name: roomName, is_owner: isOwner, exp: expUnix } },
    apiKey
  );
}

export async function startDailyRecording(
  apiKey: string,
  roomName: string
): Promise<{ id: string }> {
  return dailyPost<{ id: string }>("/recordings/start", { roomName }, apiKey);
}

export async function getDailyRecordingLink(
  apiKey: string,
  recordingId: string
): Promise<{ download_link: string }> {
  return dailyGet<{ download_link: string }>(`/recordings/${recordingId}/access-link`, apiKey);
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/modules/appointments/daily.client.ts
git commit -m "feat(appointments): add Daily.co HTTP client helper"
```

---

## Task 6: Consent repository

**Files:**
- Create: `apps/api/src/modules/consent/consent.repository.ts`

- [ ] **Step 1: Create the file**

```typescript
// apps/api/src/modules/consent/consent.repository.ts
import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { DrizzleClient } from "../../db/client";
import { consentDocuments, patients, therapists, tenants } from "../../db/schema";
import { DATABASE_CLIENT } from "../../db/tokens";

export type ConsentDocumentRow = typeof consentDocuments.$inferSelect;

export type ConsentDocumentWithDetails = ConsentDocumentRow & {
  patientName: string;
  therapistName: string;
  tenantName: string;
};

@Injectable()
export class ConsentRepository {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: DrizzleClient) {}

  async create(input: {
    patientId: string;
    therapistId: string;
    documentVersion: string;
    token: string;
    tokenExpiresAt: Date;
  }): Promise<ConsentDocumentRow> {
    const [row] = await this.db
      .insert(consentDocuments)
      .values({
        id: randomUUID(),
        patientId: input.patientId,
        therapistId: input.therapistId,
        documentType: "recording_consent",
        documentVersion: input.documentVersion,
        token: input.token,
        tokenExpiresAt: input.tokenExpiresAt,
        status: "pending",
        updatedAt: new Date()
      })
      .returning();
    return row!;
  }

  async findByTokenWithDetails(token: string): Promise<ConsentDocumentWithDetails | undefined> {
    const [row] = await this.db
      .select({
        id: consentDocuments.id,
        patientId: consentDocuments.patientId,
        therapistId: consentDocuments.therapistId,
        documentType: consentDocuments.documentType,
        documentVersion: consentDocuments.documentVersion,
        token: consentDocuments.token,
        tokenExpiresAt: consentDocuments.tokenExpiresAt,
        status: consentDocuments.status,
        signedAt: consentDocuments.signedAt,
        signerIp: consentDocuments.signerIp,
        signerName: consentDocuments.signerName,
        createdAt: consentDocuments.createdAt,
        updatedAt: consentDocuments.updatedAt,
        patientName: patients.fullName,
        therapistName: therapists.fullName,
        tenantName: tenants.name
      })
      .from(consentDocuments)
      .innerJoin(patients, eq(consentDocuments.patientId, patients.id))
      .innerJoin(therapists, eq(consentDocuments.therapistId, therapists.id))
      .innerJoin(tenants, eq(therapists.tenantId, tenants.id))
      .where(eq(consentDocuments.token, token))
      .limit(1);
    return row as ConsentDocumentWithDetails | undefined;
  }

  async markSigned(id: string, signerName: string, signerIp: string): Promise<void> {
    await this.db
      .update(consentDocuments)
      .set({ status: "signed", signedAt: new Date(), signerName, signerIp, updatedAt: new Date() })
      .where(eq(consentDocuments.id, id));
  }

  async findSignedForPatient(patientId: string): Promise<ConsentDocumentRow | undefined> {
    const [row] = await this.db
      .select()
      .from(consentDocuments)
      .where(and(eq(consentDocuments.patientId, patientId), eq(consentDocuments.status, "signed")))
      .orderBy(desc(consentDocuments.signedAt))
      .limit(1);
    return row;
  }

  async findLatestForPatient(patientId: string): Promise<ConsentDocumentRow | undefined> {
    const [row] = await this.db
      .select()
      .from(consentDocuments)
      .where(eq(consentDocuments.patientId, patientId))
      .orderBy(desc(consentDocuments.createdAt))
      .limit(1);
    return row;
  }
}
```

- [ ] **Step 2: Check that `tenants` is exported from schema.ts**

Run: `grep "export const tenants" apps/api/src/db/schema.ts`

Expected: `export const tenants = pgTable("tenants", {`

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/consent/consent.repository.ts
git commit -m "feat(consent): add consent repository"
```

---

## Task 7: Consent service + controller

**Files:**
- Create: `apps/api/src/modules/consent/consent.service.ts`
- Create: `apps/api/src/modules/consent/consent.controller.ts`

- [ ] **Step 1: Create consent.service.ts**

```typescript
// apps/api/src/modules/consent/consent.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { EnvService } from "../../common/config/env.service";
import type { AuthSession } from "../../common/types/auth";
import { ConsentRepository } from "./consent.repository";
import type { ConsentDocumentPublic, CreateConsentDocumentResponse } from "@terapia/contracts";

const CONSENT_DOCUMENT_VERSION = "2026-05-17";

function buildConsentContent(patientName: string, therapistName: string, tenantName: string): string {
  return `TERMO DE CONSENTIMENTO PARA GRAVAÇÃO DE SESSÃO DE TELEATENDIMENTO

Versão: ${CONSENT_DOCUMENT_VERSION}

Eu, ${patientName}, paciente de ${therapistName} (${tenantName}), consinto expressamente com:

1. GRAVAÇÃO: A captação de áudio e vídeo das sessões de teleatendimento realizadas via plataforma Luma Manager, exclusivamente quando esta funcionalidade estiver ativa.

2. PROCESSAMENTO: O processamento automatizado da gravação por serviço de inteligência artificial (AssemblyAI) para geração de rascunho de anotações clínicas com identificação de locutor.

3. EXCLUSÃO: A exclusão automática do arquivo de gravação após o processamento da transcrição. Somente o texto transcrito, revisado e aprovado pelo terapeuta, será retido como parte do prontuário clínico.

4. REVISÃO HUMANA: O rascunho gerado por IA será revisado e aprovado pelo terapeuta responsável antes de integrar o prontuário. A IA é assistiva — não gera nem decide sobre diagnósticos ou condutas clínicas.

5. VALIDADE: Este consentimento é válido para todas as sessões futuras, podendo ser revogado a qualquer momento mediante comunicação ao terapeuta responsável.

BASE LEGAL: Consentimento específico e destacado do titular (art. 7º, I e art. 11, I da Lei nº 13.709/2018 — LGPD).`;
}

@Injectable()
export class ConsentService {
  constructor(
    private readonly repo: ConsentRepository,
    @Inject(EnvService) private readonly env: EnvService
  ) {}

  async createConsentDocument(
    session: AuthSession,
    patientId: string,
    patientName: string
  ): Promise<CreateConsentDocumentResponse> {
    const token = randomUUID().replace(/-/g, "");
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const doc = await this.repo.create({
      patientId,
      therapistId: session.therapist.id,
      documentVersion: CONSENT_DOCUMENT_VERSION,
      token,
      tokenExpiresAt
    });

    const consentUrl = `${this.env.values.APP_PUBLIC_URL}/consentimento/${token}`;
    return { id: doc.id, consentUrl };
  }

  async getPublicConsentDocument(token: string): Promise<ConsentDocumentPublic> {
    const doc = await this.repo.findByTokenWithDetails(token);
    if (!doc) throw new NotFoundException("Termo não encontrado.");
    if (doc.status === "signed") throw new BadRequestException("Este termo já foi assinado.");
    if (doc.tokenExpiresAt < new Date()) throw new BadRequestException("Este link expirou.");

    return {
      id: doc.id,
      documentVersion: doc.documentVersion,
      patientName: doc.patientName,
      therapistName: doc.therapistName,
      tenantName: doc.tenantName,
      content: buildConsentContent(doc.patientName, doc.therapistName, doc.tenantName)
    };
  }

  async signConsentDocument(token: string, signerName: string, signerIp: string): Promise<void> {
    const doc = await this.repo.findByTokenWithDetails(token);
    if (!doc) throw new NotFoundException("Termo não encontrado.");
    if (doc.status === "signed") throw new BadRequestException("Este termo já foi assinado.");
    if (doc.tokenExpiresAt < new Date()) throw new BadRequestException("Este link expirou.");
    if (!signerName.trim() || signerName.trim().length < 3) {
      throw new BadRequestException("Nome inválido. Digite seu nome completo.");
    }
    await this.repo.markSigned(doc.id, signerName.trim(), signerIp);
  }
}
```

Note: `EnvService` is the injectable service that wraps `readEnv()`. Check what the actual class name is in `apps/api/src/common/config/` — it may be `ConfigService` or `EnvService`. Import accordingly.

- [ ] **Step 2: Create consent.controller.ts**

```typescript
// apps/api/src/modules/consent/consent.controller.ts
import { Body, Controller, Get, Headers, Ip, Param, Post } from "@nestjs/common";

import { AuthService } from "../auth/auth.service";
import { ConsentService } from "./consent.service";

@Controller()
export class ConsentController {
  constructor(
    private readonly consentService: ConsentService,
    private readonly authService: AuthService
  ) {}

  // Authenticated: therapist creates a consent document for a patient
  @Post("patients/:patientId/consent-documents")
  async createConsentDocument(
    @Headers("authorization") authorization: string | undefined,
    @Param("patientId") patientId: string,
    @Body() body: { patientName: string }
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.consentService.createConsentDocument(session, patientId, body.patientName);
  }

  // Public: patient views the consent document (no auth)
  @Get("public/consent/:token")
  async getPublicConsentDocument(@Param("token") token: string) {
    return this.consentService.getPublicConsentDocument(token);
  }

  // Public: patient submits their signature (no auth)
  @Post("public/consent/:token/sign")
  async signConsentDocument(
    @Param("token") token: string,
    @Body() body: { signerName: string },
    @Ip() ip: string
  ) {
    await this.consentService.signConsentDocument(token, body.signerName, ip);
    return { success: true };
  }
}
```

- [ ] **Step 3: Check the AuthService import path**

Run: `find apps/api/src/modules -name "auth.service.ts" | head -3`

Use that exact path for the import.

- [ ] **Step 4: Check EnvService or equivalent**

Run: `find apps/api/src/common/config -name "*.ts" | head -5`

If env values are accessed differently (e.g., via `readEnv()` directly), adjust the consent.service.ts accordingly. The pattern used in other services is the authoritative reference.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/modules/consent/
git commit -m "feat(consent): add consent service and controller"
```

---

## Task 8: Appointments repository — 4 new methods + update findById

**Files:**
- Modify: `apps/api/src/modules/appointments/appointments.repository.ts`

- [ ] **Step 1: Update findById to include new columns**

In `apps/api/src/modules/appointments/appointments.repository.ts`, find the `findById` method (around line 143). In the `.select({...})` block, add these new fields after `updatedAt`:

```typescript
        recordingConsentId: appointments.recordingConsentId,
        recordingDailyId: appointments.recordingDailyId,
        recordingStatus: appointments.recordingStatus,
        transcriptDraft: appointments.transcriptDraft,
        transcriptApprovedAt: appointments.transcriptApprovedAt,
        transcriptApprovedBy: appointments.transcriptApprovedBy
```

Also update the `AppointmentWithPatient` type (or wherever it's defined) to include these fields. If it's inferred from the select, it will pick up automatically.

- [ ] **Step 2: Add 4 new methods at the end of the class**

```typescript
  async storeRoomData(
    appointmentId: string,
    data: { roomUrl: string; roomProviderRef: string; roomState: string }
  ): Promise<void> {
    await this.db
      .update(appointments)
      .set({ roomUrl: data.roomUrl, roomProviderRef: data.roomProviderRef, roomState: data.roomState, updatedAt: new Date() })
      .where(eq(appointments.id, appointmentId));
  }

  async storeRecordingRef(
    appointmentId: string,
    data: { recordingDailyId: string; recordingStatus: string; recordingConsentId?: string }
  ): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        recordingDailyId: data.recordingDailyId,
        recordingStatus: data.recordingStatus,
        ...(data.recordingConsentId ? { recordingConsentId: data.recordingConsentId } : {}),
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }

  async storeTranscriptDraft(
    appointmentId: string,
    data: { transcriptJobId: string; transcriptDraft: string; recordingStatus: string }
  ): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        transcriptJobId: data.transcriptJobId,
        transcriptDraft: data.transcriptDraft,
        recordingStatus: data.recordingStatus,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }

  async approveTranscript(appointmentId: string, therapistId: string): Promise<void> {
    await this.db
      .update(appointments)
      .set({
        recordingStatus: "approved",
        transcriptApprovedAt: new Date(),
        transcriptApprovedBy: therapistId,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, appointmentId));
  }
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/appointments/appointments.repository.ts
git commit -m "feat(appointments): add storeRoomData, storeRecordingRef, storeTranscriptDraft, approveTranscript to repository"
```

---

## Task 9: Appointments service — real Daily.co implementation

**Files:**
- Modify: `apps/api/src/modules/appointments/appointments.service.ts`

The service currently has `provisionRoom` and `getAppointmentCall` fully stubbed. This task replaces both stubs and adds 3 new methods.

- [ ] **Step 1: Add imports at the top of appointments.service.ts**

Add after existing imports:

```typescript
import {
  computeRoomExpiry,
  createDailyRoom,
  createMeetingToken,
  startDailyRecording
} from "./daily.client";
import { ConsentRepository } from "../consent/consent.repository";
```

- [ ] **Step 2: Inject ConsentRepository and env in the constructor**

The service already injects `this.repo` (AppointmentsRepository). Add `ConsentRepository` and access to env. Find the constructor and add:

```typescript
// If the service has a constructor, add:
constructor(
  private readonly repo: AppointmentsRepository,
  private readonly consentRepo: ConsentRepository,
  @Inject(EnvService) private readonly env: EnvService   // or however env is currently accessed
) {}
```

Check how env is currently accessed in the service — follow that same pattern.

- [ ] **Step 3: Replace the provisionRoom stub (around line 327)**

Replace the current stub `async provisionRoom(_session, _appointmentId)` with:

```typescript
  async provisionRoom(session: AuthSession, appointmentId: string): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };

    const appt = await this.repo.findById(session.therapist.id, appointmentId);
    if (!appt) throw new NotFoundException("Sessão não encontrada.");
    if (appt.roomState === "ready") return { success: true }; // idempotent

    const roomName = `luma-${appointmentId}`;
    const expUnix = computeRoomExpiry(appt.date, appt.startTime, appt.durationMinutes);

    const { url } = await createDailyRoom(this.env.values.DAILY_API_KEY, roomName, expUnix);
    await this.repo.storeRoomData(appointmentId, {
      roomUrl: url,
      roomProviderRef: roomName,
      roomState: "ready"
    });

    return { success: true };
  }
```

- [ ] **Step 4: Replace the getAppointmentCall stub (around line 266)**

Replace the current stub `async getAppointmentCall(session, appointmentId)` with:

```typescript
  async getAppointmentCall(session: AuthSession, appointmentId: string): Promise<AppointmentCall> {
    if (isMockEmail(session.therapist.email)) return buildMockCall(appointmentId);

    const appt = await this.repo.findById(session.therapist.id, appointmentId);
    if (!appt) throw new NotFoundException("Sessão não encontrada.");

    const unavailable = (reason: string): AppointmentCall => ({
      appointment: {
        id: appt.id,
        patientName: appt.patientName,
        dateLabel: appt.date,
        timeRangeLabel: `${appt.startTime}`,
        durationLabel: `${appt.durationMinutes} min`,
        detailHref: `/app/appointments/${appt.id}`
      },
      experienceState: "unavailable",
      experienceLabel: "Sala não disponível",
      roomSummary: { state: "not_provisioned", label: "Não provisionada", providerLabel: "—", joinUrlLabel: "—" },
      joinWindow: { therapistOpensAtLabel: "", patientOpensAtLabel: "", scheduledStartLabel: "", scheduledEndLabel: "", canJoinNow: false, blockedReason: reason },
      readiness: { outcome: "blocked", items: [] },
      transcript: { state: "disabled_by_policy", label: "Transcript desativado", description: reason },
      devices: { cameraPermission: "prompt", microphonePermission: "prompt", availableCameras: [], availableMicrophones: [], previewAvailable: false, microphoneLevel: 0 },
      callPermissions: { canProvisionRoom: false, canCheckIn: false, canEndSession: false },
      connection: { state: "failed", label: "Sem conexão", description: reason },
      participants: { therapistJoined: false, patientPresence: "absent", patientLabel: appt.patientName },
      sidePanel: [],
      notices: [],
      hostToken: "",
      roomUrl: "",
      recordingConsented: false
    });

    if (appt.roomState !== "ready") {
      return unavailable("Sala não provisionada. Provisione a sala na página de detalhe.");
    }

    const roomName = appt.roomProviderRef;
    const expUnix = computeRoomExpiry(appt.date, appt.startTime, appt.durationMinutes);

    const { token: hostToken } = await createMeetingToken(
      this.env.values.DAILY_API_KEY,
      roomName,
      true,
      expUnix
    );

    const signedConsent = await this.consentRepo.findSignedForPatient(appt.patientId);

    return {
      appointment: {
        id: appt.id,
        patientName: appt.patientName,
        dateLabel: appt.date,
        timeRangeLabel: `${appt.startTime}`,
        durationLabel: `${appt.durationMinutes} min`,
        detailHref: `/app/appointments/${appt.id}`
      },
      experienceState: "prejoin",
      experienceLabel: "Pronto para entrar",
      roomSummary: { state: "ready", label: "Sala pronta", providerLabel: "Daily.co", joinUrlLabel: appt.roomUrl },
      joinWindow: { therapistOpensAtLabel: appt.startTime, patientOpensAtLabel: appt.startTime, scheduledStartLabel: appt.startTime, scheduledEndLabel: "", canJoinNow: true, blockedReason: "" },
      readiness: { outcome: "ready", items: [] },
      transcript: {
        state: signedConsent ? "active" : "disabled_by_consent",
        label: signedConsent ? "Gravação autorizada" : "Sem consentimento de gravação",
        description: signedConsent
          ? "O paciente autorizou a gravação desta sessão."
          : "O paciente não assinou o termo de consentimento de gravação."
      },
      devices: { cameraPermission: "prompt", microphonePermission: "prompt", availableCameras: [], availableMicrophones: [], previewAvailable: false, microphoneLevel: 0 },
      callPermissions: { canProvisionRoom: false, canCheckIn: true, canEndSession: false },
      connection: { state: "ready", label: "Conexão pronta", description: "Sala disponível." },
      participants: { therapistJoined: false, patientPresence: "absent", patientLabel: appt.patientName },
      sidePanel: [],
      notices: [],
      hostToken,
      roomUrl: appt.roomUrl,
      recordingConsented: !!signedConsent
    };
  }
```

- [ ] **Step 5: Add getPatientToken method**

```typescript
  async getPatientToken(
    session: AuthSession,
    appointmentId: string
  ): Promise<{ patientUrl: string }> {
    if (isMockEmail(session.therapist.email)) {
      return { patientUrl: `https://luma.daily.co/mock-room?t=mock-token` };
    }

    const appt = await this.repo.findById(session.therapist.id, appointmentId);
    if (!appt) throw new NotFoundException("Sessão não encontrada.");
    if (appt.roomState !== "ready") {
      throw new BadRequestException("Sala não provisionada.");
    }

    const expUnix = computeRoomExpiry(appt.date, appt.startTime, appt.durationMinutes);
    const { token } = await createMeetingToken(
      this.env.values.DAILY_API_KEY,
      appt.roomProviderRef,
      false,
      expUnix
    );

    return { patientUrl: `${appt.roomUrl}?t=${token}` };
  }
```

- [ ] **Step 6: Add startRecording method**

```typescript
  async startRecording(
    session: AuthSession,
    appointmentId: string
  ): Promise<{ success: boolean }> {
    if (isMockEmail(session.therapist.email)) return { success: true };

    const appt = await this.repo.findById(session.therapist.id, appointmentId);
    if (!appt) throw new NotFoundException("Sessão não encontrada.");
    if (appt.roomState !== "ready") throw new BadRequestException("Sala não provisionada.");

    const signedConsent = await this.consentRepo.findSignedForPatient(appt.patientId);
    if (!signedConsent) throw new BadRequestException("Paciente não assinou o termo de consentimento de gravação.");

    const { id: recordingDailyId } = await startDailyRecording(
      this.env.values.DAILY_API_KEY,
      appt.roomProviderRef
    );

    await this.repo.storeRecordingRef(appointmentId, {
      recordingDailyId,
      recordingStatus: "processing",
      recordingConsentId: signedConsent.id
    });

    return { success: true };
  }
```

- [ ] **Step 7: Add approveTranscript method**

```typescript
  async approveTranscript(
    session: AuthSession,
    appointmentId: string
  ): Promise<{ success: boolean }> {
    const appt = await this.repo.findById(session.therapist.id, appointmentId);
    if (!appt) throw new NotFoundException("Sessão não encontrada.");
    if (appt.recordingStatus !== "transcribed") {
      throw new BadRequestException("Não há rascunho de transcrição disponível para aprovação.");
    }
    await this.repo.approveTranscript(appointmentId, session.therapist.id);
    return { success: true };
  }
```

- [ ] **Step 8: Update getAppointmentDetail to include new fields**

Find where `getAppointmentDetail` builds the return object. Add these fields to the response:

```typescript
      patientPhone: a.patientPhone,
      recordingConsentStatus: signedConsent
        ? "signed"
        : latestConsent
          ? "pending"
          : "not_sent",
      recordingConsentLink: (latestConsent && latestConsent.status === "pending")
        ? `${this.env.values.APP_PUBLIC_URL}/consentimento/${latestConsent.token}`
        : "",
      transcriptStatus: (a.recordingStatus as any) ?? "none",
      transcriptDraft: a.transcriptDraft ?? null,
      transcriptApprovedAt: a.transcriptApprovedAt?.toISOString() ?? null
```

To get `signedConsent` and `latestConsent`, at the start of `getAppointmentDetail` add:

```typescript
    const signedConsent = await this.consentRepo.findSignedForPatient(a.patientId);
    const latestConsent = signedConsent ?? await this.consentRepo.findLatestForPatient(a.patientId);
```

where `a` is the fetched appointment row.

- [ ] **Step 9: Commit**

```bash
git add apps/api/src/modules/appointments/appointments.service.ts
git commit -m "feat(appointments): implement Daily.co provisioning, call, recording, and transcript approval"
```

---

## Task 10: Appointments controller — 3 new routes

**Files:**
- Modify: `apps/api/src/modules/appointments/appointments.controller.ts`

- [ ] **Step 1: Add 3 new routes**

In `apps/api/src/modules/appointments/appointments.controller.ts`, after the existing `@Post(":appointmentId/room")` route, add:

```typescript
  @Post(":appointmentId/patient-token")
  async getPatientToken(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.service.getPatientToken(session, appointmentId);
  }

  @Post(":appointmentId/recording/start")
  async startRecording(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.service.startRecording(session, appointmentId);
  }

  @Post(":appointmentId/approve-transcript")
  async approveTranscript(
    @Headers("authorization") authorization: string | undefined,
    @Param("appointmentId") appointmentId: string
  ) {
    const session = await this.authService.getSessionFromAuthorizationHeader(authorization);
    return this.service.approveTranscript(session, appointmentId);
  }
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/modules/appointments/appointments.controller.ts
git commit -m "feat(appointments): add patient-token, recording/start, approve-transcript routes"
```

---

## Task 11: Recording service

**Files:**
- Create: `apps/api/src/modules/recording/recording.service.ts`

- [ ] **Step 1: Create the file**

```typescript
// apps/api/src/modules/recording/recording.service.ts
import { Inject, Injectable, Logger } from "@nestjs/common";

import { EnvService } from "../../common/config/env.service";
import { SupabaseService } from "../platform/supabase/supabase.service";
import { getDailyRecordingLink } from "../appointments/daily.client";
import { AppointmentsRepository } from "../appointments/appointments.repository";

const BUCKET = "session-recordings";

@Injectable()
export class RecordingService {
  private readonly logger = new Logger(RecordingService.name);

  constructor(
    @Inject(EnvService) private readonly env: EnvService,
    private readonly supabase: SupabaseService,
    private readonly apptRepo: AppointmentsRepository
  ) {}

  // Called by the Daily.co webhook handler when recording.ready fires
  async processRecording(appointmentId: string, recordingDailyId: string): Promise<void> {
    const supabaseClient = this.supabase.adminClient;
    if (!supabaseClient) {
      this.logger.error("Supabase not configured — cannot process recording");
      return;
    }

    let supabasePath: string | null = null;
    let assemblyAiId: string | null = null;

    try {
      // 1. Get download link from Daily.co
      const { download_link } = await getDailyRecordingLink(
        this.env.values.DAILY_API_KEY,
        recordingDailyId
      );

      // 2. Download audio file
      const audioResponse = await fetch(download_link);
      if (!audioResponse.ok) throw new Error(`Failed to download recording: ${audioResponse.status}`);
      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

      // 3. Upload to Supabase Storage (encrypted bucket)
      supabasePath = `${appointmentId}/${Date.now()}.mp4`;
      const { error: uploadError } = await supabaseClient.storage
        .from(BUCKET)
        .upload(supabasePath, audioBuffer, { contentType: "video/mp4", upsert: false });
      if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`);

      // 4. Get signed URL (15 min expiry) for AssemblyAI
      const { data: signedData, error: signedError } = await supabaseClient.storage
        .from(BUCKET)
        .createSignedUrl(supabasePath, 900);
      if (signedError || !signedData) throw new Error(`Signed URL failed: ${signedError?.message}`);

      // 5. Submit to AssemblyAI
      const assemblyRes = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          Authorization: this.env.values.ASSEMBLYAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          audio_url: signedData.signedUrl,
          speaker_labels: true,
          webhook_url: `${this.env.values.APP_PUBLIC_URL}/v1/webhooks/assemblyai`,
          webhook_auth_header_name: "X-Webhook-Token",
          webhook_auth_header_value: this.env.values.ASSEMBLYAI_WEBHOOK_TOKEN
        })
      });
      if (!assemblyRes.ok) throw new Error(`AssemblyAI submission failed: ${assemblyRes.status}`);
      const { id } = (await assemblyRes.json()) as { id: string };
      assemblyAiId = id;

      this.logger.log(`Recording submitted to AssemblyAI: ${id} for appointment ${appointmentId}`);
    } catch (err) {
      this.logger.error(`Recording processing failed for ${appointmentId}:`, err);
      await this.apptRepo.storeTranscriptDraft(appointmentId, {
        transcriptJobId: assemblyAiId ?? "",
        transcriptDraft: "",
        recordingStatus: "failed"
      }).catch(() => null);
      // Cleanup Supabase if upload succeeded but AssemblyAI failed
      if (supabasePath) await this.deleteFromSupabase(supabaseClient, supabasePath);
    }
  }

  // Called by the AssemblyAI webhook handler when transcript.completed fires
  async saveTranscript(
    appointmentId: string,
    assemblyAiId: string,
    utterances: Array<{ speaker: string; text: string }>
  ): Promise<void> {
    // Format: Speaker A = therapist (enters first as host), Speaker B = patient
    const draft = utterances
      .map((u) => `[${u.speaker === "A" ? "Terapeuta" : "Paciente"}]: ${u.text}`)
      .join("\n\n");

    await this.apptRepo.storeTranscriptDraft(appointmentId, {
      transcriptJobId: assemblyAiId,
      transcriptDraft: draft,
      recordingStatus: "transcribed"
    });

    // Cleanup: delete from Supabase and AssemblyAI (fire and forget)
    const supabaseClient = this.supabase.adminClient;
    if (supabaseClient) {
      supabaseClient.storage
        .from(BUCKET)
        .list(appointmentId)
        .then(({ data }) => {
          const paths = (data ?? []).map((f) => `${appointmentId}/${f.name}`);
          if (paths.length > 0) this.deleteFromSupabase(supabaseClient, ...paths);
        })
        .catch((err) => this.logger.error("Supabase cleanup failed:", err));
    }

    fetch(`https://api.assemblyai.com/v2/transcript/${assemblyAiId}`, {
      method: "DELETE",
      headers: { Authorization: this.env.values.ASSEMBLYAI_API_KEY }
    }).catch((err) => this.logger.error("AssemblyAI cleanup failed:", err));
  }

  private async deleteFromSupabase(
    client: NonNullable<SupabaseService["adminClient"]>,
    ...paths: string[]
  ): Promise<void> {
    const { error } = await client.storage.from(BUCKET).remove(paths);
    if (error) this.logger.error("Supabase delete failed:", error);
  }
}
```

Note: Check the exact import path for `EnvService` by running:
`find apps/api/src/common -name "*.ts" | head -10`

- [ ] **Step 2: Create the Supabase bucket**

In Supabase dashboard: Storage → Create bucket → Name: `session-recordings` → Private (no public access). Confirm server-side encryption is enabled (it's the default).

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/recording/
git commit -m "feat(recording): add recording service with Supabase + AssemblyAI pipeline"
```

---

## Task 12: Webhooks controller

**Files:**
- Create: `apps/api/src/modules/webhooks/webhooks.controller.ts`

- [ ] **Step 1: Create the file**

```typescript
// apps/api/src/modules/webhooks/webhooks.controller.ts
import { BadRequestException, Body, Controller, Headers, Inject, Logger, Post, Req } from "@nestjs/common";
import { createHmac } from "node:crypto";
import type { FastifyRequest } from "fastify";

import { EnvService } from "../../common/config/env.service";
import { RecordingService } from "../recording/recording.service";
import { AppointmentsRepository } from "../appointments/appointments.repository";

@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @Inject(EnvService) private readonly env: EnvService,
    private readonly recordingService: RecordingService,
    private readonly apptRepo: AppointmentsRepository
  ) {}

  @Post("daily")
  async handleDailyWebhook(
    @Req() req: FastifyRequest,
    @Body() body: Record<string, unknown>,
    @Headers("x-daily-signature") signature: string | undefined
  ) {
    // Validate HMAC signature
    const rawBody = (req as FastifyRequest & { rawBody?: string }).rawBody ?? "";
    if (!this.validateDailySignature(rawBody, signature)) {
      this.logger.warn("Daily.co webhook: invalid signature");
      throw new BadRequestException("Invalid signature");
    }

    const event = body["action"] as string;
    if (event !== "recording.ready") {
      return { received: true }; // ignore other events
    }

    const recordingId = (body["recordingId"] ?? body["id"]) as string;
    const roomName = body["roomName"] as string | undefined;

    if (!recordingId || !roomName) {
      this.logger.warn("Daily.co recording.ready: missing recordingId or roomName");
      return { received: true };
    }

    // Room name format: "luma-{appointmentId}"
    const appointmentId = roomName.replace(/^luma-/, "");

    this.logger.log(`Recording ready: ${recordingId} for appointment ${appointmentId}`);

    // Process async (don't await — webhook must return 200 quickly)
    this.recordingService
      .processRecording(appointmentId, recordingId)
      .catch((err) => this.logger.error("processRecording error:", err));

    return { received: true };
  }

  @Post("assemblyai")
  async handleAssemblyAiWebhook(
    @Body() body: Record<string, unknown>,
    @Headers("x-webhook-token") webhookToken: string | undefined
  ) {
    // Validate webhook token
    if (webhookToken !== this.env.values.ASSEMBLYAI_WEBHOOK_TOKEN) {
      this.logger.warn("AssemblyAI webhook: invalid token");
      throw new BadRequestException("Invalid token");
    }

    const status = body["status"] as string;
    if (status !== "completed") {
      this.logger.log(`AssemblyAI webhook: status=${status}, ignoring`);
      return { received: true };
    }

    const transcriptId = body["transcript_id"] as string;
    const utterances = (body["utterances"] as Array<{ speaker: string; text: string }>) ?? [];

    if (!transcriptId) {
      this.logger.warn("AssemblyAI webhook: missing transcript_id");
      return { received: true };
    }

    // Find appointment by transcriptJobId
    // Note: This requires a findByTranscriptJobId method in AppointmentsRepository
    const appt = await this.apptRepo.findByTranscriptJobId(transcriptId);
    if (!appt) {
      this.logger.warn(`No appointment found for transcript ${transcriptId}`);
      return { received: true };
    }

    this.logger.log(`Transcript completed: ${transcriptId} for appointment ${appt.id}`);

    await this.recordingService.saveTranscript(appt.id, transcriptId, utterances);

    return { received: true };
  }

  private validateDailySignature(rawBody: string, signatureHeader: string | undefined): boolean {
    if (!signatureHeader) return false;
    const parts = signatureHeader.split(",");
    const t = parts.find((p) => p.startsWith("t="))?.slice(2);
    const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);
    if (!t || !v1) return false;
    const expected = createHmac("sha256", this.env.values.DAILY_WEBHOOK_SECRET)
      .update(`${t}.${rawBody}`)
      .digest("hex");
    return expected === v1;
  }
}
```

- [ ] **Step 2: Add findByTranscriptJobId to AppointmentsRepository**

In `apps/api/src/modules/appointments/appointments.repository.ts`, add:

```typescript
  async findByTranscriptJobId(transcriptJobId: string): Promise<{ id: string; patientId: string } | null> {
    const [row] = await this.db
      .select({ id: appointments.id, patientId: appointments.patientId })
      .from(appointments)
      .where(eq(appointments.transcriptJobId, transcriptJobId))
      .limit(1);
    return row ?? null;
  }
```

- [ ] **Step 3: Configure Daily.co webhook**

In the Daily.co dashboard:
1. Go to Developers → Webhooks
2. Add webhook URL: `https://api.lumamanager.com.br/v1/webhooks/daily`
3. Select event: `recording.ready`
4. Copy the webhook secret → add to Railway as `DAILY_WEBHOOK_SECRET`

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/webhooks/ apps/api/src/modules/appointments/appointments.repository.ts
git commit -m "feat(webhooks): add Daily.co and AssemblyAI webhook handlers"
```

---

## Task 13: Register new providers in app.module.ts

**Files:**
- Modify: `apps/api/src/app.module.ts`

- [ ] **Step 1: Add imports**

```typescript
import { ConsentRepository } from "./modules/consent/consent.repository";
import { ConsentService } from "./modules/consent/consent.service";
import { ConsentController } from "./modules/consent/consent.controller";
import { RecordingService } from "./modules/recording/recording.service";
import { WebhooksController } from "./modules/webhooks/webhooks.controller";
```

- [ ] **Step 2: Add to controllers array**

```typescript
controllers: [
  // ... existing controllers ...
  ConsentController,
  WebhooksController,
],
```

- [ ] **Step 3: Add to providers array**

```typescript
providers: [
  // ... existing providers ...
  ConsentRepository,
  ConsentService,
  RecordingService,
],
```

- [ ] **Step 4: Verify the app compiles**

```bash
cd apps/api && npx tsc --noEmit
```

Expected: no errors. Fix any import path issues.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/app.module.ts
git commit -m "feat(app): register consent module, recording service, and webhooks controller"
```

---

## Task 14: Next.js API proxy routes (6 new files)

**Files:**
- Create: all 6 proxy routes listed in the file map

- [ ] **Step 1: Create patient-token proxy**

```typescript
// apps/web/app/api/appointments/[appointmentId]/patient-token/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch"; // use the same helper as other proxy routes

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const payload = await apiFetch(`/v1/appointments/${appointmentId}/patient-token`, {
    method: "POST",
    headers: { authorization: request.headers.get("authorization") ?? "" }
  });
  return NextResponse.json(payload);
}
```

Note: Check how other proxy routes import `apiFetch` and pass the authorization header. Look at `apps/web/app/api/appointments/[appointmentId]/room/route.ts` for the exact pattern.

- [ ] **Step 2: Create recording/start proxy**

```typescript
// apps/web/app/api/appointments/[appointmentId]/recording/start/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const payload = await apiFetch(`/v1/appointments/${appointmentId}/recording/start`, {
    method: "POST",
    headers: { authorization: request.headers.get("authorization") ?? "" }
  });
  return NextResponse.json(payload);
}
```

- [ ] **Step 3: Create approve-transcript proxy**

```typescript
// apps/web/app/api/appointments/[appointmentId]/approve-transcript/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const payload = await apiFetch(`/v1/appointments/${appointmentId}/approve-transcript`, {
    method: "POST",
    headers: { authorization: request.headers.get("authorization") ?? "" }
  });
  return NextResponse.json(payload);
}
```

- [ ] **Step 4: Create consent-documents proxy (authenticated)**

```typescript
// apps/web/app/api/patients/[patientId]/consent-documents/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params;
  const body = await request.json();
  const payload = await apiFetch(`/v1/patients/${patientId}/consent-documents`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { authorization: request.headers.get("authorization") ?? "" }
  });
  return NextResponse.json(payload);
}
```

- [ ] **Step 5: Create public consent proxy**

```typescript
// apps/web/app/api/public/consent/[token]/route.ts
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const payload = await apiFetch(`/v1/public/consent/${token}`, { method: "GET" });
  return NextResponse.json(payload);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();
  const payload = await apiFetch(`/v1/public/consent/${token}/sign`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return NextResponse.json(payload);
}
```

- [ ] **Step 6: Check the correct apiFetch import**

Run: `grep -r "apiFetch\|api-fetch" apps/web/app/api/appointments/ | head -5`

Use whatever import path the existing routes use. Do not guess.

- [ ] **Step 7: Commit**

```bash
git add apps/web/app/api/
git commit -m "feat(web): add proxy routes for consent, patient-token, recording, and transcript"
```

---

## Task 15: Consent signing page (public frontend)

**Files:**
- Create: `apps/web/app/(public)/consentimento/[token]/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// apps/web/app/(public)/consentimento/[token]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PublicPageShell } from "@/components/public/public-page-shell"; // use the same shell as /politica-de-privacidade

// Fetch the document on mount
function useConsentDocument(token: string) {
  const [doc, setDoc] = useState<{
    id: string;
    documentVersion: string;
    patientName: string;
    therapistName: string;
    tenantName: string;
    content: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(`/api/public/consent/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { message?: string } | null;
          throw new Error(body?.message ?? "Link inválido ou expirado.");
        }
        return res.json();
      })
      .then(setDoc)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  });

  return { doc, error, loading };
}

export default function ConsentimentoPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { doc, error, loading } = useConsentDocument(token);
  const [signerName, setSignerName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSign() {
    if (!agreed || signerName.trim().length < 3) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/public/consent/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signerName: signerName.trim() })
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Não foi possível registrar a assinatura.");
      }
      setSigned(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao assinar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicPageShell>
      <div className="mx-auto max-w-2xl px-6 py-16">
        {loading && (
          <p className="text-center text-[var(--color-text-muted)]">Carregando...</p>
        )}

        {error && (
          <div className="rounded-[20px] border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">Link inválido</p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}

        {signed && (
          <div className="rounded-[20px] border border-green-200 bg-green-50 p-8 text-center">
            <p className="text-xl font-semibold text-green-800">Assinatura registrada</p>
            <p className="mt-3 text-sm text-green-700">
              Seu consentimento foi registrado com sucesso. Você pode fechar esta janela.
            </p>
          </div>
        )}

        {!loading && !error && !signed && doc && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Termo de consentimento</h1>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Leia o documento abaixo antes de assinar.
              </p>
            </div>

            <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-[var(--color-text)]">
                {doc.content}
              </pre>
            </div>

            <div className="space-y-4 rounded-[20px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.9)] p-6">
              <div>
                <label className="block text-sm font-medium" htmlFor="signerName">
                  Seu nome completo
                </label>
                <input
                  className="mt-1.5 w-full rounded-[12px] border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  id="signerName"
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  type="text"
                  value={signerName}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  checked={agreed}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                  onChange={(e) => setAgreed(e.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm leading-6">
                  Li o documento acima na íntegra e concordo com os termos do consentimento de gravação.
                </span>
              </label>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <button
                className="w-full rounded-[14px] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                disabled={!agreed || signerName.trim().length < 3 || submitting}
                onClick={handleSign}
                type="button"
              >
                {submitting ? "Registrando..." : "Confirmar assinatura"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
```

Note: Check the exact import path for `PublicPageShell` by running:
`grep -r "PublicPageShell" apps/web/app/\(public\)/ | head -3`

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/\(public\)/consentimento/
git commit -m "feat(web): add patient consent signing page"
```

---

## Task 16: Appointment detail page — consent badge + WhatsApp buttons + TranscriptCard

**Files:**
- Modify: `apps/web/src/components/agenda/appointment-detail-page.tsx`

- [ ] **Step 1: Update VirtualRoomCard to show consent status and WhatsApp consent button**

Find `function VirtualRoomCard({ appointment }` (around line 478). Replace the entire function with:

```tsx
function VirtualRoomCard({ appointment }: { appointment: AppointmentDetail }) {
  if (appointment.modality === "in_person") return null;

  const dotClass = roomStateDot[appointment.roomState] ?? "bg-[var(--color-text-muted)]";

  function openWhatsAppConsent() {
    const phone = appointment.patientPhone.replace(/\D/g, "");
    const name = appointment.patientSummary.find((s) => s.label === "Nome")?.value ?? "você";
    const msg = encodeURIComponent(
      `Olá ${name}! Para que possamos gravar nossas sessões e gerar anotações automáticas, preciso da sua autorização. Leia e assine o termo pelo link abaixo:\n\n${appointment.recordingConsentLink}\n\nA assinatura é válida para todas as sessões futuras.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  }

  async function openWhatsAppPatientToken() {
    const res = await fetch(`/api/appointments/${appointment.id}/patient-token`, { method: "POST" });
    if (!res.ok) return;
    const { patientUrl } = (await res.json()) as { patientUrl: string };
    const phone = appointment.patientPhone.replace(/\D/g, "");
    const name = appointment.patientSummary.find((s) => s.label === "Nome")?.value ?? "você";
    const msg = encodeURIComponent(
      `Olá ${name}! Sua sessão de teleatendimento está confirmada para hoje. Acesse pelo link:\n\n${patientUrl}\n\nCertifique-se de estar em local reservado e com câmera/microfone disponíveis.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DoorOpen className="h-4 w-4" />
          <p className="text-base font-semibold">Sala virtual</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", dotClass)} />
            <p className="text-sm font-semibold">{appointment.roomStatusLabel}</p>
          </div>
          <Badge tone={appointment.recordingConsentStatus === "signed" ? "success" : "warning"}>
            {appointment.recordingConsentStatus === "signed"
              ? "Gravação autorizada"
              : appointment.recordingConsentStatus === "pending"
                ? "Termo pendente"
                : "Sem consentimento"}
          </Badge>
        </div>

        <Button asChild className="w-full">
          <Link href={appointment.primaryAction.href}>{appointment.primaryAction.label}</Link>
        </Button>

        {appointment.roomState === "ready" && (
          <Button className="w-full" onClick={openWhatsAppPatientToken} type="button" variant="secondary">
            Enviar link da sessão (WhatsApp)
          </Button>
        )}

        {appointment.recordingConsentStatus !== "signed" && appointment.recordingConsentLink && (
          <Button className="w-full" onClick={openWhatsAppConsent} type="button" variant="ghost">
            Enviar termo de consentimento (WhatsApp)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Add TranscriptCard component at the end of the file**

```tsx
function TranscriptCard({ appointment }: { appointment: AppointmentDetail }) {
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(appointment.transcriptStatus === "approved");
  const router = useRouter();

  if (!["transcribed", "approved", "failed"].includes(appointment.transcriptStatus ?? "")) return null;

  async function handleApprove() {
    setApproving(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/approve-transcript`, { method: "POST" });
      if (res.ok) {
        setApproved(true);
        router.refresh();
      }
    } finally {
      setApproving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-base font-semibold">Rascunho de transcrição</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          {approved
            ? "Aprovado pelo terapeuta. Este rascunho faz parte do prontuário."
            : "Revise o rascunho gerado por IA antes de aprovar. A aprovação é o ato clínico."}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointment.transcriptStatus === "failed" ? (
          <p className="text-sm text-red-600">A transcrição falhou. Entre em contato com o suporte.</p>
        ) : (
          <>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-[16px] border border-[var(--color-border)] bg-white p-4 font-sans text-sm leading-7">
              {appointment.transcriptDraft ?? ""}
            </pre>
            {!approved && (
              <Button
                className="w-full"
                disabled={approving}
                onClick={handleApprove}
                type="button"
              >
                {approving ? "Aprovando..." : "Aprovar rascunho"}
              </Button>
            )}
            {approved && appointment.transcriptApprovedAt && (
              <p className="text-center text-xs text-[var(--color-text-muted)]">
                Aprovado em {new Date(appointment.transcriptApprovedAt).toLocaleString("pt-BR")}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Add TranscriptCard to the main layout**

In the `AppointmentDetailPageView` return JSX, find where `<VirtualRoomCard appointment={appointment} />` is rendered (around line 190). After it, add:

```tsx
<TranscriptCard appointment={appointment} />
```

- [ ] **Step 4: Check imports**

Make sure `useState` is already imported in the detail page (it is, on line 2 from `"react"`). `useRouter` is already imported too.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/agenda/appointment-detail-page.tsx
git commit -m "feat(web): add recording consent UI and transcript review card to appointment detail"
```

---

## Task 17: Call page — consent badge + iframe embed + recording start

**Files:**
- Modify: `apps/web/src/components/agenda/appointment-call-page.tsx`

- [ ] **Step 1: Add iframeVisible state**

In `AppointmentCallPageView` (line 24), after the existing state declarations, add:

```typescript
  const [iframeVisible, setIframeVisible] = useState(false);
```

- [ ] **Step 2: Add handleEnter function**

After the `runAction` function (around line 96), add:

```typescript
  async function handleEnter() {
    setIsBusy("check-in");
    setError(null);

    // Start recording if patient has consented
    if (call.recordingConsented) {
      try {
        await fetch(`/api/appointments/${call.appointment.id}/recording/start`, { method: "POST" });
      } catch {
        // Recording start failure is non-blocking — continue to enter the room
      }
    }

    // Show the Daily.co iframe
    setIframeVisible(true);
    setEnteredAt(Date.now());
    setIsBusy(null);
  }
```

- [ ] **Step 3: Add consent badge to the header badges section**

Find the badges area in the header (around line 120–124):

```tsx
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">Teleatendimento web</Badge>
              <Badge tone={readinessTone}>{call.experienceLabel}</Badge>
              <Badge tone={call.transcript.state === "active" ? "success" : "warning"}>
                {call.transcript.label}
              </Badge>
            </div>
```

Add the recording consent badge after the transcript badge:

```tsx
              <Badge tone={call.recordingConsented ? "success" : "warning"}>
                {call.recordingConsented ? "Gravação autorizada" : "Sem consentimento de gravação"}
              </Badge>
```

- [ ] **Step 4: Replace the VideoPanel section with the Daily.co iframe when live**

Find the section that contains `<VideoPanel` components (around line 166). The block looks like:

```tsx
              <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
                <VideoPanel isRemote ... />
                <VideoPanel isCameraOn ... />
              </div>
```

Replace the inner content with a conditional:

```tsx
              <div className="mt-6">
                {iframeVisible && call.roomUrl && call.hostToken ? (
                  <iframe
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="h-[560px] w-full rounded-2xl border-0"
                    src={`${call.roomUrl}?t=${call.hostToken}`}
                    title="Sala de teleatendimento"
                  />
                ) : (
                  <div className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
                    <VideoPanel isRemote state={call.participants.patientPresence} title={call.appointment.patientName} />
                    <VideoPanel isCameraOn={isCameraOn} title="Você" />
                  </div>
                )}
              </div>
```

- [ ] **Step 5: Change "Entrar agora" button to call handleEnter**

Find the "Entrar agora" button (around line 294–301):

```tsx
                <Button
                  className="w-full"
                  disabled={isBusy !== null || !call.callPermissions.canCheckIn}
                  onClick={() => runAction("check-in")}
                  type="button"
                >
                  Entrar agora
                </Button>
```

Change `onClick={() => runAction("check-in")}` to `onClick={handleEnter}`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/agenda/appointment-call-page.tsx
git commit -m "feat(web): add Daily.co iframe embed, consent badge, and recording start to call page"
```

---

## Post-implementation checklist

- [ ] Verify the API compiles: `cd apps/api && npx tsc --noEmit`
- [ ] Verify Next.js builds: `cd apps/web && npx next build`
- [ ] Add Daily.co webhook in dashboard.daily.co (URL: `https://api.lumamanager.com.br/v1/webhooks/daily`, event: `recording.ready`)
- [ ] Add all 4 env vars to Railway
- [ ] Create Supabase Storage bucket `session-recordings` (private)
- [ ] Sign Daily.co DPA in dashboard.daily.co → Settings → Privacy & Compliance
- [ ] Sign AssemblyAI DPA at assemblyai.com/legal
- [ ] Add Daily.co and AssemblyAI rows to `/politica-de-privacidade` page
- [ ] Test full flow: provision room → send consent → patient signs → enter call → recording starts → session ends → transcript appears → therapist approves
