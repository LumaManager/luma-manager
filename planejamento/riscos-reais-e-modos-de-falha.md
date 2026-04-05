# Riscos Reais e Modos de Falha do Projeto

## 1. Resposta curta

Sim, `há chance real de não dar certo`.

Não por falta de tecnologia. O risco maior é o produto não virar algo suficientemente:

- confiável
- defensável
- adotável
- economicamente viável

## 2. Coisas que você pode estar subestimando

### 1. Confiança é mais difícil que produto

Psicólogo não compra só software. Ele compra:

- segurança
- reputação
- continuidade
- previsibilidade jurídica

Se ele sentir qualquer ambiguidade sobre LGPD, ética profissional, transcript ou IA, ele trava.

### 2. O valor central pode parecer melhor no papel do que no uso real

A grande promessa é:

- transcript
- draft clínico
- continuidade longitudinal

Se isso não economizar tempo de verdade, o produto perde o motivo de existir.

Se o terapeuta precisar:

- corrigir demais
- desconfiar demais
- revisar demais

então a IA vira custo e risco, não vantagem.

### 3. Você pode estar construindo um produto largo demais cedo demais

Hoje o escopo encosta em:

- agenda
- teleatendimento
- documentos
- cobrança
- prontuário
- transcript
- IA
- compliance

Isso é praticamente um `all-in-one clínico`.

O risco é fazer tudo de forma apenas razoável e não resolver nada de forma excepcional.

### 4. Distribuição pode ser mais difícil que construção

Mesmo com produto bom, ainda existe a pergunta:

- como esses psicólogos chegam até você?
- por que trocam do que já usam?
- por que confiam em um player novo com dado sensível?

Se aquisição e confiança não fecharem, o produto pode ser bom e mesmo assim não escalar.

### 5. A economia da sessão pode quebrar o modelo

Seu produto depende de custos variáveis pesados:

- vídeo
- transcript
- LLM
- storage
- suporte

Se sessão longa gerar custo alto e ticket baixo, a margem pode morrer.

### 6. A parte paciente pode parecer secundária, mas pode derrubar o uso

Se o paciente tiver fricção em:

- convite
- assinatura
- pagamento
- entrada na chamada

o terapeuta culpa a plataforma.

Em produto clínico, o terapeuta não tolera produto que dificulta a vida do paciente.

### 7. Compliance operacional é mais pesada do que parece

Não basta “estar em conformidade na arquitetura”.

Você precisa de operação real para:

- incidente
- auditoria
- revogação
- retenção
- descarte
- suporte interno
- controle de acesso

Muita healthtech morre não porque o core app é ruim, mas porque a operação regulatória não aguenta.

### 8. Um incidente de segurança cedo pode matar a empresa

Nesse tipo de produto, um incidente sério não é bug comum.

Ele pode virar:

- perda de confiança
- risco jurídico
- dano de marca
- churn imediato

## 3. Modos reais de falha

### Modo de falha 1: o produto não poupa tempo suficiente

Sinal:

- psicólogo testa, acha interessante, mas não incorpora na rotina

Tradução:

- curiosidade sem retenção

### Modo de falha 2: a revisão clínica é pesada demais

Sinal:

- draft exige tanta correção que o terapeuta prefere escrever sozinho

Tradução:

- IA sem ROI

### Modo de falha 3: o produto parece juridicamente arriscado

Sinal:

- perguntas repetidas sobre privacidade, retenção e uso da IA
- medo explícito de CRP, LGPD ou vazamento

Tradução:

- sem confiança, não há adoção

### Modo de falha 4: o CAC fica alto demais para terapeuta individual

Sinal:

- venda exige explicação longa, suporte pesado e onboarding manual

Tradução:

- comercialmente inviável no ICP atual

### Modo de falha 5: o produto vira “agenda com IA cara”

Sinal:

- usuário usa agenda, cobrança e telehealth, mas quase não usa revisão clínica assistida

Tradução:

- a parte mais cara não sustenta o valor

### Modo de falha 6: patient-side UX falha

Sinal:

- no-show por confusão
- dificuldade para entrar em sessão
- documentos não assinados
- pagamento travado

Tradução:

- desgaste direto para o terapeuta

### Modo de falha 7: escopo explode antes de PMF

Sinal:

- clínica multiusuário
- convênio
- fiscal avançado
- app nativo
- analytics
- automações demais

entrando antes da validação do núcleo

Tradução:

- empresa constrói demais antes de provar retenção

## 4. Onde eu acho que está o maior risco de verdade

Se eu tivesse que apostar nos 4 riscos mais perigosos, seriam:

### 1. Falta de confiança suficiente para adoção clínica

### 2. Draft e transcript não gerarem ganho real de tempo

### 3. Unit economics ruins por sessão

### 4. Escopo excessivo antes de provar retenção

## 5. Coisas que você talvez ainda não tenha modelado o suficiente

### ICP real

Você ainda precisa provar com clareza:

- qual psicólogo compra isso primeiro
- quem sente mais dor
- quem aceita pagar

Nem todo psicólogo vai querer transcript e IA.

### Tese comercial

Você ainda precisa provar:

- vende por confiança?
- por economia de tempo?
- por telehealth?
- por all-in-one?

Se a mensagem de venda ficar difusa, a adoção piora.

### Operação de suporte

Você ainda precisa prever:

- quem ajuda o terapeuta quando a sessão falha?
- quem responde incidente?
- quem acompanha billing quebrado?
- quem faz suporte no onboarding?

### Política real do transcript bruto

Esse ponto é mais sério do que parece.

Você precisa decidir com muita clareza:

- o transcript bruto fica quanto tempo?
- vira parte do prontuário ou não?
- quando é descartado?
- quem pode ver?

Se isso ficar mal resolvido, vira risco jurídico e risco de produto.

## 6. O que faria eu matar a ideia cedo

Eu abortaria ou pivotaria cedo se, no beta:

- psicólogos gostarem da demo, mas não usarem semanalmente
- o tempo de revisão clínica continuar alto
- o medo jurídico continuar maior que a percepção de valor
- o paciente tiver muita fricção para entrar na sessão
- o custo por sessão comer demais a margem

## 7. O que faria eu continuar investindo

Eu dobraria a aposta se o beta mostrar:

- uso recorrente real
- terapeuta fechando prontuário mais rápido
- confiança explícita na postura de segurança
- baixa fricção no fluxo do paciente
- margem que permita escalar

## 8. Conclusão brutal

O projeto pode dar muito certo, mas `não é um projeto naturalmente fácil`.

O risco não é “não conseguir construir”.

O risco é:

- construir algo sofisticado
- caro
- bonito
- tecnicamente correto

e mesmo assim não conseguir:

- adoção
- confiança
- retenção
- margem

## 9. Regra estratégica recomendada

Antes de expandir escopo, provar estas quatro coisas:

1. o terapeuta usa de verdade
2. a revisão clínica economiza tempo real
3. o paciente consegue operar sem fricção relevante
4. a economia da sessão fecha
