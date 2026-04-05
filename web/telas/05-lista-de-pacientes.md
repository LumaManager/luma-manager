# Web do Terapeuta - Etapa 5 - Lista de Pacientes

## 1. Objetivo

Definir de forma fechada a `lista de pacientes` do web admin do terapeuta, cobrindo:

- a visão central de todos os pacientes vinculados ao terapeuta
- busca e filtros operacionais
- status do paciente
- indicadores de documentos e financeiro
- ações rápidas antes de entrar na ficha do paciente

## 2. Papel da tela no produto

A lista de pacientes é o `diretório operacional central` do terapeuta.

Ela precisa responder rapidamente:

1. quem são meus pacientes ativos?
2. qual paciente preciso localizar agora?
3. quem tem pendência documental ou financeira?
4. quem ainda está em convite ou ativação?

Esta tela não substitui o dashboard. O dashboard mostra prioridade do dia. A lista de pacientes serve para `localizar, filtrar e entrar no caso certo`.

## 3. Escopo desta etapa

### Dentro do escopo

- diretório de pacientes do terapeuta
- busca local por paciente
- filtros por status e pendências
- tabela principal
- criação rápida de paciente
- navegação para a ficha do paciente

### Fora do escopo

- ficha completa do paciente
- edição avançada do cadastro
- importação por CSV
- bulk actions
- seleção múltipla
- visualização em cards ou kanban

## 4. Decisões travadas nesta etapa

- a lista de pacientes será uma `tabela`, não uma galeria
- o objetivo principal da tela é `localização rápida e triagem operacional`
- a ordenação padrão será `nome A-Z`
- a busca será `local do módulo`, sem busca global
- os sinais de problema serão separados em:
  - status do paciente
  - pendência documental
  - indicador financeiro
- `Novo paciente` será `criação rápida em drawer`
- a ficha completa continua sendo a tela de detalhe, não a lista
- importação de pacientes fica fora do MVP

## 5. Rota e permissão

### Rota

- `/app/patients`

### Permissão

- terapeuta autenticado

### Comportamento por status da conta

- `ready_for_operations`: acesso completo
- `restricted`: leitura permitida, ações operacionais críticas bloqueadas conforme a pendência
- `pending_setup`: redirecionar para onboarding

## 6. Estrutura geral da página

Esta tela usa o `Template B: Lista com detalhe por navegação` definido na Etapa 1.

Estrutura final:

1. título e contexto
2. CTA principal
3. faixa de filtros
4. tabela de pacientes
5. paginação

## 7. Cabeçalho da página

### Título

- `Pacientes`

### Subtítulo

- frase curta explicando que a tela centraliza pacientes e pendências operacionais

Exemplo:

- `Localize pacientes e acompanhe status, documentos e operação.`

### Ação primária

- `Novo paciente`

### Ações secundárias

- nenhuma no MVP

## 8. Criação rápida de paciente

### Forma

- abrir `drawer lateral`

### Motivo

- o cadastro inicial mínimo é curto
- reduz fricção para o terapeuta começar a operar
- a complementação detalhada fica para a ficha do paciente

### Campos mínimos do drawer

- nome completo
- e-mail ou telefone
- data de nascimento
- origem do pagamento
- enviar convite agora: `sim` ou `não`

### Regras

- pelo menos um contato é obrigatório: e-mail ou telefone
- `data de nascimento` é obrigatória para já suportar regras etárias e responsável legal depois
- ao concluir, o sistema cria o paciente e abre a ficha do paciente
- se `enviar convite agora` estiver ativo, o fluxo dispara o convite após criação

## 9. Modelo de status do paciente na lista

O status principal exibido na tabela deve ser simples e estável.

### Status do paciente no MVP

- `Convidado`
- `Ativo`
- `Inativo`
- `Arquivado`

### Significado

- `Convidado`: paciente criado, mas ainda sem ativação completa no fluxo do paciente
- `Ativo`: vínculo em operação normal
- `Inativo`: vínculo pausado ou sem operação corrente
- `Arquivado`: paciente não deve mais aparecer nos fluxos operacionais principais

### Regra

- pendências documentais ou financeiras não alteram o status principal
- elas aparecem em colunas separadas

## 10. Filtros da tela

### Filtros sempre visíveis

- busca
- status
- documentos
- financeiro

### Busca

Deve buscar por:

- nome do paciente
- código externo, se existir
- e-mail
- telefone

### Filtro de status

Valores:

- todos
- convidado
- ativo
- inativo
- arquivado

### Filtro de documentos

Valores:

- todos
- sem pendência
- pendente
- crítico

### Filtro de financeiro

Valores:

- todos
- sem pendência
- cobrança em aberto
- cobrança vencida

### Filtro adicional em drawer

- pacientes com próxima sessão nos próximos 7 dias
- pacientes com responsável legal

### Regras

