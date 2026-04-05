# Benchmark: HeyBerries / Berries

## 1. Objetivo

Investigar a empresa `HeyBerries` como benchmark do produto que queremos construir, entendendo:

- o que eles fazem
- como posicionam o produto
- quais funcionalidades parecem centrais
- o que isso valida na nossa tese
- o que ainda não pode ser importado automaticamente para o Brasil

## 2. Resumo executivo

A `Berries` se posiciona claramente como um `AI scribe for mental health professionals`.

Ela prova algumas coisas importantes:

- existe mercado real para documentação assistida por IA em saúde mental
- a narrativa `capture the session -> generate note -> review -> paste into EMR` já está sendo vendida
- `não armazenar gravações` é parte explícita da proposta de confiança
- o produto não depende de integração profunda com EHR/EMR para ser útil

Mas ela também mostra um limite importante para nós:

- o fato de funcionar nos EUA sob `HIPAA/PHIPA` `não resolve` automaticamente a viabilidade regulatória no Brasil sob `CFP + LGPD + contexto contratual local`

## 3. O que a Berries aparentemente faz

Com base no site oficial e no help center:

- captura sessões presenciais ou virtuais
- gera notas automaticamente
- gera treatment plans
- sugere ICD-10
- gera patient instructions / letters
- oferece pre-session highlights
- permite copiar o resultado para o EMR/EHR

### Leitura prática

O fluxo central deles parece ser:

1. começar sessão
2. capturar a conversa
3. encerrar sessão
4. revisar nota gerada
5. copiar para o prontuário/EMR

## 4. Posicionamento de produto

O posicionamento deles é muito claro:

- focado em `mental health`
- foco em `reduzir burden de documentação`
- promessa principal de `economia de tempo + mais atenção ao paciente`

Eles não se apresentam como EMR principal.

Se apresentam mais como:

- camada de captura
- camada de drafting
- camada de apoio documental

que depois se conecta ao sistema principal do profissional por `copy/paste` ou fluxo leve.

## 5. O que isso valida para nós

### 1. A tese de AI note-taking em saúde mental é real

Isso deixa de ser uma aposta puramente teórica.

Existe empresa operando exatamente nesse espaço e se apresentando de forma especializada para saúde mental.

### 2. O mercado aceita uma ferramenta especializada, não só EHR completo

Isso é importante porque reduz a necessidade de começar como suíte completa.

### 3. “Não armazenar gravações” é argumento central de confiança

Isso reforça uma coisa importante para o nosso produto:

- se formos seguir por áudio/transcrição, a estratégia de retenção mínima ou zero do bruto é parte central do valor, não detalhe técnico

### 4. Integração leve com EHR parece aceitável

Eles explicitam compatibilidade com EMRs e telehealth platforms, mas o help center indica fluxo de `copy note`.

Isso sugere:

- integração profunda não é pré-condição para utilidade

## 6. Sinais de produto observados

## 6.1 Narrativa de valor

A Berries vende:

- mais foco no paciente
- menos digitação durante a sessão
- mais velocidade documental

Isso é muito próximo da nossa tese desejada.

## 6.2 Especialização em mental health

Eles enfatizam:

- mental health templates
- insurance/compliance workflow
- treatment plan
- ICD-10

Isso mostra que especialização vertical parece ser parte relevante da diferenciação.

## 6.3 Segurança como peça de conversão

Eles destacam:

- HIPAA
- PHIPA
- SOC 2
- encryption
- recording not stored
- no training on customer data

Ou seja:

- a confiança não está escondida
- ela é parte explícita da venda

## 6.4 Produto browser-first

O help center diz que a ferramenta é acessível por browser em mobile e desktop.

Isso combina bem com a nossa decisão de `beta web-first`.

## 7. Pricing observado

Aqui existe uma inconsistência pública entre páginas:

- homepage recente mostra `Pro` a `US$ 79/mês`
- help center de pricing mostra `Pro` mensal a `US$ 99/mês`

Isso pode indicar:

