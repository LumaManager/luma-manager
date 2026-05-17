# Vídeo, Gravação e Transcrição — Design Spec

**Data:** 2026-05-17
**Status:** Aprovado — aguardando plano de implementação
**Providers:** Daily.co (DPA + SCC ANPD Res. 19/2024), AssemblyAI (DPA + SCC)

---

## Objetivo

Cada sessão de teleatendimento gera um link de vídeo único e descartável. Se o paciente assinou o termo de consentimento de gravação, a sessão é gravada automaticamente, transcrita via AssemblyAI (com identificação de locutor), e apresentada como rascunho de prontuário para aprovação do terapeuta. O terapeuta distribui o link do paciente via WhatsApp com um clique.

---

## Escopo MVP

**Incluído:**
- Sistema de consentimento: envio de termo via WhatsApp, assinatura digital pelo paciente, rastreabilidade completa
- Provisionar sala (Daily.co) a partir da página de detalhe da sessão
- Gerar token de paciente on-demand (para envio via WhatsApp)
- Gerar token de host on-demand (para o terapeuta entrar na call page)
- Iframe Daily.co Prebuilt na call page do terapeuta
- Botão WhatsApp na página de detalhe com mensagem pré-preenchida
- Expiração automática da sala no horário de término + 30 min
- Gravação automática via Daily.co (somente se consentimento assinado)
- Processamento server-side: backend baixa encriptado → AssemblyAI → delete imediato
- Transcrição com speaker diarization (terapeuta vs paciente)
- Rascunho de prontuário na página da sessão para revisão e aprovação do terapeuta
- Adicionar Daily.co e AssemblyAI à política de privacidade

**Excluído:**
- Portal do paciente com iframe (paciente acessa Daily.co diretamente pelo link)
- Chat em sessão
- Métricas de qualidade de chamada
- Customização do template de consentimento pelo terapeuta (template fixo no MVP)
- Múltiplos tipos de documento de consentimento (apenas gravação no MVP)
- Retry manual de transcrição pela UI

---

## Arquitetura — Três Fluxos

### Fluxo 1: Consentimento

```
Terapeuta abre ficha do paciente → "Enviar termo de consentimento"
  ↓
POST /api/patients/{id}/consent-documents
  → gera token único (UUID v4), cria registro em consent_documents (status: pending)
  → retorna link: https://lumamanager.com.br/consentimento/{token}
  ↓
Botão WhatsApp abre: wa.me/{phone}?text=mensagem+com+link
  ↓
Paciente abre /consentimento/{token}
  → valida token (não expirado, não usado)
  → exibe documento completo (termo de consentimento de gravação, versão atual)
  ↓
Paciente digita nome + marca checkbox "Li e concordo"
  → POST /api/public/consent/{token}/sign
  → registra: signed_at, signer_ip, signer_name, document_version
  → status muda para "signed", token consumido (não pode ser reutilizado)
  ↓
Call page verifica: consent_signed = true → habilita gravação
```

### Fluxo 2: Vídeo com Gravação

```
Detalhe da sessão
  └─ "Provisionar sala" (btn, visível quando modality=telehealth AND roomState=not_provisioned)
       └─ POST /api/appointments/{id}/room
            └─ POST https://api.daily.co/v1/rooms
                 name: "luma-{appointmentId}", privacy: "private"
                 exp: unix(date + startTime + durationMinutes + 30min)
                 enable_recording: true
            └─ UPDATE appointments SET roomUrl, roomProviderRef, roomState="ready"

  └─ "Enviar via WhatsApp (link da sessão)" (btn, visível quando roomState=ready)
       └─ POST /api/appointments/{id}/patient-token
            └─ POST https://api.daily.co/v1/meeting-tokens
                 room_name, is_owner: false, exp: mesmo do room
            └─ Abre: wa.me/{phone}?text=mensagem+com+url

  └─ Indicador de consentimento (visível sempre que modality=telehealth):
       ✅ "Gravação autorizada" → se consent_documents.status = "signed"
       ⚠️ "Paciente não assinou o termo" + "Enviar termo via WhatsApp" → se não assinado

Call page (/app/appointments/{id}/call)
  └─ GET /api/appointments/{id}/call
       └─ Se roomState=ready:
            POST https://api.daily.co/v1/meeting-tokens
              room_name, is_owner: true, exp: mesmo do room
            └─ Retorna: { experienceState="prejoin", roomUrl, hostToken, recordingConsented: bool }
       └─ Se roomState=not_provisioned: experienceState="unavailable"

  └─ Terapeuta clica "Entrar na sala"
       └─ <iframe src="{roomUrl}?t={hostToken}" allow="camera; microphone; fullscreen; display-capture; autoplay" />
       └─ Se recordingConsented = true:
            POST /api/appointments/{id}/recording/start
              └─ POST https://api.daily.co/v1/recordings/start { roomName: "luma-{appointmentId}" }
              └─ UPDATE appointments SET recording_daily_id, recording_status="processing"
```