- filtros ativos devem ficar visíveis como chips
- deve existir botão `Limpar filtros`

## 11. Tabela principal

### Colunas obrigatórias

1. `Paciente`
2. `Status`
3. `Próxima sessão`
4. `Documentos`
5. `Financeiro`

### Coluna 1 - Paciente

Deve conter:

- nome completo
- código externo, se existir
- contato resumido secundário

### Coluna 2 - Status

Deve conter:

- badge principal do status do paciente

### Coluna 3 - Próxima sessão

Deve conter:

- data e hora da próxima sessão, se existir
- estado `Sem sessão futura`, quando não existir

### Coluna 4 - Documentos

Deve conter:

- estado resumido documental
- contador de pendências quando fizer sentido

Valores visuais:

- `OK`
- `Pendente`
- `Crítico`

### Coluna 5 - Financeiro

Deve conter:

- estado financeiro resumido

Valores visuais:

- `OK`
- `Em aberto`
- `Vencido`

## 12. Interação por linha

### Comportamento principal

- clique na linha abre a ficha do paciente

### Menu contextual por linha

- abrir ficha
- agendar sessão
- reenviar convite, quando aplicável
- arquivar, quando permitido

### Regras

- não permitir edição inline na tabela
- ações destrutivas exigem confirmação

## 13. Ordenação

### Ordenação padrão

- nome do paciente em ordem alfabética

### Ordenações permitidas no MVP

- nome
- próxima sessão
- status

### O que não entra

- ranking automático de prioridade operacional

Motivo:

- a prioridade operacional já é papel do dashboard e da fila de revisão
- a lista de pacientes precisa ser previsível e estável

## 14. Paginação

### Defaults

- `25` itens por página
- opções `25`, `50`, `100`

### Regras

- paginação no rodapé
- total de resultados visível

## 15. Estados da tela

### Loading

- skeleton da faixa de filtros
- skeleton da tabela

### Empty state inicial

Quando não há pacientes:

- mensagem de que o consultório ainda não tem pacientes cadastrados
- CTA principal: `Cadastrar primeiro paciente`

### Empty state de busca/filtro

Quando não há resultado:

- mensagem simples de nenhum paciente encontrado
- CTA: `Limpar filtros`

### Error state

- mensagem curta
- botão `Tentar novamente`

## 16. Indicadores e semântica visual

### Documentos

- `OK`: nada pendente
- `Pendente`: existe item pendente, mas ainda sem impacto crítico imediato
- `Crítico`: há pendência capaz de bloquear sessão, cobrança ou operação relevante

### Financeiro

- `OK`: sem cobrança pendente relevante
- `Em aberto`: existe cobrança ainda dentro do prazo
- `Vencido`: existe valor vencido

### Regra

- os indicadores devem ser legíveis sem precisar abrir a ficha
- não usar texto clínico nem contexto sensível nesta tela

## 17. Payload necessário para a tabela

Cada item da lista precisa trazer:

- `patientId`
- `fullName`
- `externalCode`
- `primaryContactSummary`
- `status`
- `nextAppointmentAt`
- `documentStatus`
- `documentPendingCount`
- `financialStatus`
- `hasGuardian`

## 18. APIs mínimas necessárias

- `GET /patients`
- `POST /patients`
- `POST /patients/:patientId/invite/resend`
- `POST /patients/:patientId/archive`

### Query params recomendados para `GET /patients`

- `search`
- `status`
- `documentStatus`
- `financialStatus`
- `upcomingWindow`
- `hasGuardian`
- `page`
- `pageSize`
- `sort`

## 19. Eventos de produto

- `patients_list_loaded`
- `patient_filter_applied`
- `patient_search_used`
- `patient_created_from_list`
- `patient_row_clicked`
- `patient_row_action_clicked`

## 20. Critérios de aceite da Etapa 5

- o terapeuta consegue localizar um paciente rapidamente
- a tabela deixa claras as diferenças entre status, documentos e financeiro
- a criação rápida de paciente reduz fricção sem tentar resolver todo o cadastro ali
- a navegação para a ficha do paciente é o fluxo principal da tela
- a lista funciona como diretório estável, e não como dashboard paralelo

## 21. Dependências que esta etapa destrava

- ficha do paciente
- agendamento a partir do paciente
- navegação entre paciente, documentos, financeiro e prontuário
- modelagem agregada de indicadores do paciente

## 22. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/06-ficha-do-paciente.md`

## 23. Atualização de fase

### O que já existe no build atual

- rota `/app/patients` com tabela operacional
- toolbar visível com busca, filtros e chips ativos
- `Novo paciente` em drawer lateral
- criação rápida já pensada para troca futura de dummy data por backend real

### Decisões já refletidas na UI

- a lista está `lista-first`, não dashboard paralelo
- o drawer de criação ficou mais compacto e orientado à decisão de convite imediato
