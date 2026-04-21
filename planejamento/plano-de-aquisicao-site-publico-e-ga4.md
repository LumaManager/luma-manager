# Plano de Aquisição, Site Público, SEO e GA4

## 1. Objetivo

Construir um motor de aquisição previsível para o SaaS de psicólogos no Brasil, começando pelo ICP já definido no projeto:

- psicólogo autônomo
- clínica privada própria
- sem convênio
- sem vínculo institucional
- decisão de compra individual

O plano abaixo conecta quatro frentes que hoje estão separadas:

- funil comercial
- arquitetura do site público
- indexação e conteúdo
- mensuração em GA4 e Search Console

---

## 2. Premissas do plano

### 2.1 O que estamos vendendo

O produto não deve ser vendido como "IA clínica" nem como "terapia automatizada".
O enquadramento correto, já consolidado nos documentos do projeto, é:

- software para operação do consultório
- documentação assistida com revisão humana obrigatória
- agenda, sessão, prontuário, documentos, consentimentos e cobrança no mesmo fluxo
- postura de software para psicólogos, não de prestadora direta de cuidado

### 2.2 O que trava a compra neste nicho

Para esse ICP, a barreira principal não é "descobrir que existe software".
A barreira é confiar que o software:

- não aumenta risco ético
- não banaliza sigilo e privacidade
- não força workflow confuso
- não vende IA como substituto do julgamento profissional
- reduz trabalho operacional real

### 2.3 Tese central de aquisição

O funil recomendado para este produto é:

`demanda intencional + prova de confiança + demonstração guiada + ativação rápida + indicação`

Em termos práticos:

- captar quem já está procurando solução
- responder objeções de confiança cedo
- oferecer demo e entrada qualificada no beta
- acelerar o primeiro valor dentro do produto
- transformar contas ativadas em prova social, referrals e reviews

---

## 3. Diagnóstico do estado atual do site

### 3.1 O que existe hoje

Com base no web atual:

- home pública em `/` com foco em waitlist
- pricing em `/pricing`
- login público em `/login`
- fluxo de convite em `/invite/[token]`
- `robots.ts` já bloqueia `/app/`, `/portal/` e `/internal/`
- `sitemap.ts` hoje lista apenas a home
- GA4 está carregado no `layout.tsx` com `gtag('config', 'G-7W1Q64T883')`

### 3.2 Principais gaps

- o site está forte em branding e espera, mas fraco em captura de demanda orgânica
- não existe arquitetura de páginas para keywords de alta intenção
- não existem páginas específicas por dor, caso de uso ou confiança
- o sitemap está subdimensionado
- há pouca metadata pública além da raiz e da pricing
- o GA4 existe, mas só no nível básico; não há modelagem de eventos do funil
- não há camada pública robusta de segurança, privacidade, LGPD e postura de IA
- o CTA principal da home ainda é waitlist; isso limita conversão de demanda quente

### 3.3 Conclusão do diagnóstico

O site atual é coerente para um beta muito inicial.
Ele ainda não está organizado para:

- competir em busca orgânica
- capturar intenção comercial por tema
- medir bem o funil
- sustentar compra com confiança regulatória e operacional

---

## 4. Modelo de funil recomendado

## 4.1 Estrutura do funil

| Etapa | Objetivo | Oferta principal | Canais principais | KPI principal |
|---|---|---|---|---|
| Descoberta | trazer tráfego qualificado | conteúdo de alta intenção e páginas de solução | Google orgânico, review sites, comunidades, referrals | sessões qualificadas |
| Consideração | convencer que vale avaliar | demo curta, página de segurança, pricing, comparação | páginas transacionais, pricing, trust pages | clique em CTA e geração de lead |
| Conversão em lead | capturar interesse real | pedir demo, pedir acesso, entrar no beta | formulários, pricing, CTA contextual | `generate_lead` |
| Qualificação | separar curiosidade de ICP forte | formulário com perfil, volume, maior dor | landing, demo request, onboarding de lead | lead qualificado |
| Venda | fechar conta | demo guiada, onboarding assistido, trial guiado quando estiver pronto | founder-led sale, e-mail, WhatsApp comercial | conta criada / venda |
| Ativação | levar ao primeiro valor rápido | agenda + 1 paciente + 1 sessão + 1 documento | onboarding, checklist, nudges | ativação |
| Expansão e aquisição secundária | transformar cliente em novo canal | referral, review, depoimento, indicação de colega | CRM, e-mail, in-app | referral e review |

