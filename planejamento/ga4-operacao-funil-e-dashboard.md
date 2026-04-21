# GA4 Operacional do Funil Publico

## 1. Objetivo

Este documento fecha a camada operacional do GA4 para o site publico do Luma Manager.

Ele foi escrito para responder quatro perguntas:

- quais paginas trazem visita qualificada
- quais conteudos assistem a geracao de demanda
- quais CTAs realmente movem o usuario para o proximo passo
- onde o funil quebra entre visita, inicio de formulario e lead

## 2. O que ja foi implementado no app

Hoje o front ja emite estes eventos:

- `marketing_page_view`
- `cta_click`
- `form_start`
- `generate_lead`
- `scroll_depth`
- `qualified_read`

Arquivos principais da instrumentacao:

- [gtag.ts](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/lib/analytics/gtag.ts)
- [marketing-page-context.ts](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/lib/analytics/marketing-page-context.ts)
- [marketing-page-view-tracker.tsx](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/components/analytics/marketing-page-view-tracker.tsx)
- [tracked-cta-link.tsx](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/lib/analytics/tracked-cta-link.tsx)
- [waitlist-form.tsx](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/components/marketing/waitlist-form.tsx)
- [public-demo-form.tsx](/Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura/apps/web/src/components/marketing/public-demo-form.tsx)

## 3. Mapa de eventos

### 3.1 `marketing_page_view`

Quando dispara:

- em toda rota publica do funil mapeada no catalogo de paginas

Serve para:

- separar visualizacao por cluster
- montar o funil por estagio
- comparar paginas de blog, comparacao, demo, pricing e solucao

Parametros principais:

- `source_path`
- `page_type`
- `page_cluster`
- `funnel_stage`
- `primary_intent`
- `content_kind`

### 3.2 `cta_click`

Quando dispara:

- em CTAs publicos instrumentados com `TrackedCtaLink`

Serve para:

- medir clique em CTA por pagina
- medir qual posicao converte melhor
- medir destino mais acionado

Parametros principais:

- `source_path`
- `destination_path`
- `cta_label`
- `cta_location`
- `page_type`
- `page_cluster`
- `funnel_stage`
- `primary_intent`

### 3.3 `form_start`

Quando dispara:

- no primeiro foco do formulario de waitlist
- no primeiro foco do formulario de demo

Serve para:

- medir abandono entre visita e intencao real
- medir se a pagina traz interesse suficiente para abrir o formulario

Parametros principais:

- `source_path`
- `form_name`
- `form_variant`
- `page_type`
- `page_cluster`
- `funnel_stage`
- `primary_intent`

### 3.4 `generate_lead`

Quando dispara:

- ao entrar na waitlist
- ao solicitar demo

Serve para:

- medir conversao principal do site publico
- comparar canais, paginas e conteudos pelo resultado final

Parametros principais:

- `source_path`
- `lead_type`
- `professional_role`
- `page_type`
- `page_cluster`
- `funnel_stage`
- `primary_intent`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

### 3.5 `scroll_depth`

Quando dispara:

- nos marcos de 25, 50, 75 e 90 por cento em artigos e comparacoes

Serve para:

- ver profundidade real de consumo
- comparar qualidade de leitura entre blog e comparacoes

Parametros principais:

- `content_kind`
- `content_path`
- `scroll_depth_percent`
- `threshold_percent`
- `max_scroll_depth_percent`

### 3.6 `qualified_read`

Quando dispara:

- artigo: ao atingir 60 por cento de profundidade e 45 segundos de leitura engajada
- comparacao: ao atingir 50 por cento de profundidade e 30 segundos de leitura engajada

Serve para:

- medir consumo realmente util
- ligar conteudo a CTA e lead sem depender de pageview bruto

Parametros principais:

- `content_kind`
- `content_path`
- `engaged_seconds`
- `max_scroll_depth_percent`
- `qualified_depth_percent`
- `qualified_seconds`

## 4. Custom Definitions para criar no GA4

Criar em `Admin > Data display > Custom definitions`.

### 4.1 Custom dimensions

Todas abaixo com escopo de evento:

| Nome no GA4 | Parametro | Por que criar |
|---|---|---|
| Page Type | `page_type` | separar home, solution, pricing, blog, comparison e demo |
| Page Cluster | `page_cluster` | comparar grupos de paginas sem depender de regex |
| Funnel Stage | `funnel_stage` | ler topo, meio e fundo de funil |
| Primary Intent | `primary_intent` | separar paginas de educacao, comparacao, confianca e pedido de demo |
| Source Path | `source_path` | analisar qual pagina originou clique, formulario ou lead |
| Destination Path | `destination_path` | ver para onde os CTAs empurram o trafego |
| CTA Label | `cta_label` | identificar a copia do CTA que mais move |
| CTA Location | `cta_location` | identificar a posicao do CTA que mais move |
| Lead Type | `lead_type` | separar waitlist de demo request |
| Professional Role | `professional_role` | entender qual perfil mais converte |
| Content Kind | `content_kind` | separar artigo de comparacao |
| Content Path | `content_path` | analisar leitura por URL de conteudo |
| Form Name | `form_name` | separar waitlist e demo |
| Form Variant | `form_variant` | comparar formulario embedded e standalone |

### 4.2 Custom metrics

Criar apenas as que vao para leitura operacional. Nao precisa registrar tudo.

