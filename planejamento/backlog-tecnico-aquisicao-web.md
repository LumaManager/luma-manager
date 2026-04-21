# Backlog Técnico de Aquisição Web

## 1. Escopo

Este backlog transforma o plano de aquisição em entregas técnicas para o `apps/web`.

Objetivo operacional:

- aumentar capacidade de indexação
- criar páginas públicas de aquisição
- estruturar trust layer pública
- medir o funil com GA4
- preparar o site para Search Console e campanhas de busca

Base estratégica:

- `planejamento/plano-de-aquisicao-site-publico-e-ga4.md`

---

## 2. Princípios de execução

- começar por fundação, não por volume de páginas
- priorizar páginas transacionais antes de blog amplo
- toda página pública nova precisa nascer com metadata, CTA e analytics
- tudo que não deve ranquear precisa nascer com `noindex`
- cada sprint deve terminar com algo publicável

---

## 3. Macrofrentes

### Frente A: Fundação SEO e indexação

- sitemap
- robots
- canonical
- metadata
- noindex
- linking interno

### Frente B: Páginas públicas de aquisição

- páginas de solução
- páginas de confiança
- páginas de conversão
- componentes compartilhados para marketing público

### Frente C: Analytics e mensuração

- GA4
- key events
- parâmetros de eventos
- rastreamento de CTA e formulários

### Frente D: Operação comercial e conteúdo

- fluxo de demo
- SLA comercial
- blog e comparação
- Search Console loop

---

## 4. Sprint 1

### Meta do sprint

Sair de um site institucional beta para um site com fundação mínima de aquisição.

### Issues

#### `AQ-001` Expandir sitemap público

Objetivo:

- listar todas as URLs públicas indexáveis relevantes

Escopo:

- revisar `apps/web/app/sitemap.ts`
- incluir home, pricing e novas rotas públicas de aquisição

Critérios de aceite:

- o sitemap deixa de conter só a home
- não inclui áreas protegidas, portal nem fluxos com token

Dependências:

- definição das rotas públicas prioritárias

#### `AQ-002` Revisar estratégia de `robots` e `noindex`

Objetivo:

- impedir indexação indevida de superfícies operacionais

Escopo:

- manter bloqueio de `/app/`, `/portal/`, `/internal/`
- aplicar `noindex` em login, invite/token e páginas de obrigado futuras

Critérios de aceite:

- páginas sensíveis ou transacionais não ficam elegíveis a ranqueamento

#### `AQ-003` Criar página pública `/solicitar-demo`

Objetivo:

- criar a principal página de conversão de fundo de funil

Escopo:

- página com headline, proposta de valor, campos de captura e FAQ curta
- CTA de envio de pedido

Critérios de aceite:

- página com metadata própria
- formulário pronto para instrumentação de lead

#### `AQ-004` Criar página `/software-para-psicologos`

Objetivo:

- capturar a principal keyword comercial identificada

Escopo:

- página orientada ao ICP
- copy de dor operacional + confiança + CTA de demo

Critérios de aceite:

- metadata específica
- H1 e estrutura coerentes com a intenção de busca

#### `AQ-005` Criar página `/seguranca-e-privacidade`

Objetivo:

- remover objeções de confiança antes da compra

Escopo:

- explicar postura de software
- revisão humana obrigatória
- papel do terapeuta e do produto
- uso de dados, consentimentos e governança

Critérios de aceite:

- linguagem clara
- alinhamento com a tese regulatória já definida no projeto

#### `AQ-006` Criar fundação de GA4

Objetivo:

- centralizar configuração de analytics

Escopo:

- helper de tracking
- measurement ID configurável
- limpeza do bootstrap de `gtag`

Critérios de aceite:

- layout não fica com snippet inline espalhado
- existe função reutilizável para eventos

#### `AQ-007` Instrumentar `generate_lead` na waitlist

Objetivo:

- começar a medir geração de lead real

Escopo:

- evento no submit bem-sucedido
- parâmetros mínimos de origem e perfil

Critérios de aceite:

- evento disparado apenas em sucesso
- payload inclui contexto útil de aquisição

### Saída esperada do Sprint 1

- site com fundação mínima de SEO
- três páginas públicas novas
- primeiro evento de lead funcionando

---

## 5. Sprint 2

### Meta do sprint

Ampliar cobertura de intenção comercial e preparar o site para tráfego pago e orgânico de busca.

### Issues

