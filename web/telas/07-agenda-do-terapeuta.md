# Web do Terapeuta - Etapa 7 - Agenda do Terapeuta

## 1. Objetivo

Definir de forma fechada a `agenda do terapeuta` no web admin, cobrindo:

- visualização temporal das sessões
- disponibilidade padrão
- bloqueios de agenda
- criação de sessão
- reagendamento
- cancelamento
- atalhos para entrar na sessão e abrir o detalhe

## 2. Papel da tela no produto

A agenda é a `superfície operacional principal` antes da sessão acontecer.

Ela precisa responder rapidamente:

1. quando estou disponível?
2. quais sessões tenho hoje, esta semana e este mês?
3. onde existe conflito, bloqueio ou janela livre?
4. como crio, movo ou cancelo uma sessão com segurança?
5. como entro rapidamente no detalhe da sessão certa?

## 3. Escopo desta etapa

### Dentro do escopo

- calendário diário, semanal e mensal
- disponibilidade do terapeuta
- bloqueios de agenda
- criação de sessão
- reagendamento
- cancelamento
- navegação para detalhe da sessão

### Fora do escopo

- videochamada em si
- transcript
- lógica clínica pós-sessão
- sincronização com calendários externos no MVP
- agenda multi-terapeuta de clínica

## 4. Decisões travadas nesta etapa

- a agenda será `calendar-first`, não lista-first
- a visão padrão ao abrir `/app/agenda` será `semana`
- o terapeuta poderá alternar entre `dia`, `semana` e `mês`
- `criar sessão` será feito por `drawer`
- `novo bloqueio` também será feito por `drawer`, mantendo a grade como contexto principal
- bloqueios pontuais precisam permitir `edição` e `exclusão` sem sair da agenda
- `editar disponibilidade` também deve acontecer no contexto da agenda, sem depender da área de configurações
- clicar em uma sessão da grade deve abrir `contexto operacional rápido` antes do detalhe completo
- a partir desse contexto, o terapeuta deve conseguir `reposicionar a sessão na grade`
- `reagendar` poderá acontecer por ação explícita e por drag and drop controlado
- `cancelar` nunca acontecerá por gesto direto; exige confirmação
- disponibilidade estrutural e bloqueios pontuais serão tratados como entidades diferentes
- conflitos de horário devem ser prevenidos antes da gravação
- sessões continuam com rota de detalhe própria: `/app/appointments/:appointmentId`
- a lateral da agenda deve funcionar como `mesa de ação`, resumindo o dia em foco e atalhos úteis
- blocos exibidos na grade semanal precisam abrir o contexto de edição diretamente, sem criar fluxo paralelo
- o detalhe completo da sessão continua existindo, mas não deve ser o único caminho para ações rápidas

## 5. Rota e permissão

### Rota

- `/app/agenda`

### Permissão

- terapeuta autenticado com conta apta a operar

### Comportamento por estado da conta

- `ready_for_operations`: acesso completo
- `restricted`: leitura permitida; ações de criação/reagendamento podem ser bloqueadas conforme a pendência
- `pending_setup`: redirecionar para onboarding

## 6. Estrutura geral da tela

Esta tela usa o `Template D: Agenda` definido na Etapa 1.

Estrutura final:

1. título e contexto
2. ações primárias
3. controles de período e visualização
4. grade do calendário
5. painel lateral ou drawer para ações rápidas

## 7. Cabeçalho da página

### Título

- `Agenda`

### Subtítulo

- frase curta explicando que a tela centraliza disponibilidade e sessões

Exemplo:

- `Gerencie disponibilidade, sessões e conflitos do consultório.`

### Ação primária

- `Nova sessão`

### Ações secundárias

- `Novo bloqueio`
- `Editar disponibilidade`

## 8. Controles superiores

### Navegação temporal

- voltar período
- avançar período
- ir para `Hoje`

### Alternância de visualização

- `Dia`
- `Semana`
- `Mês`

