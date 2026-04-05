# APIs e Contratos do Web

## 1. Objetivo

Definir os contratos iniciais que o `web` precisa para começar a ser implementado com estabilidade entre frontend, backend e jobs assíncronos.

## 2. Princípios

- API externa versionada
- contratos tipados compartilhados
- payloads clínicos fora de endpoints genéricos
- jobs idempotentes
- upload por URL assinada quando houver arquivo
- áudio/transcrição tratados como `capability`, não como premissa universal
- bruto clínico com descarte automático e rastreável

## 3. Modelo de integração recomendado

### Frontend

- `Next.js` consome API do backend via HTTP
- componentes de tela usam cliente tipado
- bootstrap de sessão pode usar chamadas server-side, mas a fonte de verdade continua sendo a API
- o build atual padroniza as superfícies do terapeuta com `OperationalHero` e `ToolbarPanel`
- o portal do paciente usa superfície própria com `PortalHero` e `PortalPanel`
- a autenticação pública materializada hoje acontece em `/login`, enquanto os contratos continuam versionados em `/v1/auth/*`

### Backend

- `NestJS` expõe endpoints REST
- jobs assíncronos processam pós-sessão, resumo em tópicos, descarte e notificações
- adapters encapsulam vídeo, ASR, LLM, pagamento e assinatura

## 4. Contratos compartilhados

### Recomendação

Manter schemas e tipos compartilhados em `packages/contracts`.

### Tipos mínimos

- `AuthSession`
- `TherapistAccountStatus`
- `AccountCapabilities`
- `PatientSummary`
- `PatientDetail`
- `AppointmentSummary`
- `AppointmentDetail`
- `PostSessionInputMode`
- `ClinicalReviewQueueItem`
- `ClinicalDraftDetail`
- `ClinicalSummaryDraft`
- `ChargeSummary`
- `DocumentSummary`
- `WaitlistSummary`

## 5. Endpoints iniciais obrigatórios

### Auth

