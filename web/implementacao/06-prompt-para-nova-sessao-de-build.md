# Prompt para Nova Sessão de Build

## 1. Modelo recomendado

### Recomendação principal

Use:

- `gpt-5.4`
- `high`

## 2. Por que essa é a melhor escolha

Para começar a implementação deste projeto, `high` é o melhor ponto de equilíbrio.

Motivo:

- precisamos de leitura cuidadosa de bastante documentação
- precisamos de boas decisões arquiteturais logo no scaffold
- ainda não estamos em um problema que justifique `xhigh`

### Quando usar `medium`

Use `medium` apenas para:

- ajustes pequenos
- iterações curtas
- refinos em cima de uma base já criada

### Quando usar `xhigh`

Use `xhigh` só se a sessão for:

- refatoração grande
- decisão arquitetural crítica nova
- investigação difícil de bug/regressão
- redesign estrutural complexo

### Resposta curta

Se for abrir a nova sessão agora para começar o build:

`gpt-5.4 high`

## 3. Prompt completo recomendado

```text
Quero iniciar a fase de implementação real deste projeto.

Antes de qualquer código, leia e siga esta ordem de contexto:

1. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/00-indice-mestre.md
2. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/01-contexto-integral.md
3. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/00-indice-web.md
4. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/02-stack-recomendada.md
5. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/06-analise-de-ui-do-berries.md
6. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/07-avaliacao-do-supabase.md
7. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/produto/prd-mvp.md
8. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/01-ordem-de-build.md
9. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/03-apis-e-contratos.md
10. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/04-backlog-do-mvp.md
11. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/05-prontidao-para-codificar.md

Regras obrigatórias desta sessão:

- siga a documentação existente como fonte de verdade
- salve toda decisão nova relevante em arquivos .md
- se algo da documentação estiver inconsistente com o build, atualize os documentos junto com o código
- trate o produto como web-first
- implemente apenas o core web
- não implemente app mobile agora
- mantenha áudio/transcrição como capability condicional
- o produto precisa ser útil sem áudio
- o fluxo principal de pós-sessão deve funcionar com texto/ditado
- não implementar sugestão de CID ou diagnóstico por IA
- não reter áudio bruto nem transcript bruto após processamento
- manter processamento no Brasil como direção atual

Stack já definida para esta fase:

- frontend: Next.js + TypeScript + React + Tailwind v4 + Radix
- backend: NestJS + Fastify
- banco: Supabase Postgres
- storage: Supabase Storage
- auth: Supabase Auth
- ORM: Drizzle
- jobs: Redis + BullMQ

Arquitetura obrigatória:

- não usar frontend + supabase-js como espinha dorsal do domínio clínico
- o backend NestJS continua sendo a fonte de verdade para autorização, regras de negócio, auditoria e domínio clínico
- Supabase entra como infraestrutura gerenciada

Direção de UX obrigatória:

- use a skill global $saas-conversion-builder se ela estiver disponível
- auth deve ser extremamente claro, objetivo e sem dúvida
- cada tela importante deve ter CTA principal evidente
- dashboard deve ser mesa de ação, não BI
- listas operacionais devem ser fáceis de escanear

O que eu quero que você faça agora:

1. Ler a documentação acima.
2. Resumir em poucas linhas o que será implementado nesta primeira sessão.
3. Confirmar a estrutura de pastas/monorepo que será criada.
4. Iniciar a implementação pela Fase 0 e Fase 1 do build.
5. Se ainda não existir codebase, scaffoldar o projeto real.
6. Entregar código funcional, não só plano.

Escopo desta primeira sessão de implementação:

- scaffold do monorepo
- apps/web
- apps/api
- packages/contracts
- packages/ui
- packages/config
- configuração base de lint/format/types
- variáveis de ambiente
- setup inicial do Next.js
- setup inicial do NestJS
- integração inicial com Supabase
- auth base
- MFA preparado
- shell autenticado mínimo

No fim, me mostre:

- o que foi criado
- o que está funcional
- o que ainda falta
- quais arquivos .md foram atualizados
```

## 4. Versão mais curta, se quiser algo mais direto

