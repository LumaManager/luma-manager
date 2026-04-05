# Ordem Exata de Definição de Telas

## 1. Objetivo

Definir as telas na ordem que reduz retrabalho, respeita as dependências do produto e prioriza o que destrava arquitetura, dados, navegação e operação real do terapeuta.

Esta ordem não é a ordem de implementação de código. Ela é a ordem ideal de `definição funcional e de UX`.

## 2. Princípio central

Começar pelo `web do terapeuta`, porque é onde estão:

- os fluxos mais densos
- as principais regras de negócio
- as definições que impactam backend, permissões e modelo de dados

O app do paciente e o app do terapeuta devem ser definidos depois, já apoiados no que foi validado no web.

## 3. Regra de definição por tela

Toda tela definida deve sair com estes itens:

- objetivo da tela
- usuário e permissão
- dados exibidos
- ações possíveis
- estados vazios
- estados de erro
- estados de loading
- dependências com outras telas
- eventos que a tela produz
- integrações e APIs que a tela exige

## 4. Ordem oficial de definição

### Etapa 1: Estrutura-base do web do terapeuta

Definir primeiro:

- layout principal do web admin
- navegação lateral
- header
- breadcrumbs
- busca global, se existir
- padrão de tabelas, filtros e formulários

Motivo:

- isso define a linguagem estrutural do produto
- todas as telas seguintes dependem dessa base

Saída esperada:

- shell do produto
- arquitetura de navegação
- padrão visual funcional para telas densas

### Etapa 2: Login e segurança

Definir:

- login
- MFA
- recuperação de acesso
- gestão de sessões/dispositivos

Motivo:

- autenticação e sessão impactam todos os fluxos
- é aqui que se materializa a separação entre terapeuta, paciente e admin

Saída esperada:

- fluxo de acesso completo
- estados de bloqueio e erro
- política visível de segurança do terapeuta

### Etapa 3: Onboarding do terapeuta

Definir:

- cadastro profissional
- CRP
- dados bancários e tributários
- contrato e DPA
- configuração inicial de agenda
- consentimentos padrão

Motivo:

- sem isso não existe conta configurada para operar
- esse fluxo define os dados mínimos do tenant solo

Saída esperada:

- fluxo de primeira ativação do terapeuta
- checklist do que torna a conta apta a atender

### Etapa 4: Dashboard do terapeuta

Definir:

- visão geral operacional
- próximos atendimentos
- pendências de documentos
- cobranças em aberto
- sessões aguardando revisão

Motivo:

- o dashboard resume o produto
- ele ajuda a validar quais objetos são realmente centrais

Saída esperada:

- hierarquia de prioridade visual
- widgets e cards que representam o dia a dia real do psicólogo

### Etapa 5: Lista de pacientes

Definir:

- tabela/lista de pacientes
- busca
- filtros
- status
- ações rápidas

Motivo:

- paciente é o eixo principal da operação
- essa tela ajuda a validar taxonomia, status e relacionamento com agenda, documentos e financeiro

Saída esperada:

- visão consolidada de pacientes
- modelo de filtros operacionais

### Etapa 6: Ficha do paciente

Definir:

- cabeçalho do paciente
- dados cadastrais
- responsável legal
- status de consentimento
- visão resumida de sessões, cobranças e documentos
- atalhos para prontuário e agenda

Motivo:

- essa é uma das telas mais importantes do sistema
- ela conecta quase todos os módulos

Saída esperada:

- estrutura canônica da entidade paciente
- navegação interna por abas ou seções

### Etapa 7: Agenda do terapeuta

Definir:

- calendário diário, semanal e mensal
- disponibilidade
- bloqueios
- criação de sessão
- reagendamento
- cancelamento

Motivo:

- agenda é o eixo operacional antes da sessão acontecer
- depende do cadastro do terapeuta e da existência do paciente

Saída esperada:

- regras visuais de sessão
- padrões de criação e edição de compromisso

### Etapa 8: Detalhe da sessão

Definir:

- dados da consulta
- status
- pagamento
- consentimentos pendentes
- acesso à sala virtual
- checklist pré-atendimento

Motivo:

- essa tela liga agenda, paciente, pagamento e teleatendimento
- ela organiza o ponto de entrada da sessão

Saída esperada:

- modelo detalhado do objeto sessão
- regras de transição entre estados da consulta