### Filtros operacionais do MVP

- status da sessão
- modalidade

### Regras

- a agenda deve preservar o período atual ao trocar entre dia/semana/mês
- a visão `Semana` é a default porque equilibra operação e contexto

## 9. Grade da agenda

## 9.1 Visão Dia

### Objetivo

Dar alta precisão operacional para o dia corrente.

### Conteúdo

- horários do dia
- blocos de disponibilidade
- sessões
- bloqueios

### Uso principal

- dia com muitas sessões
- ajuste fino de horário
- entrada rápida na sessão

## 9.2 Visão Semana

### Objetivo

Ser a visão principal do terapeuta no MVP.

### Conteúdo

- colunas por dia
- linhas por horário
- sessões distribuídas no tempo
- disponibilidade e bloqueios

### Uso principal

- planejamento semanal
- criação e remarcação
- visualização de conflitos

## 9.3 Visão Mês

### Objetivo

Dar panorama de ocupação, sem detalhamento excessivo.

### Conteúdo

- grade mensal
- quantidade resumida de sessões por dia
- indicadores de dias cheios ou vazios

### Regra

- detalhes finos da sessão não precisam aparecer aqui
- clicar no dia pode abrir a visão diária ou semanal contextual

## 10. Modelo visual de blocos na agenda

### Tipo 1 - Sessão

Deve exibir:

- nome do paciente
- horário
- status
- modalidade

### Tipo 2 - Bloqueio

Deve exibir:

- título curto do bloqueio
- intervalo

### Tipo 3 - Disponibilidade

Deve exibir:

- faixa livre configurada

### Regra

- disponibilidade serve de contexto visual
- sessões e bloqueios têm prioridade visual sobre a disponibilidade

## 11. Status da sessão na agenda

### Status operacionais do MVP

- `Agendada`
- `Confirmada`
- `Em andamento`
- `Concluída`
- `Cancelada`
- `No-show`

### Regras

- `Cancelada` não ocupa slot operacional como sessão ativa
- `Concluída` aparece no histórico e pode ter styling reduzido
- `Em andamento` deve receber destaque claro

## 12. Disponibilidade estrutural

### Objetivo

Definir a base recorrente da agenda do terapeuta.

### Origem

- vem da configuração inicial do onboarding
- pode ser ajustada em `Configurações`, mas também precisa ser visível na agenda

### Ação na agenda

- `Editar disponibilidade` abre drawer ou navega para a área certa de configurações

### Regras

- disponibilidade é recorrente
- não deve ser editada diretamente por drag and drop no calendário do MVP

## 13. Bloqueios de agenda

### Objetivo

Permitir reservar janelas não atendíveis sem alterar a disponibilidade estrutural.

### Exemplos

- almoço
- reunião
- folga
- compromisso pessoal

### Campos mínimos

- título
- data
- horário inicial
- horário final
- recorrente: `sim` ou `não`

### Regras

- bloqueio pode ser pontual ou recorrente
- bloqueio não pode ser criado sobre sessão existente sem fluxo explícito de conflito

## 14. Criação de sessão

### Forma

- `drawer`

### Motivo

- o fluxo é frequente e operacional
- a tela de detalhe da sessão fica para profundidade posterior

### Campos mínimos

- paciente
- data
- horário inicial
- duração
- modalidade
- observação operacional curta

### Defaults

- duração inicial: usar padrão da conta
- modalidade inicial: usar padrão da conta

### Regras

- paciente é obrigatório
- não permitir gravação com conflito de horário
- o sistema deve validar bloqueios e disponibilidade antes de salvar
- após criação, abrir opção de:
  - ver sessão
  - continuar na agenda

## 15. Reagendamento

### Formas permitidas

- ação explícita no detalhe rápido da sessão
- drag and drop controlado na agenda

### Regras

- todo reagendamento precisa validar conflito
- reagendamento por drag and drop deve abrir confirmação antes de salvar
- reagendamento deve preservar vínculo da sessão com paciente e cobrança, quando aplicável

