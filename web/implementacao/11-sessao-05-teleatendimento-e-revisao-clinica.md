# Sessão 05 - Teleatendimento e Revisão Clínica

## 1. Objetivo da sessão

Avançar dois blocos sequenciais do core web:

- teleatendimento em `/app/appointments/:appointmentId/call`
- fila de revisão clínica em `/app/clinical-review`
- revisão detalhada em `/app/clinical-review/:appointmentId`

## 2. Escopo implementado

### Teleatendimento

- `GET /v1/appointments/:appointmentId/call`
- `POST /v1/appointments/:appointmentId/room`
- `POST /v1/appointments/:appointmentId/check-in`
- `POST /v1/appointments/:appointmentId/end-session`
- tela `/app/appointments/:appointmentId/call` com:
  - prejoin
  - waiting room do terapeuta
  - superficie ao vivo mockada
  - transcript state explicito
  - encerramento seguro

### Revisão clínica

- `GET /v1/clinical-review`
- `GET /v1/clinical-review/:appointmentId`
- `PATCH /v1/clinical-review/:appointmentId/draft`
- `POST /v1/clinical-review/:appointmentId/approve`
- `POST /v1/clinical-review/:appointmentId/discard`
- `POST /v1/clinical-review/:appointmentId/retry-transcript`
- `POST /v1/clinical-review/:appointmentId/retry-draft`
- tela `/app/clinical-review` com tabela operacional e filtros
- tela `/app/clinical-review/:appointmentId` com transcript, draft, highlights e versoes

## 3. Decisões novas registradas

- a chamada web pode operar mesmo com transcript desativado por política; a UI precisa deixar isso explícito sem prometer automação
- o estado da chamada é tratado como agregado próprio no backend, separado do detalhe da sessão
- a fila de revisão usa lista operacional como inbox e não BI
- a revisão detalhada já nasce separando claramente `transcript`, `rascunho` e `registro final`

## 4. Dummy data desta fase

- teleatendimento com cenários:
  - paciente aguardando na waiting room
  - sessão bloqueada por consentimento crítico
  - sessão fora da janela
  - sessão encerrada
- revisão clínica com cenários:
  - transcript pronto e rascunho pronto
  - transcript pronto e IA falhou
  - transcript falhou
  - transcript desativado por política

## 5. O que ficou pendente

- provedor real de video
- portal do paciente conectado à presença real na sala
- persistência real de eventos de chamada
- pipeline assíncrono real de transcript e rascunho
- auditoria clínica persistente
- prontuário longitudinal integrado

## 6. Arquivos principais criados ou alterados

- `apps/api/src/modules/appointments/appointments.service.ts`
- `apps/api/src/modules/appointments/appointments.controller.ts`
- `apps/api/src/modules/clinical-review/clinical-review.service.ts`
- `apps/api/src/modules/clinical-review/clinical-review.controller.ts`
- `apps/web/app/(protected)/app/appointments/[appointmentId]/call/page.tsx`
- `apps/web/src/components/agenda/appointment-call-page.tsx`
- `apps/web/app/(protected)/app/clinical-review/page.tsx`
- `apps/web/app/(protected)/app/clinical-review/[appointmentId]/page.tsx`
- `apps/web/src/components/clinical-review/clinical-review-queue-page.tsx`
- `apps/web/src/components/clinical-review/clinical-review-detail-page.tsx`
- `packages/contracts/src/index.ts`

## 7. Validação executada

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## 8. Observações

- a UX segue web-first e continua util sem audio
- transcript/IA continuam capability condicional; quando desativados, a UI explicita isso sem bloquear o core do produto
