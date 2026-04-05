# Investigação Oficial: Gravação, Transcrição e Registro Auxiliar

## 1. Pergunta investigada

Precisamos garantir se `transcrição em bullet points` a partir da sessão realmente `não pode` ser feita, ou se ela é possível dentro de determinadas condições regulatórias e éticas.

## 2. Conclusão curta

Com base nas fontes oficiais que encontrei:

- `não existe`, nas fontes consultadas, uma proibição geral do CFP à gravação de sessões
- ao contrário, há orientação oficial do CFP dizendo que a gravação pode ocorrer `em casos necessários`, com ciência, concordância e objetivo claros para a pessoa atendida
- também há base normativa para `registro documental sigiloso` separado do prontuário

Portanto:

- eu `não consigo sustentar`, com base oficial, a frase `isso realmente não pode ser feito`
- o que eu consigo sustentar é:
  - `pode ser possível em tese`
  - `não é permitido de forma irrestrita`
  - `pode estar proibido no contexto específico do terapeuta`, se houver termo contratual, política institucional, supervisor, clínica, convênio ou serviço-escola vedando gravador/captura

## 3. O que o CFP oficial diz sobre gravação

O CFP tem FAQ oficial intitulada `É permitido gravar as sessões de atendimento?`

O texto diz, em essência, que:

- o psicólogo deve respeitar o sigilo profissional
- deve avaliar a necessidade da gravação conforme sua abordagem
- em caso de necessidade, deve se certificar de que o paciente:
  - tem ciência da gravação
  - concorda com ela
  - conhece o objetivo da gravação
- a regra geral continua sendo resguardar a intimidade

Fonte oficial:

- CFP: https://site.cfp.org.br/faq/e-permitido-gravar-as-sessoes-de-atendimento/

## 4. O que isso significa para transcrição com IA

### Inferência regulatória

Não encontrei, nas fontes oficiais consultadas, um texto do CFP dizendo expressamente:

- `IA transcription de sessão pode`

ou

- `IA transcription de sessão não pode`

Então a leitura precisa ser feita por inferência:

- se o CFP admite gravação em casos necessários e com ciência/concordância/objetivo definidos
- e se a transcrição depende da captura do conteúdo da sessão

então a transcrição com IA `não parece proibida em tese por uma regra geral do CFP`

Mas:

- ela entra em um nível mais sensível de tratamento de dados
- e exige leitura combinada de `sigilo profissional + LGPD + contrato/local de trabalho + desenho técnico`

## 5. O que a LGPD muda

Dados de saúde são `dados pessoais sensíveis`.

Fonte oficial:

- LGPD, art. 5º, II: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm

O tratamento de dados pessoais sensíveis exige base legal adequada e mais rigor.

Fonte oficial:

- LGPD, art. 11: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm

Na prática, isso significa que uma feature de transcrição com IA não pode ser tratada como simples conveniência de produto.

Ela exige, no mínimo:

- finalidade específica
- necessidade real
- minimização
- transparência
- segurança forte
- controle sobre fornecedores
- política de retenção

## 6. O que a Resolução CFP nº 001/2009 mostra

Essa resolução é muito importante porque ela mostra que a profissão já admite `registro documental` sigiloso, inclusive informatizado, separado do prontuário em certas hipóteses.

### Pontos centrais

O art. 1º torna obrigatório o registro documental da prestação de serviços psicológicos quando ele não puder ser mantido prioritariamente como prontuário psicológico.

O § 1º diz que o registro documental em papel ou informatizado:

- tem caráter sigiloso
- contempla de forma sucinta o trabalho prestado
- descreve evolução e procedimentos adotados

O art. 5º diz que, quando esse registro for realizado na forma de prontuário, fica garantido ao usuário ou representante legal `acesso integral` às informações registradas em seu prontuário.

Fonte oficial:

- Resolução CFP nº 001/2009: https://site.cfp.org.br/wp-content/uploads/2009/04/resolucao2009_01.pdf

## 7. O que isso significa para o seu desenho de produto

### Sim, um registro auxiliar é juridicamente plausível

Pelo que a Resolução 001/2009 mostra, existe base para um `registro documental sigiloso` que não seja simplesmente o prontuário aberto ao usuário.

