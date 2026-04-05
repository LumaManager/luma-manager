# Sessao 07 - Documentos e Consentimentos

## 1. Objetivo da sessao

Entregar a area de `documentos e consentimentos` como superficie operacional real do core web, usando dummy data estruturada, lista-first, detalhe por navegacao e mutacoes suficientes para avaliacao visual.

## 2. Entregas realizadas

- modulo `documents` no backend NestJS
- contratos compartilhados para lista, detalhe, geracao e mutacoes documentais
- rota `/app/documents` com:
  - cabecalho com CTA primario
  - cards de resumo
  - filtros visiveis
  - painel lateral de filtros extras
  - drawer de geracao
  - tabela operacional priorizada
- rota `/app/documents/:documentId` com:
  - contexto do documento
  - status de assinatura e consentimento
  - impactos operacionais
  - preview resumido
  - timeline de eventos
  - acoes de reenviar, revogar e gerar nova versao

## 3. Endpoints disponiveis apos a sessao

- `GET /v1/documents`
- `POST /v1/documents`
- `GET /v1/documents/:documentId`
- `POST /v1/documents/:documentId/sign`
- `POST /v1/documents/:documentId/resend`
- `POST /v1/documents/:documentId/revoke`

## 4. Decisoes registradas

- `sign` foi mantido como mutacao dummy de QA para permitir avaliacao rapida das mudancas de estado antes do portal do paciente existir
- filtros extras ficaram em `painel lateral`, preservando a intencao original de drawer sem esconder os filtros principais
- o detalhe documental mostra `preview resumido`, nao o PDF completo nem editor juridico inline

## 5. O que ainda falta

- provider real de assinatura
- documentos reais em storage e URLs assinadas
- portal do paciente para aceite
- politicas finas de bloqueio cruzando documento, agenda, call e financeiro em dado persistido

## 6. Validacao esperada

- `npm run typecheck`
- `npm run lint`
- `npm run build`
