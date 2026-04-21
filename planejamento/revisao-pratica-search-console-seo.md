# Revisao Pratica de Search Console e SEO Editorial

## 1. Objetivo

Este documento transforma Search Console em rotina de decisao. O foco nao e "olhar grafico"; e decidir, toda semana, o que manter, melhorar, consolidar ou criar.

Ele foi escrito para o site publico ja implementado, com foco nas rotas atuais:

- `/`
- `/pricing`
- `/solicitar-demo`
- `/software-para-psicologos`
- `/prontuario-eletronico-para-psicologos`
- `/agenda-para-psicologos`
- `/teleatendimento-para-psicologos`
- `/documentos-e-consentimentos-para-psicologos`
- `/seguranca-e-privacidade`
- `/blog`
- `/blog/como-escolher-software-para-psicologo`
- `/blog/como-organizar-agenda-e-prontuario`
- `/blog/lgpd-para-psicologos-consultorio`
- `/comparar/planilha-e-whatsapp-vs-software`

Base de referencia:

- [plano-de-aquisicao-site-publico-e-ga4.md](./plano-de-aquisicao-site-publico-e-ga4.md)
- [backlog-tecnico-aquisicao-web.md](./backlog-tecnico-aquisicao-web.md)

## 2. O que este processo precisa responder

Toda rodada de leitura em Search Console deve terminar com respostas objetivas para estas perguntas:

- quais queries estao trazendo impressao real
- quais paginas estao recebendo impressao e clicando pouco
- qual pagina esta competindo com a intencao errada
- o que precisa de refresh de title, H1 ou copy
- o que precisa de link interno
- o que precisa ser consolidado
- o que ainda nao existe e merece nova pagina

## 3. O que revisar primeiro

### 3.1 Propriedade e base tecnica

Antes de olhar performance, confirmar:

- propriedade de dominio correta
- sitemap enviado e atualizado
- robots sem bloqueio indevido nas paginas publicas
- `noindex` nas rotas sensiveis
- canonical consistente em cada pagina indexavel

### 3.2 Paginas que devem ser inspecionadas primeiro

Ordem pratica:

1. home
2. `/software-para-psicologos`
3. `/solicitar-demo`
4. `/pricing`
5. `/seguranca-e-privacidade`
6. paginas de solucao por dor
7. artigos novos
8. comparativos

## 4. Rotina operacional

### 4.1 Diario, 10 minutos

Checar:

- paginas novas publicadas
- mensagens de indexacao
- quedas bruscas de impressao em paginas prioritarias
- paginas que ainda nao entraram no indice depois de publicadas

Acao:

- se a pagina nao indexou, inspecionar URL
- se indexou mas nao ganha impressao, aguardar janela razoavel e reforcar links internos
- se perdeu impressao sem motivo, verificar title, canonical e concorrencia interna

### 4.2 Semanal, 45 a 60 minutos

Fluxo:

1. Abrir `Performance`.
2. Olhar `Queries`.
3. Separar por intencao:
   - comercial
   - comparativa
   - operacional
   - confianca/compliance
4. Abrir `Pages`.
5. Cruzar query com URL.
6. Priorizar 3 a 5 acoes.

### 4.3 Mensal, 90 minutos

Objetivo:

- entender o que virou tracao
- decidir o que cresce
- decidir o que deve ser consolidado
- atualizar o calendario editorial do mes seguinte

## 5. Thresholds praticos

Use estes cortes para decidir acao:

| Situacao | Leitura | Acao |
|---|---|---|
| Muitas impressoes, CTR baixo | pagina relevante, snippet fraco | revisar title e meta description |
| Posicao 8 a 20, CTR baixo | existe tracao, falta empurrao | melhorar H1, subtitulos, prova social e link interno |
| Query certa aponta para pagina errada | arquitetura confusa | adicionar links para pagina certa ou consolidar |
| Pagina nova sem impressao apos prazo razoavel | descoberta lenta ou conteudo fraco | inspecionar URL, reforcar links e revisar densidade de topico |
| Query comercial sem pagina dedicada | oportunidade aberta | abrir nova pagina ou artigo de apoio |
| Conteudo informacional puxa termos comerciais | boa porta de entrada | criar link claro para pagina de conversao |

