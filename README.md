# Arquitetura e Planejamento do Produto

Leitura inicial obrigatória: [00-indice-mestre.md](./00-indice-mestre.md)

Este diretório agora está organizado como um pacote de definição do produto, cobrindo visão, MVP, arquitetura técnica, segurança, compliance, telas e backlog inicial.

## Documentos

- [investigacao.md](./investigacao.md): dossiê central das dúvidas críticas sobre gravação, transcrição com IA, registro auxiliar e prontuário.
- [licitude-brasil/README.md](./licitude-brasil/README.md): ponto de entrada da frente regulatória específica para operação no Brasil.
- [licitude-brasil/00-indice-licitude-br.md](./licitude-brasil/00-indice-licitude-br.md): ordem oficial de leitura da investigação de licitude.
- [licitude-brasil/01-tese-de-licitude-no-brasil.md](./licitude-brasil/01-tese-de-licitude-no-brasil.md): resposta consolidada sobre se o produto pode operar licitamente no Brasil e sob qual tese.
- [licitude-brasil/02-mapa-regulatorio-oficial.md](./licitude-brasil/02-mapa-regulatorio-oficial.md): consolidação de LGPD, ANPD, CFP, CRPs, PJ e fronteira ANVISA em fontes oficiais.
- [licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md](./licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md): decisões de produto, arquitetura e posicionamento exigidas pela tese regulatória.
- [licitude-brasil/04-matriz-de-cenarios-audio-ia-e-registro.md](./licitude-brasil/04-matriz-de-cenarios-audio-ia-e-registro.md): matriz prática para cenários com e sem áudio, transcript e registro auxiliar.
- [licitude-brasil/05-gates-juridicos-para-go-live.md](./licitude-brasil/05-gates-juridicos-para-go-live.md): checklist jurídico-regulatório mínimo antes de produção.
- [licitude-brasil/06-perguntas-para-parecer-juridico.md](./licitude-brasil/06-perguntas-para-parecer-juridico.md): briefing objetivo para jurídico especializado.
- [web/README.md](./web/README.md): ponto de entrada do pacote específico do web.
- [web/00-indice-web.md](./web/00-indice-web.md): ordem de leitura para qualquer agente que vá construir o web.
- [web/fundacao/README.md](./web/fundacao/README.md): pacote de decisões que precisam ser fechadas antes do build.
- [web/fundacao/01-gates-pre-build.md](./web/fundacao/01-gates-pre-build.md): checklist do que precisa estar definido antes da implementação principal.
- [web/fundacao/02-stack-recomendada.md](./web/fundacao/02-stack-recomendada.md): stack recomendada para o beta web-first.
- [web/fundacao/03-direcao-de-branding-e-ui.md](./web/fundacao/03-direcao-de-branding-e-ui.md): direção de cor, branding e UI.
- [web/fundacao/04-layout-e-composicao-do-web.md](./web/fundacao/04-layout-e-composicao-do-web.md): consolidação dos princípios de layout.
- [web/fundacao/05-sinais-de-mercado.md](./web/fundacao/05-sinais-de-mercado.md): benchmark resumido do que parece funcionar hoje no mercado.
- [web/fundacao/06-analise-de-ui-do-berries.md](./web/fundacao/06-analise-de-ui-do-berries.md): leitura do que já funciona na UI do Berries e de como adaptar isso ao nosso CRM.
- [web/fundacao/07-avaliacao-do-supabase.md](./web/fundacao/07-avaliacao-do-supabase.md): avaliação de quando Supabase acelera o projeto e como usá-lo sem enfraquecer a arquitetura.
- [visao-geral.md](./visao-geral.md): visão inicial e contexto do problema.
- [web/produto/prd-mvp.md](./web/produto/prd-mvp.md): escopo do MVP, objetivos, personas e funcionalidades.
- [web/produto/ordem-de-definicao-de-telas.md](./web/produto/ordem-de-definicao-de-telas.md): sequência oficial para definir UX e telas, começando pelo web.
- [web/telas/01-estrutura-base-do-web.md](./web/telas/01-estrutura-base-do-web.md): definição fechada do shell do web admin do terapeuta.
- [web/telas/02-login-e-seguranca.md](./web/telas/02-login-e-seguranca.md): especificação completa dos fluxos de autenticação e segurança do terapeuta.
- [web/telas/03-onboarding-do-terapeuta.md](./web/telas/03-onboarding-do-terapeuta.md): definição do wizard de ativação da conta do terapeuta e regra de prontidão operacional.
- [web/telas/04-dashboard-do-terapeuta.md](./web/telas/04-dashboard-do-terapeuta.md): definição do dashboard operacional inicial do terapeuta.
- [web/telas/05-lista-de-pacientes.md](./web/telas/05-lista-de-pacientes.md): definição do diretório operacional de pacientes do terapeuta.
- [web/telas/06-ficha-do-paciente.md](./web/telas/06-ficha-do-paciente.md): definição da tela de detalhe principal do paciente e sua separação do prontuário clínico.
- [web/telas/07-agenda-do-terapeuta.md](./web/telas/07-agenda-do-terapeuta.md): definição da agenda operacional do terapeuta, disponibilidade, bloqueios e criação de sessões.
- [web/telas/08-detalhe-da-sessao.md](./web/telas/08-detalhe-da-sessao.md): definição do ponto de entrada operacional da consulta, com prontidão, consentimentos, pagamento e acesso à sala.
- [web/telas/09-videochamada-no-web.md](./web/telas/09-videochamada-no-web.md): definição da experiência ao vivo da sessão no web, incluindo waiting room, transcript, reconexão e encerramento.
- [web/telas/10-fila-de-revisao-clinica.md](./web/telas/10-fila-de-revisao-clinica.md): definição do inbox clínico pós-sessão, com estados de pipeline, priorização e SLA interno.
- [web/telas/11-transcript-e-rascunho-ia.md](./web/telas/11-transcript-e-rascunho-ia.md): definição da tela principal de revisão humana do transcript e do rascunho gerado pela IA.
- [web/telas/12-prontuario-longitudinal.md](./web/telas/12-prontuario-longitudinal.md): definição do repositório clínico final do paciente ao longo do tempo, separado do fluxo de revisão.
- [web/telas/13-documentos-e-consentimentos.md](./web/telas/13-documentos-e-consentimentos.md): definição da área operacional de documentos, assinaturas e consentimentos do produto.
- [web/telas/14-financeiro.md](./web/telas/14-financeiro.md): definição da área operacional de cobranças, pagamentos, resumo mensal e exportação para contador.
- [web/telas/15-configuracoes.md](./web/telas/15-configuracoes.md): definição da área de governança operacional do terapeuta, cobrindo perfil, conta, segurança, políticas e notificações.
- [web/telas/16-admin-interno.md](./web/telas/16-admin-interno.md): definição da superfície interna da plataforma para tenants, suporte, billing, auditoria e incidentes, com bloqueio de conteúdo clínico por padrão.
- [web/produto/mapa-de-telas.md](./web/produto/mapa-de-telas.md): inventário de telas e conteúdo por perfil/plataforma.
- [web/implementacao/README.md](./web/implementacao/README.md): ponto de entrada da trilha de implementação técnica do web.
- [web/implementacao/01-ordem-de-build.md](./web/implementacao/01-ordem-de-build.md): sequência recomendada para construir o beta web-first.
- [web/implementacao/02-modelo-de-rotas.md](./web/implementacao/02-modelo-de-rotas.md): grupos de rota, guards e organização do App Router.
- [web/implementacao/03-apis-e-contratos.md](./web/implementacao/03-apis-e-contratos.md): contratos iniciais entre frontend, API e jobs assíncronos.
- [web/implementacao/04-backlog-do-mvp.md](./web/implementacao/04-backlog-do-mvp.md): backlog técnico inicial pronto para virar issues ou sprints.
- [web/implementacao/05-prontidao-para-codificar.md](./web/implementacao/05-prontidao-para-codificar.md): veredito operacional sobre o que já está pronto para build e o que ainda depende de gate.
- [web/implementacao/06-prompt-para-nova-sessao-de-build.md](./web/implementacao/06-prompt-para-nova-sessao-de-build.md): prompt completo recomendado para abrir uma nova sessão já focada em código.
- [arquitetura/arquitetura-do-sistema.md](./arquitetura/arquitetura-do-sistema.md): stack proposta, módulos, integrações e fluxos principais.
- [arquitetura/modelo-de-dados.md](./arquitetura/modelo-de-dados.md): entidades principais e relações do domínio.
- [arquitetura/seguranca-e-compliance.md](./arquitetura/seguranca-e-compliance.md): controles de segurança, retenção e governança.
- [web/planejamento/estrategia-de-beta-web-first.md](./web/planejamento/estrategia-de-beta-web-first.md): decisão operacional de começar o MVP pelo web e validar aderência antes de investir em apps nativos.
- [planejamento/roadmap-e-backlog.md](./planejamento/roadmap-e-backlog.md): roadmap por fases, épicos e critérios de saída.
- [planejamento/riscos-reais-e-modos-de-falha.md](./planejamento/riscos-reais-e-modos-de-falha.md): análise direta dos riscos mais perigosos, pontos cegos e modos reais de falha do projeto.
- [planejamento/ia-sem-gravacao-da-sessao.md](./planejamento/ia-sem-gravacao-da-sessao.md): decisão e alternativas para usar IA quando não é permitido capturar o áudio da sessão.
- [planejamento/investigacao-oficial-gravacao-transcricao-e-registro-auxiliar.md](./planejamento/investigacao-oficial-gravacao-transcricao-e-registro-auxiliar.md): investigação baseada em fontes oficiais sobre gravação, transcrição com IA e registro auxiliar separado do prontuário.
- [planejamento/benchmark-heyberries.md](./planejamento/benchmark-heyberries.md): benchmark detalhado da HeyBerries/Berries como referência de mercado para o produto.
- [planejamento/mercado-e-icp.md](./planejamento/mercado-e-icp.md): definição do ICP inicial, tamanho estimado do mercado e racional de foco no psicólogo autônomo.
- [planejamento/unidade-e-precificacao.md](./planejamento/unidade-e-precificacao.md): modelo de unit economics e decisões comerciais a validar.
- [planejamento/perguntas-em-aberto.md](./planejamento/perguntas-em-aberto.md): lista estruturada de decisões pendentes.

