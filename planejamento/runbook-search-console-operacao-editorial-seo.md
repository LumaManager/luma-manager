# Runbook de Search Console e Operacao Editorial SEO

## 1. Objetivo

Este runbook define a operacao pratica de Search Console e da rotina editorial/SEO pos-publicacao para o site publico do SaaS de psicologos.

Ele complementa:

- [plano-de-aquisicao-site-publico-e-ga4.md](./plano-de-aquisicao-site-publico-e-ga4.md)
- [backlog-tecnico-aquisicao-web.md](./backlog-tecnico-aquisicao-web.md)

O objetivo nao e "produzir conteudo". O objetivo e:

- indexar as paginas certas
- entender quais consultas estao trazendo demanda real
- decidir quando melhorar, consolidar ou descartar uma pagina
- usar Search Console e GA4 como um unico loop de decisao

---

## 2. O que esta sob controle deste runbook

Este runbook cobre apenas operacao editorial e SEO pos-publicacao:

- Search Console
- sitemap
- inspeccao de URLs
- monitoramento de indexacao
- rotina semanal
- rotina mensal
- decisao de refresh de paginas
- uso combinado de Search Console e GA4

Nao cobre:

- implementacao de codigo no app
- campanhas pagas
- automacao de CRM
- operacao comercial de demos

---

## 3. Setup inicial

### 3.1 Propriedade correta

Confirmar que o dominio principal do site esta cadastrado no Search Console como propriedade de dominio.

Validar:

- dominio correto
- protocolo correto nao importa quando a propriedade e de dominio
- versao canonica do site publicamente acessivel

### 3.2 Sitemap

O sitemap precisa apontar apenas para URLs que devem ser indexadas.

Checklist:

- home incluida
- paginas de solucao incluidas
- pagina de pricing incluida
- pagina de demo incluida
- pagina de seguranca e privacidade incluida
- blog e artigos incluidos quando publicados
- rotas com token, login, portal e areas internas excluidas

### 3.3 Canonical e indexacao

Antes de olhar performance, confirmar que:

- cada pagina indexavel tem canonical coerente
- paginas sensiveis estao com `noindex`
- nao existe conflito entre sitemap, robots e metadata

### 3.4 GA4 conectado

Search Console nao deve ser lido sozinho.

O GA4 precisa estar ativo para:

- medir engajamento de conteudo
- medir cliques em CTA
- medir `generate_lead`
- medir sinais de qualidade de pagina

---

## 4. Submissao de sitemap

### 4.1 Quando submeter

Submeter o sitemap:

- na ativacao inicial da propriedade
- depois de adicionar um conjunto relevante de paginas indexaveis
- sempre que a estrutura de URLs mudar de forma material

### 4.2 Como submeter

Passo a passo:

1. Abrir Search Console.
2. Selecionar a propriedade correta.
3. Entrar em `Sitemaps`.
4. Enviar a URL do sitemap atual.
5. Confirmar que o status saiu de pendente para processado.

### 4.3 O que verificar depois

Depois do envio, verificar:

- se o sitemap foi lido sem erro
- quantas URLs foram descobertas
- se as paginas principais estao entrando no indice
- se existe discrepancia entre URLs enviadas e URLs indexadas

### 4.4 Regra pratica

Se uma pagina esta no sitemap e nao indexa depois de um tempo razoavel, o problema costuma estar em um destes pontos:

- conteudo raso
- canonical inconsistente
- indexacao bloqueada
- pouco valor percebido pelo Google
- pagina ainda sem links internos suficientes

---

## 5. Inspecao de URLs

### 5.1 O que inspecionar primeiro

Prioridade de inspecao:

1. home
2. paginas de conversao
3. paginas de solucao com maior potencial comercial
4. artigos novos
5. paginas com suspeita de canonical ou `noindex`

### 5.2 Quando inspecionar

Inspecionar uma URL quando:

- ela foi publicada ha pouco tempo
- ela recebeu mudanca relevante de titulo, copy ou estrutura
- ela perdeu impressao sem motivo claro
- ela nao apareceu em indexacao mesmo estando no sitemap
- ela entrou em conflito com outra pagina para a mesma intencao

### 5.3 O que observar na inspeccao

Na URL inspection, olhar sempre:

- se a URL esta indexada
- se a canonical escolhida pelo Google bate com a esperada
- se o rastreamento foi bem sucedido
- se existe algum bloqueio de indexacao
- se ha diferenca entre `user-declared canonical` e `Google-selected canonical`

### 5.4 Decisao apos a inspecao

Depois da inspeccao, classificar a pagina em um destes estados:

- ok para seguir acumulando impressao
- precisa de mais links internos
- precisa de refresh de copy/titulo
- precisa de consolidacao com outra pagina
- nao deve indexar

---

## 6. Rotina semanal

### 6.1 Objetivo da semana

Toda semana o foco e responder:

- quais consultas novas surgiram
- quais paginas ganharam ou perderam tracao
- quais paginas merecem acao imediata

### 6.2 Roteiro semanal

1. Abrir Search Console e ver `Performance`.
2. Filtrar por `Queries`.
3. Separar consultas por intencao:
   - comercial
   - informacional
   - comparativa
   - confianca / compliance
4. Abrir `Pages` e identificar quais URLs estao recebendo impressao.
5. Verificar `CTR` e `position` das paginas mais importantes.
6. Abrir GA4 para conferir comportamento das mesmas paginas.
7. Registrar as 3 a 5 acoes da semana.

### 6.3 O que procurar nas queries

Priorizar consultas que indiquem:

- software para psicologos
- prontuario eletrnico para psicologos
- agenda para psicologos
- seguranca e privacidade
- comparacoes com planilha, WhatsApp ou ferramentas soltas
- duvidas sobre LGPD, consentimento e teleatendimento

### 6.4 O que fazer com cada achado

Se a query tem impressao e CTR baixo:

- revisar title
- revisar meta description
- revisar alinhamento da pagina com a intencao

Se a query tem impressao e a pagina errada esta ranqueando:

- adicionar links internos para a pagina certa
- reforcar topicos e anchors
- considerar consolidacao de conteudo

Se a query e comercial mas a pagina ainda nao existe:

- abrir issue para nova pagina
- colocar no backlog editorial

Se a pagina indexa mas nao engaja:

- revisar dobrada inicial
- revisar CTA
- revisar prova de confianca

---

## 7. Rotina mensal

### 7.1 Objetivo do mes

Todo mes a analise precisa responder:

- quais paginas merecem refresh
- quais clusters merecem novas paginas
- quais paginas estao canibalizando entre si
- onde o site esta ganhando ou perdendo autoridade

### 7.2 Roteiro mensal

1. Exportar desempenho do Search Console por pagina.
2. Cruzar com GA4 para ver engagement e conversao.
3. Mapear paginas com:
   - impressao alta e CTR baixa
   - CTR boa e conversao baixa
   - posicao entre 8 e 20
   - queda de impressao por 2 janelas seguidas
4. Revisar titles e descriptions das paginas mais sensiveis.
5. Revisar consolidacao de paginas semelhantes.
6. Definir o proximo pacote editorial.

### 7.3 Perguntas de decisao mensal

- esta pagina merece ser melhorada ou substituida?
- existe uma pagina melhor para a mesma intencao?
- o conteudo esta respondendo o que o usuario realmente quis encontrar?
- a pagina esta atraindo a consulta certa mas falhando no CTA?
- a pagina esta falando com o ICP certo?

---

## 8. Como decidir refresh de paginas

### 8.1 Sinais de refresh

Uma pagina merece refresh quando um ou mais sinais aparecem:

- posicao caindo
- CTR abaixo do esperado para a posicao
- query principal mudou
- a pagina envelheceu em relacao ao mercado
- a oferta mudou e a pagina nao acompanhou
- o GA4 mostra baixa profundidade de engajamento

### 8.2 Tipos de refresh

#### Refresh leve

Usar quando a pagina esta boa, mas pouco eficiente.

Ajustes tipicos:

- title
- description
- H1
- ordem dos blocos
- CTA principal

#### Refresh medio

Usar quando a pagina ainda serve a intencao, mas a resposta ficou incompleta.

Ajustes tipicos:

- introduzir seccao nova
- melhorar provas de confianca
- incluir FAQ
- reforcar links internos
- atualizar screenshots ou exemplos

#### Refresh forte

Usar quando a pagina virou uma oportunidade nova, ou quando a pagina atual esta desalinhada com a intencao real.

Ajustes tipicos:

- reescrever a pagina quase inteira
- mudar a focalizacao da keyword
- consolidar com outra URL
- criar novo cluster e redirecionar foco editorial

### 8.3 Regra de consolidacao

Consolidar paginas quando:

- duas URLs brigam pela mesma intencao
- nenhuma delas ranqueia bem
- ambas ficam rasas demais separadamente

Em geral, e melhor ter uma pagina forte por intencao do que duas medias competindo entre si.

---

## 9. Operacao editorial pos-publicacao

### 9.1 Fluxo de uma nova pagina

Toda pagina nova deve seguir este fluxo:

1. publicar
2. inspecionar URL
3. submeter ou revalidar sitemap
4. criar links internos para a pagina
5. acompanhar impressao e CTR nas duas primeiras semanas
6. decidir se a pagina precisa de ajuste antes de criar outra parecida

### 9.2 Regras editoriais

- nao publicar pagina sem intencao clara
- nao publicar pagina sem CTA
- nao publicar pagina sem title e description definidos
- nao publicar pagina sem link interno de entrada
- nao publicar pagina so para "encher blog"

### 9.3 Estrutura recomendada para artigos

Artigos devem:

- responder uma duvida real
- conectar com uma pagina transacional
- apontar para uma proxima acao concreta
- evitar excesso de generalidade

Cada artigo precisa ter:

- foco em uma intencao
- link para a pagina de solucao relacionada
- CTA contextual

---

## 10. Como usar Search Console e GA4 juntos

### 10.1 Papel de cada ferramenta

#### Search Console

Mostra:

- para qual consulta a pagina aparece
- quantas impressões ela ganha
- qual o CTR
- qual a posicao media
- se a pagina foi indexada como esperado

#### GA4

Mostra:

- o que o usuario faz depois do clique
- se a pagina engaja
- se o CTA recebe acao
- se a pagina leva a lead

### 10.2 Leitura combinada

#### Caso 1: muitas impressões, pouco clique

Leitura:

- o Google entendeu a pagina
- o usuario nao achou o snippet atraente

Acoes:

- revisar title
- revisar description
- revisar alinhamento de promessa

#### Caso 2: bom CTR, pouco engajamento no GA4

Leitura:

- a promessa do snippet funciona
- a pagina nao entrega o que o usuario esperava

Acoes:

- revisar primeira dobra
- revisar prova de valor
- revisar coerencia entre consulta e conteudo

#### Caso 3: engajamento bom, mas sem lead

Leitura:

- a pagina interessa, mas nao converte

Acoes:

- reforcar CTA
- reduzir friccao
- tornar a oferta mais explicita

#### Caso 4: lead bom, mas sem impressao

Leitura:

- a pagina converte, mas ainda nao ganha distribuicao organica

Acoes:

- melhorar linking interno
- melhorar indexacao
- ampliar cobertura de queries

### 10.3 Pareamento minimo de dados

Toda analise mensal deveria cruzar:

- pagina no Search Console
- pagina no GA4
- evento principal da pagina
- objetivo da pagina

Exemplo:

- pagina de demo
- query comercial
- `cta_click`
- `generate_lead`

---

## 11. Decisoes praticas por tipo de pagina

### 11.1 Pagina de solucao

Exemplo:

- `/software-para-psicologos`

O que medir:

- impressao da keyword principal
- CTR da query principal
- clique no CTA
- tempo e engajamento

### 11.2 Pagina editorial

Exemplo:

- `/blog/como-escolher-software-para-psicologo`

O que medir:

- queries de topo e meio
- rolagem
- clique para pagina de solucao
- assistencia para conversao

### 11.3 Pagina de confianca

Exemplo:

- `/seguranca-e-privacidade`

O que medir:

- acesso a partir de paginas de produto
- aumento de clique em demo apos visita
- saida reduzida na pagina de pricing ou demo

---

## 12. Lista semanal de saida

Ao final de cada semana, registrar:

- top 5 queries novas
- top 5 paginas por impressao
- 3 paginas com CTA fraco
- 3 acoes priorizadas
- 1 pagina candidata a refresh
- 1 nova pagina candidata a criar

Esse registro deve ser curto o suficiente para virar decisao, nao um relatorio longo sem uso.

---

## 13. Lista mensal de saida

Ao final de cada mes, registrar:

- paginas que entraram no indice
- paginas que perderam posicao
- paginas que merecem consolidacao
- clusters que precisam de nova cobertura
- paginas que devem ser reescritas
- hipoteses para o proximo mes editorial

---

## 14. Critérios de sucesso

Este processo esta funcionando quando:

- o sitemap reflete somente URLs validas
- paginas novas entram em indexacao sem retrabalho manual excessivo
- Search Console vira insumo semanal, nao consulta eventual
- GA4 mostra se a pagina realmente gera acao
- refreshes sao feitos por sinais, nao por opiniao
- o editorial publica menos paginas, mas com mais intencao e melhor qualidade

---

## 15. Regra final

Se a pagina:

- recebe impressao
- responde a uma intencao valida
- gera algum engajamento

ela merece ser melhorada antes de ser descartada.

Se a pagina:

- nao recebe impressao
- nao responde uma intencao clara
- nao tem CTA ou nao gera acao

ela deve ser consolidada, reescrita ou removida do plano editorial.