### Fluxo 3: Transcrição Automática

```
Daily.co webhook → POST /api/webhooks/daily (evento: recording.ready)
  ↓
Backend valida assinatura HMAC (header X-Daily-Signature)
  ↓
Backend baixa arquivo via Daily.co API (server-to-server, HTTPS, nunca passa pelo browser)
GET https://api.daily.co/v1/recordings/{recordingId}/access-link
  ↓
Backend armazena temporariamente no Supabase Storage
  bucket: "session-recordings" (privado, AES-256, sem URL pública)
  ↓
Backend submete ao AssemblyAI:
POST https://api.assemblyai.com/v2/transcript
  { audio_url: supabase_signed_url (expiração: 15min), speaker_labels: true,
    webhook_url: "https://api.lumamanager.com.br/webhooks/assemblyai",
    webhook_auth_header_name: "X-Webhook-Token",
    webhook_auth_header_value: {ASSEMBLYAI_WEBHOOK_TOKEN} }
  ↓
AssemblyAI webhook → POST /api/webhooks/assemblyai (evento: transcript.completed)
  ↓
Backend valida token (header X-Webhook-Token)
Backend formata transcript com labels (Speaker A = terapeuta, Speaker B = paciente)
Backend salva rascunho em appointments.transcript_draft
Backend atualiza appointments.recording_status = "transcribed"
  ↓
Cleanup (em paralelo, falha não bloqueia o fluxo):
  DELETE Supabase Storage → session-recordings/{appointmentId}
  DELETE https://api.assemblyai.com/v2/transcript/{assemblyAiTranscriptId}
  ↓
Terapeuta vê rascunho na página da sessão (TranscriptCard)
Terapeuta edita se necessário → clica "Aprovar rascunho"
  → transcript_approved_at, transcript_approved_by gravados
  → rascunho aprovado vira parte do prontuário clínico
```

---

## Segurança

### Dados em trânsito
- Arquivo de áudio: Daily.co → backend via HTTPS (server-to-server, nunca browser)
- Backend → Supabase Storage: HTTPS
- Supabase Storage → AssemblyAI: signed URL com expiração curta (15 min)
- Todos os webhooks validados com HMAC (Daily.co) e token fixo (AssemblyAI)

### Dados em repouso
- Supabase Storage bucket `session-recordings`: privado, AES-256, sem URL pública
- Arquivo existe por minutos (enquanto AssemblyAI processa), não horas ou dias
- Transcript text: armazenado no DB junto ao prontuário, coberto pela política de retenção de prontuários

### Daily.co media
- P2P por padrão para chamadas 1:1 — mídia diretamente entre dispositivos, sem passar pelos servidores Daily.co
- Fallback automático para SFU quando P2P falha — processado em trânsito, sem armazenamento permanente
- Gravação: Daily.co armazena temporariamente entre fim da sessão e download pelo backend Luma (minutos)

### Tokens
- Meeting tokens: gerados on-demand, nunca armazenados em DB
- Consent tokens: UUID v4, expiração em 7 dias, consumidos após assinatura (não reutilizáveis)

---

## Backend — mudanças

### Arquivos a modificar

**`apps/api/src/modules/appointments/appointments.service.ts`**
- `provisionRoom(session, appointmentId)`: chamada real à Daily.co API (com `enable_recording: true`)
- `getAppointmentCall(session, appointmentId)`: gera host token, verifica recording_consent_id, retorna `recordingConsented`
- `startRecording(session, appointmentId)`: `POST https://api.daily.co/v1/recordings/start`, atualiza `recording_daily_id` e `recording_status="processing"`

**`apps/api/src/modules/appointments/appointments.controller.ts`**
- `POST /:appointmentId/patient-token` → `getPatientToken()`
- `POST /:appointmentId/recording/start` → `startRecording()`

**`apps/api/src/modules/appointments/appointments.repository.ts`**
- `storeRoomData(appointmentId, { roomUrl, roomProviderRef, roomState })`
- `storeRecordingRef(appointmentId, { recordingDailyId, recordingStatus })`
- `storeTranscriptDraft(appointmentId, { draft, assemblyAiId })`
- `approveTranscript(appointmentId, therapistId)`

