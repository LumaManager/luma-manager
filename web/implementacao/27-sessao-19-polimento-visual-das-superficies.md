# Sessão 19: Polimento visual das superfícies prontas

## Objetivo

Elevar as telas já funcionais do core web para o mesmo nível de clareza visual da dashboard, sem mexer no escopo de domínio e sem introduzir dependência nova de frontend.

## Superfícies trabalhadas

- agenda
- detalhe da sessão
- pacientes
- ficha do paciente
- revisão clínica
- detalhe da revisão clínica
- documentos
- detalhe documental
- financeiro
- detalhe da cobrança
- prontuário longitudinal

## Decisões de UI consolidadas

### 1. Hero operacional único por superfície

As telas principais passaram a usar um `hero` com a mesma gramática:

- badges de contexto
- título forte
- descrição curta e objetiva
- CTA principal e secundários no topo
- mini-blocos de sinal operacional logo abaixo

Isso evita páginas com cabeçalho fraco enquanto a dashboard já trabalha com direção visual forte.

### 2. Painel de filtros deixou de ser “formulário solto”

Listas operacionais agora usam um painel de controle com:

- título da área de filtragem
- explicação curta do que o filtro controla
- ações de `Aplicar`, `Limpar` ou `Extras`
- chips ativos no rodapé do próprio painel

O objetivo é aumentar legibilidade e reduzir a sensação de layout “montado por partes”.

### 3. Sinais operacionais compactos e comparáveis

Os indicadores das telas passaram a ser tratados como blocos pequenos e comparáveis:

- contagem em foco
- itens críticos
- pendências
- continuidade

Isso aproxima pacientes, agenda, revisão, documentos e financeiro da mesma mesa de ação.

### 4. Detalhes seguem o mesmo padrão da dashboard

Páginas de detalhe agora não começam mais com cabeçalhos neutros. Elas herdam o mesmo padrão de:

- estado atual visível
- CTA acionável sem scroll
- três sinais rápidos do objeto aberto

Isso vale para sessão, documento, cobrança, revisão clínica e prontuário.

## Componentes novos

- `apps/web/src/components/shared/operational-surface.tsx`

### Componentes criados

- `OperationalHero`
- `ToolbarPanel`

## Impacto no produto

- o conjunto visual fica mais coerente sem depender só da dashboard para “parecer produto real”
- a leitura de CTA primário e contexto operacional fica mais rápida
- o core web passa a parecer uma suíte única, não páginas avulsas

## Validação

- `npm run typecheck --workspace @terapia/web` passou com `Node 22`

## Observação de ambiente

O `lint` do web continua bloqueado por problema de toolchain local em `eslint/package.json` no `node_modules`, não por erro dos componentes novos.