### Etapa 9: Tela de videochamada no web

Definir:

- sala de espera
- autorização de entrada
- controles de áudio e vídeo
- indicador de consentimento para transcript
- encerramento

Motivo:

- é um fluxo crítico e sensível
- depende do detalhe da sessão já estar definido

Saída esperada:

- comportamento da sessão ao vivo
- estados de conexão, erro e encerramento

### Etapa 10: Fila de revisão clínica

Definir:

- lista de sessões com transcript pendente
- status do processamento
- prioridade
- filtros

Motivo:

- essa tela conecta o atendimento ao valor central do SaaS
- ela vira o inbox de trabalho pós-sessão do terapeuta

Saída esperada:

- estrutura da fila clínica
- critérios de priorização e SLA interno

### Etapa 11: Tela de transcript e rascunho IA

Definir:

- transcript segmentado
- rascunho da IA
- tópicos sugeridos
- continuidade do caso
- campo de edição
- aprovação
- descarte

Motivo:

- essa é a principal tela de diferenciação do produto
- depende da fila de revisão e do pipeline clínico já modelados

Saída esperada:

- fluxo de revisão humana
- separação explícita entre rascunho e prontuário final

### Etapa 12: Prontuário e histórico longitudinal

Definir:

- timeline clínica
- versão final por sessão
- histórico do caso
- navegação entre registros anteriores

Motivo:

- depois que o fluxo de aprovação estiver claro, fica possível desenhar o repositório clínico final

Saída esperada:

- modelo de consulta histórica do paciente
- estrutura de leitura do caso ao longo do tempo

### Etapa 13: Documentos e consentimentos

Definir:

- biblioteca de documentos
- documentos por paciente
- pendências de assinatura
- histórico de aceite
- status de validade

Motivo:

- documentos dependem da entidade paciente, da jornada da sessão e das políticas de compliance

Saída esperada:

- gestão documental clara
- estados de assinatura e pendência

### Etapa 14: Financeiro

Definir:

- contas a receber
- detalhe da cobrança
- status
- filtros por tipo de pagamento
- exportação
- resumo mensal

Motivo:

- depende da sessão e da ficha do paciente já estarem claras
- o financeiro é operacional, mas não deve definir o produto antes do fluxo clínico central

Saída esperada:

- modelo de operação financeira do consultório
- visibilidade de inadimplência e repasses

### Etapa 15: Configurações do terapeuta

Definir:

- perfil
- segurança
- notificações
- cobrança
- agenda
- integrações
- retenção assistida

Motivo:

- configurações dependem de decisões já tomadas nas telas anteriores
- definir cedo demais gera retrabalho

Saída esperada:

- painel consolidado de parametrização da conta

### Etapa 16: Web interno de admin

Definir:

- contas/tenants
- billing
- jobs e integrações
- compliance ops
- trilha de auditoria
- incidentes

Motivo:

- não deve ser definido antes da operação principal do terapeuta
- o admin interno existe para sustentar o produto, não para ditar sua UX principal

Saída esperada:

- operação segura de backoffice
- visibilidade sem exposição indevida de conteúdo clínico

## 5. Ordem resumida

1. Estrutura-base do web
2. Login e segurança
3. Onboarding do terapeuta
4. Dashboard
5. Lista de pacientes
6. Ficha do paciente
7. Agenda
8. Detalhe da sessão
9. Videochamada
10. Fila de revisão clínica
11. Transcript e rascunho IA
12. Prontuário longitudinal
13. Documentos e consentimentos
14. Financeiro
15. Configurações
16. Admin interno

## 6. O que vem depois do web

Depois de fechar o web do terapeuta:

1. definir `web responsivo do paciente` para convite, documentos e entrada na sessão
2. definir `app do paciente`
3. definir `app enxuto do terapeuta`

## 7. Recomendação prática de trabalho

Para cada etapa acima, produzir nesta ordem:

1. objetivo da tela
2. blocos de informação
3. ações primárias e secundárias
4. estados
5. regras de permissão
6. wireframe
7. requisitos de backend

## 8. Próximo passo recomendado

Começar imediatamente pela `Etapa 1` e `Etapa 2`, porque elas travam o resto:

- shell do web admin
- login
- MFA
- padrão de navegação

Depois entrar em `pacientes` e `agenda`, que são os dois pilares operacionais do terapeuta.