## Decisões de trabalho adotadas

- Mercado inicial: Brasil.
- Público inicial: psicólogos.
- ICP inicial: psicólogo autônomo, com clínica privada própria, sem convênio e sem vínculo institucional.
- Canais do beta atual: web do terapeuta e web responsivo do paciente; app nativo fica para fase posterior.
- Tese regulatória de trabalho: operar como `plataforma SaaS para psicólogos`, não como `prestadora direta de serviços de Psicologia`.
- Papel do paciente: uso operacional guiado, sem acesso ao prontuário clínico.
- Teleatendimento: provedor seguro terceirizado; transcript e IA ficam em camada própria quando o contexto jurídico e operacional permitir.
- IA clínica: somente rascunho assistido; aprovação humana obrigatória.
- Áudio/transcrição: módulo `condicional`, não universal; deve ser validado por contexto e parecer jurídico aplicado.
- Direção atual do módulo de IA: `resumo em tópicos`, não nota clínica completa; sem sugestão automática de CID/diagnóstico.
- Direção atual de retenção: não reter áudio bruto nem transcript bruto após processamento.
- Direção atual de infraestrutura: processamento no Brasil, sem transferência internacional na primeira versão.
- Decisão atual de stack gerenciada: `Supabase Postgres + Supabase Storage + Supabase Auth`.
- Financeiro/fiscal do MVP: operação básica, conciliação e preparação; integrações profundas entram depois.
- Modelo operacional do MVP: terapeuta individual, com arquitetura preparada para multi-clínica.
- Estratégia atual de entrega: `beta web-first`, com app nativo posterior à validação do núcleo.