- preço antigo vs novo
- página desatualizada
- campanha ou experimento comercial

Leitura prática para nós:

- ferramentas desse tipo parecem operar em ticket individual relevante
- o mercado pode aceitar `ticket mensal razoável` se o ROI de tempo for claro

## 8. Segurança e retenção observadas

Pontos públicos relevantes que eles afirmam:

- não armazenam gravações
- notas podem ser apagadas manualmente ou automaticamente após 30 dias
- dados criptografados em trânsito e repouso
- dados armazenados nos EUA
- BAA para clientes
- PHI não usado para treinar modelos

Isso é importante porque sugere uma arquitetura orientada a:

- mínimo de retenção do bruto
- confiança como feature

## 9. O que isso não prova para nós

## 9.1 Não prova viabilidade regulatória no Brasil

Mesmo que a Berries opere nos EUA e Canadá, isso não responde:

- CFP
- Código de Ética do psicólogo no Brasil
- LGPD aplicada ao nosso fluxo
- contrato específico assinado por terapeuta brasileiro

## 9.2 Não prova adequação para psicoterapia brasileira

O fato de funcionar em `mental health` nos EUA não significa automaticamente adequação para:

- psicólogo clínico no Brasil
- práticas locais
- linguagem documental local
- relação com prontuário sob regras brasileiras

## 9.3 Não prova que o modelo deles é economicamente saudável

Do lado de fora, conseguimos ver:

- features
- discurso
- preço

Não conseguimos ver:

- churn
- margem
- retenção
- qualidade real da nota

## 10. Leitura estratégica para o nosso produto

## 10.1 O que eu copiaria conceitualmente

- posicionamento especializado em saúde mental
- promessa de reduzir carga documental
- segurança como parte da narrativa de venda
- retenção mínima do bruto
- compatibilidade com sistemas existentes em vez de integração pesada no dia 1

## 10.2 O que eu não copiaria cegamente

- assumir que “não armazenar gravação” resolve sozinho o problema regulatório
- assumir que se é aceito nos EUA será aceito no Brasil
- assumir que nosso ICP aceitará áudio sem resistência

## 10.3 O que isso muda no nosso planejamento

Se decidirmos manter a tese de transcrição:

- devemos tratá-la como `feature condicional`
- com governança muito forte
- com retenção mínima
- com messaging de confiança tão forte quanto o valor funcional

Se tivermos bloqueio jurídico/contratual local:

- ainda assim a Berries continua útil como benchmark de `workflow`
- mas o nosso núcleo pode precisar migrar para `IA sobre notas do terapeuta`

## 11. Principais perguntas que a Berries nos ajuda a fazer

1. Nosso produto quer ser `EHR completo` ou `camada de inteligência documental`?
2. O Brasil permite o mesmo nível de captura de sessão que eles parecem usar?
3. Se não permitir, qual parte do workflow deles pode ser traduzida para `notas humanas + IA`?
4. O nosso diferencial vai ser:
   - transcript?
   - prontuário assistido?
   - compliance?
   - memória longitudinal?

## 12. Conclusão objetiva

A Berries é um benchmark muito relevante.

Ela valida fortemente:

- a dor
- a proposta de valor
- a narrativa de produto
- a importância de retenção mínima e confiança

Mas ela `não resolve` nossa dúvida regulatória central.

Conclusão prática:

- ela é prova de `viabilidade de mercado`
- não é prova de `viabilidade regulatória no Brasil`

## 13. Fontes usadas

- Homepage: https://heyberries.com/
- About: https://heyberries.com/about
- Security: https://heyberries.com/security
- Features: https://heyberries.com/features
- Help Center FAQ: https://help.heyberries.com/en/articles/10213888-frequently-asked-questions
- Help Center Getting Started: https://help.heyberries.com/en/articles/10340121-getting-started-with-berries
- Help Center Pricing: https://help.heyberries.com/en/articles/10333592-berries-pricing

---

## 14. Análise do produto testado ao vivo (março 2026)

