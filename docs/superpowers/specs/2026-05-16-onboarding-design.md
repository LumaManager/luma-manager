# Onboarding — Design Spec

## Goal

Implementar o fluxo de onboarding de 7 steps para novos terapeutas, com persistência real no DB, substituindo os stubs vazios existentes.

## Architecture

A abordagem é um **service orquestrador central** (`OnboardingService.completeStep`) que despacha cada step para os repositories canônicos corretos. Sem JSON blob intermediário — os dados ficam nas tabelas certas desde o primeiro submit. O bootstrap (`getStatus`) reconstrói o estado lendo de todas as tabelas.

**Tech stack:** NestJS + Drizzle ORM + PostgreSQL (API), Next.js 15 App Router + localStorage (Web)

---

## DB Changes

### Nova tabela: `therapist_legal_acceptances`

Armazena cada aceite de documento legal com timestamp e versão — auditável para fins de LGPD.

```sql
CREATE TABLE therapist_legal_acceptances (
  id             TEXT PRIMARY KEY,
  therapist_id   TEXT NOT NULL REFERENCES therapists(id),
  document_type  TEXT NOT NULL,
  -- "terms_of_service" | "dpa" | "privacy_policy"
  -- "lgpd_consent" | "telehealth_consent" | "ai_consent"
  document_version TEXT NOT NULL DEFAULT '1.0',
  accepted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address     TEXT NOT NULL DEFAULT ''
);
```

### `onboarding_state` — sem breaking changes

- `completed_steps` passa a usar keys canônicos: `welcome`, `profile`, `operations`, `tax`, `contracts`, `schedule`, `consents`
- Colunas `practice_name`, `practice_city`, `practice_state` permanecem no schema mas param de ser escritas (dados vão para `therapist_practices`)
- `first_patient_created` permanece mas não é mais escrito pelo novo fluxo

### Contracts — narrowing (não quebra código existente)

Três schemas simplificados para remover campos sem coluna no DB:

- `onboardingTaxDraftSchema` → manter só `billingDocument: z.string()`, remover `regime`, `city`, `emissionType`, `municipalRegistration`, `accountantName`
- `onboardingProfileDraftSchema` → remover `cpf`, `birthDate`, `professionalEmail`
- `onboardingOperationsDraftSchema` → manter `timezone` (seletor de fuso brasileiro)

---

## API Layer

### `OnboardingRepository` (substituição completa)

**Métodos:**

```typescript
findBootstrapData(therapistId: string): Promise<BootstrapRawData>
// Lê em paralelo: onboarding_state, therapist_profiles, therapist_practices,
// therapist_policies, availability_rules + windows, therapist_legal_acceptances

markStepDone(therapistId: string, step: string): Promise<void>
// Idempotente: adiciona step ao JSON array completed_steps se não estiver presente

upsertProfile(therapistId: string, data: ProfileData): Promise<void>
// → therapist_profiles (INSERT ... ON CONFLICT DO UPDATE)

updateTherapistName(therapistId: string, fullName: string): Promise<void>
// → therapists.full_name

upsertPracticeAndTimezone(therapistId: string, data: OperationsData): Promise<void>
// → therapist_practices + therapist_profiles.timezone (dois upserts sequenciais)

upsertBillingDocument(therapistId: string, billingDocument: string): Promise<void>
// → therapist_practices.billing_document

upsertPolicies(therapistId: string, data: PoliciesData): Promise<void>
// → therapist_policies

rebuildSchedule(therapistId: string, weekdays: number[], windows: WindowInput[]): Promise<void>
// DELETE + INSERT availability_rules + availability_windows em transação

insertLegalAcceptances(therapistId: string, docs: AcceptanceInput[], ip: string): Promise<void>
// → therapist_legal_acceptances (uma linha por documento)

completeOnboarding(therapistId: string): Promise<void>
// → onboarding_state.completed_at = now() + therapists.status = 'active' em transação
```

### `OnboardingService` (implementação real — hoje vazio)

```typescript
initForTherapist(therapistId: string): Promise<void>
// Cria onboarding_state com completed_steps = '[]'
// (muda de ["mfa_setup"] para [])

getStatus(therapistId: string): Promise<TherapistOnboardingBootstrap>
// Chama findBootstrapData, determina currentStep (primeiro não em completed_steps),
// monta TherapistOnboardingBootstrap com draft reconstruído das tabelas reais

completeStep(therapistId: string, step: OnboardingStepKey, payload: unknown, ip?: string):
  Promise<{ onboarding: TherapistOnboardingBootstrap; accountStatus: TherapistAccountStatus }>
// Switch por step:
//   welcome    → markStepDone("welcome")
//   profile    → upsertProfile + updateTherapistName + markStepDone("profile")
//   operations → upsertPracticeAndTimezone + markStepDone("operations")
//   tax        → upsertBillingDocument + markStepDone("tax")
//   contracts  → insertLegalAcceptances(terms/dpa/privacy) + markStepDone("contracts")
//   schedule   → upsertPolicies + rebuildSchedule + markStepDone("schedule")
//   consents   → insertLegalAcceptances(lgpd/telehealth/ai) + completeOnboarding
// Retorna getStatus() + accountStatus mapeado (pending_onboarding→"pending_setup", active→"ready_for_operations")
```

### `OnboardingController` (adição de 2 endpoints)