### Regra pratica de priorizacao

Se a pagina e importante para receita, a resposta deve vir de:

- title
- H1
- subtitulo inicial
- CTA
- prova de confianca
- linkagem interna

Nao comece por volume de texto.

## 6. Como ler as principais queries

### 6.1 `software para psicologo`

O que observar:

- a pagina `/software-para-psicologos` esta capturando a intencao principal?
- a home esta roubando impressao que deveria ir para a pagina core?
- o snippet comunica software para consultorio ou parece institucional demais?

Acao recomendada:

- reforcar a pagina core
- manter home como tese institucional
- usar links internos da home e do blog para a pagina principal

### 6.2 `prontuario`, `prontuario eletronico`, `prontuario para psicologos`

O que observar:

- a pagina de prontuario explica o ganho operacional de forma clara?
- o conteudo fala de seguranca e fluxo ou fica generico?

Acao recomendada:

- testar title com foco em prontuario eletronico para psicologos
- conectar com consentimentos, agenda e pos-sessao

### 6.3 `agenda para psicologo`

O que observar:

- a pagina mostra organizacao, lembretes e reducao de trabalho manual?
- o snippet fala da dor real do consultorio?

Acao recomendada:

- reforcar o uso no fluxo diario
- linkar com prontuario e demo

### 6.4 `LGPD`, `privacidade`, `seguranca`

O que observar:

- a pagina de seguranca e privacidade responde objetivamente ao risco?
- existe prova de postura do produto, e nao apenas texto juridico?

Acao recomendada:

- manter a pagina enxuta, clara e concreta
- usar como pagina de apoio a todas as rotas de conversao

### 6.5 `comparativo`, `planilha`, `whatsapp`, `melhor software`

O que observar:

- a pagina comparativa entrega contraste util?
- ha CTA claro para sair do status quo?

Acao recomendada:

- criar comparacoes objetivas, com workflow e risco operacional
- evitar texto de marketing vazio

## 7. Matriz de decisao por tipo de pagina

### 7.1 Paginas de conversao

Exemplos:

- `/software-para-psicologos`
- `/solicitar-demo`
- `/pricing`

Se tiverem CTR baixo:

- revisar title
- revisar meta description
- revisar CTA acima da dobra
- inserir prova social ou trust block

### 7.2 Paginas de solucao

Exemplos:

- `/prontuario-eletronico-para-psicologos`
- `/agenda-para-psicologos`
- `/teleatendimento-para-psicologos`
- `/documentos-e-consentimentos-para-psicologos`

Se a impressao subir mas o clique nao vier:

- simplificar o H1
- mover CTA para cedo
- reforcar beneficios concretos

### 7.3 Paginas de apoio

Exemplos:

- `/blog/como-escolher-software-para-psicologo`
- `/blog/como-organizar-agenda-e-prontuario`
- `/blog/lgpd-para-psicologos-consultorio`
- `/comparar/planilha-e-whatsapp-vs-software`

Se a pagina atrai consultas boas:

- adicionar blocos de link para a pagina core correspondente
- incluir FAQ curto
- apontar para demo ou pricing no fim

## 8. Regras de consolidacao

Consolidar quando:

- duas paginas disputam a mesma query
- a pagina errada esta ganhando impressao
- o conteudo ficou muito parecida entre si

Nao consolidar quando:

- as intencoes forem diferentes
- uma pagina for comercial e a outra comparativa
- uma for confianca e a outra for operacao

## 9. O que nao fazer

- nao criar pagina para cada variacao de keyword
- nao perseguir query sem intencao clara
- nao deixar login, invite ou area interna indexavel
- nao usar Search Console isolado do GA4
- nao tratar impressao baixa nos primeiros dias como fracasso
- nao abrir novo artigo antes de revisar a pagina core da mesma intencao

## 10. Saida esperada de cada revisao

Ao final de cada semana, produzir um registro curto com:

- consultas novas relevantes
- paginas que subiram
- paginas que precisam de refresh
- oportunidades de nova pagina
- decisoes de consolidacao

Esse registro alimenta o calendario editorial e o backlog tecnico.