Então o desenho abaixo parece defensável em tese:

- `prontuário oficial`
- `registro auxiliar sigiloso de trabalho`
- `IA atuando sobre esse registro auxiliar`
- `publicação controlada do que vai para o prontuário`

### Mas há um limite importante

Se esse registro auxiliar guardar conteúdo clínico substantivo por longo prazo, ele continua sendo:

- dado clínico sigiloso
- registro profissional sensível

Então ele não é um “CRM qualquer”.

Ele precisa herdar:

- sigilo
- segurança
- controle de acesso
- retenção
- governança

## 8. O que o CRP diz sobre prontuário eletrônico

O CRP 16 afirma oficialmente:

- não há impedimentos para uso de prontuário eletrônico por psicólogos
- desde que os princípios do Código de Ética e das resoluções sejam respeitados
- e sugere chaves de acesso exclusivo para psicologia, para resguardar o sigilo

Fonte oficial:

- CRP 16: https://transparencia.cfp.org.br/crp16/pergunta-frequente/registro-em-prontuario/

## 9. Resposta objetiva à pergunta do produto

### Pergunta

`Precisamos garantir que transcrição em bullet points realmente não pode ser feita?`

### Resposta

Não.

Pelas fontes oficiais consultadas, eu não consigo afirmar que `realmente não pode`.

O que eu consigo afirmar é:

- `não há base oficial encontrada para uma proibição geral do CFP`
- `há base oficial para gravação em casos necessários, com ciência e concordância`
- `há base oficial para registro documental sigiloso separado do prontuário`

Logo, a tese de transcrição assistida `continua viva em tese`.

## 10. O que ainda impede um “sim definitivo”

### 1. Termo específico do terapeuta

Se ele assinou documento proibindo gravador, precisamos ver o texto.

Diferença crítica:

- proibir `gravação`
- proibir `captura de áudio`
- proibir `armazenamento`
- proibir `qualquer meio eletrônico de registro`

não são exatamente a mesma coisa

### 2. Ausência de texto oficial específico do CFP sobre IA transcription

Não encontrei norma oficial do CFP tratando diretamente de:

- IA ouvindo sessão
- speech-to-text clínico
- ambient AI em psicoterapia

Então a conclusão aqui é uma `inferência regulatória`, não uma autorização textual expressa.

### 3. Necessidade de parecer jurídico aplicado ao modelo

Mesmo que o CFP não proíba em abstrato, o seu produto ainda precisará validar:

- base legal LGPD
- contrato com suboperadores
- retenção
- acesso
- descarte
- consentimento

## 11. Recomendação pragmática

Eu faria assim:

1. `não matar` ainda a hipótese de transcription
2. tratar transcription como `feature opcional e condicional`
3. obter o `texto exato` do termo assinado pelo terapeuta
4. submeter o fluxo a revisão jurídica especializada
5. manter em paralelo uma trilha de `IA sobre notas do terapeuta`, para o caso de contextos onde áudio seja vedado

## 12. Posição final

Minha posição honesta, com base oficial:

- `não, eu não consigo garantir que é proibido`
- `sim, há elementos oficiais para dizer que pode ser possível em certos contextos`
- `não, isso ainda não é um “sim automático” para o seu produto`
- `o ponto decisivo agora é o texto do termo e a revisão jurídica aplicada`

## 13. Fontes oficiais usadas

- CFP FAQ sobre gravação de sessões: https://site.cfp.org.br/faq/e-permitido-gravar-as-sessoes-de-atendimento/
- Resolução CFP nº 001/2009: https://site.cfp.org.br/wp-content/uploads/2009/04/resolucao2009_01.pdf
- Código de Ética Profissional do Psicólogo: https://site.cfp.org.br/wp-content/uploads/2012/07/codigo-de-etica-psicologia-1.pdf
- Resolução CFP nº 06/2019 comentada: https://site.cfp.org.br/wp-content/uploads/2019/09/Resolu%C3%A7%C3%A3o-CFP-n-06-2019-comentada.pdf
- CRP 16 sobre prontuário eletrônico: https://transparencia.cfp.org.br/crp16/pergunta-frequente/registro-em-prontuario/
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
