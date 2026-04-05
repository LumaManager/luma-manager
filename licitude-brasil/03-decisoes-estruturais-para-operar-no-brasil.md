# Decisões Estruturais para Operar no Brasil

Este arquivo transforma a leitura regulatória em decisões de produto e arquitetura.

## 1. Modelo de negócio recomendado

### Decisão

Operar como `plataforma SaaS para psicólogos e clínicas`, não como `prestadora direta de serviços psicológicos`.

### Implicação prática

- a empresa vende software
- a responsabilidade clínica permanece com a(o) psicóloga(o)
- o produto não deve se apresentar como substituto de supervisão clínica, diagnóstico ou condução terapêutica

## 2. Papéis de tratamento de dados

### Decisão de trabalho

Assumir provisoriamente o seguinte desenho:

- `psicóloga(o)` como controladora(or) do conteúdo clínico do atendimento
- `plataforma` como operadora do tratamento necessário para prestar o serviço contratado
- `plataforma` como controladora independente dos próprios dados corporativos e operacionais, como billing, antifraude, segurança da conta e logs internos

### Ressalva

Esse desenho pode mudar em fluxos específicos, especialmente se a plataforma:

- decidir finalidades próprias para dados clínicos
- usar dados clínicos para treino de modelo
- gerar analytics próprios sobre conteúdo clínico para além da prestação do serviço

Nesses casos, pode haver tese de `controladora` ou até `controladoria conjunta`.

## 3. Separação obrigatória de domínios

### Decisão

Separar o produto em quatro domínios claros:

- `CRM operacional`
- `workspace clínico auxiliar`
- `prontuário oficial`
- `pipeline opcional de áudio/transcrição`

### Implicação

O erro seria tratar tudo como uma única camada de dados.

O que é clínico precisa ter:

- acesso mais restrito
- auditoria própria
- retenção própria
- regras próprias de exportação

## 4. IA como assistência documental

### Decisão

A IA deve ser posicionada e construída como:

- organização documental
- draft de evolução
- sumarização assistida
- continuidade de contexto

### Não fazer

- diagnóstico automatizado
- conduta terapêutica autônoma
- recomendação clínica vinculante
- avaliação psicológica automatizada
- classificação de risco com linguagem de decisão clínica

## 5. Áudio e transcrição como módulo condicional

### Decisão

`Transcrição` continua no escopo estratégico, mas não pode ser tratada como capacidade universal.

Ela deve existir sob condições explícitas:

- contexto profissional permite
- paciente foi informado desde o início
- há concordância adequada para o fluxo
- objetivo está claro
- retenção e descarte estão definidos
- fornecedor e transferência internacional estão contratualmente cobertos

### Implicação técnica

O produto deve suportar ao menos dois modos:

- `modo sem áudio`, com IA sobre notas do terapeuta
- `modo com áudio`, com regras reforçadas e auditáveis

## 6. Registro auxiliar não é “área livre”

### Decisão

O `workspace clínico auxiliar` é permitido em tese, mas deve ser tratado como ativo sigiloso.

### Implicação

Mesmo que ele não seja o prontuário formal:

- não pode ser acessível ao suporte comum
- não pode ser usado para treino
- não pode ter retenção indefinida sem critério
- não pode ser tratado como simples histórico de produto

## 7. Regra de publicação para prontuário

### Decisão

Nada vira prontuário final sem `ação humana explícita` da(o) psicóloga(o).

### Implicação

- transcript não é prontuário por padrão
- bullet points não são prontuário por padrão
- rascunho da IA não é prontuário por padrão
- o registro oficial nasce da revisão e aprovação profissional

## 8. Crianças e adolescentes

### Decisão

O produto precisa ter fluxo próprio para menores desde o MVP regulatório.

### Itens mínimos

- vínculo com responsável legal
- autorização de ao menos um responsável para atendimento não eventual
- prevalência do melhor interesse
- política de acesso separada
- revisão jurídica da retenção específica

## 9. Fornecedores estrangeiros

### Decisão

Nenhum fornecedor estrangeiro de IA, transcript, vídeo, e-mail ou storage entra no go-live sem validação formal de:

- transferência internacional
- retenção
- uso para treino
- suboperadores
- localização e segurança
- contrato e DPA

## 10. Marketing e venda

### Decisão

O discurso comercial precisa ser compatível com a tese regulatória.

### Pode dizer

- documentação assistida
- organização clínica
- continuidade de caso
- prontuário eletrônico
- teleatendimento seguro

### Não deve dizer

- IA faz a sessão sozinha
- IA avalia o paciente
- IA decide conduta
- IA substitui anotação clínica obrigatória
- IA atua como apoio diagnóstico automatizado

## 11. Posição consolidada

Se o produto respeitar estas decisões, a tese de licitude fica consideravelmente mais forte.

Se quebrar qualquer uma delas, especialmente em:

- papel da empresa
- papel da IA
- sigilo
- áudio
- prontuário

o risco regulatório sobe rápido.
