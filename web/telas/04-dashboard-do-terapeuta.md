# Web do Terapeuta - Etapa 4 - Dashboard do Terapeuta

## 1. Objetivo

Definir de forma fechada o `dashboard inicial do terapeuta` no web admin, cobrindo:

- a visão operacional principal ao entrar no produto
- a priorização do que exige ação hoje
- os cards e listas que resumem agenda, pacientes, revisão clínica, financeiro e documentos
- as ações rápidas que aceleram o dia a dia

## 2. Papel do dashboard no produto

O dashboard não é uma tela de BI avançado. Ele é a `mesa de controle diária` do psicólogo.

Ao abrir o produto, o terapeuta deve conseguir responder rapidamente:

1. o que tenho para fazer hoje?
2. existe algo bloqueando meu atendimento?
3. quais sessões ou pacientes exigem atenção imediata?
4. há pendências financeiras ou documentais relevantes?

## 3. Escopo desta etapa

### Dentro do escopo

- dashboard do terapeuta no web
- visão do dia e curto prazo
- cards operacionais
- listas resumidas com links para telas de trabalho
- ações rápidas seguras

### Fora do escopo

- dashboard do paciente
- dashboard do admin interno
- analytics profundos
- comparação histórica avançada
- gráficos complexos
- customização livre de widgets no MVP

## 4. Decisões travadas nesta etapa

- o dashboard será `operacional`, não analítico
- a prioridade visual será `próxima ação` e `pendência crítica`
- não haverá customização de layout no MVP
- não haverá drag and drop de widgets
- não haverá feed de notificações global no dashboard
- não haverá gráfico financeiro avançado no MVP
- o dashboard sempre abrirá em `visão do dia`
- cards com pendência devem sempre ter CTA para a tela de trabalho correspondente

## 5. Rota e permissão

### Rota

- `/app/dashboard`

### Permissão

- apenas terapeuta autenticado com conta `ready_for_operations`

### Comportamento com conta não pronta

- se a conta estiver `pending_setup` ou `restricted`, o dashboard pode abrir em modo reduzido
- as áreas operacionais ficam bloqueadas ou substituídas por alertas e CTAs de regularização

## 6. Estrutura geral da tela

O dashboard usará o `Template A: Dashboard` definido na Etapa 1.

Estrutura final:

1. título e contexto
2. faixa de alertas globais, quando existir
3. bloco de ações rápidas
4. grid principal de cards
5. listas operacionais resumidas

## 7. Cabeçalho da página

### Título

- `Dashboard`

### Subtítulo

- frase curta contextual baseada no momento do dia ou na data, sem depender disso para funcionamento

Exemplo de lógica:

- `Veja o que exige atenção hoje.`

### Ações primárias

- `Novo paciente`
- `Nova sessão`

### Ações secundárias

- `Abrir agenda`
- `Abrir revisão clínica`

## 8. Ações rápidas

As ações rápidas ficam logo abaixo do título.

### Ações permitidas no MVP

- criar paciente
- criar sessão
- abrir agenda de hoje
- abrir fila de revisão clínica
- abrir contas em aberto

### Regras

- ações rápidas não substituem as telas completas
- ações rápidas devem sempre levar a fluxos já definidos
- não criar modal complexo de cadastro direto no dashboard

## 9. Grid principal de cards

O grid principal terá `6 cards`.

## 10. Card 1 - Próximos atendimentos

### Objetivo

Mostrar o que está chegando no curto prazo.

### Conteúdo

- próximas sessões do dia
- horário
- nome do paciente
- status da sessão
- indicador de pagamento, se relevante

### Ações

- abrir detalhe da sessão
- entrar na sala, quando aplicável
- abrir agenda completa

### Regras

- mostrar até `5` sessões
- ordenar por horário mais próximo
- se não houver sessão hoje, mostrar estado vazio com CTA para agenda

## 11. Card 2 - Revisão clínica pendente

### Objetivo

Dar visibilidade à fila pós-sessão, que representa o valor central do SaaS.

### Conteúdo

- quantidade de rascunhos pendentes
- item mais antigo pendente
- prioridade visual para backlog clínico atrasado

### Ações

- abrir fila de revisão
- abrir o próximo item pendente

### Regras

- se houver qualquer item atrasado, este card deve ganhar destaque maior

## 12. Card 3 - Pendências documentais

### Objetivo

Mostrar documentos ou consentimentos que podem bloquear atendimento ou operação.

### Conteúdo

- pacientes com documentos pendentes
- quantidade de pendências
- indicador de pendência crítica

### Ações

- abrir documentos
- abrir paciente com pendência, se essa relação já estiver disponível

### Regras

- pendências que bloqueiem sessão devem aparecer primeiro

## 13. Card 4 - Cobranças em aberto

### Objetivo

Dar visibilidade rápida ao financeiro sem transformar o dashboard em tela contábil.

### Conteúdo

- valor total em aberto
- quantidade de cobranças pendentes
- quantidade de vencidas

### Ações

- abrir financeiro
- abrir cobranças vencidas

### Regras

- priorizar vencidas antes de futuras
- sem gráfico no MVP