- `POST /v1/auth/login`
- `POST /v1/auth/mfa/verify`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`
- `GET /v1/app-shell/bootstrap`
- `GET /v1/dashboard/therapist`

### Marketing e waitlist

- `GET /v1/marketing/waitlist/summary`
- `POST /v1/marketing/waitlist`

Observação de fase:

- a landing pública em `/` já consome esse agregado no SSR e usa `fallback` apenas se a API falhar
- `POST /v1/marketing/waitlist` deduplica por e-mail e atualiza o contexto do lead quando ele reenviar o formulário
- a captura mínima atual já persiste `sourcePath`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `referrerHost`

### Onboarding e conta

- `GET /v1/account`
- `GET /v1/account/capabilities`
- `GET /v1/account/onboarding`
- `GET /v1/settings`
- `POST /v1/account/onboarding/start`
- `POST /v1/account/onboarding/complete-step`
- `POST /v1/settings/profile`
- `POST /v1/settings/practice`
- `POST /v1/settings/security`
- `POST /v1/settings/policies`
- `POST /v1/settings/notifications`

### Pacientes

- `GET /v1/patients`
- `POST /v1/patients`
- `GET /v1/patients/:patientId`

Observação de fase:

- nesta etapa inicial, `GET /v1/patients` já retorna lista filtrável com objetos `Summary`
- `GET /v1/patients/:patientId` já retorna o detalhe operacional inicial da ficha do paciente
- o prontuário do paciente hoje é servido pelo namespace clínico dedicado `GET /v1/clinical-records/patients/:patientId`

### Documentos e consentimentos

- `GET /v1/documents`
- `POST /v1/documents`
- `GET /v1/documents/:documentId`
- `POST /v1/documents/:documentId/sign`
- `POST /v1/documents/:documentId/resend`
- `POST /v1/documents/:documentId/revoke`

Observação de fase:

- nesta etapa inicial, `GET /v1/documents` ja entrega lista operacional com filtros, prioridades, resumo do tenant e catalogo de templates para geracao manual
- `GET /v1/documents/:documentId` ja entrega o detalhe com preview resumido, impactos operacionais, estados de assinatura/consentimento e trilha de eventos
- `POST /v1/documents` ja gera documento dummy e retorna `redirectTo` para o detalhe
- `POST /v1/documents/:documentId/resend`, `.../revoke` e `.../sign` ja atualizam o estado em memoria para avaliacao visual da UI e futura troca por provider real

### Agenda e sessão

- `GET /v1/appointments`
- `POST /v1/appointments`
- `POST /v1/appointments/availability`
- `POST /v1/appointments/blocks`
- `POST /v1/appointments/blocks/:blockId`
- `POST /v1/appointments/blocks/:blockId/delete`
- `GET /v1/appointments/:appointmentId`
- `POST /v1/appointments/:appointmentId/reschedule`
- `POST /v1/appointments/:appointmentId/cancel`
- `POST /v1/appointments/:appointmentId/room`
- `GET /v1/appointments/:appointmentId/call`
- `POST /v1/appointments/:appointmentId/check-in`
- `POST /v1/appointments/:appointmentId/end-session`

Observação de fase:

- nesta etapa inicial, `GET /v1/appointments` entrega a agenda agregada `calendar-first` com `dayColumns`, `timeSlots`, `scheduleBlocks` e filtros visuais
- `POST /v1/appointments` ja cria sessao com validacao de conflito em dummy data e retorna `id` + `href` para o detalhe
- `POST /v1/appointments/availability` ja atualiza a disponibilidade recorrente em memoria sem sair da agenda
- `POST /v1/appointments/blocks` ja cria bloqueio operacional em memoria com validacao real de conflito contra sessoes e outros bloqueios
- `POST /v1/appointments/blocks/:blockId` ja atualiza bloqueio em memoria sem sair da agenda
- `POST /v1/appointments/blocks/:blockId/delete` ja remove bloqueio em memoria para fechar o ciclo operacional
- `GET /v1/appointments/:appointmentId` ja entrega o detalhe pre-sessao-first com paciente resumido, consentimentos, pagamento, checklist e timeline
- `POST /v1/appointments/:appointmentId/reschedule` e `POST /v1/appointments/:appointmentId/cancel` ja atualizam a sessao em memoria com validacao real de conflito, motivo e estado
- a agenda no web ja aciona `nova sessao`, `editar disponibilidade`, `novo bloqueio`, `editar bloqueio`, `excluir bloqueio`, `quick view de sessao` e `reposicionamento pela grade` por drawers/estado operacional, sem sair da grade
- o detalhe da sessao no web ja aciona essas mutacoes por drawers operacionais, sem handoff vazio para a agenda

Atualização de fase:

- `GET /v1/appointments/:appointmentId/call` ja entrega a experiencia agregada de prejoin/live com janela, transcript, dispositivos, participantes e notices
- `POST /v1/appointments/:appointmentId/room`, `POST /v1/appointments/:appointmentId/check-in` e `POST /v1/appointments/:appointmentId/end-session` ja operam a sala mockada do teleatendimento
- `room`, `check-in` e `end-session` seguem operando a sala mockada do teleatendimento

### Clinical review

- `GET /v1/clinical-review`
- `GET /v1/clinical-review/:appointmentId`
- `PATCH /v1/clinical-review/:appointmentId/draft`
- `POST /v1/clinical-review/:appointmentId/approve`
- `POST /v1/clinical-review/:appointmentId/discard`
- `POST /v1/clinical-review/:appointmentId/retry-transcript`
- `POST /v1/clinical-review/:appointmentId/retry-draft`

Observação de fase:

- nesta etapa inicial, a API usa o prefixo operacional `GET /v1/clinical-review` para a fila
- `GET /v1/clinical-review/:appointmentId` ja entrega transcript segmentado, rascunho, highlights de pipeline e historico de versoes
- `PATCH /v1/clinical-review/:appointmentId/draft`, `POST /v1/clinical-review/:appointmentId/approve`, `POST /v1/clinical-review/:appointmentId/discard`, `POST /v1/clinical-review/:appointmentId/retry-transcript` e `POST /v1/clinical-review/:appointmentId/retry-draft` ja existem para a fase dummy-to-real

### Prontuário longitudinal

- `GET /v1/clinical-records/patients/:patientId`
- `GET /v1/clinical-records/patients/:patientId/:recordId`
- `GET /v1/clinical-records/patients/:patientId/:recordId/versions`

Observação de fase:

- `GET /v1/clinical-records/patients/:patientId` ja entrega o agregado principal do prontuario com timeline, entradas aprovadas, metadata do ultimo registro e revisao pendente
- `GET /v1/clinical-records/patients/:patientId/:recordId` e `.../versions` ja existem para preparar navegacao mais profunda e futura troca por dados reais

### Áudio/transcrição condicional

Planejados, mas ainda não materializados no build atual:

- `POST /v1/clinical-review/:appointmentId/audio-session/start`
- `POST /v1/clinical-review/:appointmentId/audio-session/complete`
- `POST /v1/clinical-review/:appointmentId/audio-session/discard`

### Financeiro

- `GET /v1/finance/charges`
- `GET /v1/finance/charges/:chargeId`
- `GET /v1/finance/summary`
- `GET /v1/finance/export`
- `POST /v1/charges`
- `POST /v1/charges/:chargeId/payments`
- `POST /v1/charges/:chargeId/cancel`

Observação de fase:

- nesta etapa inicial, o namespace operacional foi travado como `GET /v1/finance/charges`, `GET /v1/finance/charges/:chargeId`, `GET /v1/finance/summary` e `GET /v1/finance/export`
- `POST /v1/charges` ja cria cobranca dummy e retorna `redirectTo` para o detalhe
- `POST /v1/charges/:chargeId/payments` e `POST /v1/charges/:chargeId/cancel` ja atualizam a fila financeira em memoria para avaliacao visual

### Configuracoes

- `GET /v1/settings`
- `POST /v1/settings/profile`
- `POST /v1/settings/practice`
- `POST /v1/settings/security`
- `POST /v1/settings/policies`
- `POST /v1/settings/notifications`

Observação de fase:

- `GET /v1/settings` ja entrega o bootstrap completo da area com perfil, consultorio, seguranca, politicas, notificacoes, remediacoes e trilha sensivel
- os `POST` por secao ja persistem estado dummy em memoria, sincronizando shell e dados derivados quando necessario
- `pending_setup` continua redirecionando para onboarding antes de abrir a area

### Admin interno

- `GET /v1/internal/bootstrap`
- `GET /v1/internal/summary`
- `GET /v1/internal/waitlist`
- `GET /v1/internal/tenants`
- `GET /v1/internal/tenants/:tenantId`
- `GET /v1/internal/support`
- `GET /v1/internal/billing`
- `GET /v1/internal/audit`
- `GET /v1/internal/incidents`

Observação de fase:

- o admin interno já opera com `bootstrap` próprio, shell separado e sessão interna distinta do terapeuta
- a UI atual cobre `visão geral`, `waitlist`, `tenants`, `suporte`, `billing`, `auditoria` e `incidentes`
- o acesso continua `metadata-first`, sem prontuário ou transcript
- `GET /v1/internal/waitlist` já entrega leitura operacional dos leads com origem, UTM, referrer, contexto e timestamps
- a persistência da waitlist segue local em `.runtime/marketing/waitlist.json`, preparada para troca futura por storage real

### Portal do paciente

- `GET /v1/portal/invite/:token`
- `POST /v1/portal/invite/:token/accept`
- `GET /v1/portal/bootstrap`
- `GET /v1/portal/appointments`
- `GET /v1/portal/appointments/:appointmentId`
- `GET /v1/portal/appointments/:appointmentId/call`
- `GET /v1/portal/documents`
- `GET /v1/portal/documents/:documentId`
- `POST /v1/portal/documents/:documentId/sign`
- `GET /v1/portal/payments`
- `GET /v1/portal/payments/:chargeId`
- `POST /v1/portal/payments/:chargeId/confirm`
- `GET /v1/portal/profile`

Observação de fase:

- o portal do paciente já existe em `/invite/:token` e `/portal/*`
- o escopo atual cobre convite, ativação, documentos, pagamentos, sessões e call em web
- a sessão do portal é dummy e separada da sessão do terapeuta
- o portal permanece sem prontuário, transcript e qualquer domínio clínico detalhado

## 6. Contratos assíncronos mínimos

### Eventos de domínio

- `patient.invited`
- `patient.accepted_invite`
- `document.signed`
- `session.scheduled`
- `session.started`
- `session.ended`
- `post_session.input_submitted`
- `post_session.audio_capture_completed`
- `transcript.completed`
- `clinical_summary.generated`
- `clinical_note.approved`
- `clinical_raw_artifacts.deleted`
- `charge.created`
- `payment.confirmed`

### Regras

- todo evento deve ter `eventId`
- todo consumidor deve ser idempotente
- eventos clínicos não devem carregar texto clínico completo em barramento genérico
- eventos de áudio/transcrição só existem quando a capability estiver habilitada

## 7. Estratégia de payload

### Listas

- usar objetos `Summary`
- evitar payload excessivo

### Detalhes

- usar objetos `Detail`
- carregar apenas o necessário para a tela

### Conteúdo clínico

- separar `metadata` de `content`
- proteger endpoints clínicos com autorização reforçada e auditoria
- conteúdo bruto deve ter TTL técnico e trilha de descarte

## 8. Contratos de erro

### Padrão recomendado

- `code`
- `message`
- `details`
- `requestId`

### Códigos mínimos

- `UNAUTHORIZED`
- `FORBIDDEN`
- `ACCOUNT_RESTRICTED`
- `CONSENT_REQUIRED`
- `FEATURE_DISABLED`
- `AUDIO_MODE_NOT_ALLOWED`
- `SESSION_NOT_AVAILABLE`
- `RAW_ARTIFACT_EXPIRED`
- `RESOURCE_NOT_FOUND`
- `VALIDATION_ERROR`
- `INTEGRATION_UNAVAILABLE`

## 9. Contratos que podem esperar

- busca global
- exportação massiva
- analytics avançado
- integrações fiscais profundas
- APIs de clínica multiusuário enterprise

## 10. Contratos que precisam respeitar a tese atual do MVP

### Conta e capabilities

`GET /v1/account/capabilities` deve informar no mínimo:

- se `audio_transcription` está habilitado
- se `patient_portal_payments` está habilitado
- se a conta está em modo `brazil_only_processing`

### Clinical review detail

`GET /v1/clinical-review/:appointmentId` deve separar:

- `appointment`
- `patientSummary`
- `reviewState`
- `allowedInputModes`
- `draftSummary`
- `approvedRecordMetadata`

Não deve retornar transcript bruto por padrão.

### Draft clínico

`PATCH /v1/clinical-review/:appointmentId/draft`

Objetivo:

- salvar edições humanas do rascunho clínico
- preservar a separação entre material de trabalho e registro final
- preparar aprovação explícita posterior pelo terapeuta

### Áudio/transcrição

Os endpoints de áudio só devem:

- existir para contas com capability habilitada
- gerar transcript como artefato temporário
- disparar descarte automático do bruto após processamento

Eles não devem pressupor retenção longa do áudio nem do transcript.