```
GET  /v1/onboarding/start         → getStatus(session.therapist.id)
POST /v1/onboarding/complete-step → valida com onboardingCompleteStepRequestSchema
                                    → completeStep(..., ip from x-forwarded-for)
```

O endpoint `POST /v1/onboarding/practice-info` existente permanece mas pode ser deprecated silenciosamente.

---

## Frontend Layer

### Proxy routes (hoje stubs vazios)

```
GET  /api/account/onboarding/start
     → apiFetch("GET /v1/onboarding/start", { token })

POST /api/account/onboarding/complete-step
     → apiFetch("POST /v1/onboarding/complete-step", { token, body })
```

Ambas: `getRequiredSessionToken()` fora do try/catch (padrão do projeto).

### `/app/onboarding/page.tsx` (hoje vazio)

Server component:
1. Chama `GET /api/account/onboarding/start`
2. Se `accountStatus === "ready_for_operations"` → `redirect("/app/dashboard")`
3. Caso contrário, renderiza `<OnboardingWizard initialData={bootstrap} />`

### `OnboardingWizard` (hoje vazio)

Client component com três responsabilidades:

**Navegação:** renderiza o step atual baseado em `currentStep`. Barra de progresso com os 7 steps e status visual (pending / current / completed).

**Autosave:** hook `useDraft(stepKey, therapistId)` por step component:
- Lê do localStorage na montagem e restaura formulário
- Debounce de 500ms ao alterar qualquer campo
- Limpa o localStorage após submit bem-sucedido

**Submit:** `POST /api/account/onboarding/complete-step` com `{ step, payload }`. Recebe bootstrap atualizado, avança para próximo step. Se `accountStatus === "ready_for_operations"` → `router.replace("/app/dashboard")`.

### Step components (`src/components/onboarding/steps/`)

| Componente | Step | Campos | → DB |
|---|---|---|---|
| `welcome-step.tsx` | welcome | Botão "Começar" | `completed_steps` |
| `profile-step.tsx` | profile | socialName, crp, crpState, phone, specialty, miniBio, fullName | `therapist_profiles` + `therapists` |
| `operations-step.tsx` | operations | practiceName, practicePhone, timezone (seletor BR), pixKey, beneficiaryName, paymentInstructions | `therapist_practices` + `therapist_profiles.timezone` |
| `tax-step.tsx` | tax | billingDocument (CPF ou CNPJ) | `therapist_practices` |
| `contracts-step.tsx` | contracts | termsAccepted, dpaAccepted, privacyAccepted | `therapist_legal_acceptances` |
| `schedule-step.tsx` | schedule | weekdays (checkbox Seg–Sex), startHour, endHour, sessionDurationMinutes, gapMinutes, defaultModality | `therapist_policies` + `availability_rules/windows` |
| `consents-step.tsx` | consents | lgpdConsent, telehealthConsent, aiConsent | `therapist_legal_acceptances` |

### Timezones brasileiros (seletor no step operations)

```
America/Sao_Paulo     → "Brasília / São Paulo (UTC-3)"
America/Manaus        → "Manaus / Campo Grande (UTC-4)"
America/Rio_Branco    → "Acre (UTC-5)"
America/Noronha       → "Fernando de Noronha (UTC-2)"
```

**Auto-detecção:** ao montar o `operations-step`, ler `Intl.DateTimeFormat().resolvedOptions().timeZone` do browser. Mapear o timezone IANA detectado para o mais próximo das 4 opções acima e pré-selecionar. O terapeuta pode alterar se necessário. Exemplo: browser retorna `"America/Campo_Grande"` → pré-seleciona "Manaus / Campo Grande (UTC-4)". Se o localStorage já tiver um draft salvo, o draft prevalece sobre a auto-detecção.

---

## Data Flow

### Bootstrap assembly (`getStatus`)

```
onboarding_state.completed_steps  → determina currentStep + steps[].status
therapist_profiles                → draft.profile.*
therapist_practices               → draft.operations.*, draft.tax.billingDocument
therapist_profiles.timezone       → draft.operations.timezone
therapist_policies                → draft.schedule.sessionDurationMinutes, gapMinutes, etc.
availability_rules + windows      → draft.schedule.weekdays, startHour, endHour
therapist_legal_acceptances       → draft.contracts.*, draft.consents.*
```

### Completion → status change

Após `consents` step: `completeOnboarding()` executa em transação:
1. `UPDATE onboarding_state SET completed_at = now()`
2. `UPDATE therapists SET status = 'active'`

O `accountStatus` retornado: `active` → `"ready_for_operations"` (mesmo mapeamento de `auth.service.ts` linha 264).

O frontend detecta `accountStatus === "ready_for_operations"` e faz `router.replace("/app/dashboard")`.

---

## Error Handling

- Cada step é **idempotente** — resubmit não cria duplicatas (upserts por `therapist_id`)
- `therapist_legal_acceptances` não tem unique constraint por `(therapist_id, document_type)` — múltiplos aceites do mesmo documento são permitidos (o mais recente é o válido). Se resubmeter o step contracts/consents, insere novas linhas com novo timestamp.
- Se `getStatus` não encontra `onboarding_state` para o therapistId → `initForTherapist` é chamado on-demand e o bootstrap é montado do zero com todos os steps pending.

---

## Out of Scope

- Email de boas-vindas ao completar onboarding (fase 2)
- MFA setup como step (removido — `REQUIRE_MFA=false` em produção)
- NF-e / regime tributário completo no step tax (fase 2)
- Validação de CRP via API do CFP (fase 2)