## 4.2 Movimento comercial recomendado

### Fase atual: beta com entrada controlada

Enquanto o produto ainda estiver em beta:

- CTA principal da home: `Ver demo` ou `Pedir acesso`
- CTA secundário: `Entrar na lista`
- motion comercial: `PLG assistido`
- objetivo: aprender com ICP forte, não maximizar volume

### Fase seguinte: beta aberto ou trial

Quando onboarding e cobrança estiverem maduros:

- CTA principal: `Começar teste`
- CTA secundário: `Ver demo`
- CTA para contas maiores: `Falar com a equipe`
- objetivo: aumentar conversão sem perder qualidade de ativação

### Decisão importante

Para este nicho, eu não recomendo operar só com `waitlist`.
Para demanda quente, o melhor desenho é:

- `Ver demo`
- `Pedir acesso`
- `Pricing`

Waitlist pode continuar existindo, mas como mecanismo secundário.

---

## 5. Prioridade de canais

## 5.1 Canais prioritários

### 1. SEO de alta intenção

É o canal mais alinhado a este produto porque captura demanda existente:

- software para psicólogos
- prontuário eletrônico para psicólogos
- agenda para psicólogo
- sistema para consultório de psicologia
- teleatendimento para psicólogos

### 2. Demo founder-led / comercial curto

Como a compra é individual e a objeção central é confiança:

- demo curta tende a fechar mais do que trial totalmente frio
- objeções de LGPD, sigilo, prontuário e uso de IA podem ser resolvidas ao vivo

### 3. Referrals e rede profissional

Esse mercado cresce por indicação entre profissionais:

- colegas de profissão
- supervisores
- comunidades de prática
- contadores e consultores nichados

### 4. Review sites e prova social

Review sites pesam na avaliação de software B2B.
Eles não substituem o site, mas fortalecem meio e fundo de funil.

### 5. Google Ads em exact match

Vale depois que:

- as páginas transacionais estiverem prontas
- a demo request estiver instrumentada
- houver capacidade de resposta comercial

## 5.2 Canais de baixa prioridade no início

- conteúdo amplo de Instagram sem oferta clara
- Meta Ads frios para tráfego genérico
- blog grande antes de acertar páginas transacionais
- outbound frio em escala

---

## 6. Estratégia de keywords

## 6.1 Ferramentas que devemos usar

Sim, faz sentido usar:

- `AnswerThePublic`: para descobrir perguntas, dores e linguagem real
- `Google Keyword Planner`: para validar volume e intenção comercial
- `Google Search Console`: depois do lançamento, para descobrir queries reais
- `SERP review manual`: para ver qual tipo de página o Google já entende como melhor resposta

### Papel de cada uma

`AnswerThePublic`:

- ótimo para topo e meio de funil
- encontra perguntas do tipo `como`, `qual`, `vale a pena`, `diferença entre`
- ajuda a montar blog, FAQs e cluster de dor

`Google Keyword Planner`:

- melhor para priorizar keywords comerciais
- ajuda a comparar variações semânticas
- mais útil para decidir quais landing pages entram primeiro

`Search Console`:

- vira a fonte mais importante depois que o site tiver páginas indexadas
- mostra termos com impressões, CTR e posição reais

### Regra prática

Não escolher páginas só por volume.
Escolher por combinação de:

- intenção comercial
- aderência ao ICP
- chance real de conversão
- proximidade com o produto atual

## 6.2 Mapa inicial de keywords

