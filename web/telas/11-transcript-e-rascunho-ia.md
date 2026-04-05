# Web do Terapeuta - Etapa 11 - Transcript e Rascunho IA

## 1. Objetivo

Definir de forma fechada a `tela de transcript e rascunho IA` no web admin do terapeuta, cobrindo:

- visualização do transcript da sessão
- visualização do rascunho gerado pela IA
- edição humana do material
- aprovação ou descarte
- histórico de versões
- separação explícita entre insumo, rascunho e prontuário final

## 2. Papel da tela no produto

Esta é a `principal tela de diferenciação do produto`.

Ela precisa responder rapidamente:

1. o transcript está disponível e confiável o suficiente para revisão?
2. o que a IA propôs como estrutura clínica?
3. o que precisa ser editado pelo terapeuta?
4. o que pode ser aprovado como registro final?
5. como manter rastreabilidade entre transcript, rascunho e prontuário aprovado?

## 3. Escopo desta etapa

### Dentro do escopo

- transcript segmentado por tempo
- rascunho IA estruturado
- edição manual pelo terapeuta
- aprovação do rascunho como base do prontuário final
- descarte do rascunho
- histórico de versões do rascunho e do registro aprovado

### Fora do escopo

- edição colaborativa multiusuário
- busca semântica global
- geração de laudos e documentos derivados
- analytics clínicos avançados
- edição do prontuário longitudinal completo em outra tela

## 4. Decisões travadas nesta etapa

- a rota principal será `/app/clinical-review/:appointmentId`
- a tela será dividida em `dois painéis principais`: `transcript` e `rascunho`
- o transcript é `insumo`; o rascunho é `draft`; o prontuário aprovado é `registro final`
- nada entra no prontuário final sem ação explícita do terapeuta
- o terapeuta pode editar livremente o rascunho antes de aprovar
- a IA não reescreve automaticamente o que o terapeuta editou
- o transcript não é editável no MVP
- o terapeuta pode descartar o rascunho IA sem perder rastreabilidade da sessão
- a tela deve mostrar claramente se o transcript ou o rascunho falharam

## 5. Rota e permissão

### Rota

- `/app/clinical-review/:appointmentId`

### Permissão

- terapeuta autenticado com vínculo válido à sessão e ao paciente

### Regra crítica

- esta tela pertence ao domínio clínico sensível
- qualquer leitura, edição, aprovação ou descarte deve gerar auditoria

## 6. Estrutura geral da tela

Esta tela usa o `Template E: Revisão clínica` definido na Etapa 1.

Estrutura final:

1. cabeçalho da revisão
2. faixa de status do pipeline
3. dois painéis principais
4. barra de ações clínicas
5. histórico de versões

## 7. Cabeçalho da revisão

### Conteúdo obrigatório

- paciente
- data e hora da sessão
- status do transcript
- status do rascunho
- estado da revisão

### Ações de topo

- voltar para fila
- abrir ficha do paciente
- abrir prontuário atual

### Regra

- o cabeçalho deve deixar claro em que etapa do fluxo clínico o item está

## 8. Faixa de status do pipeline

### Objetivo

Mostrar de forma compacta o estado técnico e operacional do material da sessão.

### Estados visíveis

- transcript: `Pronto`, `Falha`, `Desativado`, `Processando`
- rascunho: `Pronto`, `Falha`, `Desativado`, `Gerando`
- revisão: `Pronto para revisar`, `Em revisão`, `Aprovado`, `Descartado`

### Regras

- a tela deve explicar claramente quando um estado técnico limita a revisão
- falha de IA não precisa bloquear revisão manual se o transcript estiver pronto

## 9. Painel 1 - Transcript

### Objetivo

Dar ao terapeuta o insumo bruto estruturado da sessão.

### Conteúdo

- transcript segmentado por tempo
- separação visual por blocos temporais
- indicador de disponibilidade ou falha

### Regras

- transcript não é editável no MVP
- transcript não deve ser o elemento visual principal acima do rascunho; ele funciona como referência
- quando transcript estiver desativado por consentimento, a tela deve explicar isso sem sugerir automação

### Estados possíveis

- pronto
- processando
- falha
- desativado

## 10. Painel 2 - Rascunho IA

### Objetivo

Oferecer ao terapeuta uma estrutura inicial de registro clínico para revisão humana.

### Conteúdo mínimo do rascunho

- resumo da sessão
- tópicos centrais
- continuidade do caso
- pendências ou pontos de atenção

### Regra

- a estrutura pode evoluir, mas esses blocos formam o núcleo do MVP

## 11. Edição do rascunho

### Comportamento

- o terapeuta edita o rascunho em campo rico ou editor estruturado
- a edição é sempre manual e explícita

### Regras

- o terapeuta pode editar qualquer parte do rascunho
- o transcript continua como referência lateral
- não haverá autosave silencioso total no MVP sem feedback
- o sistema deve indicar claramente:
  - alterações não salvas
  - salvamento em andamento
  - última atualização

## 12. Estrutura editorial recomendada

### Blocos do editor no MVP