**`apps/api/src/common/config/env.ts`**
- `DAILY_API_KEY: z.string().min(1)`
- `DAILY_WEBHOOK_SECRET: z.string().min(1)`
- `ASSEMBLYAI_API_KEY: z.string().min(1)`
- `ASSEMBLYAI_WEBHOOK_TOKEN: z.string().min(1)`
- `SUPABASE_SERVICE_ROLE_KEY: z.string().min(1)`

### Novos módulos

**`apps/api/src/modules/consent/`**
- `consent.service.ts`: `createConsentDocument()`, `signConsentDocument()`, `getConsentStatus()`
- `consent.controller.ts`:
  - `POST /patients/:patientId/consent-documents` → cria registro, retorna link
  - `GET /public/consent/:token` → retorna documento para leitura (rota pública)
  - `POST /public/consent/:token/sign` → registra assinatura (rota pública)
- `consent.repository.ts`: CRUD em `consent_documents`

**`apps/api/src/modules/webhooks/`**
- `daily.webhook.handler.ts`: valida HMAC, processa `recording.ready` → dispara processamento
- `assemblyai.webhook.handler.ts`: valida token, processa `transcript.completed` → salva draft + cleanup

**`apps/api/src/modules/recording/`**
- `recording.service.ts`:
  - `downloadAndStore(dailyRecordingId, appointmentId)`: baixa do Daily.co → sobe ao Supabase Storage
  - `submitToAssemblyAI(supabaseSignedUrl)`: submete transcrição, retorna `assemblyAiTranscriptId`
  - `cleanup(supabaseKey, assemblyAiTranscriptId)`: deleta dos dois provedores (falha silenciosa com log)

### Novas env vars (Railway)

| Variável | Origem |
|---|---|
| `DAILY_API_KEY` | dashboard.daily.co → Developers → API Keys |
| `DAILY_WEBHOOK_SECRET` | gerado ao configurar webhook no Daily.co dashboard |
| `ASSEMBLYAI_API_KEY` | assemblyai.com → Account → API Keys |
| `ASSEMBLYAI_WEBHOOK_TOKEN` | string aleatória gerada localmente, registrada no AssemblyAI |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings (apenas backend Railway, nunca frontend) |

### Daily.co API calls

**Criar sala:**
```
POST https://api.daily.co/v1/rooms
Authorization: Bearer {DAILY_API_KEY}
{
  "name": "luma-{appointmentId}",
  "privacy": "private",
  "properties": {
    "exp": 1234567890,
    "enable_recording": true,
    "enable_transcription_storage": false
  }
}
→ Response: { "url": "https://luma.daily.co/luma-{id}", "name": "luma-{id}" }
```

**Iniciar gravação:**
```
POST https://api.daily.co/v1/recordings/start
Authorization: Bearer {DAILY_API_KEY}
{ "roomName": "luma-{appointmentId}" }
→ Response: { "recordingId": "rec_xxx" }
```

**Obter link de download:**
```
GET https://api.daily.co/v1/recordings/{recordingId}/access-link
Authorization: Bearer {DAILY_API_KEY}
→ Response: { "download_link": "https://..." }
```

**Gerar meeting token (host ou paciente):**
```
POST https://api.daily.co/v1/meeting-tokens
Authorization: Bearer {DAILY_API_KEY}
{
  "properties": {
    "room_name": "luma-{appointmentId}",
    "is_owner": true | false,
    "exp": 1234567890
  }
}
→ Response: { "token": "eyJhbGci..." }
```

### AssemblyAI API calls

**Submeter transcrição:**
```
POST https://api.assemblyai.com/v2/transcript
Authorization: {ASSEMBLYAI_API_KEY}
{
  "audio_url": "https://supabase.co/storage/v1/...",
  "speaker_labels": true,
  "webhook_url": "https://api.lumamanager.com.br/webhooks/assemblyai",
  "webhook_auth_header_name": "X-Webhook-Token",
  "webhook_auth_header_value": "{ASSEMBLYAI_WEBHOOK_TOKEN}"
}
→ Response: { "id": "transcript_xxx", "status": "queued" }
```

**Deletar transcrição (purge):**
```
DELETE https://api.assemblyai.com/v2/transcript/{transcriptId}
Authorization: {ASSEMBLYAI_API_KEY}
```

### Tratamento de erros
- Daily.co API offline → 503, `roomState` permanece `not_provisioned`, terapeuta pode tentar novamente
- Sala já existe (name conflict) → idempotente: buscar sala existente e retornar sucesso
- Token expirado → erro claro: "Sala expirada. Provisione uma nova sala."
- Download da gravação falhou → `recording_status = "failed"`, exibir aviso na UI
- AssemblyAI falhou → `recording_status = "transcription_failed"`, exibir aviso na UI
- Cleanup falhou → log de erro + retry automático, não bloqueia fluxo principal

