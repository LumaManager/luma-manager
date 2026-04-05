# Web do Terapeuta - Etapa 12 - Prontuário Longitudinal

## 1. Objetivo

Definir de forma fechada o `prontuário longitudinal` no web admin do terapeuta, cobrindo:

- a leitura histórica do caso
- os registros finais aprovados ao longo do tempo
- a navegação entre sessões e versões
- a separação entre registro final e material de trabalho
- os controles de acesso e rastreabilidade do domínio clínico

## 2. Papel da tela no produto

O prontuário longitudinal é o `repositório clínico final do paciente`.

Ele precisa responder rapidamente:

1. qual é a linha do caso ao longo do tempo?
2. qual foi o último registro aprovado?
3. como navegar por sessões anteriores sem voltar para a fila?
4. qual versão do registro final está valendo?
5. como manter o prontuário separado de transcript e rascunho?

## 3. Escopo desta etapa

### Dentro do escopo

- timeline clínica do paciente
- lista de registros finais por sessão
- leitura do conteúdo aprovado
- navegação entre entradas
- metadata de versões aprovadas
- acesso ao item de revisão relacionado, quando aplicável

### Fora do escopo

- edição principal do rascunho
- transcript bruto
- editor longitudinal livre
- busca semântica global
- exportação massiva
- notas privadas soltas fora do fluxo de sessão

## 4. Decisões travadas nesta etapa

- a rota principal será `/app/patients/:patientId/clinical-record`
- o prontuário será uma `tela dedicada`, separada da ficha do paciente
- o prontuário mostrará `apenas registros finais aprovados` como visão principal
- transcript e rascunho não aparecem como conteúdo principal do prontuário
- a visualização padrão será `timeline decrescente`, do mais recente para o mais antigo
- cada entrada do prontuário fica vinculada a uma sessão
- versões aprovadas são rastreáveis, mas a versão atual é a principal exibida
- a edição do conteúdo final não acontece diretamente nesta tela no MVP; ela nasce do fluxo de revisão

## 5. Rota e permissão

### Rota

- `/app/patients/:patientId/clinical-record`

### Permissão

- terapeuta autenticado com vínculo válido ao paciente

### Regra crítica

- esta tela pertence ao domínio clínico sensível
- toda leitura precisa gerar auditoria adequada
- paciente e admin interno não acessam essa superfície no fluxo padrão

## 6. Estrutura geral da tela

Esta tela usa uma variação do `Template C: Detalhe com abas ou seções`, com foco em histórico e leitura.

Estrutura final:

1. breadcrumbs
2. cabeçalho do prontuário
3. barra de ações
4. coluna de timeline/lista de entradas
5. painel principal de leitura da entrada selecionada

## 7. Breadcrumbs

Formato:

- `Pacientes / Nome do Paciente / Prontuário`

## 8. Cabeçalho do prontuário

### Objetivo

Dar contexto clínico mínimo do caso sem misturar toda a ficha operacional do paciente.

### Conteúdo obrigatório

- nome do paciente
- data do último registro aprovado
- quantidade de registros aprovados
- existência de revisão pendente, se houver

### Ações de topo

- `Abrir ficha do paciente`
- `Abrir revisão pendente`, quando existir
- `Voltar para pacientes`

### Regra

- o cabeçalho deve deixar claro que esta é a área de `registro final`

## 9. Modelo da timeline clínica

### Objetivo

Permitir navegação rápida entre registros aprovados.

### Conteúdo por item da timeline

- data da sessão
- horário
- versão aprovada atual
- autor da aprovação
- indicador de revisão pendente posterior, se existir

### Ordenação

- mais recente primeiro

### Regras

- a timeline mostra apenas entradas que já geraram registro final
- sessões sem aprovação não entram como prontuário final
- itens da timeline não exibem texto clínico completo no modo reduzido

## 10. Painel principal de leitura

### Objetivo

Exibir o conteúdo final aprovado de uma sessão específica.

### Conteúdo

- cabeçalho da entrada
- corpo do registro final
- metadata de aprovação
- histórico de versões aprovadas

### Cabeçalho da entrada

- data e hora da sessão
- terapeuta autor
- versão atual
- data/hora da aprovação

