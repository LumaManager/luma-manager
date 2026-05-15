# Self-Scheduling Links — Design

## Problem

Therapists need a way to send patients a link every week so they can pick their own session time. The link must work without patient authentication, create the appointment automatically, and be distributable via WhatsApp.

## Solution Overview

Token-based, no-auth booking page. Therapist generates one unique link per patient per week in bulk, then distributes via WhatsApp (wa.me deep links — no WhatsApp API required). Patient opens link, picks a slot, appointment is created and confirmed automatically. Link expires on use or at end of Sunday.

---

## Data Model

New table: `scheduling_tokens`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `tenant_id` | UUID | FK → tenants |
| `therapist_id` | UUID | FK → therapists |
| `patient_id` | UUID | FK → patients |
| `token` | VARCHAR(24) | Nanoid, unique, used in URL |
| `week_start` | DATE | Monday of target week (e.g. 2026-05-19) |
| `week_end` | DATE | Sunday of target week (e.g. 2026-05-25) |
| `status` | ENUM | `pending` \| `used` \| `expired` |
| `appointment_id` | UUID? | FK → appointments, set on booking |
| `expires_at` | TIMESTAMP | Sunday 23:59:59 in therapist's timezone |
| `used_at` | TIMESTAMP? | Set when patient confirms |
| `created_at` | TIMESTAMP | — |

**Indexes:**
- `token` — unique
- `(therapist_id, patient_id, week_start)` — unique (prevents duplicate links per patient per week, and isolates therapists from each other)

**Multi-tenancy safety:** The unique index on `(therapist_id, patient_id, week_start)` means two therapists' data can never collide. The public endpoint only looks up by `token` and returns no sensitive data.

---

## API

### Authenticated endpoints (therapist)

**`POST /v1/scheduling/tokens/generate-week`**

Generates tokens for all patients of the therapist with `status = 'active'` for a given week. Idempotent — if a token already exists for `(therapist_id, patient_id, week_start)`, returns the existing one.

Request body:
```json
{ "weekStart": "2026-05-19" }
```

Response:
```json
{
  "weekStart": "2026-05-19",
  "weekEnd": "2026-05-25",
  "tokens": [
    {
      "patientId": "patient_xxx",
      "patientName": "Renata Costa",
      "phone": "11965432109",
      "token": "abc123xyz",
      "bookingUrl": "https://lumamanager.com.br/agendar/abc123xyz",
      "whatsappUrl": "https://wa.me/5511965432109?text=Oi%20Renata%2C...",
      "status": "pending"
    }
  ]
}
```

**`GET /v1/scheduling/tokens/week?weekStart=2026-05-19`**

Returns token status list for the week — used by the distribution drawer to show who confirmed and who hasn't.

Response: same shape as generate, with current statuses.

### Public endpoints (no auth)

**`GET /v1/public/scheduling/:token`**

Validates token (exists + `pending` + not expired). Returns booking page data. No sensitive data — only what the patient needs to see.

Response:
```json
{
  "therapistName": "Ana Almeida",
  "patientFirstName": "Renata",
  "weekStart": "2026-05-19",
  "weekEnd": "2026-05-25",
  "slots": [
    { "date": "2026-05-19", "dayLabel": "Segunda, 19 mai", "startTime": "09:00", "endTime": "10:00" },
    { "date": "2026-05-19", "dayLabel": "Segunda, 19 mai", "startTime": "10:00", "endTime": "11:00" }
  ]
}
```

States returned when token is invalid:
- `{ "state": "used" }` — already booked
- `{ "state": "expired" }` — past Sunday cutoff
- `{ "state": "not_found" }` — invalid token

**`POST /v1/public/scheduling/:token/book`**

Books the selected slot. Creates appointment, marks token as `used`.

Request body:
```json
{ "date": "2026-05-20", "startTime": "14:00" }
```

Response (success):
```json
{
  "confirmedAt": "terça-feira, 20 de maio às 14h",
  "therapistName": "Ana Almeida"
}
```

Response (conflict — slot already taken):
```json
{
  "error": "slot_taken",
  "message": "Este horário acabou de ser reservado. Escolha outro."
}
```

On conflict, client re-fetches available slots and shows the updated list.

---

## Slot Computation

For each day in `[weekStart, weekEnd]`:

1. Get `availability_rules` for the weekday — skip if `enabled = false`
2. Get `availability_windows` for the rule
3. Generate candidate slots every `sessionDurationMinutes` within each window
4. Load existing appointments for the therapist on that date (status: scheduled/confirmed/in_progress)
5. Load `schedule_blocks` for that date
6. Remove candidates that overlap with any appointment or block (using gap: add `gapMinutes` buffer after each appointment)
7. Remove slots where `startTime` is in the past (relative to now in therapist timezone)
8. Return remaining slots

Conflict handling at booking time: before inserting the appointment, check for overlapping appointments in the same `(therapist_id, date, time range)`. If conflict found, return `slot_taken` error. Client shows updated slot list.

---

## Frontend

### Surface 1 — Distribution Drawer (inside Agenda)

Entry point: "Distribuir links" button in the Agenda page header (alongside "Nova sessão" and "Disponibilidade").

Drawer behavior:
- Opens with next week pre-selected (Mon–Sun)
- If no tokens generated yet: shows "Gerar links para a semana de 19–25 mai" button
- After generation (or if tokens exist): shows patient list

Patient list row:
```
Renata Costa   · Aguardando   [WhatsApp ↗]
Pedro Souza    · Confirmado ✓ [WhatsApp ↗]
Maria Lima     · Aguardando   [WhatsApp ↗]
```

WhatsApp URL format:
```
https://wa.me/55{phone}?text=Oi {firstName}, segue o link para você escolher seu horário da semana de {weekRange}: {bookingUrl}
```

Phone normalization: strip all non-digits from the stored phone, then prepend `55` (Brazil country code). Example: `(11) 96543-2109` → `5511965432109`.

Status badges:
- `pending` → "Aguardando" (neutral)
- `used` → "Confirmado" (success)
- `expired` → "Expirado" (warning)

### Surface 2 — Public Booking Page `/agendar/[token]`

No app layout, no auth. Standalone page.

States:
1. **Loading** — skeleton while fetching token data
2. **Slot picker** — "Olá, Renata! Escolha seu horário da semana de 19–25 mai." + grid of available slots grouped by day
3. **Confirmation** — "Confirmar sessão na terça, 20 de maio às 14h?" with confirm/back buttons
4. **Success** — "Sessão confirmada! Até terça-feira, 20 de maio às 14h com Ana Almeida."
5. **Already used** — "Este link já foi utilizado. Entre em contato com seu terapeuta."
6. **Expired** — "Este link expirou. Peça ao seu terapeuta um novo link."
7. **Not found** — "Link inválido."

---

## No Real-Time Updates

Slot availability is loaded once when the patient opens the link. If two patients attempt the same slot simultaneously, the database resolves it: first write wins, second gets `slot_taken` error with a prompt to choose another slot. This is the standard approach (Calendly does the same). Real-time sync is not justified at this volume.

---

## Token Expiry

Tokens expire at `Sunday 23:59:59` of the target week (in the therapist's timezone, stored in `therapistPolicies.timezone`). Expiry is checked lazily on each public request — no background job needed for MVP.

---

## Files to Create / Modify

### API (`apps/api`)
- Create: `src/modules/scheduling/scheduling.module.ts`
- Create: `src/modules/scheduling/scheduling.controller.ts`
- Create: `src/modules/scheduling/scheduling.service.ts`
- Create: `src/modules/scheduling/scheduling.repository.ts`
- Modify: `src/modules/app.module.ts` — register SchedulingModule
- Modify: `src/db/schema.ts` — add `schedulingTokens` table
- Create: migration file for `scheduling_tokens` table

### Contracts (`packages/contracts`)
- Modify: `src/index.ts` — add request/response schemas for all 4 endpoints

### Web (`apps/web`)
- Modify: `apps/web/src/components/agenda/agenda-page.tsx` — add "Distribuir links" button + DistributionDrawer
- Create: `apps/web/src/components/agenda/distribution-drawer.tsx`
- Create: `apps/web/app/agendar/[token]/page.tsx` — public booking page (no layout)
- Create: `apps/web/app/agendar/[token]/booking-page.tsx` — client component
- Create: `apps/web/app/api/scheduling/tokens/generate-week/route.ts` — Next.js proxy
- Create: `apps/web/app/api/scheduling/tokens/week/route.ts` — Next.js proxy
- Create: `apps/web/app/api/public/scheduling/[token]/route.ts` — Next.js public proxy
- Create: `apps/web/app/api/public/scheduling/[token]/book/route.ts` — Next.js public proxy