### Cluster 1: alta intenção comercial

Páginas de prioridade máxima:

- software para psicólogos
- sistema para psicólogos
- sistema para consultório de psicologia
- plataforma para psicólogos
- prontuário eletrônico para psicólogos
- agenda para psicólogo
- software de gestão para psicólogos
- teleatendimento para psicólogos

### Cluster 2: dor operacional

- como organizar o pós-sessão
- como organizar prontuário de psicologia
- como centralizar agenda, cobrança e prontuário
- como reduzir trabalho administrativo no consultório
- como parar de usar planilha e WhatsApp para organizar atendimento

### Cluster 3: confiança e compliance

- LGPD para psicólogos
- consentimento para teleatendimento psicológico
- prontuário eletrônico psicologia
- privacidade de dados no consultório de psicologia
- uso de IA em documentação clínica

### Cluster 4: comparação

- agenda e planilha para psicólogo vs software
- melhor software para psicólogos
- alternativa a ferramentas soltas para consultório
- como escolher software para consultório psicológico

### Cluster 5: intenção por feature

- cobrança para psicólogos
- documentos e consentimentos para psicólogos
- portal do paciente para psicólogos
- agenda com lembrete para psicólogos
- videochamada para psicólogos

## 6.3 Regra de arquitetura

Não criar uma página para cada keyword isolada.
Criar uma página para cada `intenção`.

Exemplo:

- uma página forte para `software para psicólogos`
- uma página forte para `prontuário eletrônico para psicólogos`
- uma página forte para `agenda para psicólogos`

Cada uma pode capturar muitas variações sem virar site inflado artificialmente.

## 6.4 Leitura inicial dos exports enviados em 12 de abril de 2026

Os arquivos fornecidos trazem dois sinais bem diferentes:

### Sinal 1: keyword comercial forte

`software para psicólogo`

- região/idioma: `BR | pt`
- volume identificado no export: `70`
- CPC identificado no export: `US$ 1.45`

Interpretação:

- existe sinal comercial explícito
- a linguagem do mercado parece mais próxima de `software para psicólogo` do que de formulações mais acadêmicas
- essa keyword merece ser o centro da primeira página transacional

### Sinal 2: keyword conceitualmente boa, mas fraca como alvo principal

`gestão de consultório psicologia`

- variações encontradas no export analisado: volume `0`
- exemplos:
  - `gestão de consultório psicologia`
  - `guia para gestão de consultório de psicologia`

Interpretação:

- esse tema é relevante como problema e como linguagem de copy
- ele não parece, neste recorte inicial, ser a melhor keyword principal para a landing core
- deve entrar como:
  - subtese de copy
  - H2/H3
  - conteúdo editorial
  - página secundária, não principal

### O que os prompts de ChatGPT e Gemini sugerem como adjacências úteis

Os dois exports também mostram perguntas e intenções úteis para expansão de páginas:

- melhor software para psicólogos no Brasil
- software com prontuário eletrônico
- agendamento de consultas para psicólogos
- teleconsulta / terapia online
- gestão de pacientes
- agendas e prontuários digitais
- emissão de recibos e parte financeira

Esses itens não são validação de volume por si só.
Mas ajudam muito a decidir:

- naming de páginas
- cluster editorial
- FAQs
- blocos de comparação
- pauta para demo

## 6.5 Priorização real de páginas a partir dos exports

### Tier 1: criar primeiro

- `/software-para-psicologos`
- `/prontuario-eletronico-para-psicologos`
- `/agenda-para-psicologos`

### Tier 2: criar em seguida

- `/teleatendimento-para-psicologos`
- `/documentos-e-consentimentos-para-psicologos`
- `/seguranca-e-privacidade`

### Tier 3: conteúdo e comparação

- `/blog/como-escolher-software-para-psicologo`
- `/blog/como-organizar-agenda-e-prontuario`
- `/comparar/planilha-e-whatsapp-vs-software`
- `/para-quem-faz-tudo-sozinho`

### Decisão prática

