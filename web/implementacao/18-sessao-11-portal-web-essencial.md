# Sessao 11 - Portal Web Essencial do Paciente

## 1. Objetivo da sessao

Fechar a lacuna principal do MVP web-first fora do shell do terapeuta: o `portal do paciente` para convite, documentos, pagamento e acesso a sessao.

## 2. Entregas realizadas

- convite publico em `/invite/[token]`
- shell do paciente em `/portal`
- lista e detalhe de sessoes
- entrada na call do paciente
- lista e detalhe de documentos com assinatura dummy
- lista e detalhe de pagamentos com confirmacao dummy
- perfil operacional do paciente

## 3. Endpoints disponiveis apos a sessao

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

## 4. Decisoes registradas

- o portal usa cookie proprio e nao compartilha sessao com terapeuta
- o token publico do convite vira sessao dummy separada para reduzir acoplamento no MVP
- a call do paciente permanece operacional, sem abrir dominio clinico
- assinatura e pagamento foram mantidos stateful em memoria para avaliacao visual rapida

## 5. Rotas principais para avaliacao

- `/invite/invite_maria_001`
- `/portal/appointments`
- `/portal/appointments/portal_appt_1032`
- `/portal/appointments/portal_appt_1032/call`
- `/portal/documents`
- `/portal/documents/portal_doc_201`
- `/portal/payments`
- `/portal/payments/portal_charge_401`
- `/portal/profile`

## 6. O que ainda falta

- autenticacao real do paciente
- pagamento real com provider
- assinatura eletronica real
- webhooks reais da presenca na call
- fluxo de recuperacao de acesso do portal

## 7. Validacao esperada

- `npm run typecheck`
- `npm run lint`
- `npm run build`
