# Convenções de Documentação

## 1. Regra permanente

Tudo o que for relevante para o produto deve ser salvo em arquivos `.md`.

Isso inclui:

- decisões de produto
- decisões de arquitetura
- critérios de segurança
- definições de telas
- dúvidas em aberto
- prioridades de execução
- explicações importantes dadas em conversa
- mudanças de direção

## 2. Objetivo

Garantir que agentes futuros não dependam do histórico do chat para entender o contexto do projeto.

## 3. Fonte de verdade

O contexto oficial do projeto deve morar em `.md` dentro desta pasta. O chat serve para discutir; os arquivos `.md` servem para preservar.

## 4. Estrutura recomendada

- arquivos de contexto e regras na raiz com prefixo numérico
- documentos de produto em `produto/`
- documentos de arquitetura em `arquitetura/`
- documentos de planejamento em `planejamento/`

## 5. Regra de atualização

Quando uma conversa gerar definição nova:

1. registrar a decisão no arquivo temático correto
2. atualizar o contexto integral se a decisão impactar o entendimento geral
3. manter a ordem de leitura atualizada no índice mestre

## 6. Regra de escrita

- usar português claro
- preferir decisões explícitas a texto ambíguo
- separar fatos, decisões, premissas e dúvidas
- registrar o que foi assumido temporariamente
- não deixar decisões importantes apenas implícitas

## 7. Regra para agentes futuros

Antes de propor arquitetura, features ou execução:

1. ler [00-indice-mestre.md](./00-indice-mestre.md)
2. seguir a ordem oficial de leitura
3. tratar os `.md` como estado atual do projeto