Se houver limite de tempo, a homepage não deve tentar ranquear sozinha para tudo.
Ela deve ser a tese institucional.
Quem deve brigar pelas buscas transacionais é, primeiro, a página:

- `/software-para-psicologos`

---

## 7. Arquitetura do site público recomendada

## 7.1 Páginas que devem existir

### Páginas core de conversão

| URL sugerida | Objetivo | Indexar | CTA principal |
|---|---|---|---|
| `/` | página principal e tese do produto | sim | `Ver demo` |
| `/pricing` | remover objeção comercial | sim | `Pedir acesso` ou `Começar teste` |
| `/solicitar-demo` | captura de fundo de funil | sim | `Enviar pedido` |
| `/como-funciona` | explicar fluxo de valor | sim | `Ver demo` |
| `/seguranca-e-privacidade` | remover objeção de confiança | sim | `Pedir acesso` |

### Páginas de solução e intenção comercial

| URL sugerida | Keyword/intenção principal | Indexar | CTA principal |
|---|---|---|---|
| `/software-para-psicologos` | software para psicólogos | sim | `Ver demo` |
| `/prontuario-eletronico-para-psicologos` | prontuário eletrônico | sim | `Pedir acesso` |
| `/agenda-para-psicologos` | agenda para psicólogos | sim | `Ver demo` |
| `/teleatendimento-para-psicologos` | teleatendimento | sim | `Pedir acesso` |
| `/documentos-e-consentimentos-para-psicologos` | documentos / consentimentos | sim | `Ver demo` |
| `/cobranca-e-financeiro-para-psicologos` | financeiro / cobrança | sim | `Pedir acesso` |

### Páginas de ICP e caso de uso

| URL sugerida | Objetivo | Indexar | CTA principal |
|---|---|---|---|
| `/para-psicologos-autonomos` | falar com o ICP central | sim | `Ver demo` |
| `/para-consultorios-enxutos` | capturar prática pequena | sim | `Pedir acesso` |
| `/para-quem-faz-tudo-sozinho` | página orientada por dor | sim | `Ver demo` |

### Páginas de comparação

| URL sugerida | Objetivo | Indexar | CTA principal |
|---|---|---|---|
| `/comparar/planilha-e-whatsapp-vs-software` | comparação com status quo | sim | `Ver demo` |
| `/comparar/agenda-solta-vs-fluxo-integrado` | comparação por workflow | sim | `Pedir acesso` |

### Páginas editoriais

| URL sugerida | Objetivo | Indexar | CTA principal |
|---|---|---|---|
| `/blog` | hub editorial | sim | contextual |
| `/blog/lgpd-para-psicologos-consultorio` | confiança | sim | `Ver demo` |
| `/blog/prontuario-eletronico-na-psicologia` | busca informacional próxima da compra | sim | `Pedir acesso` |
| `/blog/como-organizar-pos-sessao` | dor operacional | sim | `Ver demo` |
| `/blog/como-escolher-software-para-psicologo` | comparação | sim | `Solicitar demo` |

### Páginas legais e de base institucional

| URL sugerida | Objetivo | Indexar | Observação |
|---|---|---|---|
| `/politica-de-privacidade` | transparência | sim | importante para LGPD e anúncios |
| `/termos-de-uso` | base contratual | sim | institucional |
| `/encarregado-de-dados` ou `/privacidade` | contato e governança | sim | opcionalmente combinado com privacy |

## 7.2 Páginas que devem ser `noindex`

- `/login`
- `/invite/[token]`
- páginas de confirmação como `/obrigado/*`
- qualquer URL com token, sessão ou estado transitório
- superfícies internas, protegidas e do portal do paciente

### Observação

`robots.txt` sozinho não resolve toda a estratégia.
Algumas páginas devem continuar acessíveis, mas com `noindex`.
Login é o melhor exemplo.

---

## 8. O que alterar no site atual

## 8.1 Home

### Alterações principais

