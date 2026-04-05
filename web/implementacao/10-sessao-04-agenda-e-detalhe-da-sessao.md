# Sessão 04 - Agenda e Detalhe da Sessão

## 1. Objetivo da sessão

Entregar a próxima fatia vertical do core web:

- agenda do terapeuta em `/app/agenda`
- detalhe da sessão em `/app/appointments/:appointmentId`
- continuidade coerente com dashboard, onboarding e pacientes

## 2. Escopo implementado

### Backend

- `GET /v1/appointments`
- `POST /v1/appointments`
- `GET /v1/appointments/:appointmentId`

### Web

- página `/app/agenda` com:
  - visão `semana` default
  - alternância `dia`, `semana` e `mês`
  - controles de período
  - filtros por status e modalidade
  - grade com disponibilidade, bloqueios e sessões
  - drawer funcional de `Nova sessão`
- página `/app/appointments/:appointmentId` com:
  - breadcrumbs
  - cabeçalho da sessão
  - CTA principal contextual
  - resumo do paciente
  - dados da sessão
  - consentimentos e documentos
  - pagamento resumido
  - checklist pré-sessão
  - sala virtual como bloco operacional
  - timeline resumida
- rota `/app/appointments/:appointmentId/call` como handoff operacional temporário

## 3. Decisões novas registradas

- `POST /v1/appointments` retorna `id` e `href` para redirecionamento imediato ao detalhe
- o CTA principal do detalhe da sessão precisa apontar para uma rota válida mesmo antes da videochamada existir; por isso a rota `/call` foi criada como handoff temporário
- conta `restricted` continua com leitura permitida na agenda; mutações de agenda ficam bloqueadas
- conta `pending_setup` continua sendo redirecionada para onboarding antes de usar agenda e detalhe

## 4. Dummy data desta fase

- sessões distribuídas entre:
  - `Maria Souza`
  - `Lucas Santos`
  - `Renata Costa`
  - `Caio Oliveira`
- disponibilidade recorrente por dia da semana
- bloqueios pontuais para supervisão e treinamento
- cenários distintos no detalhe:
  - sessão pronta para iniciar
  - sessão presencial com financeiro em aberto
  - sessão com bloqueio documental crítico
  - sessão concluída
  - sessão cancelada

## 5. O que ficou pendente

- `POST /v1/appointments/:appointmentId/reschedule`
- `POST /v1/appointments/:appointmentId/cancel`
- `POST /v1/appointments/:appointmentId/room`
- quick view lateral da sessão
- edição real de bloqueios
- drag and drop controlado
- tela de videochamada

## 6. Arquivos principais criados ou alterados

- `apps/api/src/modules/appointments/appointments.service.ts`
- `apps/api/src/modules/appointments/appointments.controller.ts`
- `apps/web/app/(protected)/app/agenda/page.tsx`
- `apps/web/src/components/agenda/agenda-page.tsx`
- `apps/web/app/(protected)/app/appointments/[appointmentId]/page.tsx`
- `apps/web/src/components/agenda/appointment-detail-page.tsx`
- `apps/web/app/(protected)/app/appointments/[appointmentId]/call/page.tsx`
- `apps/web/app/api/appointments/route.ts`
- `packages/contracts/src/index.ts`

## 7. Validação executada

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## 8. Observações

- o build segue exibindo o warning conhecido do plugin de ESLint do Next, sem impedir lint nem compilação
- a tela continua útil sem áudio; o fluxo principal permanece texto/ditado-first