Esta seção complementa o benchmark anterior com observações diretas do produto em uso real, via screenshots e consent form.

### 14.1 Fluxo real observado

O produto oferece 3 modos de entrada:

- `Live session` — captura ao vivo com microfone
- `Dictate summary` — terapeuta dita após a sessão
- `Generate from text` — terapeuta cola texto escrito
- `Upload audio file` — upload de áudio gravado separadamente

Isso confirma que o produto não depende exclusivamente de captura ao vivo. Modos alternativos existem.

### 14.2 Estrutura real da nota gerada

A nota gerada é uma nota clínica completa, muito além de bullet points:

| Seção | Conteúdo |
|---|---|
| Chief Complaint | Queixa principal |
| HPI | História da doença atual |
| Symptoms Recap | Lista numerada de sintomas |
| Sleep | Sono |
| Mood | Humor |
| Psychotherapeutic Interventions | Intervenções realizadas na sessão |
| Social History | Contexto social |
| Past Mental Health History | Histórico psiquiátrico completo |
| Substance Use History | Uso de substâncias |
| Vital Signs | Sinais vitais |
| Past Medical History | Histórico médico |
| Allergies | Alergias |
| Mental Status Exam | Exame do estado mental estruturado |
| Assessment | Avaliação clínica |
| Plan | Plano terapêutico |
| Follow Up | Próxima sessão e instruções |
| Risk Factors | Fatores de risco |

Cada seção tem botão `Magic edit` (edição assistida por IA) e `Copy section`.

### 14.3 Transcript disponível mas deletável

Após geração da nota, o transcript fica visível com botão `Delete` (vermelho).

Diferente do que afirmam sobre "não armazenar gravações" — o transcript em si fica disponível até o terapeuta deletar manualmente, ou até auto-delete em 30 dias.

Isso é diferente da nossa decisão de não reter transcript de forma alguma.

### 14.4 Diagnóstico sugerido por IA

Na aba `Diagnosis`, o produto sugere automaticamente códigos ICD-10:

- F43.2 Adjustment disorder
- F43.8 Other reactions to severe stress
- F41.1 Generalized anxiety disorder

Com botões: `Approve` / `Provisional` / `Reject`.

Decisão para o nosso produto: não implementar sugestão de CID. No Brasil, diagnóstico é ato exclusivo do psicólogo (CFP). Sugestão automática de CID cria risco regulatório e reduz confiança do terapeuta.

### 14.5 AI Assistant longitudinal

Painel lateral com assistant por paciente, com ações rápidas:

- Medication timeline
- Treatment response
- Diagnostic review
- Referral or coordination

É o equivalente ao que chamamos de "IA sobre registros anteriores aprovados". Já implementado por eles — é feature core, não diferencial.

### 14.6 Consent form real

O consent form disponibilizado pelo produto para o terapeuta entregar ao paciente afirma explicitamente:

> "The documents produced by the scribe are derived from session recordings, which are not stored and are automatically deleted after processing."

Pontos do consent form:

- Gravações não armazenadas, deletadas após processamento
- HIPAA compliant
- Dados criptografados em trânsito e repouso
- Notas podem ser deletadas manualmente ou auto-delete em 30 dias
- O paciente assina confirmando consentimento

Este modelo é diretamente adaptável ao Brasil, substituindo HIPAA por LGPD e adicionando:

- Base legal explícita (tutela da saúde ou consentimento)
- Direitos do titular (acesso, correção, portabilidade, revogação)
- Identificação do controlador e do operador

### 14.7 Pricing confirmado

- `$79/mês` com desconto anual (observado no produto)
- Sessões ilimitadas
- 20 sessões gratuitas no onboarding

### 14.8 Decisões do nosso produto derivadas desta análise

