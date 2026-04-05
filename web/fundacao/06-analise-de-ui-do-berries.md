# Análise de UI do Berries

## 1. Objetivo

Extrair do `Berries` o que já parece funcionar de verdade em UI para um SaaS clínico/documental e traduzir isso para o nosso produto sem copiar cegamente o contexto americano.

Esta análise foi feita a partir de:

- benchmark público já documentado
- screenshots do produto em uso real
- consent form real observado

## 2. Leitura direta da estrutura deles

O produto tem uma estrutura visual muito mais enxuta do que um EHR clássico.

### Navegação principal observada

- `Sessions`
- `Templates`
- `Clients`

### Estruturas recorrentes

- top nav rasa
- sidebar local para lista/fila
- área central grande e limpa
- CTA principal muito claro
- assistant lateral recolhível

Leitura prática:

- eles preservam foco
- evitam profundidade excessiva de navegação
- tratam a plataforma como `camada documental especializada`, não como suíte hospitalar

## 3. O que claramente está dando certo

### 3.1 Empty state orientado à ativação

O primeiro contato com o produto não joga o usuário em uma dashboard vazia.

Ele oferece logo de cara caminhos claros:

- `Live session sample`
- `Dictate a sample session`
- `View a sample note`

Por que isso funciona:

- reduz a ansiedade da tela vazia
- mostra valor antes de exigir configuração extensa
- acelera a primeira experiência de “aha moment”

### 3.2 Um CTA principal por tela

As telas principais deles quase sempre têm um foco dominante:

- `Start session`
- `Generate note`
- `Copy note`
- `Add patient`

Por que isso funciona:

- elimina hesitação
- reduz leitura desnecessária
- aumenta velocidade operacional

### 3.3 Estrutura browser-first muito clara

O produto parece desenhado para funcionar bem no browser, sem depender de instalação nem de app nativo.

Isso aparece em:

- permissões nativas do navegador
- share de aba
- fluxo direto de sessão
- baixa complexidade de navegação

Por que isso funciona:

- acelera ativação
- reduz barreira de entrada
- combina com terapeuta autônomo testando sozinho

### 3.4 Lista + detalhe é o padrão dominante

Eles usam uma fórmula muito sólida:

- lista na esquerda
- detalhe/revisão no centro
- ações auxiliares do lado ou no topo

Por que isso funciona:

- o usuário nunca perde contexto
- fica fácil alternar entre entidades
- reduz necessidade de voltar e avançar demais

### 3.5 Assistant como camada lateral, não como produto inteiro

O assistant existe, mas não engole a interface.

Ele aparece como:

- painel lateral
- contexto do paciente
- ações prontas
- chat complementar

Por que isso funciona:

- IA ajuda sem substituir a navegação principal
- mantém sensação de ferramenta séria e operacional

### 3.6 Linguagem visual calma

Apesar de usar acento roxo/azulado, a UI é:

- muito branca
- espaçada
- silenciosa
- focada em leitura

Por que isso funciona:

- passa sensação de ferramenta profissional
- reduz ruído
- ajuda a leitura de nota longa

## 4. O que devemos copiar conceitualmente

### 4.1 Navegação enxuta

Não devemos inflar o menu inicial do nosso web.

Para o nosso CRM, o caminho certo continua sendo:

- poucos módulos principais
- subnavegação dentro do contexto
- profundidade baixa

### 4.2 Empty states que vendem o próximo passo

Cada área nova do nosso produto deve responder:

- o que é isso
- por que isso importa
- qual é o primeiro clique

Especialmente em:

- dashboard
- pacientes
- revisão clínica
- documentos

### 4.3 CTA primário muito explícito

Nosso web deve usar verbos objetivos:

- `Novo paciente`
- `Agendar sessão`
- `Entrar na sessão`
- `Gerar tópicos`
- `Aprovar registro`

Evitar:

- `Continuar`
- `Salvar`
- `Avançar`

quando houver ação mais específica disponível.