- trocar CTA principal de `waitlist` para `Ver demo` ou `Pedir acesso`
- manter waitlist como CTA secundário
- adicionar navegação pública real:
  - Produto
  - Como funciona
  - Segurança
  - Pricing
  - Recursos
  - Ver demo
- subir prova de confiança acima da dobra
- incluir bloco curto sobre:
  - revisão humana obrigatória
  - postura de software para psicólogos
  - operação no Brasil
  - privacidade e consentimento

### Estrutura sugerida da home

1. headline orientada a dor operacional
2. prova de confiança
3. visão do fluxo do produto
4. blocos por área:
   agenda, prontuário, consentimentos, financeiro
5. seção de segurança / LGPD / postura de IA
6. CTA de demo
7. pricing simplificada ou preview
8. FAQ

## 8.2 Pricing

Hoje a pricing existe, mas ainda precisa virar página de venda.

### Adições recomendadas

- FAQ comercial
- comparação entre planos com linguagem mais próxima do ICP
- CTA principal:
  - beta atual: `Pedir acesso`
  - fase trial: `Começar teste`
- bloco de segurança e privacidade
- bloco sobre o que entra e o que não entra no produto
- prova de adequação ao consultório brasileiro

## 8.3 Nova página de segurança e privacidade

Essa página deve existir cedo.
Ela precisa explicar, sem juridiquês exagerado:

- qual é a tese do produto
- quem controla o conteúdo clínico
- que a IA é assistiva
- que aprovação humana é obrigatória
- como consentimentos entram no fluxo
- retenção mínima do bruto quando aplicável
- postura sobre uso de dados

## 8.4 Página de demo

Essa página é crítica porque substitui parte da fragilidade do modelo de waitlist.

Campos recomendados:

- nome
- e-mail
- WhatsApp
- perfil profissional
- volume de sessões por mês
- principal dor
- usa hoje planilha / agenda / software?

CTA:

- `Solicitar demo`

Obrigatório:

- página de obrigado separada
- `generate_lead` no submit
- integração com CRM ou pelo menos planilha operacional limpa

## 8.5 Footer e linking

Adicionar footer global com:

- produto
- pricing
- segurança
- blog
- política de privacidade
- termos
- contato

Isso ajuda:

- navegação
- confiança
- descoberta interna de URLs
- crawling

---

## 9. Regras de copy e posicionamento para todas as páginas

## 9.1 Linguagem que deve aparecer

- organização clínica
- rotina do consultório
- pós-sessão
- continuidade do caso
- consentimentos e documentos
- cobrança e acompanhamento
- revisão humana obrigatória
- software para psicólogos

## 9.2 Linguagem que deve ser evitada

- IA faz a sessão
- IA substitui anotação clínica
- diagnóstico automatizado
- apoio diagnóstico
- decisão clínica automática
- terapia com IA

## 9.3 Fórmula de copy para páginas comerciais

Cada página deve responder quatro perguntas:

1. Qual dor operacional ela resolve?
2. Como resolve isso no fluxo do consultório?
3. Por que é segura e confiável?
4. Qual próximo passo o visitante deve dar agora?

---

## 10. SEO técnico e indexação

## 10.1 Ações obrigatórias

- expandir o sitemap para todas as páginas públicas indexáveis
- remover do sitemap tudo o que não deve ranquear
- criar metadata por página:
  - `title`
  - `description`
  - `openGraph`
  - canonical
- usar URLs limpas e semânticas
- criar linking interno entre home, solution pages, pricing, segurança e blog
- garantir que páginas importantes estejam a poucos cliques da home

## 10.2 Ajustes específicos para o projeto atual

### `sitemap.ts`

Hoje lista apenas a home.
Precisa passar a listar:

- home
- pricing
- páginas de solução
- páginas de segurança
- páginas de blog
- páginas de comparação
- páginas legais

### `robots.ts`

Está correto ao bloquear áreas protegidas.
Mas ainda falta a estratégia de `noindex` nas páginas públicas que não devem ranquear.

### Metadata