---

## Frontend — mudanças

### Arquivos a modificar/criar

**`apps/web/app/(protected)/app/appointments/[appointmentId]/page.tsx`**
- `VirtualRoomCard` com botões condicionais:
  - "Provisionar sala" → `modality=telehealth AND roomState=not_provisioned`
  - "Enviar via WhatsApp (link da sessão)" → `roomState=ready`
  - Badge de consentimento: "✅ Gravação autorizada" ou "⚠️ Sem consentimento de gravação"
  - "Enviar termo de gravação via WhatsApp" → quando consentimento não assinado
- `TranscriptCard` (novo):
  - "Transcrevendo sessão…" → `recording_status = "processing"`
  - Rascunho com labels Terapeuta / Paciente + campo editável → `recording_status = "transcribed"`
  - Botão "Aprovar rascunho" → POST `../approve-transcript`
  - "Transcrição falhou" com opção de contato → `recording_status = "transcription_failed"`

**`apps/web/app/(public)/consentimento/[token]/page.tsx`** (novo)
- Página pública (sem auth), usa `PublicPageShell`
- Exibe documento completo de consentimento de gravação (template fixo, versão atual)
- Campo "Digite seu nome completo"
- Checkbox "Li o documento acima e concordo com os termos"
- Botão "Confirmar assinatura" → POST `/api/public/consent/{token}/sign`
- Estado de sucesso: "Assinatura registrada. Você pode fechar esta janela."
- Estado de token inválido/expirado: mensagem de erro clara, sem ação

**`apps/web/app/api/appointments/[appointmentId]/patient-token/route.ts`** (novo)
- Proxy POST → API backend

**`apps/web/app/api/appointments/[appointmentId]/recording/start/route.ts`** (novo)
- Proxy POST → API backend

**`apps/web/app/api/public/consent/[token]/route.ts`** (novo)
- Proxy GET e POST → API backend (rotas públicas)

**`apps/web/src/components/agenda/appointment-call-page.tsx`**
- Indicador de consentimento no topo da call page
- Ao clicar "Entrar na sala": dispara `POST .../recording/start` se `recordingConsented = true`
- Iframe Daily.co Prebuilt

### Iframe Daily.co
```tsx
<iframe
  src={`${roomUrl}?t=${hostToken}`}
  allow="camera; microphone; fullscreen; display-capture; autoplay"
  className="h-full w-full rounded-2xl border-0"
  title="Sala de teleatendimento"
/>
```

### Mensagem WhatsApp — link da sessão
```
Olá {patientFirstName}! Sua sessão de teleatendimento está confirmada
para hoje às {startTime}. Acesse pelo link (válido até {endTime}):

{patientTokenUrl}

Certifique-se de estar em local reservado e com câmera/microfone disponíveis.
```

### Mensagem WhatsApp — termo de consentimento
```
Olá {patientFirstName}! Para que possamos gravar nossas sessões e gerar
anotações automáticas, preciso da sua autorização. Leia e assine o termo
pelo link abaixo:

{consentUrl}

A assinatura é válida para todas as sessões futuras.
```

---

## Schema de banco de dados

### Nova tabela: `consent_documents`
```sql
CREATE TABLE consent_documents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES patients(id),
  therapist_id     UUID NOT NULL REFERENCES therapists(id),
  document_type    TEXT NOT NULL DEFAULT 'recording_consent',
  document_version TEXT NOT NULL,           -- ex: '2026-05-17'
  token            TEXT NOT NULL UNIQUE,
  token_expires_at TIMESTAMPTZ NOT NULL,    -- now() + 7 days
  status           TEXT NOT NULL DEFAULT 'pending', -- pending | signed | expired
  signed_at        TIMESTAMPTZ,
  signer_ip        TEXT,
  signer_name      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Novos campos em `appointments`
```sql
ALTER TABLE appointments
  ADD COLUMN recording_consent_id       UUID REFERENCES consent_documents(id),
  ADD COLUMN recording_daily_id         TEXT DEFAULT '',
  ADD COLUMN recording_assemblyai_id    TEXT DEFAULT '',
  ADD COLUMN recording_status           TEXT DEFAULT 'none',
  -- none | processing | transcribed | transcription_failed | failed
  ADD COLUMN transcript_draft           TEXT,
  ADD COLUMN transcript_approved_at     TIMESTAMPTZ,
  ADD COLUMN transcript_approved_by     UUID REFERENCES therapists(id);
