# Video Call Feature — Design Spec

**Data:** 2026-05-17
**Status:** Aprovado — aguardando plano de implementação
**Provider:** Daily.co (DPA + SCC ANPD Res. 19/2024)

---

## Objetivo

Cada sessão de teleatendimento gera um link de vídeo único e descartável. O link expira automaticamente ao fim da sessão. O terapeuta distribui o link do paciente via WhatsApp com um clique. A sala de vídeo é embutida na call page do Luma via iframe (Daily.co Prebuilt).

---

## Escopo MVP

**Incluído:**
- Provisionar sala (Daily.co) a partir da página de detalhe da sessão
- Gerar token de paciente on-demand (para envio via WhatsApp)
- Gerar token de host on-demand (para o terapeuta entrar na call page)
- Iframe Daily.co Prebuilt na call page do terapeuta
- Botão WhatsApp na página de detalhe com mensagem pré-preenchida
- Expiração automática da sala no horário de término + 30 min
- Adicionar Daily.co à política de privacidade

**Excluído:**
- Gravação de sessão
- Transcrição / IA
- Portal do paciente com iframe (paciente acessa Daily.co diretamente pelo link)
- Chat em sessão
- Métricas de qualidade de chamada

---

## Arquitetura

```
Detalhe da sessão
  └─ "Provisionar sala" (btn)
       └─ POST /api/appointments/{id}/room
            └─ POST https://api.daily.co/v1/rooms
                 name: "luma-{appointmentId}"
                 privacy: "private"
                 exp: unix(date + startTime + durationMinutes + 30min)
            └─ UPDATE appointments SET roomUrl, roomProviderRef, roomState="ready"
       └─ UI: estado muda para "Sala pronta"

  └─ "Enviar via WhatsApp" (btn, visível quando roomState=ready)
       └─ POST /api/appointments/{id}/patient-token
            └─ POST https://api.daily.co/v1/meeting-tokens
                 room_name: roomProviderRef, is_owner: false, exp: mesmo do room
            └─ Retorna: { url: "https://luma.daily.co/luma-{id}?t=TOKEN" }
       └─ Abre: wa.me/{phone}?text=mensagem+com+url

Call page (/app/appointments/{id}/call)
  └─ GET /api/appointments/{id}/call
       └─ Se roomState=ready:
            POST https://api.daily.co/v1/meeting-tokens
              room_name, is_owner: true, exp: mesmo do room
            └─ Retorna AppointmentCall com experienceState="prejoin", roomUrl+token
       └─ Se roomState=not_provisioned: experienceState="unavailable"

  └─ Terapeuta clica "Entrar"
       └─ <iframe src="{roomUrl}?t={hostToken}" allow="camera; microphone; fullscreen" />
```

---

## Segurança de mídia

Daily.co opera em modo **P2P por padrão** para chamadas 1:1 quando a rede permite:
- Mídia vai diretamente entre os dispositivos — servidores Daily.co não processam conteúdo
- Daily.co só processa metadados (timestamps, IPs, qualidade de rede)
- Fallback automático para SFU quando P2P falha (firewall/NAT restritivo) — nesse caso pacotes trafegam pelo servidor deles mas sem armazenamento

**Tokens vs. URL:** a sala tem `privacy: "private"` — sem um meeting token válido, a URL base não permite entrada. O terapeuta tem token `is_owner: true`, o paciente tem token `is_owner: false`. Tokens expiram junto com a sala.

---

## Backend — mudanças

### Arquivos a modificar

**`apps/api/src/modules/appointments/appointments.service.ts`**
- `provisionRoom(session, appointmentId)`: implementar chamada real à Daily.co API
- `getAppointmentCall(session, appointmentId)`: gerar host token quando `roomState = "ready"`, montar `AppointmentCall` com `experienceState: "prejoin"` e `roomUrl + token`

**`apps/api/src/modules/appointments/appointments.controller.ts`**
- Adicionar: `POST /:appointmentId/patient-token` → novo método `getPatientToken()`

**`apps/api/src/modules/appointments/appointments.repository.ts`**
- Adicionar: `storeRoomData(appointmentId, { roomUrl, roomProviderRef, roomState })`

**`apps/api/src/common/config/env.ts`**
- Adicionar: `DAILY_API_KEY: z.string().min(1)`

### Nova env var (Railway)
```
DAILY_API_KEY=<gerada em dashboard.daily.co → Developers → API Keys>
```

### Daily.co API calls

**Criar sala:**
```
POST https://api.daily.co/v1/rooms
Authorization: Bearer {DAILY_API_KEY}
{
  "name": "luma-{appointmentId}",
  "privacy": "private",
  "properties": {
    "exp": 1234567890,       // Unix timestamp: session end + 30min
    "enable_recording": false,
    "enable_transcription_storage": false
  }
}
→ Response: { "url": "https://luma.daily.co/luma-{id}", "name": "luma-{id}" }
```

