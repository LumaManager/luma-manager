# Investigação Central do Projeto

## 1. Objetivo

Este documento consolida, em um único lugar, as dúvidas críticas que precisam ser resolvidas antes de travar decisões definitivas sobre:

- gravação de sessão
- transcrição com IA
- uso de bullet points derivados da sessão
- CRM auxiliar versus prontuário
- registro documental sigiloso
- limites regulatórios do produto

Este arquivo existe para permitir uma decisão `cravada na pedra` sobre o que o produto pode ou não pode fazer.

## 1.1 Desdobramento posterior desta investigação

A partir de `30/03/2026`, a frente regulatória ganhou um pacote dedicado em:

- [licitude-brasil/README.md](./licitude-brasil/README.md)

Esse pacote deve ser tratado como a continuidade oficial desta investigação para o mercado brasileiro, especialmente nos temas de:

- tese de operação lícita
- enquadramento da empresa
- áudio e transcrição
- controlador x operador
- gates jurídicos para go-live

## 2. Pergunta central

O produto pode usar `captura da sessão + transcrição assistida por IA + geração de bullet points` de forma compatível com:

- CFP
- Código de Ética
- LGPD
- dever de sigilo
- prática clínica real
- termos contratuais do terapeuta

## 3. Resposta atual, sem enrolação

### O que já dá para dizer

- `não foi encontrada`, nas fontes oficiais consultadas, uma proibição geral do CFP à gravação de sessões
- o CFP tem orientação oficial de que a gravação pode ocorrer `em casos necessários`, com ciência, concordância e objetivo claros
- existe base normativa para `registro documental sigiloso`, inclusive informatizado
- existe base para `prontuário eletrônico`
- a LGPD torna isso tudo `dado pessoal sensível`, exigindo rigor forte

### O que ainda não dá para dizer

- não dá para afirmar ainda que `o seu fluxo específico de IA/transcrição está liberado`
- não dá para afirmar ainda que `o termo assinado pelo terapeuta permite isso`
- não dá para afirmar ainda qual deve ser a `retenção correta` do material bruto da sessão, se houver

### Conclusão operacional de hoje

- a tese de `transcrição em bullet points` `não está morta`
- ela `não está validada de forma definitiva`
- o ponto decisivo agora é:
  - o `texto exato` do termo assinado
  - a leitura jurídica aplicada ao fluxo técnico

## 4. Hipóteses que estamos avaliando

### Hipótese A

`É proibido gravar/transcrever sessões em qualquer hipótese.`

Status:

- `não confirmada`

Leitura atual:

- não encontrei base oficial para sustentar isso como regra geral

### Hipótese B

`É possível gravar/transcrever em alguns contextos, desde que haja necessidade, transparência, concordância e proteção forte.`

Status:

- `plausível`

Leitura atual:

- é a hipótese mais compatível com as fontes oficiais encontradas

### Hipótese C

`Mesmo que o CFP não proíba em abstrato, o contexto concreto do terapeuta pode proibir.`

Status:

- `muito plausível`

Leitura atual:

- se o terapeuta assinou termo próprio, política institucional ou contrato local, isso pode bloquear a funcionalidade naquele contexto específico

## 5. O que as fontes oficiais mostram

## 5.1 CFP sobre gravação de sessões

O CFP possui FAQ oficial intitulada `É permitido gravar as sessões de atendimento?`

Leitura prática do conteúdo:

- o sigilo deve ser respeitado
- a necessidade da gravação deve ser avaliada
- a pessoa atendida deve ter ciência
- a pessoa atendida deve concordar
- a pessoa atendida deve conhecer o objetivo da gravação

Isso não equivale a uma liberação irrestrita, mas também `não equivale a proibição geral`.

Fonte:

- https://site.cfp.org.br/faq/e-permitido-gravar-as-sessoes-de-atendimento/

## 5.2 Registro documental obrigatório

O CFP reforça que a atividade psicológica exige `registro documental`.

Pelo material oficial consultado:

- o registro documental é obrigatório
- ele pode ser sigiloso
- ele pode ser informatizado
- ele contempla evolução e procedimentos adotados

