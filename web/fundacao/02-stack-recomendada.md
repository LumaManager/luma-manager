# Stack Recomendada do Web

## 1. Objetivo

Definir uma stack coerente para o `beta web-first`, priorizando velocidade de execução, segurança, consistência de TypeScript e caminho limpo para evolução posterior.

## 2. Recomendação principal

### Frontend

- `Next.js` com `App Router`
- `TypeScript`
- `React`
- `Tailwind CSS v4`
- `Radix Primitives`

### Backend

- `NestJS`
- `TypeScript`
- `Fastify` como adapter HTTP

### Dados e jobs

- `PostgreSQL`
- `Drizzle ORM`
- `Redis`
- `BullMQ`
- `S3-compatible object storage`

### Segurança e identidade

- `Supabase Auth`
- senha com fluxo nativo do Supabase Auth
- `TOTP` para MFA
- access token curto + refresh token rotativo via Supabase Auth

### Observabilidade e qualidade

- `OpenTelemetry`
- error tracking
- testes unitários + integração + `Playwright` para fluxos críticos

## 3. Por que essa stack faz sentido

### Consistência

- TypeScript ponta a ponta
- menor fricção entre web e API
- contratos mais fáceis de compartilhar

### Velocidade

- Next.js acelera build do produto web
- NestJS acelera organização do backend modular
- Tailwind + Radix aceleram UI sem sacrificar acessibilidade

### Controle

- PostgreSQL + Drizzle dão mais controle de schema, auditoria e SQL do que uma camada mais mágica
- BullMQ resolve bem jobs de transcript, notificações e pipeline clínico
- Supabase Auth acelera o MVP sem bloquear MFA, sessões, claims customizadas e trilha de auth

## 4. Recomendação de integração técnica

### Web e API

- `apps/web`
- `apps/api`
- `packages/contracts`
- `packages/ui`

### Regras

- contratos tipados compartilhados
- validação de entrada e saída
- versionamento de API
- adapters externos isolados por domínio
- o `backend` continua sendo a fonte de verdade de autorização clínica e regras de negócio
- `Supabase Auth` resolve identidade, sessão e MFA; ele não substitui a camada de domínio do backend

## 5. Infraestrutura recomendada

### Estratégia

Preferir uma base de cloud simples e previsível.

### Recomendação atual

- API, banco, storage e Redis no mesmo provedor principal
- evitar multi-cloud cedo demais
- evitar serverless-first para o pipeline clínico

### Observação

O provedor de cloud ainda pode ser fechado depois, mas a topologia recomendada é:

- um cloud principal
- web + API + dados com observabilidade central

## 6. O que eu não recomendo para este caso

- `GraphQL` no MVP
- microservices logo no início
- múltiplas clouds desde o beta
- ORM excessivamente opinativo se atrapalhar SQL e auditoria
- expor domínio clínico direto ao frontend via `supabase-js` como caminho principal

## 7. Decisão adicional fechada

### Auth

Decisão atual:

- usar `Supabase Auth`

Motivo:

- você já domina a plataforma
- há suporte oficial a `TOTP MFA`
- há suporte a sessões com refresh token rotativo
- há `custom access token hooks` para claims
- a velocidade de MVP melhora sem sacrificar a arquitetura principal

Caveats:

- controles avançados de `password verification` e `MFA verification hooks` são `Teams/Enterprise`
- controles de lifetime e número de sessões por usuário são `Pro+`
- o backend continua responsável por autorização contextual, auditoria clínica e regras de domínio

## 8. Fontes consultadas

- Next.js App Router: https://nextjs.org/docs/app
- NestJS docs: https://docs.nestjs.com/
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind compatibility: https://tailwindcss.com/docs/compatibility
- Radix Primitives: https://www.radix-ui.com/primitives/docs/overview/introduction
- Drizzle ORM: https://orm.drizzle.team/docs/get-started
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase MFA TOTP: https://supabase.com/docs/guides/auth/auth-mfa/totp
- Supabase Sessions: https://supabase.com/docs/guides/auth/sessions
- Supabase Custom Access Token Hook: https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