Hoje há metadata global e metadata em pricing, mas isso ainda é insuficiente.
Cada URL pública importante deve ter metadata própria.

## 10.3 Structured data recomendada

Adicionar quando as páginas estiverem maduras:

- `Organization`
- `SoftwareApplication`
- `BreadcrumbList`
- `Article` nas páginas de blog

### Regra

Structured data ajuda elegibilidade e compreensão, mas não garante rich result.
Só vale a pena se o conteúdo real da página estiver forte.

## 10.4 Search Console

### Configuração mínima

- garantir a propriedade do domínio
- submeter sitemap
- usar URL Inspection nas páginas novas prioritárias
- acompanhar:
  - indexação
  - consultas
  - CTR
  - páginas com impressões e baixa taxa de clique

### Rotina

- semanal no primeiro mês
- quinzenal depois

---

## 11. GA4: plano completo de mensuração

## 11.1 Estado atual

Hoje o projeto já carrega o script do GA4.
Isso é o começo, não o plano.

Falta:

- governança de eventos
- parâmetros padronizados
- key events
- relatórios de funil
- validação por DebugView
- exclusão de tráfego interno
- eventual consent mode

## 11.2 Objetivo do GA4 neste projeto

Responder com clareza:

- quais canais trazem tráfego qualificado
- quais páginas geram lead
- quais CTAs convertem
- quais páginas assistem conversão
- quais leads viram conta
- quais contas ativam
- quais ativações viram receita

## 11.3 Eventos recomendados

### Eventos GA4 recomendados

| Evento | Quando disparar | Tipo |
|---|---|---|
| `generate_lead` | envio de demo request, waitlist qualificada, contato comercial | recomendado |
| `sign_up` | criação de conta | recomendado |
| `login` | login concluído | recomendado |
| `tutorial_begin` | início do onboarding do terapeuta | recomendado |
| `tutorial_complete` | conclusão do onboarding do terapeuta | recomendado |
| `view_item` | visualização de plano ou oferta quando houver compra self-serve | recomendado |
| `select_item` | clique em plano | recomendado |
| `begin_checkout` | início do checkout | recomendado |
| `add_payment_info` | envio de pagamento | recomendado |
| `purchase` | compra concluída | recomendado |
| `search` | uso de busca interna, se existir | recomendado |

### Eventos customizados úteis

| Evento | Quando disparar | Observação |
|---|---|---|
| `cta_click` | clique em CTA relevante | útil enquanto o funil ainda estiver simples |
| `demo_video_played` | play de vídeo principal | opcional |
| `faq_opened` | abertura de FAQ importante | opcional |
| `pricing_viewed` | visualização qualificada da pricing | pode ser substituído por page_view + page_type |
| `comparison_page_viewed` | visita a página de comparação | pode ser tratado por parâmetro |

## 11.4 Eventos de CRM / lead funnel

Se o time passar a operar lead stages fora do GA4, vale enviar também:

- `qualify_lead`
- `working_lead`
- `close_convert_lead`
- `close_unconvert_lead`

Isso aproxima marketing de venda real e não só de formulário.

## 11.5 Parâmetros que devem acompanhar eventos

Criar um padrão simples e consistente:

- `page_type`
- `page_cluster`
- `cta_label`
- `cta_location`
- `offer_type`
- `persona`
- `plan_name`
- `lead_type`
- `traffic_source_detail`

### Exemplo de uso

No `generate_lead`, enviar:

- origem da página
- tipo de CTA
- perfil selecionado
- principal dor
- volume de sessões

## 11.6 Key events

Marcar como key events no GA4:

- `generate_lead`
- `sign_up`
- `tutorial_complete`
- `begin_checkout`
- `purchase`
- `close_convert_lead` quando existir integração de CRM

## 11.7 Dashboards que o time precisa

### Painel 1: aquisição

- sessões por source / medium
- usuários por landing page
- taxa de geração de lead por landing page
- `generate_lead` por canal

### Painel 2: funil comercial

