# Sessão 28 - Landing real, tracking leve e waitlist interna

## Objetivo

Sair do estado de preview isolado e ligar a landing ao fluxo real do produto, adicionando:

- leitura SSR do summary real da waitlist
- tracking mínimo de origem
- visão interna simples da fila capturada

## Entregue

- home pública em `/` consumindo `GET /v1/marketing/waitlist/summary` com fallback seguro
- captura real de `sourcePath`, `utm_source`, `utm_medium`, `utm_campaign` e `referrerHost`
- extensão do tracking para `utm_content` e `utm_term`
- endpoint interno `GET /v1/internal/waitlist`
- rota interna `/internal/waitlist`
- tela interna para leitura de origem, dor principal, contexto enriquecido e atualização dos leads

## Arquivos principais

- `apps/web/app/page.tsx`
- `apps/web/src/components/marketing/waitlist-form.tsx`
- `apps/web/src/components/marketing/landing-page.tsx`
- `apps/api/src/modules/marketing/waitlist.service.ts`
- `apps/api/src/modules/internal/internal.controller.ts`
- `apps/api/src/modules/internal/internal-ops.service.ts`
- `apps/web/app/(internal)/internal/waitlist/page.tsx`
- `apps/web/src/components/internal/internal-waitlist-page.tsx`
- `packages/contracts/src/index.ts`

## Observações

- o tracking continua propositalmente leve e suficiente para aprender com distribuição
- a visão interna da waitlist não tenta virar CRM; ela existe para leitura operacional de aderência
- a persistência continua em store local simples, preparada para troca posterior por infraestrutura real