## 16. Cancelamento

### Forma

- ação explícita

### Campos mínimos

- motivo do cancelamento
- notificar paciente: `sim` ou `não`

### Regras

- cancelamento exige confirmação
- sessão cancelada não deve ser excluída fisicamente do histórico operacional
- o status muda, mas a trilha precisa permanecer auditável

## 17. Quick view da sessão

### Objetivo

Dar contexto suficiente sem sempre abrir a tela completa de detalhe.

### Abertura

- clique simples ou painel lateral rápido

### Conteúdo

- paciente
- horário
- status
- modalidade
- pagamento resumido
- documentos pendentes críticos, se houver

### Ações

- abrir detalhe da sessão
- entrar na sala, quando aplicável
- reagendar
- cancelar

## 18. Interações principais

### Clique em slot livre

- abre drawer de criação já com data/hora preenchidas

### Clique em sessão

- abre quick view ou navega para detalhe, conforme decisão de implementação

### Clique em bloqueio

- abre edição do bloqueio

### Drag and drop

- permitido apenas para sessão agendada/confirmada
- não permitido para sessão concluída, cancelada ou no-show

## 19. Filtros da agenda

### Filtros visíveis

- status
- modalidade

### Valores de modalidade

- teleatendimento
- presencial, se o produto suportar esse tipo já no MVP

### Regras

- filtros devem afetar apenas a visualização
- não alterar disponibilidade estrutural

## 20. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton da grade

### Empty state

Quando não houver sessões no período:

- mensagem simples
- CTA:
  - `Nova sessão`
  - `Editar disponibilidade`

### Error state

- falha ao carregar agenda
- botão `Tentar novamente`

## 21. Dados mínimos para renderizar a agenda

- período atual
- visualização atual
- availability rules
- bloqueios
- sessões do período
- timezone da conta
- conflitos detectáveis

## 22. APIs mínimas necessárias

- `GET /agenda`
- `POST /appointments`
- `PATCH /appointments/:appointmentId`
- `POST /appointments/:appointmentId/cancel`
- `GET /availability-rules`
- `POST /availability-blocks`
- `PATCH /availability-blocks/:blockId`
- `DELETE /availability-blocks/:blockId`

### Query params recomendados para `GET /agenda`

- `view`
- `start`
- `end`
- `status`
- `mode`

## 23. Eventos de produto

- `agenda_loaded`
- `agenda_view_changed`
- `agenda_period_changed`
- `appointment_creation_started`
- `appointment_created`
- `appointment_rescheduled`
- `appointment_canceled`
- `availability_block_created`

## 24. Critérios de aceite da Etapa 7

- o terapeuta consegue entender disponibilidade e sessões no mesmo lugar
- a visão semanal funciona como centro operacional do calendário
- criação, reagendamento e cancelamento têm regras claras e auditáveis
- conflitos de agenda são prevenidos antes de salvar
- a agenda leva naturalmente ao detalhe da sessão

## 25. Dependências que esta etapa destrava

- detalhe da sessão
- sala virtual vinculada à sessão
- lembretes e ciclo pré-sessão
- cobrança vinculada à sessão

## 26. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/08-detalhe-da-sessao.md`

## Atualização de fase

### O que já existe no build atual

- `/app/agenda` com visão `semana` default e alternância para `dia` e `mês`
- grade `calendar-first` com disponibilidade recorrente, bloqueios pontuais e sessões na mesma superfície
- drawers funcionais de `Nova sessão`, `Novo bloqueio`, `Editar bloqueio` e `Editar disponibilidade`
- `quick view` da sessão dentro da agenda
- reposicionamento da sessão escolhendo o novo slot diretamente na grade
- validação de conflito para criação, remarcação e bloqueio

### Ainda pendente nesta fase

- `drag and drop` controlado como gesto direto
- persistência real em banco substituindo o estado em memória