## 11. Estrutura do registro final

### Blocos recomendados do MVP

1. `Resumo`
2. `Tópicos`
3. `Continuidade do caso`
4. `Pendências`

### Motivo

- mantém consistência com a estrutura editorial da etapa de revisão
- facilita leitura longitudinal entre sessões

## 12. Versões aprovadas

### Objetivo

Preservar rastreabilidade do que foi aprovado ao longo do tempo.

### Conteúdo

- lista de versões aprovadas da mesma entrada
- data/hora
- autor

### Regras

- a versão mais recente aprovada é a principal
- o terapeuta pode navegar para uma versão anterior em modo de leitura
- não precisa haver diff avançado no MVP

## 13. Relação com a revisão clínica

### Regra principal

- o prontuário é `resultado`
- a revisão clínica é `processo`

### Consequências práticas

- desta tela, o terapeuta pode abrir a revisão relacionada, mas não usar o prontuário como editor principal do rascunho
- quando uma nova sessão for aprovada, a timeline longitudinal é atualizada

## 14. Indicadores auxiliares permitidos

### Permitido

- data do último atendimento registrado
- total de entradas aprovadas
- revisão pendente atual

### Não permitido no MVP

- score clínico automatizado
- resumos agregados automáticos do caso na tela principal
- sugestão ativa de IA no prontuário final

## 15. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton da timeline
- skeleton do painel principal

### Empty state

Quando não houver registro aprovado:

- mensagem clara de que ainda não existe prontuário final aprovado para o paciente
- CTA:
  - `Abrir revisão pendente`, se existir
  - ou `Voltar para ficha do paciente`

### Error state

- falha ao carregar prontuário
- acesso negado
- paciente não encontrado

## 16. Casos especiais

### Existe revisão pendente e prontuário anterior já aprovado

- a tela continua mostrando o último registro final aprovado
- deve existir destaque de que há material novo aguardando revisão

### Existe sessão encerrada sem transcript aprovado

- isso não altera o prontuário final até que o fluxo de revisão seja concluído

### Descarte do rascunho

- o prontuário final anterior continua sendo a verdade vigente até nova aprovação

## 17. Dados mínimos para renderizar a tela

- patientSummary
- latestApprovedRecordMeta
- approvedRecordsTimeline
- selectedRecord
- approvedVersions
- pendingReviewMeta

## 18. APIs mínimas necessárias

- `GET /clinical-records/patients/:patientId`
- `GET /clinical-records/patients/:patientId/:recordId`
- `GET /clinical-records/patients/:patientId/:recordId/versions`

## 19. Eventos de produto

- `clinical_record_loaded`
- `clinical_record_timeline_item_clicked`
- `clinical_record_version_opened`
- `clinical_record_open_review_clicked`
- `clinical_record_open_patient_clicked`

## 20. Critérios de aceite da Etapa 12

- o prontuário longitudinal funciona como repositório final e histórico do caso
- a timeline mostra apenas registros aprovados
- transcript e rascunho continuam separados da leitura principal do prontuário
- a navegação entre entradas aprovadas é clara
- a tela preserva rastreabilidade de versões sem virar editor de revisão

## 21. Dependências que esta etapa destrava

- visão histórica do caso no MVP
- consultas clínicas por sessão aprovada
- base para exportações futuras do prontuário
- base para evolução da leitura longitudinal do paciente

## 22. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/13-documentos-e-consentimentos.md`

## Nota de implementação - Sessão 06

O core web entregue nesta sessão implementa:

- `/app/patients/:patientId/clinical-record` como tela dedicada e separada da ficha operacional
- cabeçalho com metadata do ultimo registro aprovado e destaque de revisao pendente
- timeline decrescente com entradas aprovadas
- painel principal de leitura do registro final selecionado
- metadata de aprovacao e lista de versoes aprovadas em modo leitura
- polish visual alinhado com o restante das superficies operacionais do terapeuta

Ainda pendente nesta fase:

- navegacao profunda por rota para cada entrada/versao do prontuario
- auditoria persistente real de leitura
- integracao plena com aprovacoes vindas do fluxo clinico real