Fontes:

- Resolução CFP nº 001/2009: https://site.cfp.org.br/wp-content/uploads/2009/04/resolucao2009_01.pdf
- Caderno do CFP sobre psicoterapia: https://site.cfp.org.br/wp-content/uploads/2023/06/caderno_reflexoes_e_orientacoes_sobre_a_pratica_de_psicoterapia.pdf

## 5.3 Prontuário eletrônico

O CRP 16 afirma que não há impedimento ao uso de prontuário eletrônico, desde que:

- sejam respeitados os princípios do Código de Ética
- sejam respeitadas as resoluções do CFP
- o sigilo seja resguardado
- haja controle de acesso adequado

Fonte:

- https://transparencia.cfp.org.br/crp16/pergunta-frequente/registro-em-prontuario/

## 5.4 LGPD

Pela LGPD:

- dado referente à saúde é `dado pessoal sensível`
- o tratamento de dados sensíveis exige base legal adequada e rigor maior

Isso impacta diretamente:

- gravação de sessão
- transcrição
- geração de bullet points
- retenção
- compartilhamento com fornecedores
- descarte

Fonte:

- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm

## 6. O que ainda está em aberto

Estas são as dúvidas que ainda precisam ser respondidas antes da decisão final:

### 1. O termo assinado pelo terapeuta

Precisamos ver o texto exato.

Perguntas:

- ele proíbe `gravar`?
- ele proíbe `capturar áudio`?
- ele proíbe `armazenar`?
- ele proíbe `qualquer forma eletrônica de registro da sessão`?
- ele faz exceção para consentimento do paciente?

### 2. Base jurídica específica do fluxo

Precisamos fechar:

- qual base legal LGPD sustenta esse tratamento
- se o consentimento será necessário e suficiente
- se o consentimento precisará ser destacado e granular

### 3. Qual é o status do material transcrito

Precisamos decidir:

- transcript bruto é registro documental?
- transcript bruto é mero insumo temporário?
- bullet points gerados são rascunho?
- o que vira prontuário?

### 4. Retenção

Precisamos decidir:

- quanto tempo o áudio bruto ficaria
- quanto tempo o transcript bruto ficaria
- quanto tempo o bullet point ficaria
- o que é descartado e quando

### 5. Fornecedores

Precisamos validar:

- uso para treino
- retenção
- transferência internacional
- criptografia
- logs
- possibilidade de zero retention

## 7. A dúvida do CRM auxiliar

## 7.1 A pergunta

Um `CRM auxiliar` que não substitui o prontuário, mas ajuda a consolidar visão geral e depois alimenta o prontuário, é possível?

## 7.2 Resposta atual

`Sim, em tese`.

Mas com um limite importante:

- se ele guarda conteúdo clínico substantivo, ele deixa de ser “CRM comum”
- ele passa a se parecer com `registro clínico auxiliar sigiloso`

Então o nome pode ser CRM, mas a governança não pode ser de CRM comum.

## 7.3 Modelo mais defensável hoje

### Camada 1: CRM operacional

Pode conter:

- agenda
- cobrança
- documentos
- status
- consentimentos
- vínculo terapeuta-paciente

### Camada 2: Workspace clínico auxiliar

Pode conter:

- notas estruturadas do terapeuta
- bullet points
- rascunhos
- síntese da sessão
- contexto longitudinal auxiliar

### Camada 3: Prontuário oficial

Contém:

- o registro clínico final
- revisado e aprovado pelo terapeuta

## 7.4 Regra crítica

Nada clínico deve ser tratado como simples dado operacional só porque o nome da área é `CRM`.

## 8. Cenários de decisão

## Cenário A: áudio/transcrição permitidos no contexto concreto

Nesse cenário, o produto pode seguir com:

- captação da sessão
- transcrição
- bullet points
- rascunho
- revisão humana

Exigências:

- consentimento claro
- necessidade clara
- proteção técnica forte
- retenção mínima
- fornecedor adequado

## Cenário B: áudio permitido, mas só com restrições fortes

Nesse cenário, o produto deve tratar a funcionalidade como:

- opcional
- condicionada
- configurável por terapeuta/organização

Exigências:

- política de ativação explícita
- consentimento granular
- retenção curta
- desligamento por tenant

## Cenário C: áudio proibido no contexto concreto

Nesse cenário, a IA ainda pode existir, mas em outro formato:

- terapeuta escreve bullets
- IA organiza em draft
- IA ajuda com continuidade do caso
- IA atua sobre registros anteriores aprovados

Nesse cenário, `ambient AI` sai do núcleo.

## 9. O que precisa ser decidido juridicamente

Estas são as perguntas que eu faria para um advogado especializado:

1. A gravação/captura de áudio da sessão, com consentimento explícito, é juridicamente sustentável no nosso contexto de produto?
2. Há diferença relevante entre `gravação para armazenamento` e `captura para transcrição assistida`?
3. Transcript bruto pode ser tratado como insumo temporário fora do prontuário?
4. Bullet points gerados por IA podem compor um `registro auxiliar sigiloso` distinto do prontuário final?
5. Quais cláusulas mínimas precisam existir nos contratos com provedores de áudio/transcrição/LLM?
6. Quais bases legais e quais consentimentos precisam existir no fluxo do paciente?
7. Há alguma vedação prática para esse fluxo em clínicas, convênios, serviços-escola ou contratos de prestação comuns?

## 10. O que precisa ser decidido tecnicamente

1. Áudio bruto será armazenado ou não?
2. Transcript bruto será armazenado ou não?
3. Se armazenado, onde e por quanto tempo?
4. Bullet points ficam onde?
5. O que entra no prontuário final?
6. O que é descartado automaticamente?
7. O terapeuta consegue optar por não usar essa feature?
8. O tenant consegue desabilitar a feature por política?

## 11. O que precisa ser respondido pelo terapeuta ou instituição

1. Qual foi o termo assinado exatamente?
2. O termo proíbe gravador em qualquer hipótese ou só por padrão?
3. O contexto é:
   - clínica privada?
   - convênio?
   - serviço-escola?
   - instituição pública?
4. Há proibição interna também para prontuário eletrônico, ditado ou qualquer meio digital?
5. O paciente poderia consentir com esse fluxo?

## 12. Minha leitura mais honesta hoje

Se eu tivesse que resumir a posição atual:

- `não há base suficiente para matar a tese`
- `não há base suficiente para liberar sem ressalvas`
- `o principal bloqueador agora é o contexto contratual concreto`

## 13. O que eu faria a partir daqui

### Passo 1

Obter o `termo exato` ou a cláusula exata assinada pelo terapeuta.

### Passo 2

Submeter esse texto a análise jurídica especializada.

### Passo 3

Manter dois trilhos de produto em paralelo:

- trilho A: com transcrição condicional
- trilho B: sem captura de áudio, usando notas do terapeuta

### Passo 4

Só depois disso congelar o núcleo do SaaS.

## 14. Decisão provisória recomendada

Até que a análise final seja feita:

- `não abandonar` a hipótese de transcription
- `não prometer` transcription como premissa garantida do produto
- tratar a funcionalidade como `condicional`

## 15. Fontes oficiais centrais

- CFP FAQ sobre gravação: https://site.cfp.org.br/faq/e-permitido-gravar-as-sessoes-de-atendimento/
- Resolução CFP nº 001/2009: https://site.cfp.org.br/wp-content/uploads/2009/04/resolucao2009_01.pdf
- Código de Ética Profissional do Psicólogo: https://site.cfp.org.br/wp-content/uploads/2012/07/codigo-de-etica-psicologia-1.pdf
- Resolução CFP nº 06/2019 comentada: https://site.cfp.org.br/wp-content/uploads/2019/09/Resolu%C3%A7%C3%A3o-CFP-n-06-2019-comentada.pdf
- CRP 16 sobre prontuário eletrônico: https://transparencia.cfp.org.br/crp16/pergunta-frequente/registro-em-prontuario/
- CRP 16 sobre atendimento online/TDIC: https://transparencia.cfp.org.br/crp16/pergunta-frequente/atendimento-online/
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