```

Campos já existentes em `appointments` (sem migration necessária):
- `roomState` (text, default `"not_provisioned"`)
- `roomUrl` (text)
- `roomProviderRef` (text)

Tokens de meeting **não são armazenados** — gerados on-demand a cada request.

---

## Provedores — configuração

### Daily.co
1. Criar conta em dashboard.daily.co
2. Criar subdomain: `luma` → sala em `luma.daily.co/luma-{id}`
3. Gerar API key em Developers → API Keys → `DAILY_API_KEY`
4. Configurar webhook: URL `https://api.lumamanager.com.br/webhooks/daily`, evento `recording.ready`
5. Copiar webhook secret → `DAILY_WEBHOOK_SECRET` no Railway
6. Assinar DPA em Settings → Privacy & Compliance
7. Registrar SCC per Resolução CD/ANPD nº 19/2024

### AssemblyAI
1. Criar conta em assemblyai.com
2. Gerar API key em Account → API Keys → `ASSEMBLYAI_API_KEY`
3. Definir `ASSEMBLYAI_WEBHOOK_TOKEN` (string aleatória, gerada localmente)
4. Assinar DPA (disponível em assemblyai.com/legal)
5. Registrar SCC per Resolução CD/ANPD nº 19/2024

### Supabase Storage
1. Criar bucket `session-recordings` como privado (RLS: sem acesso público)
2. Server-side encryption AES-256 (padrão no Supabase)
3. `SUPABASE_SERVICE_ROLE_KEY` → apenas no backend Railway (nunca no frontend)

---

## Política de privacidade

Adicionar à tabela de sub-operadores em `/politica-de-privacidade` (após implementação):

| Categoria | Fornecedor | País | Finalidade |
|---|---|---|---|
| Videoconferência | Daily.co | EUA | Sala de teleatendimento por sessão — links únicos com expiração automática. Metadados de sessão (IP, timestamps) processados nos EUA via SCC. Sem retenção de conteúdo de mídia. |
| Transcrição de sessão | AssemblyAI | EUA | Transcrição automática de áudio com identificação de locutor, exclusivamente para sessões onde o paciente assinou o termo de consentimento de gravação. Dado de áudio processado e deletado após transcrição — sem armazenamento permanente. Via SCC. |

Adicionar nota: consentimento de gravação é coletado via termo digital separado, assinado pelo paciente antes da primeira sessão gravada, com rastreabilidade completa (timestamp, IP, versão do documento).

---

## Decisões de design registradas

| Decisão | Motivo |
|---|---|
| Consentimento em sistema próprio (não DocuSign) | Mesmo padrão de token do agendamento — rastreabilidade interna completa, zero custo por assinatura, UX consistente |
| Token de consentimento consumido após assinatura | Impede reutilização do link por terceiros que o recebam |
| Gravação via Daily.co API (não WebRTC direto) | Compatível com Daily.co Prebuilt (iframe) — sem acesso direto ao stream de mídia |
| Backend baixa e processa (nunca browser) | Dado sensível de saúde nunca passa pelo cliente — reduz superfície de vazamento |
| Supabase Storage como trânsito (não destino) | Arquivo existe por minutos; delete imediato após AssemblyAI processar |
| HMAC em webhook Daily.co + token fixo em AssemblyAI | Garante que só chamadas legítimas disparam processamento de dado sensível |
| Speaker A = terapeuta, Speaker B = paciente | AssemblyAI não sabe quem é quem — identificação por ordem de entrada (terapeuta entra primeiro como `is_owner: true`) |
| Transcript draft editável + aprovação explícita | Transcrição automática tem erros; aprovação é o ato clínico do terapeuta |
| Tokens de meeting não armazenados | Se DB for comprometido, tokens não vazam. Custo de API call extra é negligível. |
| P2P para 1:1 sessions | Daily.co usa P2P por default — mídia não passa pelos servidores deles quando rede permite |
| `privacy: "private"` na sala | Sem meeting token válido, a URL base não permite entrada |
| Expiração = fim da sessão + 30 min | Buffer para sessão estender. Após expirar, Daily.co deleta automaticamente. |

---

## Fora de escopo (futuras versões)

- Customização do template de consentimento pelo terapeuta
- Múltiplos tipos de documento (consentimento geral de tratamento, menores)
- Portal do paciente com iframe integrado
- Chat em sessão
- Métricas de qualidade de chamada
- Migrar para Livekit self-hosted (dados no Brasil)
- Gravação opt-in por sessão individual (hoje: all-or-nothing por consentimento do paciente)
- Retry manual de transcrição pela UI
- Gravação opt-in com consentimento destacado per-session (art. 11, I LGPD)