1. `Resumo`
2. `Tópicos`
3. `Continuidade do caso`
4. `Pendências`

### Motivo

- mantém consistência entre o que a IA gera e o que o prontuário final espera
- reduz variação excessiva na revisão inicial do produto

## 13. Barra de ações clínicas

### Ações principais

- `Salvar rascunho`
- `Aprovar como prontuário`

### Ações secundárias

- `Descartar rascunho`
- `Voltar para fila`

### Regras

- `Aprovar como prontuário` exige confirmação clara
- `Descartar rascunho` também exige confirmação
- aprovar não apaga a rastreabilidade do rascunho original

## 14. Aprovação como prontuário

### Objetivo

Transformar o rascunho revisado em registro clínico final da sessão.

### Regras

- só terapeuta autorizado pode aprovar
- a aprovação gera uma `nova versão final` do registro da sessão
- o rascunho original e a versão aprovada precisam continuar rastreáveis
- após aprovar:
  - o item sai da fila principal
  - o prontuário longitudinal do paciente é atualizado

## 15. Descarte do rascunho

### Objetivo

Permitir que o terapeuta rejeite a sugestão da IA sem perder o controle do caso.

### Regras

- descarte exige confirmação
- o sistema registra que houve descarte
- descarte do rascunho não apaga automaticamente o transcript ou a sessão
- a política seguinte pode levar o item a revisão manual pura ou a estado encerrado, mas isso precisa ficar explícito

## 16. Histórico de versões

### Objetivo

Dar rastreabilidade ao que a IA gerou, ao que o terapeuta editou e ao que foi aprovado.

### Conteúdo

- versão do rascunho gerado
- versões salvas pelo terapeuta
- versão final aprovada
- data/hora
- autor da alteração

### Regras

- o histórico não precisa exibir diff avançado no MVP
- precisa existir pelo menos a lista de versões e possibilidade de abrir contexto

## 17. Casos especiais

### Transcript pronto, IA falhou

- a tela continua utilizável
- o terapeuta pode iniciar revisão manual a partir de estrutura vazia ou mínima

### Transcript falhou

- o rascunho IA normalmente não deve existir
- a tela precisa indicar falha técnica e, se houver política, permitir retry

### Transcript desativado por consentimento

- a tela deve deixar explícito que não houve processamento automatizado
- a revisão clínica automatizada não deve ser prometida

## 18. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton dos dois painéis

### Empty/manual state

Quando não existir rascunho:

- explicar que o terapeuta pode revisar manualmente, se o fluxo suportar isso

### Error state

- falha ao carregar transcript
- falha ao carregar rascunho
- falha ao salvar
- falha ao aprovar

## 19. Dados mínimos para renderizar a tela

- appointmentId
- patientSummary
- transcriptStatus
- transcriptBlocks
- draftStatus
- draftContent
- reviewState
- versionHistory
- latestApprovedRecordMeta

## 20. APIs mínimas necessárias

- `GET /clinical-review/:appointmentId`
- `PATCH /clinical-review/:appointmentId/draft`
- `POST /clinical-review/:appointmentId/approve`
- `POST /clinical-review/:appointmentId/discard`
- `POST /clinical-review/:appointmentId/retry-draft`
- `POST /clinical-review/:appointmentId/retry-transcript`

## 21. Eventos de produto

- `clinical_review_detail_loaded`
- `clinical_review_draft_edited`
- `clinical_review_draft_saved`
- `clinical_review_approved`
- `clinical_review_discard_clicked`
- `clinical_review_transcript_panel_viewed`
- `clinical_review_version_opened`

## 22. Critérios de aceite da Etapa 11

- o terapeuta entende a diferença entre transcript, rascunho e registro final
- a edição humana do rascunho é clara e central
- nada vira prontuário sem aprovação explícita
- a tela continua útil mesmo quando a IA falha e o transcript está pronto
- histórico de versões e auditoria ficam preservados

## 23. Dependências que esta etapa destrava

- prontuário longitudinal
- fechamento clínico da sessão
- métricas de aprovação e descarte
- rastreabilidade do fluxo IA -> humano -> registro final

## 24. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/12-prontuario-longitudinal.md`

## Nota de implementação - Sessão 05

O core web entregue nesta sessão implementa:

- `/app/clinical-review/:appointmentId` com cabecalho, highlights de pipeline, transcript segmentado, editor de rascunho e historico de versoes
- acoes de `Salvar rascunho`, `Aprovar como prontuario`, `Descartar rascunho`, `Retry transcript` e `Retry rascunho`
- separacao visual entre transcript, draft e versoes aprovadas
- estados `pronto`, `falha`, `desativado` e `aguardando transcript` já materializados com copy operacional clara

Ainda pendente nesta fase:

- autosave com feedback refinado
- auditoria persistente real
- bloqueios de aprovacao ligados a pipeline assíncrono real
- integracao com prontuario longitudinal

### Direção já aplicada no build

- transcript e áudio bruto continuam como artefatos condicionais, não pré-requisito universal do fluxo
- a superfície de revisão segue útil mesmo quando transcript está desativado ou falhou
