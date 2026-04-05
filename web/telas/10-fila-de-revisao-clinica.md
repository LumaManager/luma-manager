# Web do Terapeuta - Etapa 10 - Fila de Revisão Clínica

## 1. Objetivo

Definir de forma fechada a `fila de revisão clínica` no web admin do terapeuta, cobrindo:

- o inbox pós-sessão do terapeuta
- a lista de sessões com transcript e/ou rascunho pendente
- os estados de processamento clínico
- priorização e SLA operacional
- navegação para a tela de transcript e rascunho

## 2. Papel da tela no produto

A fila de revisão clínica é o `inbox operacional do pós-sessão`.

Ela precisa responder rapidamente:

1. quais sessões ainda exigem revisão?
2. o transcript já ficou pronto?
3. o rascunho da IA já foi gerado?
4. qual item está mais atrasado ou mais urgente?
5. para qual sessão eu devo ir agora?

## 3. Escopo desta etapa

### Dentro do escopo

- lista de itens pendentes de revisão
- filtros operacionais
- ordenação por prioridade e atraso
- estados de transcript e rascunho
- indicadores de SLA
- navegação para revisão detalhada

### Fora do escopo

- leitura integral do transcript
- edição do rascunho
- aprovação do prontuário
- busca semântica clínica
- analytics clínicos avançados

## 4. Decisões travadas nesta etapa

- a fila de revisão será uma `lista/tabela operacional`, não dashboard
- a rota principal será `/app/clinical-review`
- a ordenação padrão será por `prioridade operacional`, não alfabética
- a fila mostrará o `estado do pipeline clínico`, mas não o conteúdo clínico
- o terapeuta poderá abrir diretamente o próximo item pendente
- a fila terá `SLA interno visual`, mas não promessa externa ao usuário
- itens concluídos não ficam na fila principal do MVP
- a fila é focada em `pendência atual`; histórico completo fica para outras superfícies

## 5. Rota e permissão

### Rota

- `/app/clinical-review`

### Permissão

- terapeuta autenticado com vínculo às sessões listadas

### Regra crítica

- a tela não deve listar sessões fora do vínculo do terapeuta
- a fila não deve mostrar texto clínico ou trechos de transcript no nível de lista

## 6. Estrutura geral da tela

Esta tela usa o `Template B: Lista com detalhe por navegação`, com foco em priorização.

Estrutura final:

1. título e contexto
2. CTA principal
3. faixa de filtros
4. lista principal da fila
5. paginação ou carregamento contínuo controlado

## 7. Cabeçalho da página

### Título

- `Revisão Clínica`

### Subtítulo

- frase curta explicando que a área reúne sessões aguardando revisão e fechamento clínico

Exemplo:

- `Revise sessões pendentes e feche o registro clínico com segurança.`

### Ação primária

- `Abrir próximo item`

### Ações secundárias

- nenhuma no MVP

## 8. Modelo de item da fila

Cada item representa `uma sessão encerrada` que entrou no fluxo clínico pós-atendimento.

### Campos visíveis por item

- paciente
- data e hora da sessão
- status do transcript
- status do rascunho IA
- prioridade/SLA
- estado final da revisão

## 9. Estados do pipeline clínico na fila

### Estado do transcript

- `Não iniciado`
- `Processando`
- `Pronto`
- `Falha`
- `Desativado`

### Estado do rascunho IA

- `Não iniciado`
- `Aguardando transcript`
- `Gerando`
- `Pronto`
- `Falha`
- `Desativado`

### Estado do item de revisão

- `Aguardando processamento`
- `Pronto para revisar`
- `Em revisão`
- `Bloqueado`

### Regra

- o estado de revisão do item é derivado do transcript, do rascunho e de bloqueios operacionais

## 10. Priorização da fila

### Ordem padrão

1. itens `Pronto para revisar` mais antigos
2. itens `Em revisão`
3. itens com `Falha`
4. itens `Aguardando processamento`

### Regras

- prioridade principal é antiguidade do item pendente
- falha ganha destaque visual, mas não necessariamente vai acima de tudo se ainda houver revisão pronta mais antiga
- itens muito antigos devem ganhar destaque de SLA

## 11. SLA interno visual

### Objetivo

Mostrar atraso operacional sem transformar isso em promessa clínica formal.

### Faixas sugeridas

- `Dentro do prazo`
- `Atenção`
- `Atrasado`

### Base de cálculo

- tempo desde o encerramento da sessão

### Regras

- os thresholds ficam parametrizáveis no backend
- no MVP, o SLA é só interno, para priorização visual

## 12. Filtros da fila

### Filtros visíveis