## Ordem sugerida de execução

1. Validar as decisões em [planejamento/perguntas-em-aberto.md](./planejamento/perguntas-em-aberto.md).
2. Congelar o escopo do MVP em [web/produto/prd-mvp.md](./web/produto/prd-mvp.md).
3. Fechar a tese regulatória e os gates de go-live em [licitude-brasil/01-tese-de-licitude-no-brasil.md](./licitude-brasil/01-tese-de-licitude-no-brasil.md) e [licitude-brasil/05-gates-juridicos-para-go-live.md](./licitude-brasil/05-gates-juridicos-para-go-live.md).
4. Fechar stack, integrações e políticas de retenção em [arquitetura/arquitetura-do-sistema.md](./arquitetura/arquitetura-do-sistema.md) e [arquitetura/seguranca-e-compliance.md](./arquitetura/seguranca-e-compliance.md).
5. Quebrar o roadmap em sprints a partir de [planejamento/roadmap-e-backlog.md](./planejamento/roadmap-e-backlog.md).

## Setup local do build atual

### Runtime

- usar `Node 22` via `.nvmrc`
- considerar suportado `Node >=20 <23`
- evitar `Node 25`, porque o modo `dev` atual usa `tsx watch` e o bootstrap do backend foi validado em LTS

### Subida local

```bash
cd /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura
nvm use
cp .env.example .env
npm install
npm run dev
```

### Endpoints esperados

- web: `http://localhost:3000`
- api: `http://localhost:4000`
- health check: `http://localhost:4000/v1/health`

### Credenciais mock do core web

- conta pronta:
  - e-mail: `ana.ready@institutovivace.com.br`
  - senha: `12345678`
  - MFA: `123456`
- conta em ativação:
  - e-mail: `ana@institutovivace.com.br`
  - senha: `12345678`
  - MFA: `123456`

## Observação regulatória

Os documentos abaixo foram escritos para maximizar compliance técnico e operacional, mas não substituem parecer jurídico. Antes de produção, o produto deve passar por revisão de advogado especializado em LGPD, saúde digital e regulamentação do CFP.