#### `AQ-008` Criar página `/prontuario-eletronico-para-psicologos`

Critérios de aceite:

- orientada a benefício operacional e segurança
- CTA para demo

#### `AQ-009` Criar página `/agenda-para-psicologos`

Critérios de aceite:

- foco em organização, disponibilidade, lembretes e contexto da sessão

#### `AQ-010` Criar página `/teleatendimento-para-psicologos`

Critérios de aceite:

- foco em fluxo seguro, prontidão e continuidade

#### `AQ-011` Criar página `/documentos-e-consentimentos-para-psicologos`

Critérios de aceite:

- foco em consentimento, versionamento e timing operacional

#### `AQ-012` Revisar home para CTA principal de demo

Escopo:

- trocar waitlist como ação dominante
- manter waitlist como CTA secundário
- adicionar navegação pública mais completa

Critérios de aceite:

- home passa a vender avaliação, não só espera

#### `AQ-013` Revisar pricing como página de fundo de funil

Escopo:

- adicionar FAQ comercial
- reforçar trust layer
- adequar CTA à fase do produto

#### `AQ-014` Instrumentar cliques críticos de CTA

Escopo:

- home
- pricing
- páginas de solução
- solicitação de demo

Critérios de aceite:

- eventos com `cta_label`, `cta_location` e `page_type`

### Saída esperada do Sprint 2

- cluster comercial principal publicado
- base pronta para campanhas de busca
- tracking de CTA funcionando

---

## 6. Sprint 3

### Meta do sprint

Abrir meio de funil com conteúdo assistido por intenção real e melhorar apoio à decisão.

### Issues

#### `AQ-015` Criar hub `/blog`

#### `AQ-016` Publicar artigo `como escolher software para psicólogo`

#### `AQ-017` Publicar artigo `como organizar agenda e prontuário`

#### `AQ-018` Publicar artigo `LGPD para psicólogos no consultório`

#### `AQ-019` Criar página de comparação `planilha e WhatsApp vs software`

#### `AQ-020` Adicionar structured data

Escopo:

- `Organization`
- `SoftwareApplication`
- `Article`
- `BreadcrumbList` quando fizer sentido

#### `AQ-021` Configurar Search Console operacionalmente

Escopo:

- submissão de sitemap
- inspeção de URLs críticas
- rotina de monitoramento

### Saída esperada do Sprint 3

- site com topo, meio e fundo de funil conectados
- feedback loop ativo com Search Console

---

## 7. Sprint 4

### Meta do sprint

Fechar o loop entre tráfego, lead, demo, conta e ativação.

### Issues

#### `AQ-022` Instrumentar `sign_up`

#### `AQ-023` Instrumentar `tutorial_begin`

#### `AQ-024` Instrumentar `tutorial_complete`

#### `AQ-025` Instrumentar `begin_checkout`, `add_payment_info`, `purchase`

#### `AQ-026` Criar mapeamento de key events no GA4

#### `AQ-027` Excluir tráfego interno e validar DebugView

#### `AQ-028` Definir e integrar estágios mínimos de lead

Escopo:

- lead gerado
- lead qualificado
- demo agendada
- demo realizada
- conta criada

### Saída esperada do Sprint 4

- funil mensurável do marketing até onboarding

---

## 8. Dependências e ordem real

### Dependências críticas

- `AQ-003`, `AQ-004` e `AQ-005` dependem de componentes públicos reutilizáveis
- `AQ-001` depende do mapa real de rotas públicas
- `AQ-007` depende da fundação de analytics de `AQ-006`
- `AQ-014` depende da existência das páginas e CTAs revisados

### Ordem recomendada

1. `AQ-006`
2. `AQ-001`
3. `AQ-002`
4. `AQ-003`
5. `AQ-004`
6. `AQ-005`
7. `AQ-007`
8. `AQ-012`
9. `AQ-013`
10. `AQ-014`

---

## 9. Critérios de pronto

Uma issue só pode ser considerada pronta quando:

- a rota funciona
- metadata existe
- CTA principal está claro
- analytics básico está conectado quando aplicável
- o texto respeita a tese regulatória do produto

---

## 10. Entregas iniciadas nesta rodada

Frentes em execução agora:

- fundação SEO/indexação
- fundação de analytics/GA4
- primeiras páginas públicas:
  - `/solicitar-demo`
  - `/software-para-psicologos`
  - `/seguranca-e-privacidade`
