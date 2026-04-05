# Arquitetura do Sistema

## 1. Abordagem geral

Adotar `modular monolith` no backend com fronteiras claras de domínio, mais um `pipeline isolado` para teleatendimento, transcript e IA. Isso reduz complexidade operacional no início e preserva caminho de extração futura para serviços independentes.

## 2. Stack recomendada

### Frontend

- App móvel: `Flutter`
- Web admin: `Next.js + TypeScript`
- Design system compartilhado em tokens, componentes base e regras de acessibilidade

### Backend

- API principal: `NestJS + TypeScript`
- Banco relacional: `PostgreSQL`
- Fila e jobs assíncronos: `Redis + BullMQ`
- Storage de documentos/mídia: bucket compatível com `S3` com criptografia
- Observabilidade: `OpenTelemetry`, agregação de logs, alertas e rastreamento de erros

### Integrações externas

- Vídeo/RTC: provedor terceirizado via `VideoProviderAdapter`
- Transcript: provedor terceirizado via `TranscriptProviderAdapter`
- LLM: provedor terceirizado via `ClinicalDraftProviderAdapter`
- Pagamento: `PaymentGatewayAdapter`
- Assinatura eletrônica: `SignatureProviderAdapter`
- Fiscal futuro: `TaxProviderAdapter`

## 3. Bounded contexts

### Identity

Responsável por:

- usuários
- papéis
- autenticação
- MFA
- sessões
- dispositivos

### Tenancy

Responsável por:

- conta principal
- plano
- billing interno
- parâmetros do tenant
- futuras clínicas multiusuário

### Patient Ops

Responsável por:

- cadastro administrativo do paciente
- vínculo terapeuta-paciente
- responsáveis legais
- alertas
- status operacional

### Scheduling

Responsável por:

- disponibilidade
- sessões
- reagendamento
- cancelamentos
- lembretes
- salas virtuais

### Telehealth

Responsável por:

- criação da sala
- credenciais efêmeras
- webhooks do provedor
- presença
- encerramento

### Clinical Records

Responsável por:

- transcript
- rascunho IA
- prontuário
- histórico de versões
- busca clínica futura

### Billing

Responsável por:

- cobranças
- pagamentos
- conciliação simples
- exportações financeiras
- origem particular/convênio

### Documents & Consent

Responsável por:

- modelos
- documentos gerados
- assinaturas
- versionamento
- aceite e revogação

### Audit & Compliance

Responsável por:

- trilhas de auditoria
- retenção
- descarte
- legal hold
- solicitações de titular

## 4. Fluxos principais

### 4.1 Convite e onboarding do paciente

1. Terapeuta cria paciente.
2. Sistema cria convite com expiração.
3. Paciente aceita o convite.
4. Documents & Consent publica os termos pendentes.
5. Identity conclui o provisionamento.
6. Patient Ops ativa o vínculo terapeuta-paciente.

### 4.2 Ciclo da sessão

1. Scheduling cria a sessão.
2. Telehealth provisiona a sala quando a janela da sessão abre.
3. Paciente e terapeuta entram com credenciais temporárias.
4. Telehealth recebe evento de encerramento.
5. Transcript job é disparado.
6. Clinical Draft job processa o transcript.
7. O terapeuta revisa.
8. Clinical Records publica a versão final do prontuário.

### 4.3 Cobrança ligada à sessão

1. Scheduling marca sessão como realizada.
2. Billing avalia regra de cobrança.
3. Payment adapter cria cobrança.
4. Paciente paga.
5. Billing atualiza status.
6. Financeiro da ficha do paciente reflete o novo estado.

## 5. Eventos de domínio

- `tenant.created`
- `therapist.onboarded`
- `patient.invited`
- `patient.accepted_invite`
- `consent.accepted`
- `session.scheduled`
- `session.rescheduled`
- `session.canceled`
- `session.started`
- `session.ended`
- `transcript.requested`
- `transcript.completed`
- `ai_draft.generated`
- `clinical_note.approved`
- `charge.created`
- `payment.confirmed`
- `document.signed`
- `retention.review_due`

## 6. Contratos de API internos

### Regras

- APIs externas ao cliente devem ser versionadas.
- Eventos assíncronos devem ser idempotentes.
- Jobs críticos precisam de retry controlado e dead-letter queue.
- Dados clínicos não devem trafegar por endpoints genéricos de backoffice.

### Interfaces mínimas

- `POST /auth/login`
- `POST /auth/mfa/verify`
- `POST /patients`
- `GET /patients/:id`
- `POST /appointments`
- `POST /appointments/:id/check-in`
- `POST /appointments/:id/room`
- `POST /clinical-sessions/:id/transcript-jobs`
- `GET /clinical-records/patients/:patientId`
- `POST /clinical-records/drafts/:id/approve`
- `POST /charges`
- `POST /documents/:id/sign`

## 7. Separação de dados

### Banco operacional

Armazena:

- identidade
- agenda
- cobrança
- documentos
- relações de conta

### Banco ou schema clínico isolado

Armazena:

- transcript
- rascunho
- prontuário
- histórico clínico

Regras:

- acesso mínimo
- chaves separadas
- conexão restrita
- trilha de auditoria específica

## 8. Estratégia de expansão

- Fase 1: modular monolith com adapters externos.
- Fase 2: extrair `Telehealth` e `Clinical Records` se custo ou sensibilidade exigirem.
- Fase 3: introduzir tenancy organizacional completa para clínicas.

## 9. Riscos técnicos já conhecidos

- Custo de transcript em sessões longas.
- Latência entre fim da sessão e rascunho disponível.
- Tratamento seguro de transcript bruto.
- Dependência contratual de vídeo e LLM.
- Complexidade de retenção/descarte em dados clínicos com vínculos legais diferentes.
