# Sessão 06 - Prontuário Longitudinal

## 1. Objetivo da sessão

Entregar a próxima fatia vertical após revisão clínica:

- prontuário longitudinal do paciente
- leitura histórica do caso focada em registros finais aprovados
- separação explícita entre prontuário final e material de trabalho

## 2. Escopo implementado

### Backend

- `GET /v1/clinical-records/patients/:patientId`
- `GET /v1/clinical-records/patients/:patientId/:recordId`
- `GET /v1/clinical-records/patients/:patientId/:recordId/versions`

### Web

- página `/app/patients/:patientId/clinical-record` com:
  - breadcrumbs
  - cabeçalho do prontuário
  - CTA para ficha do paciente
  - CTA para revisão pendente
  - timeline de entradas aprovadas
  - painel principal de leitura
  - metadata de aprovação
  - lista de versões aprovadas

## 3. Decisões novas registradas

- o agregado principal do prontuário já entrega `entries` completas no backend para evitar duplicação de conteúdo clínico no frontend
- a tela continua estritamente read-only nesta fase
- a revisão pendente aparece como destaque lateral sem transformar o prontuário em editor

## 4. Dummy data desta fase

- Maria Souza com múltiplas entradas aprovadas
- Lucas Santos com registro aprovado anterior e revisão pendente mais nova
- Renata Costa com último registro aprovado antigo e revisão atual bloqueada

## 5. O que ficou pendente

- rotas profundas de navegação por entrada/versão no web
- auditoria persistente real por leitura
- sincronização com aprovações dinâmicas vindas do fluxo clínico real
- integração com exportações futuras do prontuário

## 6. Arquivos principais criados ou alterados

- `apps/api/src/modules/clinical-records/clinical-records.service.ts`
- `apps/api/src/modules/clinical-records/clinical-records.controller.ts`
- `apps/web/app/(protected)/app/patients/[patientId]/clinical-record/page.tsx`
- `apps/web/src/components/clinical-record/clinical-record-page.tsx`
- `packages/contracts/src/index.ts`

## 7. Validação executada

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## 8. Observações

- o prontuário continua separado de transcript e rascunho, como definido na arquitetura
- a tela já fica útil para avaliação visual e futura troca por dados persistidos