| Nome no GA4 | Parametro | Unidade | Uso |
|---|---|---|---|
| Engaged Seconds | `engaged_seconds` | Standard | leitura qualificada por conteudo |
| Max Scroll Depth Percent | `max_scroll_depth_percent` | Standard | profundidade maxima por conteudo |
| Threshold Percent | `threshold_percent` | Standard | marcos de scroll acionados |

## 5. Key Events

Configurar em `Admin > Data display > Events`.

### 5.1 Marcar como key event agora

- `generate_lead`

Esse e o evento principal de negocio do site publico. Use este como referencia de conversao do funil.

### 5.2 Marcar como key event apenas se quiser microconversao editorial

- `qualified_read`

Use se voce quiser enxergar o blog e as comparacoes como parte do funil assistido.
Nao use este evento para otimizacao de midia paga como se fosse conversao final.

### 5.3 Nao marcar como key event

- `marketing_page_view`
- `cta_click`
- `form_start`
- `scroll_depth`

Esses eventos sao diagnosticos. Eles ajudam a localizar perda e ganho, nao a representar resultado final.

## 6. Painel operacional recomendado

Se puder escolher, use Looker Studio ligado ao GA4 para ter calculos e filtros mais claros.
Se quiser ficar dentro do GA4, replique isso em `Explore`.

### 6.1 Painel 1: Funil executivo

Objetivo:

- mostrar se o site esta virando lead

Blocos:

- usuarios com `marketing_page_view`
- usuarios com `form_start`
- usuarios com `generate_lead`
- taxa `form_start / marketing_page_view`
- taxa `generate_lead / form_start`
- taxa `generate_lead / marketing_page_view`

Quebras:

- `page_cluster`
- `funnel_stage`
- `source_path`
- `lead_type`

### 6.2 Painel 2: Conteudo assistido

Objetivo:

- mostrar quais artigos e comparacoes ajudam a empurrar para demo e lead

Blocos:

- `qualified_read` por `content_path`
- `cta_click` por `source_path` com filtro `source_path` contendo `/blog/` ou `/comparar/`
- `generate_lead` por `source_path`

Quebras:

- `content_kind`
- `content_path`
- `destination_path`

Leitura esperada:

- artigo ou comparacao forte gera `qualified_read`
- depois move para `cta_click`
- e parte desse trafego chega em `generate_lead`

### 6.3 Painel 3: CTAs

Objetivo:

- descobrir quais CTAs merecem ficar acima da dobra e quais posicoes estao mortas

Blocos:

- total de `cta_click`
- `cta_click` por `cta_location`
- `cta_click` por `cta_label`
- `cta_click` por `destination_path`

Quebras:

- `page_type`
- `page_cluster`
- `source_path`

### 6.4 Painel 4: Demo e captacao

Objetivo:

- olhar o fim do funil

Blocos:

- `form_start` com `form_name = demo_request`
- `generate_lead` com `lead_type = demo_request`
- `generate_lead` por `professional_role`
- `generate_lead` por `source_path`

Leitura esperada:

- se a pagina de demo tem pageview mas pouco `form_start`, o problema e a pagina
- se tem `form_start` mas pouco `generate_lead`, o problema e o formulario ou a proposta

## 7. Segmentos prontos para salvar

Criar estes segmentos logo no inicio:

- Blog: `page_cluster = blog`
- Comparacoes: `page_cluster = comparison`
- Solucoes: `page_cluster = solution`
- Fundo de funil: `funnel_stage = bottom`
- Demo requests: `lead_type = demo_request`
- Waitlist: `lead_type = waitlist`

## 8. Checklist de configuracao no GA4

### 8.1 No codigo

- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` definido no ambiente
- deploy publicado com a versao atual da instrumentacao

### 8.2 No GA4

1. Confirmar se os eventos aparecem em `Realtime`.
2. Esperar os eventos popularem `Events`.
3. Criar as custom dimensions.
4. Criar as custom metrics.
5. Marcar `generate_lead` como key event.
6. Opcional: marcar `qualified_read` como key event editorial.
7. Criar explorations ou dashboard.

### 8.3 Em DebugView

Testar manualmente estes fluxos:

1. abrir `/`
2. abrir um artigo do blog
3. abrir uma pagina de comparacao
4. clicar em um CTA
5. focar no formulario de demo
6. focar no formulario de waitlist
7. enviar um lead de teste

Esperado:

- `marketing_page_view` no carregamento da pagina
- `cta_click` no clique
- `form_start` no primeiro foco
- `generate_lead` no submit
- `scroll_depth` e `qualified_read` nas paginas de conteudo

## 9. Como ler isso toda semana

Toda semana, responder:

- quais paginas de topo geram leitura qualificada
- quais paginas de meio empurram clique para demo
- quais paginas de fundo realmente geram lead
- quais CTAs perderam relevancia
- qual pagina tem `marketing_page_view` alto e `form_start` baixo
- qual pagina tem `form_start` alto e `generate_lead` baixo

Se a resposta nao levar a uma acao de copy, CTA, pagina ou link interno, o painel esta decorativo demais.

## 10. Prioridade pratica

Se precisar montar por etapas, siga esta ordem:

1. `generate_lead` como key event
2. custom dimensions de contexto
3. painel de funil executivo
4. painel de conteudo assistido
5. painel de CTAs
6. `qualified_read` como microconversao opcional
