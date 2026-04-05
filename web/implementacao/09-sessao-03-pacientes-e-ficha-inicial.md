# Sessao 03 de Implementacao Real

Data de consolidacao: `30/03/2026`.

## 1. Objetivo desta sessao

Implementar a proxima fatia prevista pela ordem do produto:

- lista de pacientes
- criacao rapida em drawer
- ficha inicial do paciente

## 2. Entrega funcional

### Backend

- `GET /v1/patients`
- `POST /v1/patients`
- `GET /v1/patients/:patientId`

### Web

- rota `/app/patients` com:
  - filtros visiveis
  - busca local do modulo
  - tabela principal
  - drawer de `Novo paciente`
- rota `/app/patients/:patientId` com:
  - cabecalho persistente
  - acoes de topo
  - abas internas iniciais
  - resumo operacional do vinculo

## 3. Decisoes aplicadas

- a lista continua `table-first`
- nao foi criado modo card, kanban ou galeria
- o drawer pede apenas o minimo:
  - nome completo
  - e-mail ou telefone
  - data de nascimento
  - origem do pagamento
  - enviar convite agora
- ao criar, o fluxo redireciona direto para a ficha
- a ficha separa operacao de conteudo clinico e mantem o prontuario em rota propria

## 4. Dados mock adicionados

Foram criados pacientes com cenarios diferentes:

- ativo sem pendencia
- ativo com pendencia financeira
- ativo com pendencia documental critica
- convidado com responsavel legal
- inativo com cobranca vencida

Objetivo:

- permitir avaliacao visual e operacional da tela
- validar filtros e sinais separados de status, documentos e financeiro

## 5. Limites desta fase

- persistencia continua em memoria
- nao ha drawer de edicao ainda
- menu contextual por linha ainda nao entrou
- `PATCH /v1/patients/:patientId` ainda nao foi implementado
- o prontuario continua como placeholder separado

## 6. Resultado pratico

Com esta sessao, o produto passa a ter:

- auth e MFA preparados
- onboarding e estado da conta
- dashboard operacional
- diretorio de pacientes usavel
- ficha inicial do paciente pronta para avaliacao visual e futura integracao real