| Ponto observado no Berries | Nossa decisão |
|---|---|
| Nota clínica completa (17 seções) | Focar em resumo em tópicos — mais simples, menor risco |
| Transcript salvo com delete manual | Não salvar transcript — descarte automático |
| Sugestão de ICD automática | Não implementar — CFP proíbe diagnóstico por IA |
| AI assistant longitudinal | Implementar sobre registros aprovados pelo terapeuta |
| Consent form entregue pelo terapeuta | Adaptar para LGPD e disponibilizar no produto |
| $79/mês | Referência de preço para o mercado brasileiro |

---

## 15. Stack técnico identificado via DevTools (março 2026)

Análise das requisições de rede e logs do console durante uso real do produto.

### 15.1 Banco de dados: Firebase Firestore

Identificado por chamada direta do browser para:

```
firestore.googleapis.com/...projects/prior-auth-ai/databases/(default)/documents/appointmentsView/...
```

O Firestore faz chamadas client-side visíveis no Network, o que expõe o nome do projeto e a estrutura de dados.

### 15.2 Nome do projeto Firebase: `prior-auth-ai`

O projeto Firebase se chama **prior-auth-ai**, não "berries" nem "heyberries".

**"Prior authorization"** em healthcare americano é o processo burocrático de aprovação de plano de saúde antes de um procedimento médico. Isso indica que os fundadores provavelmente começaram com um produto de prior authorization e pivotaram para mental health notes. Eles não nasceram nesse mercado.

### 15.3 Criptografia client-side de dados do paciente

```
"patient_name": "U2FsdGVkX1/1YZBmIGWIExnT6qoGq9iXiKw9TIRhVuo="
```

O nome do paciente é **AES criptografado no browser** antes de ser enviado ao Firestore. O prefixo `U2FsdGVkX1` é característico do CryptoJS. Boa prática de privacidade — nem o Firebase vê o dado em claro.

### 15.4 Frontend: Next.js com RSC

Identificado pelo padrão `?_rsc=` nas requisições de navegação:

```
GET https://app.heyberries.com/?_rsc=vusbg
```

### 15.5 Pipeline de áudio: próprio backend

```
/api/audio/allchunk → HTTP 500
```

O áudio vai para o **próprio servidor deles**, não diretamente para OpenAI/AssemblyAI/Deepgram. O modelo de STT e LLM são chamados server-side — por isso o modelo não aparece nas requisições do browser.

### 15.6 Erro de API keys no cliente

```
One or more API keys are missing from environment variables.
```

Esse erro vem de um SDK sendo inicializado no cliente durante a sessão ao vivo. Os candidatos para SDK de STT com API key client-side são:

- **AssemblyAI** — tem SDK de real-time para browser
- **Deepgram** — tem SDK de real-time para browser

O STT provavelmente usa token temporário client-side para captura em tempo real. O LLM (geração da nota) é chamado server-side e não é identificável pelo browser.

### 15.7 Resumo do stack identificado

| Componente | Tecnologia identificada |
|---|---|
| Banco de dados | Firebase Firestore |
| Frontend | Next.js com RSC |
| Criptografia | AES client-side (CryptoJS) para dados do paciente |
| STT em tempo real | SDK client-side — provavelmente AssemblyAI ou Deepgram |
| LLM para geração da nota | Server-side — modelo não identificado |
| Origem histórica do produto | Pivotou de prior authorization para mental health |

### 15.8 O que isso significa para o nosso produto

- Firebase Firestore é uma escolha viável e rápida para MVP — eles validaram isso em produção
- Criptografia client-side de dados do paciente é uma boa prática replicável — especialmente relevante para LGPD
- O pipeline de áudio próprio (não SDK direto do browser para STT) reduz exposição de dados — considerar mesma arquitetura
- O LLM é opaco pelo browser — qualquer modelo pode ser trocado no backend sem que o cliente perceba

---

## 16. Observações confirmadas a partir da pasta local `Beries/` (março 2026)

Esta seção consolida o que foi confirmado por inspeção direta do material local em:

- screenshots do produto
- consent form em `.pdf` e `.docx`

### 16.1 O empty state deles é muito bem resolvido

Antes de qualquer nota existir, o produto conduz o terapeuta para uma primeira decisão simples:

- `Live session sample`
- `Dictate a sample session`
- link para `View a sample note`

Leitura prática:

- eles entendem que o maior risco de ativação é a tela vazia
- o onboarding de valor acontece por demonstração assistida, não por documentação longa

### 16.2 O produto real confirma estratégia multi-input

No ambiente real, o botão principal de sessão expõe mais de um caminho:

- `Start session`
- `Dictate summary`
- `Generate from text`
- `Upload audio file`

Isso confirma uma tese importante para nós:

- o produto deles `não depende exclusivamente` de captura ao vivo
- a utilidade principal está na `geração documental`, não no canal de entrada específico

### 16.3 A captura ao vivo usa permissões nativas do browser

As capturas locais mostram:

- pedido de permissão de microfone pelo browser
- fluxo de `share tab`
- opção de `share tab audio`

Leitura prática:

- o caminho de áudio deles depende fortemente das capacidades nativas do navegador
- isso reduz fricção de setup, mas cria uma superfície regulatória e de UX que precisa ser explicada com clareza

### 16.4 A arquitetura de produto deles é enxuta

A navegação principal observada é muito pequena:

- `Sessions`
- `Templates`
- `Clients`

Leitura prática:

- eles não tentam parecer um EHR completo
- o produto é uma `camada documental especializada`
- isso reforça a leitura de que o valor vem de foco, não de cobertura total

### 16.5 A nota gerada é profunda demais para o nosso recorte atual

As telas confirmam que a nota deles entra em profundidade ampla, com seções como:

- `Chief Complaint`
- `HPI`
- `Social History`
- `Past Mental Health History`
- `Plan`
- `Transcript`

Cada seção oferece:

- `Magic edit`
- `Copy section`

Leitura prática:

- eles vendem uma nota clínica quase completa
- isso é poderoso, mas também aumenta risco de erro, sobre-geração e atrito regulatório no Brasil
- nossa decisão de `resumo em tópicos` continua correta para o MVP

### 16.6 Transcript continua presente na experiência final

Uma das capturas mostra:

- transcript aberto ao final da nota
- aviso de que transcript pode conter erros
- botão explícito de `Delete`

Leitura prática:

- mesmo com discurso de “não armazenar gravações”, eles continuam tratando o transcript como artefato visível e manipulável
- isso reforça a nossa decisão de `não reter transcript bruto` no MVP brasileiro

### 16.7 O assistant longitudinal é parte visível do produto

O painel lateral do assistant aparece dentro da própria interface de produção e traz ações rápidas como:

- `Medication timeline`
- `Treatment response`
- `Diagnostic review`
- `Referral or coordination`

Leitura prática:

- memória longitudinal guiada por IA já é commodity nesse tipo de produto
- isso não será nosso diferencial isolado
- o diferencial precisa vir de `compliance brasileiro + UX correta + escopo certo`

### 16.8 Consentimento do paciente é parte operacional do produto

O menu do usuário expõe diretamente:

- `Patient consent form`

Leitura prática:

- consentimento não é tratado como documento externo “solto”
- ele é parte da operação do produto
- isso reforça nossa decisão de embutir documentos/consentimentos desde o núcleo do sistema

### 16.9 Conclusão adicional

O material local confirma quatro coisas importantes:

1. o Berries é, na prática, uma `camada documental browser-first`
2. o produto foi desenhado para ser `útil por múltiplos inputs`, não apenas ao vivo
3. o transcript ainda aparece como artefato operacional relevante
4. a simplicidade de navegação deles é uma força, não uma limitação

### 16.10 Impacto direto no nosso produto

- manter `modo texto/ditado` como caminho principal do MVP faz sentido
- manter `áudio/transcrição` como capability condicional faz sentido
- manter `resumo em tópicos` em vez de nota clínica extensa faz sentido
- tratar `consentimento` como fluxo nativo do produto faz sentido
- evitar inflar o web com áreas demais no primeiro corte faz sentido
