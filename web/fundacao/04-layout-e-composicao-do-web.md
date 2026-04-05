# Layout e Composição do Web

## 1. Objetivo

Consolidar, em um único documento, como as telas do web devem ser dispostas antes da implementação visual.

## 2. Princípio central

O web deve ser `desktop-first`, com foco em produtividade do terapeuta.

## 3. Estrutura-base

### Shell

- sidebar lateral
- header superior
- faixa de alertas globais
- área principal de conteúdo

### Hierarquia geral

1. contexto da página
2. ação principal
3. filtros ou navegação local
4. conteúdo principal
5. ações secundárias

## 4. Tipos de tela que o produto usa

### Lista operacional

Exemplos:

- pacientes
- documentos
- financeiro
- fila clínica

### Detalhe com abas ou seções

Exemplos:

- ficha do paciente
- configurações
- tenant interno

### Calendar-first

Exemplos:

- agenda

### Detalhe orientado a fluxo

Exemplos:

- detalhe da sessão
- transcript e rascunho

## 5. Densidade recomendada

- média para alta nas áreas operacionais
- mais respirada nas áreas de onboarding e settings
- alta legibilidade em tabelas e editores

## 6. Regras de composição

- listas sempre com filtros claros
- detalhes sempre com ações primárias visíveis
- informação crítica acima da dobra
- itens sensíveis sem poluição visual
- clinical record separado do resto da ficha

## 7. Layout que tende a funcionar melhor aqui

- navegação lateral persistente
- cabeçalhos estáveis
- conteúdo principal largo
- navegação local por abas apenas quando a entidade justificar
- drawers para criação rápida
- páginas dedicadas para tarefas densas

## 8. O que evitar

- excesso de modais
- dashboards com gráficos sem ação
- cards demais para tudo
- navegação escondida
- telas com múltiplos CTAs primários competindo

## 9. Consolidação

As definições detalhadas continuam nas telas de:

- `/web/telas`

Este documento apenas transforma aquelas decisões em princípios únicos para implementação visual.