### 4.4 Review workspace como tela central

O Berries trata a revisão da nota como superfície central de valor.

No nosso caso, devemos fazer o mesmo, mas adaptado ao nosso recorte:

- fonte de entrada
- resumo em tópicos
- pendências
- memória longitudinal
- aprovação explícita

### 4.5 IA como camada lateral e contextual

Quando o nosso assistant aparecer, ele deve:

- ser contextual ao paciente ou à sessão
- ficar em painel lateral
- sugerir ações objetivas
- não virar chat genérico vazio

## 5. O que não devemos copiar

### 5.1 Nota clínica extensa estilo médico

O Berries gera uma nota muito profunda, com estrutura quase médico-psiquiátrica.

Não devemos copiar isso no MVP.

Motivos:

- sobe risco regulatório no Brasil
- aumenta chance de erro e overreach da IA
- foge do nosso recorte de `resumo em tópicos`

### 5.2 Aba de diagnóstico com sugestão automática

Isso não deve existir no nosso produto.

Motivos:

- risco ético
- risco regulatório
- redução de confiança do terapeuta

### 5.3 Transcript como artefato visível e persistente

O transcript visível com botão de delete faz sentido para eles, mas não deve ser nosso padrão no Brasil.

Nossa direção continua correta:

- transcript bruto não deve ser superfície principal
- retenção deve ser mínima
- o valor deve estar no resumo aprovado

### 5.4 Dependência de áudio para valor principal

O próprio Berries mostra múltiplos modos de input.

Isso reforça que o nosso produto não deve depender estruturalmente do áudio para parecer útil.

## 6. Como isso deve moldar o nosso CRM

### 6.1 Shell

O shell do nosso web deve parecer:

- simples
- orientado a ação
- profissional
- legível em 5 segundos

Isso significa:

- sidebar curta
- header limpo
- poucos badges
- pouca ornamentação

### 6.2 Auth

O auth do nosso produto deve ser ainda mais objetivo que o deles.

Meta:

- o profissional deve entender imediatamente
- onde está
- o que precisa preencher
- por que existe MFA
- o que acontece depois

Cada tela de auth deve ter:

- uma pergunta central
- um CTA dominante
- uma rota de recuperação clara
- microcopy curta e funcional

### 6.3 Dashboard

Nosso dashboard não deve tentar competir com BI.

Deve funcionar como:

- mesa do dia
- fila de atenção
- atalho para tarefas críticas

### 6.4 Pacientes

A lista de pacientes deve continuar `table-first`.

O que funciona:

- busca
- filtros
- estado claro
- ação rápida

O que não funciona:

- cardzinho decorativo para diretório operacional

### 6.5 Revisão clínica

Essa é a nossa tela mais importante.

Ela deve herdar do Berries:

- foco total
- baixa distração
- ação principal evidente

Mas adaptar para o nosso produto:

- menos texto
- mais estrutura em tópicos
- mais clareza sobre `rascunho` vs `registro final`
- menos medicalização

## 7. Direção visual recomendada a partir desta análise

Devemos perseguir:

- sobriedade
- densidade controlada
- clareza de estado
- confiança visual

Não devemos perseguir:

- visual wellness genérico
- excesso de gradiente
- excesso de cards
- excesso de assistente em primeiro plano

## 8. Checklist para aplicar no nosso web

- cada tela importante tem `1 CTA principal`
- empty states explicam e vendem o primeiro passo
- o usuário consegue entender a página em `3 a 5 segundos`
- auth explica o motivo da etapa, não só pede preenchimento
- IA aparece como camada útil, não como fumaça visual
- listas operacionais continuam objetivas
- revisão clínica vira a principal superfície de valor do produto

## 9. Conclusão

O maior acerto de UI do Berries não é o visual em si.

É a disciplina de produto:

- navegação curta
- foco operacional
- onboarding de valor rápido
- CTA claro
- IA encaixada como ferramenta

É isso que devemos replicar `da nossa forma`.
