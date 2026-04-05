# Sessão 14 - Edição e Exclusão de Bloqueios na Agenda

## 1. Objetivo

Fechar o ciclo operacional dos bloqueios de agenda, saindo de `criação isolada` para um fluxo realmente utilizável no dia a dia.

## 2. Entregas

- novos endpoints para atualizar e excluir bloqueios
- novos proxies web para essas mutações
- drawer de bloqueio em modo duplo:
  - criação
  - edição
- exclusão direta do bloqueio a partir do mesmo drawer
- blocos da grade semanal e da lateral agora abrem o contexto de edição

## 3. Decisões registradas

- bloqueio não merece uma rota própria de detalhe no MVP
- o melhor fluxo para o terapeuta é `editar no contexto da agenda`
- o identificador do bloqueio pode trafegar por query string para abrir o drawer certo sem quebrar a navegação principal

## 4. Resultado prático

A agenda agora cobre:

- criar sessão
- criar bloqueio
- editar bloqueio
- excluir bloqueio
- reagendar sessão
- cancelar sessão

## 5. O que ainda falta neste subfluxo

- edição da disponibilidade estrutural
- drag and drop controlado
- remarcação a partir da própria grade
- exclusão com confirmação mais rica quando o bloqueio estiver muito próximo da sessão