```text
Leia os índices e documentos oficiais do projeto em /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura, especialmente a trilha de /web, e comece a implementação real do core web.

Stack já definida:
Next.js + NestJS + Drizzle + Supabase Postgres + Supabase Storage + Supabase Auth + Redis/BullMQ.

Regras:
- salvar toda decisão relevante em .md
- backend NestJS como fonte de verdade do domínio
- áudio/transcrição como capability condicional
- produto útil sem áudio
- pós-sessão principal via texto/ditado
- sem CID por IA

Comece pela Fase 0 e Fase 1 do build e scaffold o projeto real se ainda não existir.
```

## 5. Versão recomendada para começar pela dashboard

Use esta versão se você quiser iniciar pela `dashboard do terapeuta` e ir construindo por blocos visuais com `dummy data`.

```text
Quero iniciar a fase de implementação real deste projeto.

Antes de qualquer código, leia e siga esta ordem de contexto:

1. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/00-indice-mestre.md
2. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/01-contexto-integral.md
3. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/00-indice-web.md
4. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/02-stack-recomendada.md
5. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/06-analise-de-ui-do-berries.md
6. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/fundacao/07-avaliacao-do-supabase.md
7. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/produto/prd-mvp.md
8. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/telas/01-estrutura-base-do-web.md
9. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/telas/04-dashboard-do-terapeuta.md
10. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/01-ordem-de-build.md
11. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/03-apis-e-contratos.md
12. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/04-backlog-do-mvp.md
13. /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/web/implementacao/05-prontidao-para-codificar.md

Regras obrigatórias desta sessão:

- siga a documentação existente como fonte de verdade
- salve toda decisão nova relevante em arquivos .md
- se algo da documentação estiver inconsistente com o build, atualize os documentos junto com o código
- trate o produto como web-first
- implemente apenas o core web
- não implemente app mobile agora
- mantenha áudio/transcrição como capability condicional
- o produto precisa ser útil sem áudio
- o fluxo principal de pós-sessão deve funcionar com texto/ditado
- não implementar sugestão de CID ou diagnóstico por IA
- não reter áudio bruto nem transcript bruto após processamento
- manter processamento no Brasil como direção atual

Stack já definida para esta fase:

- frontend: Next.js + TypeScript + React + Tailwind v4 + Radix
- backend: NestJS + Fastify
- banco: Supabase Postgres
- storage: Supabase Storage
- auth: Supabase Auth
- ORM: Drizzle
- jobs: Redis + BullMQ

Arquitetura obrigatória:

- não usar frontend + supabase-js como espinha dorsal do domínio clínico
- o backend NestJS continua sendo a fonte de verdade para autorização, regras de negócio, auditoria e domínio clínico
- Supabase entra como infraestrutura gerenciada

Direção de UX obrigatória:

- use a skill global $saas-conversion-builder se ela estiver disponível
- auth deve ser extremamente claro, objetivo e sem dúvida
- cada tela importante deve ter CTA principal evidente
- dashboard deve ser mesa de ação, não BI
- listas operacionais devem ser fáceis de escanear

Estratégia de implementação desta sessão:

- quero começar pela dashboard do terapeuta
- quero construir por blocos visuais e funcionais
- neste momento inicial pode usar dummy data bem estruturada
- a interface precisa ficar visualmente completa, populada e fácil de avaliar
- organize o código para que depois seja fácil trocar dummy data por dados reais

O que eu quero que você faça agora:

1. Ler a documentação acima.
2. Resumir em poucas linhas o que será implementado nesta primeira sessão.
3. Confirmar a estrutura de pastas/monorepo que será criada.
4. Se ainda não existir codebase, scaffoldar o projeto real.
5. Implementar a base do projeto e a dashboard do terapeuta primeiro.
6. Construir a dashboard por blocos, com componentes claros e reutilizáveis.
7. Popular a dashboard com dummy data realista.
8. Deixar a tela pronta para avaliação visual e futura integração com dados reais.

Escopo desta primeira sessão de implementação:

- scaffold do monorepo
- apps/web
- apps/api
- packages/contracts
- packages/ui
- packages/config
- configuração base de lint/format/types
- variáveis de ambiente
- setup inicial do Next.js
- setup inicial do NestJS
- integração inicial com Supabase
- auth base
- MFA preparado
- shell autenticado mínimo
- rota da dashboard do terapeuta
- componentes visuais da dashboard
- dummy data para cards, listas, agenda do dia, pendências e ações rápidas

Quero que a dashboard já tenha aparência de produto real, não de wireframe cru.

No fim, me mostre:

- o que foi criado
- o que está funcional
- quais blocos da dashboard já existem
- o que ainda falta
- quais arquivos .md foram atualizados
```
