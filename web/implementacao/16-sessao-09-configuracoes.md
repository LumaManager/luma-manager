# Sessao 09 - Configuracoes

## 1. Objetivo da sessao

Entregar a area de `configuracoes` como superficie de governanca operacional do terapeuta, com navegacao interna por secao, salvamento isolado e trilha resumida de alteracoes sensiveis.

## 2. Entregas realizadas

- bootstrap unico de configuracoes no backend
- persistencia dummy em memoria por secao
- rotas reais:
  - `/app/settings/profile`
  - `/app/settings/practice`
  - `/app/settings/security`
  - `/app/settings/policies`
  - `/app/settings/notifications`
- salvamento por secao com endpoints dedicados
- remediacoes destacadas no topo da area
- trilha lateral de alteracoes sensiveis

## 3. Endpoints disponiveis apos a sessao

- `GET /v1/settings`
- `POST /v1/settings/profile`
- `POST /v1/settings/practice`
- `POST /v1/settings/security`
- `POST /v1/settings/policies`
- `POST /v1/settings/notifications`

## 4. Decisoes registradas

- configuracoes usa `bootstrap unico` para manter orientacao e reduzir multiplas chamadas iniciais
- `pending_setup` continua fora da area e vai para onboarding
- o retorno de salvamento informa `stepUpRequired` quando a mudanca for sensivel, mesmo com reautenticacao ainda mockada
- perfil e consultorio sincronizam campos que impactam shell e dominio derivado

## 5. O que ainda falta

- step-up authentication real
- reset real de MFA
- mudanca real de e-mail de login
- politica fina de revogacao de sessoes
- trilha persistida em banco

## 6. Validacao esperada

- `npm run typecheck`
- `npm run lint`
- `npm run build`
