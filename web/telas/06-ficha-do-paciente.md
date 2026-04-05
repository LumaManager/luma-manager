# Web do Terapeuta - Etapa 6 - Ficha do Paciente

## 1. Objetivo

Definir de forma fechada a `ficha do paciente` no web admin do terapeuta, cobrindo:

- a visão de detalhe principal do paciente
- os dados cadastrais e operacionais do vínculo
- o resumo de sessões, documentos e financeiro
- os atalhos para agenda, prontuário e operação
- a separação correta entre contexto operacional e conteúdo clínico sensível

## 2. Papel da tela no produto

A ficha do paciente é a `tela central de detalhe` do sistema.

Ela precisa responder rapidamente:

1. quem é esse paciente?
2. qual o estado operacional atual desse vínculo?
3. há sessão próxima, documento pendente ou cobrança aberta?
4. o que eu preciso fazer agora em relação a esse paciente?
5. como chego rápido no prontuário sem misturar tudo na mesma tela?

## 3. Escopo desta etapa

### Dentro do escopo

- cabeçalho do paciente
- dados cadastrais essenciais
- responsável legal
- resumo de agenda
- resumo documental
- resumo financeiro
- histórico operacional resumido
- atalhos para prontuário e próximas ações

### Fora do escopo

- editor de prontuário
- transcript e rascunho IA
- timeline clínica textual completa
- edição fiscal avançada
- portal do paciente

## 4. Decisões travadas nesta etapa

- a ficha do paciente será uma `página de detalhe com abas internas`
- a rota principal continua sendo `/app/patients/:patientId`
- o prontuário continua em rota separada: `/app/patients/:patientId/clinical-record`
- a ficha do paciente mostrará `resumos operacionais e clínicos de alto nível`, mas não exibirá texto clínico detalhado no corpo principal
- o cabeçalho do paciente será persistente ao trocar de aba
- a ação principal da ficha será contextual e muda conforme o estado do paciente
- edição pesada de cadastro não será inline; usará drawer ou página/seção dedicada dentro da própria ficha

## 5. Rota e permissão

### Rotas

- `/app/patients/:patientId`
- `/app/patients/:patientId/clinical-record`

### Permissão

- terapeuta autenticado com vínculo válido ao paciente

### Regra crítica

- se o terapeuta não tiver vínculo com o paciente, a ficha não deve ser carregada
- o sistema deve retornar estado de acesso negado sem vazar metadados desnecessários

## 6. Estrutura geral da tela

Esta tela usa o `Template C: Detalhe com abas ou seções` definido na Etapa 1.

Estrutura final:

1. breadcrumbs
2. cabeçalho persistente do paciente
3. barra de ações
4. abas internas
5. conteúdo da aba selecionada

## 7. Breadcrumbs

Formato:

- `Pacientes / Nome do Paciente`

Quando abrir o prontuário:

- `Pacientes / Nome do Paciente / Prontuário`

## 8. Cabeçalho persistente do paciente

### Objetivo

Dar identidade imediata ao paciente e mostrar o estado geral do vínculo sem obrigar o terapeuta a ler a página toda.

### Conteúdo obrigatório

- nome completo
- status principal do paciente
- idade ou data de nascimento resumida
- contato principal resumido
- indicador de responsável legal, quando existir
- próxima sessão, se existir

### Indicadores resumidos

- documentos: `OK`, `Pendente`, `Crítico`
- financeiro: `OK`, `Em aberto`, `Vencido`
- revisão clínica: `Sem pendência` ou `Pendente`

### Ações de topo

- `Agendar sessão`
- `Abrir prontuário`
- menu secundário:
  - editar dados
  - reenviar convite, quando aplicável
  - arquivar paciente

## 9. Ação principal contextual

### Regra

A ação principal no topo deve refletir o próximo passo mais provável.

### Ordem de prioridade

1. se paciente estiver `Convidado`: `Reenviar convite`
2. se paciente estiver `Ativo` e sem próxima sessão: `Agendar sessão`
3. se houver sessão próxima: `Abrir sessão`
4. se houver revisão clínica pendente: `Abrir revisão`

Se houver empate, priorizar:

1. revisão clínica
2. sessão próxima
3. convite
4. agendamento

## 10. Abas internas da ficha

No MVP, a ficha terá `5 abas`.

1. `Resumo`
2. `Sessões`
3. `Documentos`
4. `Financeiro`
5. `Cadastro`

### O que não entra como aba

- `Prontuário`

Motivo:

- o prontuário é domínio mais sensível e terá fluxo dedicado
- manter a separação reduz risco de exposição indevida e evita misturar operação com registro clínico final

## 11. Aba 1 - Resumo

### Objetivo

Ser a visão inicial da ficha e concentrar o que o terapeuta mais precisa entender sem mudar de tela.

### Blocos obrigatórios

- resumo do vínculo
- próxima sessão
- pendências do paciente
- documentos recentes
- financeiro resumido
- atividade recente
- acesso rápido ao prontuário

### Bloco: resumo do vínculo

Conteúdo:

- status do paciente
- data de criação do vínculo
- forma principal de pagamento
- responsável legal, quando existir

### Bloco: próxima sessão

Conteúdo:

- data e hora
- status
- modalidade
- CTA:
  - abrir sessão
  - reagendar, quando aplicável

### Bloco: pendências do paciente

Conteúdo:

- documentos pendentes
- cobrança vencida
- revisão clínica pendente relacionada ao paciente
- convite pendente, quando aplicável

### Bloco: documentos recentes

Conteúdo:

- últimos documentos gerados ou assinados
- status resumido
- CTA para aba `Documentos`

### Bloco: financeiro resumido

Conteúdo:

- último pagamento
- cobrança em aberto
- cobrança vencida, se existir
- CTA para aba `Financeiro`

### Bloco: atividade recente

Conteúdo:

- últimos eventos operacionais relevantes do paciente

Exemplos:

- paciente convidado
- documento assinado
- pagamento confirmado
- sessão reagendada

### Bloco: acesso ao prontuário

Conteúdo:

- metadata clínica mínima

Campos permitidos:

- data do último registro aprovado
- quantidade de revisões pendentes
- CTA `Abrir prontuário`

Regra:

- não mostrar texto clínico detalhado aqui

## 12. Aba 2 - Sessões

### Objetivo

Concentrar o histórico operacional de atendimentos e o acesso à agenda relacionada ao paciente.

### Conteúdo

- próxima sessão
- sessões passadas
- status de cada sessão
- modalidade
- indicação de pagamento

### Ações

- agendar nova sessão
- abrir detalhe da sessão
- reagendar
- cancelar, quando permitido

### Regras

- ordenação padrão:
  - próxima sessão no topo
  - depois histórico decrescente

## 13. Aba 3 - Documentos

### Objetivo

Centralizar documentos, consentimentos e assinaturas ligados ao paciente.

### Conteúdo

- documentos exigidos
- status de assinatura
- histórico de aceite
- pendências críticas

### Ações

- gerar documento
- reenviar para assinatura
- abrir documento

### Regras

- destacar primeiro o que bloqueia atendimento
- separar visualmente:
  - documentos pendentes
  - documentos concluídos

## 14. Aba 4 - Financeiro

### Objetivo

Dar visão financeira do paciente sem exigir navegação até a área financeira geral.

### Conteúdo

- cobranças em aberto
- cobranças pagas
- vencidas
- forma de pagamento principal
- origem do pagamento

### Ações

- criar cobrança
- abrir cobrança
- registrar pagamento, se houver fluxo manual

### Regras

- priorizar vencidas no topo
- não transformar essa aba em relatório mensal completo

## 15. Aba 5 - Cadastro

### Objetivo

Concentrar os dados administrativos do paciente.

### Conteúdo obrigatório

- nome completo
- data de nascimento
- contato principal
- contatos secundários
- responsável legal, quando houver
- origem do pagamento
- observações administrativas não clínicas

### Ações

- editar cadastro
- atualizar contato
- atualizar responsável legal

### Regras

- esta aba não guarda notas clínicas
- observações aqui são estritamente operacionais/administrativas

## 16. Edição de dados

### Forma

- pequenas edições: `drawer`
- alterações mais sensíveis: seção dedicada dentro da aba `Cadastro`

### Regras

- alterações relevantes devem gerar auditoria
- dados de identificação e responsável legal exigem validação cuidadosa

## 17. Resumo clínico na ficha

### Objetivo

Dar contexto sem violar a separação do domínio clínico.

### Permitido na ficha

- data do último prontuário aprovado
- existência de revisão pendente
- CTA para prontuário

### Não permitido na ficha principal

- transcript textual
- resumo clínico completo
- tópicos da sessão
- notas privadas em texto livre

## 18. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton das abas
- skeleton dos blocos internos

### Empty states

- paciente sem sessão futura
- paciente sem documentos
- paciente sem cobrança

Cada estado vazio deve oferecer CTA útil:

- agendar sessão
- gerar documento
- criar cobrança

### Error state

- falha ao carregar ficha
- paciente não encontrado
- acesso negado

## 19. Dados mínimos para renderizar a ficha

### Cabeçalho

- identificação do paciente
- status
- contato principal
- responsável legal
- próxima sessão
- indicadores agregados

### Resumo

- pendências
- últimos eventos operacionais
- resumo documental
- resumo financeiro
- metadata clínica mínima

## 20. APIs mínimas necessárias

- `GET /patients/:patientId`
- `PATCH /patients/:patientId`
- `GET /patients/:patientId/overview`
- `GET /patients/:patientId/appointments`
- `GET /patients/:patientId/documents`
- `GET /patients/:patientId/finance`
- `POST /patients/:patientId/invite/resend`
- `POST /patients/:patientId/archive`

## 21. Payload recomendado de `GET /patients/:patientId`

- `patient`
- `relationshipStatus`
- `guardian`
- `nextAppointment`
- `documentSummary`
- `financialSummary`
- `clinicalSummaryMeta`
- `actionState`

## 22. Eventos de produto

- `patient_detail_loaded`
- `patient_tab_changed`
- `patient_primary_action_clicked`
- `patient_open_clinical_record_clicked`
- `patient_edit_started`
- `patient_archive_clicked`

## 23. Critérios de aceite da Etapa 6

- a ficha do paciente funciona como hub de detalhe do caso
- o terapeuta entende rapidamente o estado operacional do paciente
- o prontuário permanece separado como área clínica dedicada
- a tela conecta agenda, documentos, financeiro e cadastro sem virar confusa
- o cabeçalho persistente reduz navegação desnecessária

## 24. Dependências que esta etapa destrava

- agenda contextual por paciente
- detalhe da sessão a partir do paciente
- documentos por paciente
- financeiro por paciente
- prontuário longitudinal em rota dedicada

## 25. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/07-agenda-do-terapeuta.md`

## 26. Atualização de fase

### O que já existe no build atual

- rota `/app/patients/:patientId` com cabeçalho persistente e abas operacionais
- CTA contextual no topo
- resumos de sessões, documentos, financeiro e atividade recente
- atalho claro para `/app/patients/:patientId/clinical-record`

### Decisões já refletidas na UI

- a ficha funciona como `hub operacional` do caso
- o prontuário continua separado e preserva a barreira correta entre operação e registro clínico final
