# Mapa Regulatório Oficial

Este arquivo consolida as fontes oficiais que sustentam a análise de licitude no Brasil.

## 1. LGPD e ANPD

### 1.1 Dados de saúde são dados pessoais sensíveis

Ponto prático:

- o produto trata dados sensíveis
- isso afeta prontuário, transcript, notas clínicas, dados de saúde mental, dados de crianças e logs que revelem contexto clínico

Fonte oficial:

- Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018, arts. 5º e 11: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm

### 1.2 Controlador e operador precisam ser definidos por fluxo

Ponto prático:

- não basta dizer genericamente que a plataforma é “apenas operadora”
- é preciso mapear fluxo a fluxo quem decide finalidade e meios essenciais

Fonte oficial:

- Lei nº 13.709/2018, art. 5º: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
- Guia orientativo da ANPD sobre agentes de tratamento e encarregado, publicado em 22/11/2024 e atualizado em 23/01/2025: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado

### 1.3 Crianças e adolescentes exigem melhor interesse como critério central

Ponto prático:

- o tratamento pode se apoiar nas hipóteses legais dos arts. 7º ou 11, mas o `melhor interesse` deve prevalecer no caso concreto
- isso impacta onboarding, autorização do responsável, retenção, visibilidade de dados e desenho de consentimentos

Fonte oficial:

- Enunciado CD/ANPD nº 1, de 22 de maio de 2023: https://www.in.gov.br/web/dou/-/enunciado-cd/anpd-n-1-de-22-de-maio-de-2023-485306934

### 1.4 Transferência internacional não pode ser tratada como detalhe

Ponto prático:

- uso de LLM, speech-to-text, analytics, e-mail ou storage fora do Brasil pode caracterizar transferência internacional
- isso exige mecanismo válido pela LGPD e revisão contratual dos suboperadores

Fonte oficial:

- Lei nº 13.709/2018, art. 33: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm
- Regulamento de Transferência Internacional de Dados, Resolução CD/ANPD nº 19/2024: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-regulamento-de-transferencia-internacional-de-dados

### 1.5 Incidentes de segurança têm rito próprio

Ponto prático:

- se houver incidente com risco ou dano relevante, o controlador deve comunicar ANPD e titulares
- o regulamento destaca sensibilidade maior quando há dados sensíveis, menores, dados financeiros, autenticação ou dados protegidos por sigilo
- os registros de incidentes devem ser mantidos por ao menos 5 anos

Fonte oficial:

- Resolução CD/ANPD nº 15/2024 e notícia oficial da ANPD em 26/04/2024: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca

## 2. CFP, CRPs e exercício profissional

### 2.1 Sigilo é eixo central

Ponto prático:

- conteúdo clínico não pode circular livremente dentro da empresa
- logs, suporte e analytics precisam ser desenhados para `metadata-first`

Fonte oficial:

- Código de Ética Profissional do Psicólogo, art. 9º: https://site.cfp.org.br/wp-content/uploads/2022/06/WEB_29535_Codigo_de_etica_da_profissao_14.04-1.pdf

### 2.2 Quaisquer meios de registro e observação exigem informação ao usuário

Ponto prático:

- esse ponto é central para gravação, transcrição e qualquer captura da sessão
- o produto não pode tratar áudio/transcript como mecanismo invisível

Fonte oficial:

- Código de Ética Profissional do Psicólogo, art. 14: https://site.cfp.org.br/wp-content/uploads/2022/06/WEB_29535_Codigo_de_etica_da_profissao_14.04-1.pdf

### 2.3 Atendimento de criança, adolescente ou interdito exige autorização de responsável

Ponto prático:

- o fluxo de onboarding e vínculo com responsável legal não é opcional

Fonte oficial:

- Código de Ética Profissional do Psicólogo, art. 8º: https://site.cfp.org.br/wp-content/uploads/2022/06/WEB_29535_Codigo_de_etica_da_profissao_14.04-1.pdf

### 2.4 Registro documental é obrigatório

Ponto prático:

- todo serviço psicológico deve ter registro documental
- o registro pode ser em papel ou informatizado
- ele tem caráter sigiloso
- deve contemplar, de forma sucinta, evolução e procedimentos adotados

Fonte oficial:

- Resolução CFP nº 001/2009: https://site.cfp.org.br/wp-content/uploads/2009/04/resolucao2009_01.pdf

### 2.5 Guarda mínima de 5 anos

Ponto prático:

- a guarda mínima de registro documental e prontuário é de 5 anos
- o prazo pode ser ampliado quando houver previsão legal, ordem judicial ou necessidade específica
- isso `não` responde sozinho como tratar áudio bruto, transcript bruto e rascunhos auxiliares

Fontes oficiais:

- FAQ CRP 16 sobre guarda de material privativo: https://transparencia.cfp.org.br/crp16/pergunta-frequente/guarda-de-material-privativo/
- FAQ CRP 10 sobre registro documental: https://transparencia.cfp.org.br/crp10/pergunta-frequente/registro-documental/

### 2.6 Prontuário eletrônico é admitido

Ponto prático:

- o uso de prontuário eletrônico é compatível com a regulação profissional
- o sigilo e o controle de acesso continuam obrigatórios

Fonte oficial:

- FAQ CRP 16 sobre registro em prontuário: https://transparencia.cfp.org.br/crp16/pergunta-frequente/registro-em-prontuario/

### 2.7 Atendimento por TDIC segue o mesmo rigor ético

Ponto prático:

- teleatendimento não é uma zona regulatória separada
- a obrigação de registrar, guardar e proteger continua valendo

Fonte oficial:

- FAQ CRP 12 sobre atendimento psicológico on-line: https://transparencia.cfp.org.br/crp12/pergunta-frequente/atendimentopsicologicoonline/
- FAQ CRP 16 sobre atendimento on-line: https://transparencia.cfp.org.br/crp16/pergunta-frequente/atendimento-online/

### 2.8 Gravação de sessão não está proibida em bloco

Ponto prático:

- a gravação pode ser admitida em casos necessários
- a pessoa atendida deve ter ciência, concordar e conhecer o objetivo
- isso não é liberação irrestrita; é permissão condicionada

Fonte oficial:

- FAQ CFP “É permitido gravar as sessões de atendimento?”: https://site.cfp.org.br/faq/e-permitido-gravar-as-sessoes-de-atendimento/

## 3. Pessoa jurídica e enquadramento institucional

### 3.1 Se a empresa prestar serviços de Psicologia, o tema CRP entra forte

Ponto prático:

- pessoa jurídica que presta serviços de Psicologia em razão da atividade principal deve ser registrada no CRP
- se a atividade for secundária, há obrigação de cadastramento

Fontes oficiais:

- CFP sobre Resolução nº 16/2019: https://site.cfp.org.br/cfp-publica-nova-resolucao-sobre-pessoa-juridica/
- Carta de serviços do CFP sobre registro de PJ: https://transparencia.cfp.org.br/carta-de-servicos/registro-de-pj/
- Carta de serviços do CFP sobre cadastro de PJ: https://transparencia.cfp.org.br/carta-de-servicos/cadastro-de-pj/

### 3.2 Inferência importante

Se a empresa `apenas fornece software`, isso é diferente de `prestar serviços psicológicos`.

Essa distinção é decisiva para o modelo de negócio e precisa ser preservada em:

- contrato
- marketing
- onboarding
- fluxo clínico
- operação de suporte

## 4. Fronteira ANVISA

### 4.1 O produto não deve nascer como software de decisão clínica

Leitura prática:

- se o produto for posicionado como agenda, prontuário, teleatendimento e documentação assistida, a tese regulatória é mais simples
- se ele passar a prometer diagnóstico, recomendação clínica automatizada ou suporte à decisão terapêutica, a fronteira com `software como dispositivo médico` precisa ser reavaliada

Fonte oficial:

- Perguntas e respostas da Anvisa sobre software como dispositivo médico: https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/produtos-para-a-saude/manuais/software-como-dispositivo-medico-perguntas-e-respostas/view

## 5. Leitura consolidada

As fontes oficiais sustentam uma posição pragmática:

1. `o produto pode existir`
2. `o produto não pode ser desenhado como SaaS genérico`
3. `a licitude depende da forma exata de posicionamento e do fluxo técnico`
4. `áudio, transcrição, prontuário e IA precisam de regras separadas`