- status do item
- status do transcript
- status do rascunho
- SLA

### Busca local

Deve buscar por:

- nome do paciente
- data da sessão

### Filtros adicionais em drawer

- apenas itens com falha
- apenas itens da semana
- apenas itens com transcript desativado

### Regras

- filtros ativos devem virar chips visíveis
- precisa existir botão `Limpar filtros`

## 13. Colunas da lista

### Colunas obrigatórias

1. `Paciente`
2. `Sessão`
3. `Transcript`
4. `Rascunho IA`
5. `SLA`
6. `Estado`

### Coluna 1 - Paciente

- nome completo
- atalho para ficha do paciente

### Coluna 2 - Sessão

- data
- horário
- modalidade resumida

### Coluna 3 - Transcript

- badge de status

### Coluna 4 - Rascunho IA

- badge de status

### Coluna 5 - SLA

- badge visual
- idade do item, se útil

### Coluna 6 - Estado

- estado geral do item

## 14. Interação por linha

### Comportamento principal

- clique na linha abre a tela de transcript/rascunho:
  - `/app/clinical-review/:appointmentId`

### Ações rápidas por linha

- abrir revisão
- abrir ficha do paciente
- tentar novamente processamento, quando houver falha e essa ação existir

### Regras

- não mostrar transcript inline
- não permitir edição clínica diretamente da fila

## 15. CTA "Abrir próximo item"

### Objetivo

Reduzir esforço de decisão do terapeuta.

### Regra

- abre o item mais prioritário segundo a ordenação vigente e filtros ativos

### Se não houver item elegível

- mostrar estado vazio e desabilitar CTA

## 16. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton da lista

### Empty state inicial

Quando não há nada pendente:

- mensagem positiva e neutra
- exemplo:
  - `Nenhuma sessão aguardando revisão agora.`

### Empty state de filtro

- mensagem simples de nenhum item encontrado
- CTA: `Limpar filtros`

### Error state

- falha ao carregar a fila
- botão `Tentar novamente`

## 17. Casos especiais

### Transcript desativado

- item pode aparecer como `Bloqueado` ou `Aguardando revisão manual`, conforme política do fluxo seguinte
- a fila deve deixar explícito que não haverá automação clínica para essa sessão

### Falha de transcript

- item aparece com destaque de erro
- CTA pode ser:
  - `Abrir item`
  - `Tentar novamente`, se houver suporte técnico

### Falha de IA

- item pode continuar elegível para revisão manual se o transcript estiver pronto
- a fila deve indicar isso claramente

## 18. Dados mínimos para renderizar a fila

- appointmentId
- patientId
- patientName
- appointmentEndedAt
- transcriptStatus
- draftStatus
- reviewState
- slaState
- sessionMode

## 19. APIs mínimas necessárias

- `GET /v1/clinical-review`
- `GET /v1/clinical-review/:appointmentId`
- `POST /v1/clinical-review/:appointmentId/retry-transcript`
- `POST /v1/clinical-review/:appointmentId/retry-draft`

### Query params recomendados para `GET /clinical-review`

- `reviewState`
- `transcriptStatus`
- `draftStatus`
- `slaState`
- `search`
- `page`
- `pageSize`

## 20. Eventos de produto

- `clinical_review_queue_loaded`
- `clinical_review_filter_applied`
- `clinical_review_next_clicked`
- `clinical_review_item_opened`
- `clinical_review_retry_clicked`

## 21. Critérios de aceite da Etapa 10

- o terapeuta entende imediatamente o que está pendente de revisão
- transcript e rascunho aparecem como estados de pipeline claros
- a fila prioriza itens prontos para revisão e os mais antigos
- falhas aparecem de forma acionável
- a fila não expõe conteúdo clínico sensível no nível de lista

## 22. Dependências que esta etapa destrava

- tela de transcript e rascunho IA
- revisão humana do material clínico
- aprovação do prontuário final
- métricas de backlog e SLA interno

## 23. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/11-transcript-e-rascunho-ia.md`

## Nota de implementação - Sessão 05

O core web entregue nesta sessão implementa:

- `/app/clinical-review` como fila/tabela operacional
- filtros visiveis por estado, transcript, rascunho e SLA
- chips de filtros adicionais
- CTA `Abrir proximo item`
- polish visual com hero operacional e toolbar de controle compartilhada
- destaque claro para falhas, transcript desativado e itens bloqueados
- ordenacao visual focada em prioridade operacional

Ainda pendente nesta fase:

- paginacao real
- telemetria de SLA baseada em thresholds configurados no backend real
- retry tecnico conectado ao pipeline assíncrono real
