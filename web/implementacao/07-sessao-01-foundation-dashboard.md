# Sessao 01 de Implementacao Real

Data de consolidacao: `30/03/2026`.

## 1. Objetivo desta sessao

Iniciar a codebase real do produto com foco em:

- foundation do monorepo
- `apps/web`
- `apps/api`
- `packages/contracts`
- `packages/ui`
- `packages/config`
- auth base com MFA preparado
- shell autenticado minimo
- dashboard do terapeuta visualmente completa com dummy data estruturada

## 2. Estrutura real criada

O repositrio passou a conviver com documentacao e codebase na mesma raiz.

Estrutura principal desta fase:

- `apps/web`
- `apps/api`
- `packages/contracts`
- `packages/ui`
- `packages/config`

Regra adotada:

- a documentacao existente continua na raiz como fonte de verdade
- a codebase entra ao lado dela, sem mover ou duplicar os `.md`

## 3. Decisoes aplicadas no scaffold

### Arquitetura

- `Next.js + TypeScript + React + Tailwind v4 + Radix` no web
- `NestJS + Fastify` na API
- `Supabase` preparado como infraestrutura para `Auth`, `Postgres` e `Storage`
- `Drizzle` preparado na API com `drizzle.config.ts` e schema inicial
- o frontend nao usa `supabase-js` como espinha dorsal do dominio clinico
- o backend continua como fonte de verdade para auth de aplicacao, bootstrap, dashboard e regras futuras

### Auth

- login em `2 etapas`: credenciais e MFA
- modo inicial funcional em `mock`, para avaliacao visual e de fluxo
- integracao real com `Supabase` deixada preparada via `SupabaseService` e envs
- sessao do web mantida em cookie httpOnly do proprio app web

### Dashboard

- dashboard construida como `mesa de acao`
- sem graficos analiticos
- `6 cards` principais
- `3 listas` operacionais
- quick actions com CTA explicito
- dummy data realista centralizada na API, para troca futura por dados reais sem refazer a tela

## 4. Contratos e endpoints implementados nesta fase

Endpoints funcionais criados:

- `POST /v1/auth/login`
- `POST /v1/auth/mfa/verify`
- `GET /v1/auth/me`
- `POST /v1/auth/logout`
- `GET /v1/app-shell/bootstrap`
- `GET /v1/dashboard/therapist`
- `GET /v1/health`

Os payloads principais ficaram tipados em `packages/contracts`.

## 5. Alinhamentos documentais feitos

Foram ajustados documentos para refletir o build real:

- `web/telas/04-dashboard-do-terapeuta.md`
  - endpoint agregador da dashboard atualizado para `GET /v1/dashboard/therapist`
- `web/implementacao/03-apis-e-contratos.md`
  - adicionados `GET /v1/app-shell/bootstrap` e `GET /v1/dashboard/therapist`

## 6. Limites assumidos nesta sessao

- auth real com `Supabase Auth` ainda nao foi ligado ponta a ponta
- MFA real continua `preparado`, mas o fluxo funcional desta sessao usa codigo dummy
- pacientes, agenda, documentos, financeiro e revisao clinica ainda estao em rotas placeholder
- audio/transcricao seguem fora do fluxo principal e continuam capability condicional

## 7. Resultado esperado apos install

Com dependencias instaladas e envs configurados:

- `apps/api` sobe com endpoints versionados
- `apps/web` sobe com login, shell protegido e dashboard
- a dashboard fica pronta para avaliacao visual imediata
- o dummy data pode ser trocado por dados reais mantendo os contratos
