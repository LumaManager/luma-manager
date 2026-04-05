# IA Sem Gravação da Sessão

## 1. Pergunta de origem

Se a(o) terapeuta assinou termo dizendo que não pode usar gravador nem gravar sessões, como usar IA?

## 2. Resposta curta

Sem rodeio:

- se `não pode capturar áudio da sessão`, então `não pode existir transcript automático da conversa`
- qualquer solução de IA que dependa de `ouvir`, `transcrever` ou `capturar` o áudio da sessão deixa de ser um workaround real

Em outras palavras:

- `ambient AI` deixa de ser viável nesse contexto
- o caminho passa a ser `IA sobre notas do terapeuta`, não sobre a fala bruta da sessão

## 3. Regra prática

Se o termo proíbe gravador, eu trataria como proibido também:

- gravar áudio
- gravar vídeo com áudio
- rodar transcription ao vivo da conversa
- usar ferramenta que "não grava mas escuta", se houver captura do áudio da sessão

Isso porque, na prática, ainda existe `tratamento de conteúdo sensível da sessão`.

## 4. O que continua possível

### Caminho mais seguro

Usar IA em cima de material `produzido pela própria terapeuta`, por exemplo:

- bullets escritos após a sessão
- campos estruturados preenchidos pela terapeuta
- resumo manual curto
- evolução clínica digitada pela terapeuta

Depois disso, a IA pode:

- organizar o texto
- sugerir estrutura
- sugerir continuidade do caso
- transformar bullets em draft
- recuperar contexto longitudinal dos registros anteriores

## 5. Workarounds reais que fazem sentido

### Opção 1: pós-sessão assistido por texto

Fluxo:

1. terapeuta termina a sessão
2. terapeuta escreve bullets curtos
3. IA organiza em draft clínico
4. terapeuta revisa e aprova

Esse é o caminho mais defensável.

### Opção 2: formulário estruturado pós-sessão

Em vez de campo livre, a terapeuta preenche:

- resumo
- tópicos centrais
- sinais relevantes
- continuidade
- pendências

A IA transforma isso em texto final mais bem redigido.

### Opção 3: contexto longitudinal sem ouvir a sessão

Mesmo sem transcript, a IA ainda pode ajudar com:

- retomada da última sessão
- linha do caso
- pendências abertas
- sugestões de follow-up

Baseando-se apenas em:

- prontuários aprovados anteriores
- documentos
- dados operacionais autorizados

### Opção 4: ditado pós-sessão

Só faz sentido se o termo permitir gravação `fora da sessão em si` e sem captura da fala do paciente em tempo real.

Mesmo assim, isso exigiria validação jurídica e contratual antes.

Se houver dúvida, não usar.

## 6. O que eu não chamaria de workaround aceitável

- "não grava, só transcreve ao vivo"
- "fica em memória e depois apaga"
- "não salva o áudio, só salva o texto"
- "usa IA local durante a sessão"

Se houve captura da conversa da sessão, isso ainda pode entrar no campo proibido pelo termo e no campo sensível da LGPD.

## 7. Impacto estratégico no produto

Isso muda bastante a tese do produto.

### Se o ICP proíbe gravação/captura de áudio

Então o produto não deve nascer com promessa principal de:

- transcript automático da sessão
- ambient note taker
- resumo automático a partir da fala bruta

### A promessa correta passa a ser

- prontuário assistido
- organização do pós-sessão
- draft a partir de notas do terapeuta
- memória longitudinal do caso
- compliance forte

## 8. O que isso muda no posicionamento

### Posicionamento ruim

- "a IA escuta a sessão e escreve tudo para você"

### Posicionamento melhor

- "a IA ajuda a transformar suas notas em registro clínico consistente, com revisão humana e contexto longitudinal"

## 9. Risco de produto

Se muitos psicólogos tiverem restrição contratual, ética institucional ou pessoal contra gravação/captura da sessão, então:

- a tese de transcript como núcleo do SaaS perde força
- o produto precisa se sustentar sem ambient listening

Isso não mata o projeto.

Mas muda o centro de valor.

## 10. Base normativa e documental usada para calibrar esta resposta

### Psicologia mediada por TDICs

Os serviços psicológicos por TDIC seguem o mesmo rigor ético e técnico do presencial.

Fonte:

- CRP 16, referência à Resolução CFP nº 009/2024: https://transparencia.cfp.org.br/crp16/pergunta-frequente/atendimento-online/

### Registro documental continua obrigatório

O caderno do CFP de 2023 reforça que os registros documentais e o prontuário decorrentes da prestação de serviços psicológicos, virtual ou presencial, são obrigatórios.

Fonte:

- Caderno do CFP sobre psicoterapia: https://site.cfp.org.br/wp-content/uploads/2023/06/caderno_reflexoes_e_orientacoes_sobre_a_pratica_de_psicoterapia.pdf

### LGPD

Dados ligados à saúde são dados pessoais sensíveis.

Fonte:

- Lei nº 13.709/2018, art. 5º, II: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm

## 11. Recomendação objetiva

Se você quiser um caminho defensável agora, eu recomendaria:

1. abandonar a dependência de transcript automático como premissa do MVP
2. desenhar a IA para trabalhar sobre `notas estruturadas do terapeuta`
3. validar com profissionais se isso já gera ganho real de tempo
4. só reabrir o tema de áudio se houver base contratual, ética e jurídica muito clara
