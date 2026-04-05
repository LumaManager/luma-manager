# Matriz de Cenários: Áudio, IA e Registro

Este arquivo existe para impedir que a discussão sobre IA fique binária demais.

Não existe apenas:

- `pode tudo`

ou

- `não pode nada`

Existem cenários diferentes, com riscos e requisitos diferentes.

## Cenário 1: sem captura de áudio

### Desenho

- sessão acontece normalmente
- terapeuta registra notas próprias
- IA atua sobre formulário estruturado, bullets ou texto digitado pela(o) psicóloga(o)

### Status regulatório

`mais defensável`

### Motivo

- não há captura de fala da sessão
- o produto continua dentro da lógica de documentação assistida
- reduz risco de conflito com termos institucionais que vedem gravador

### Regras

- notas continuam sendo conteúdo sigiloso
- draft continua exigindo aprovação humana
- retenção do workspace auxiliar deve ser definida

## Cenário 2: captura de áudio e transcrição com regra forte

### Desenho

- há captura de áudio para viabilizar transcript
- paciente é informado desde o início
- o objetivo é claro
- existe concordância adequada
- retenção e descarte são definidos
- o fluxo é contratualmente coberto com fornecedores

### Status regulatório

`possível em tese`, mas `condicionado`

### Motivo

- o CFP não foi encontrado como fonte de proibição geral
- as fontes oficiais admitem gravação em casos necessários e com ciência/concordância/objetivo
- a LGPD eleva o nível de exigência

### Regras mínimas

- não ligar por padrão em todos os contextos
- registrar consentimentos/autorizações e versão dos textos
- explicitar o uso de IA e terceiros envolvidos
- limitar retenção de áudio bruto
- separar transcript bruto do prontuário final

## Cenário 3: contexto institucional ou contratual proíbe gravador

### Desenho

- existe termo, política local, clínica, serviço-escola ou relação contratual vedando gravação/captura

### Status regulatório

`bloqueado naquele contexto`

### Motivo

- mesmo sem proibição geral do CFP, a restrição concreta pode impedir o fluxo

### Ação de produto

- desabilitar áudio/transcript
- cair para `modo sem áudio`
- preservar o restante do produto

## Cenário 4: IA produzindo conteúdo clínico final sem revisão

### Desenho

- transcript vira bullet points
- bullet points viram prontuário automaticamente

### Status regulatório

`não recomendado`

### Motivo

- enfraquece a responsabilidade profissional
- aumenta risco ético e de documentação imprecisa
- contraria a tese de IA assistiva que sustenta o produto

## Cenário 5: workspace auxiliar robusto

### Desenho

- a plataforma mantém histórico longitudinal, drafts, notas, contexto e memória clínica auxiliar

### Status regulatório

`possível`, mas com tratamento de dado clínico de alto cuidado

### Motivo

- a Resolução CFP nº 001/2009 sustenta registro documental sigiloso
- mas esse conteúdo continua sendo sensível e não pode ser tratado como simples CRM

## Leitura final

Para o Brasil, a estratégia correta não é decidir se `IA existe ou não`.

A estratégia correta é:

1. suportar `mais de um modo operacional`
2. tratar áudio como módulo condicional
3. manter IA sobre notas como fallback obrigatório
4. preservar a regra de revisão humana antes do prontuário