**Gerar meeting token (host ou paciente):**
```
POST https://api.daily.co/v1/meeting-tokens
Authorization: Bearer {DAILY_API_KEY}
{
  "properties": {
    "room_name": "luma-{appointmentId}",
    "is_owner": true | false,
    "exp": 1234567890        // mesmo do room
  }
}
→ Response: { "token": "eyJhbGci..." }
```

**URL do paciente:** `https://luma.daily.co/luma-{appointmentId}?t={token}`
**URL do terapeuta (iframe):** `https://luma.daily.co/luma-{appointmentId}?t={hostToken}`

### Tratamento de erros
- Daily.co API offline → retornar 503, `roomState` permanece `not_provisioned`, terapeuta pode tentar novamente
- Sala já existe (room name conflict) → idempotente: buscar sala existente e retornar sucesso
- Token expirado (sala já expirou) → retornar erro claro: "Sala expirada. Provisione uma nova sala."

---

## Frontend — mudanças

### Arquivos a modificar

**`apps/web/app/(protected)/app/appointments/[appointmentId]/page.tsx`** (ou componente de detalhe)
- Adicionar `VirtualRoomCard` atualizado com dois botões condicionais:
  - "Provisionar sala" → visível quando `modality=telehealth AND roomState=not_provisioned`
  - "Enviar via WhatsApp" → visível quando `roomState=ready`

**`apps/web/app/api/appointments/[appointmentId]/patient-token/route.ts`** (novo)
- Proxy: `POST /api/appointments/{id}/patient-token` → API backend

**`apps/web/src/components/agenda/appointment-call-page.tsx`**
- Quando `experienceState = "prejoin"`: mostrar UI de pré-join existente + botão "Entrar na sala"
- Quando terapeuta clica "Entrar": substituir conteúdo central pelo iframe Daily.co

### Mensagem WhatsApp
```
Olá {patientFirstName}! Sua sessão de teleatendimento está confirmada
para hoje às {startTime}. Acesse pelo link (válido até {endTime}):

{patientTokenUrl}

Certifique-se de estar em local reservado e com câmera/microfone disponíveis.
```

### Iframe Daily.co
```tsx
<iframe
  src={`${roomUrl}?t=${hostToken}`}
  allow="camera; microphone; fullscreen; display-capture; autoplay"
  className="h-full w-full rounded-2xl border-0"
  title="Sala de teleatendimento"
/>
```

---

## Schema de banco de dados

**Zero migration necessária.** Campos já existentes em `appointments`:
- `roomState` (text, default `"not_provisioned"`) — estados: `not_provisioned | ready | open | closed | failed`
- `roomUrl` (text, default `""`) — URL base da sala Daily.co
- `roomProviderRef` (text, default `""`) — nome da sala no Daily.co (`"luma-{appointmentId}"`)

Tokens **não são armazenados** — gerados on-demand a cada request.

---

## Daily.co — configuração de conta

1. Criar conta em dashboard.daily.co
2. Criar subdomain: `luma` → sala ficará em `luma.daily.co/luma-{id}`
3. Gerar API key em Developers → API Keys
4. Configurar no Railway: `DAILY_API_KEY=<key>`
5. Assinar DPA disponível em dashboard.daily.co → Settings → Privacy & Compliance
6. Registrar mecanismo de transferência: SCC per Resolução CD/ANPD nº 19/2024

---

## Política de privacidade

Adicionar Daily.co de volta à tabela de sub-operadores em `/politica-de-privacidade`:

| Categoria | Fornecedor | País | Finalidade |
|---|---|---|---|
| Videoconferência | Daily.co | EUA | Sala de teleatendimento por sessão — links únicos com expiração automática. Metadados de sessão (IP, timestamps) processados nos EUA via SCC. Sem gravação. Sem retenção de conteúdo de mídia. |

Adicionar nota na seção de transferência internacional sobre consentimento implícito do paciente ao aceitar o link de teleatendimento.

---

## Decisões de design registradas

| Decisão | Motivo |
|---|---|
| Tokens gerados on-demand, não armazenados | Se o DB for comprometido, tokens não vazam. Custo de uma API call extra é negligível. |
| P2P para 1:1 sessions | Daily.co usa P2P por default para dois participantes — mídia não passa pelos servidores deles quando rede permite. |
| `privacy: "private"` na sala | Sem um meeting token, a URL base não permite entrada — separação entre URL e acesso. |
| Expiração = fim da sessão + 30 min | Buffer para o caso da sessão estender. Após expirar, Daily.co deleta a sala automaticamente. |
| Daily.co Prebuilt via iframe | Evita construir WebRTC customizado. UI completa (câmera, mic, tela cheia) sem dependência adicional de SDK. |
| DPA + SCC, não Livekit | Para MVP de lançamento, o risco regulatório do DPA é o padrão de mercado. Livekit self-hosted fica para escala. |

---

## Fora de escopo (futuras versões)

- Migrar para Livekit self-hosted (dados no Brasil)
- Gravação opt-in com consentimento destacado (art. 11, I LGPD)
- Transcrição e rascunho de prontuário por IA
- Portal do paciente com iframe integrado
- Métricas de qualidade de chamada no painel do terapeuta
