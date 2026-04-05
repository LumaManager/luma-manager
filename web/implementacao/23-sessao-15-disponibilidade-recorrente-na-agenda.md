# Sessão 15 - Disponibilidade Recorrente na Própria Agenda

## 1. Objetivo

Transformar `Editar disponibilidade` em fluxo real dentro da agenda, evitando o handoff para configurações e deixando a superfície principal mais completa.

## 2. Entregas

- disponibilidade recorrente passou a ser dado stateful da agenda
- `GET /v1/appointments` agora devolve regras de disponibilidade junto com a grade
- novo endpoint `POST /v1/appointments/availability`
- novo proxy web para atualizar disponibilidade
- novo drawer de disponibilidade recorrente na própria agenda

## 3. Decisões registradas

- disponibilidade recorrente faz parte do contexto da agenda, não da navegação de settings
- o terapeuta precisa ajustar dias e janelas sem perder o panorama da semana
- o MVP pode trabalhar com janelas recorrentes simples por dia, sem agenda externa e sem regras avançadas

## 4. Resultado prático

A agenda agora cobre:

- criar sessão
- editar disponibilidade recorrente
- criar bloqueio
- editar bloqueio
- excluir bloqueio
- reagendar sessão
- cancelar sessão

## 5. O que ainda falta

- exceções recorrentes mais sofisticadas
- feriados / indisponibilidade automática
- drag and drop controlado
- remarcação direta na grade