- lead gerado
- lead qualificado
- demo realizada
- conta criada
- conta ativada
- conta paga

### Painel 3: conteúdo e SEO

- páginas com mais impressões
- páginas com melhor CTR
- páginas com tráfego e baixa conversão
- páginas de blog que assistem conversão

## 11.8 Implementação recomendada

### Fase 1

- manter o `gtag`
- criar utilitário simples para disparo de eventos
- instrumentar principais CTAs
- validar em DebugView

### Fase 2

- padronizar eventos em helpers
- registrar parâmetros customizados
- criar dimensões customizadas no GA4

### Fase 3

- integrar com CRM e offline conversion
- fechar funil até venda e ativação

## 11.9 Consentimento

Se o site usar analytics com consentimento explícito no contexto de LGPD e política de cookies:

- implementar banner de consentimento
- definir política pública
- avaliar `Consent Mode`

Isto deve ser alinhado com a estratégia jurídica e de privacidade do produto.

---

## 12. Plano de Search Console

## 12.1 Setup

- confirmar propriedade do domínio
- confirmar sitemap funcional
- enviar sitemap atualizado
- registrar versões canônicas corretas

## 12.2 Relatórios que importam

- desempenho por consulta
- desempenho por página
- indexação
- problemas de experiência e renderização

## 12.3 Rotina operacional

### Toda semana

- novas queries com impressões
- páginas que ganharam impressões e perderam CTR
- páginas relevantes ainda não indexadas

### Todo mês

- decidir quais páginas merecem refresh
- decidir novas páginas por cluster
- revisar títulos e descrições de páginas com CTR baixa

---

## 13. Cronograma de execução em 90 dias

## 13.1 Semanas 1 e 2

- redefinir CTA principal da home
- desenhar arquitetura de páginas públicas
- criar página de demo
- criar página de segurança e privacidade
- revisar pricing para fundo de funil
- planejar taxonomia de eventos GA4
- configurar Search Console e sitemap ampliado

## 13.2 Semanas 3 a 6

- publicar páginas:
  - `/software-para-psicologos`
  - `/prontuario-eletronico-para-psicologos`
  - `/agenda-para-psicologos`
  - `/seguranca-e-privacidade`
  - `/solicitar-demo`
- instrumentar:
  - `generate_lead`
  - `cta_click`
  - `pricing_viewed`
- ajustar metadata e canonical por página
- validar indexação das páginas publicadas

## 13.3 Semanas 7 a 10

- lançar páginas de comparação
- lançar 3 a 5 conteúdos editoriais de meio/fundo de funil
- iniciar campanhas de busca com exact match, se operação estiver pronta
- começar rotina semanal de análise de Search Console e GA4

## 13.4 Semanas 11 e 12

- revisar copy baseada em CTR e conversão
- revisar páginas com tráfego e pouca geração de lead
- testar novos blocos de prova de confiança
- preparar fluxo de referral e captura de depoimentos dos primeiros clientes

---

## 14. Backlog objetivo para o produto web

## 14.1 Backlog de conteúdo e páginas

- criar arquitetura de rotas públicas de aquisição
- criar metadata por página pública
- criar páginas de solução
- criar páginas de comparação
- criar página de segurança e privacidade
- criar página de demo
- criar blog e template editorial
- criar páginas legais públicas

## 14.2 Backlog de SEO técnico

- expandir sitemap
- revisar `robots`
- adicionar canonical nas páginas públicas
- adicionar structured data
- revisar OG images por página
- reforçar linking interno e footer

## 14.3 Backlog de analytics

- centralizar helper de eventos
- instrumentar CTAs
- instrumentar forms
- instrumentar pricing
- instrumentar onboarding
- marcar key events
- configurar dimensões customizadas
- excluir tráfego interno
- validar DebugView e Realtime

## 14.4 Backlog comercial

- definir SLA de resposta para demo request
- definir script de qualificação
- definir fluxo de convite para beta
- definir CRM mínimo
- definir regra de lead qualificado