## 14. Card 5 - Pacientes recentes

### Objetivo

Trazer continuidade de contexto para o terapeuta.

### Conteúdo

- últimos pacientes acessados ou com interação recente
- nome
- próxima sessão, se existir
- indicador de pendência, se existir

### Ações

- abrir ficha do paciente
- abrir prontuário do paciente

### Regras

- mostrar até `5` pacientes
- a lógica preferida é `recentemente acessados`
- se não houver histórico, cair para pacientes com próxima sessão mais próxima

## 15. Card 6 - Estado da conta

### Objetivo

Mostrar a saúde operacional da conta do terapeuta.

### Conteúdo

- status da conta
- pendência de onboarding residual
- status resumido de MFA
- status de integrações críticas, quando existirem

### Ações

- abrir configurações
- resolver pendência crítica

### Regras

- este card é resumido; problemas críticos continuam aparecendo também na faixa de alertas globais

## 16. Listas operacionais abaixo do grid

Além dos cards, o dashboard terá `3 listas resumidas`.

### Lista A - Agenda de hoje

Conteúdo:

- sessões do dia em ordem cronológica
- horário
- paciente
- status
- CTA de ação

CTA por linha:

- abrir sessão
- entrar na sala, quando aplicável

### Lista B - Itens que exigem ação

Conteúdo:

- pendências mais críticas entre documentos, revisão clínica, segurança da conta e financeiro

CTA por linha:

- abrir a tela correta para resolução

Regras:

- esta lista é priorizada por impacto operacional
- máximo de `5` itens

### Lista C - Atividade recente

Conteúdo:

- eventos recentes relevantes do próprio terapeuta ou da conta
- exemplo: paciente cadastrado, pagamento confirmado, documento assinado, rascunho gerado

CTA por linha:

- abrir contexto relacionado

Regras:

- não mostrar logs técnicos
- não mostrar conteúdo clínico textual sensível

## 17. Hierarquia visual

### Ordem de prioridade visual

1. alertas bloqueantes
2. próximos atendimentos
3. revisão clínica pendente
4. itens que exigem ação
5. cobranças e documentos
6. pacientes recentes
7. atividade recente

### Motivo

Essa ordem acompanha o que mais impacta:

- atendimento do dia
- fechamento clínico da sessão
- riscos operacionais
- continuidade do relacionamento com o paciente

## 18. Estados da tela

### Loading inicial

- skeleton para cards
- skeleton para listas

### Empty state global

Quando a conta estiver pronta, mas ainda sem operação:

- mensagem explicando que o consultório ainda não tem pacientes ou sessões
- CTAs:
  - `Cadastrar primeiro paciente`
  - `Configurar agenda`

### Estado com pendência de conta

Quando a conta estiver `pending_setup` ou `restricted`:

- esconder ou reduzir cards operacionais
- destacar pendências críticas
- CTA principal:
  - `Concluir ativação`
  - ou `Resolver pendência`

### Error state

- falha ao carregar dashboard
- mostrar mensagem simples
- botão `Tentar novamente`

## 19. Dados necessários para a tela

O dashboard precisa receber um payload agregado com:

- status da conta
- próximos atendimentos
- resumo da fila de revisão
- resumo financeiro
- resumo documental
- pacientes recentes
- agenda do dia
- pendências críticas
- eventos recentes

## 20. API agregadora recomendada

- `GET /v1/dashboard/therapist`

### Resposta mínima esperada

- `accountStatus`
- `globalBlockingIssues`
- `quickActions`
- `upcomingAppointments`
- `clinicalReviewSummary`
- `documentSummary`
- `financialSummary`
- `recentPatients`
- `todayAgenda`
- `actionItems`
- `recentActivity`

## 21. Eventos de produto

- `dashboard_loaded`
- `dashboard_quick_action_clicked`
- `dashboard_card_clicked`
- `dashboard_action_item_clicked`
- `dashboard_recent_patient_clicked`

## 22. Critérios de aceite da Etapa 4

- o dashboard ajuda o terapeuta a entender o dia em menos de alguns segundos
- a tela prioriza operação real, e não analytics decorativo
- cada card importante leva a uma tela operacional concreta
- pendências bloqueantes aparecem de forma explícita
- a revisão clínica tem destaque compatível com o valor central do produto
- a tela funciona tanto para conta recém-ativada quanto para conta com rotina em andamento

## 23. Dependências que esta etapa destrava

- definição final da lista de pacientes
- definição da agenda com foco em operação diária
- definição da fila de revisão clínica
- definição dos summaries agregados do backend

## 24. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/05-lista-de-pacientes.md`

## 25. Atualização de fase

### O que já existe no build atual

- dashboard operacional em `/app/dashboard`
- hero forte com CTA principal evidente
- bloco de ações rápidas
- grid principal com cards de agenda, revisão clínica, documentos, financeiro, pacientes e governança
- listas operacionais para agenda do dia, pendências e atividade recente

### Decisões já refletidas na UI

- o dashboard foi polido para parecer `mesa de ação`, não BI
- contas `restricted` continuam abrindo em modo reduzido e orientado à remediação
