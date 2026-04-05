# Sessao 10 - Admin Interno

## 1. Objetivo da sessao

Entregar o `admin interno minimo` como superficie real do produto, separada do web do terapeuta e protegida por perfil interno com MFA.

## 2. Entregas realizadas

- shell interno separado em `/internal`
- login mock interno com redirecionamento por perfil
- visao geral operacional
- lista e detalhe de tenants
- suporte interno por metadata
- billing ops
- auditoria
- incidentes

## 3. Endpoints disponiveis apos a sessao

- `GET /v1/internal/bootstrap`
- `GET /v1/internal/summary`
- `GET /v1/internal/tenants`
- `GET /v1/internal/tenants/:tenantId`
- `GET /v1/internal/support`
- `GET /v1/internal/billing`
- `GET /v1/internal/audit`
- `GET /v1/internal/incidents`

## 4. Decisoes registradas

- usuario interno nao passa mais pelo `hydrateSession` do workspace clinico
- o login web agora resolve o destino da sessao por tipo de usuario
- `/login` deixa de assumir que toda sessao autenticada pertence ao terapeuta
- o admin interno continua `metadata-first`, sem leitura livre de prontuario ou transcript

## 5. Credenciais dummy de avaliacao

- e-mail: `ops@terapia.internal`
- senha: `12345678`
- MFA: `123456`

## 6. O que ainda falta

- RBAC fino por modulo interno
- step-up real para acoes sensiveis
- exportacao real de auditoria
- incidentes persistidos em banco

## 7. Validacao esperada

- `npm run typecheck`
- `npm run lint`
- `npm run build`