---

## 15. Métricas operacionais sugeridas

Os números abaixo são hipóteses operacionais iniciais, não benchmark rígido.
Servem para dar direção e detectar gargalos.

| Métrica | Faixa inicial de referência |
|---|---|
| home -> lead | 1% a 3% |
| página transacional -> lead | 3% a 8% |
| pricing -> lead | 2% a 6% |
| lead -> demo realizada | 35% a 60% |
| demo -> conta criada | 20% a 40% |
| conta criada -> ativada | 40% a 70% |
| ativada -> paga | 15% a 35% no início |

### Como usar essas metas

- se a home tiver tráfego e pouca conversão, o problema é oferta ou CTA
- se páginas transacionais tiverem tráfego e pouca conversão, o problema é confiança ou adequação
- se lead gerar demo mas não virar conta, o problema é qualificação ou proposta
- se conta criada não ativar, o problema é onboarding

---

## 16. O que não fazer

- manter o site só com lógica de waitlist por muito tempo
- publicar dezenas de páginas fracas só para "ter SEO"
- usar copy agressiva de IA que entre em conflito com a tese regulatória
- depender de blog amplo antes de criar páginas transacionais
- medir só pageview e achar que existe analytics
- rodar mídia paga antes de ter páginas, CTA e mensuração decentes

---

## 17. Decisão final recomendada

### Estrutura principal

O plano mais forte para este produto é:

- `SEO de intenção alta`
- `site público com páginas de solução e confiança`
- `demo request + acesso guiado no beta`
- `GA4 modelado por eventos de negócio`
- `Search Console como feedback loop de conteúdo`

### Primeiras entregas mais importantes

Se precisar cortar escopo, eu priorizaria:

1. home reposicionada com CTA de demo
2. página de segurança e privacidade
3. página de demo
4. três páginas de solução de alta intenção
5. sitemap e metadata corretos
6. `generate_lead` e funil mínimo em GA4

---

## 18. Fontes externas usadas

- Software Advice, `Buyers Switch to Mental Health Software for Greater Efficiency and Functionality`, 2 de março de 2026  
  https://www.softwareadvice.com/resources/mental-health-software-buyer-insights/

- G2, `2024 Buyer Behavior Report`  
  https://research.g2.com/2024-buyer-behavior-report

- Google Search Central, `Build and submit a sitemap`  
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

- Google Search Central, `Ask Google to recrawl your URLs`  
  https://developers.google.com/search/docs/advanced/crawling/ask-google-to-recrawl

- Google Search Central, `What is a sitemap`  
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

- Google Search Central, `How to specify a canonical with rel="canonical" and other methods`  
  https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

- Google Search Central, `Robots meta tag, data-nosnippet, and X-Robots-Tag specifications`  
  https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag

- Google Search Central, `Structured data for software apps`  
  https://developers.google.com/search/docs/appearance/structured-data/software-app

- Google Analytics Help, `Recommended events`  
  https://support.google.com/analytics/answer/9267735

- Google Analytics Help, `Tutorial: Set up a key event`  
  https://support.google.com/analytics/answer/12966437

- Google Analytics Help, `Set up ecommerce events`  
  https://support.google.com/analytics/answer/12200568

- Google Analytics Help, `Confirm that you're collecting data`  
  https://support.google.com/analytics/answer/9333790

- Google Analytics Help, `Set up consent mode`  
  https://support.google.com/analytics/answer/14009635

---

## 19. Referências internas do projeto

- `arquitetura/planejamento/mercado-e-icp.md`
- `arquitetura/web/produto/prd-mvp.md`
- `arquitetura/licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md`
- `arquitetura/apps/web/app/layout.tsx`
- `arquitetura/apps/web/app/sitemap.ts`
- `arquitetura/apps/web/app/robots.ts`
- `arquitetura/apps/web/src/components/marketing/landing-page.tsx`
- `arquitetura/apps/web/src/components/marketing/waitlist-form.tsx`
