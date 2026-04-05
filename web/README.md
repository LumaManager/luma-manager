# Pacote do Web

Leitura inicial deste pacote: [00-indice-web.md](./00-indice-web.md)

Este diretório concentra a documentação diretamente ligada ao `beta web-first` e à construção do `web` como produto principal do MVP.

## Estrutura

- [fundacao/README.md](./fundacao/README.md): decisões que precisam ser fechadas antes do build principal.
- [fundacao/01-gates-pre-build.md](./fundacao/01-gates-pre-build.md): checklist de pré-build.
- [fundacao/02-stack-recomendada.md](./fundacao/02-stack-recomendada.md): stack recomendada para o web.
- [fundacao/03-direcao-de-branding-e-ui.md](./fundacao/03-direcao-de-branding-e-ui.md): direção visual, branding e UI.
- [fundacao/04-layout-e-composicao-do-web.md](./fundacao/04-layout-e-composicao-do-web.md): consolidação de layout e composição.
- [fundacao/05-sinais-de-mercado.md](./fundacao/05-sinais-de-mercado.md): benchmark de padrões que parecem funcionar no mercado.
- [produto/prd-mvp.md](./produto/prd-mvp.md): escopo funcional e critérios de aceite do MVP web-first.
- [produto/ordem-de-definicao-de-telas.md](./produto/ordem-de-definicao-de-telas.md): sequência oficial de definição das telas do web.
- [produto/mapa-de-telas.md](./produto/mapa-de-telas.md): inventário geral de telas e superfícies do produto.
- [planejamento/estrategia-de-beta-web-first.md](./planejamento/estrategia-de-beta-web-first.md): decisão oficial de começar a validação pelo web.
- [planejamento/benchmark-landing-docspsi-e-adaptacao.md](./planejamento/benchmark-landing-docspsi-e-adaptacao.md): teardown da arquitetura de conversão do DocsPSI e adaptação recomendada para a landing do produto.
- [implementacao/README.md](./implementacao/README.md): ponto de entrada da trilha técnica de implementação.
- [implementacao/01-ordem-de-build.md](./implementacao/01-ordem-de-build.md): sequência recomendada de construção.
- [implementacao/02-modelo-de-rotas.md](./implementacao/02-modelo-de-rotas.md): modelo canônico de rotas do web.
- [implementacao/03-apis-e-contratos.md](./implementacao/03-apis-e-contratos.md): contratos iniciais entre frontend, API e jobs.
- [implementacao/04-backlog-do-mvp.md](./implementacao/04-backlog-do-mvp.md): backlog técnico inicial do beta web-first.
- [telas/01-estrutura-base-do-web.md](./telas/01-estrutura-base-do-web.md): shell do web admin.
- [telas/02-login-e-seguranca.md](./telas/02-login-e-seguranca.md): autenticação e segurança.
- [telas/03-onboarding-do-terapeuta.md](./telas/03-onboarding-do-terapeuta.md): ativação da conta.
- [telas/04-dashboard-do-terapeuta.md](./telas/04-dashboard-do-terapeuta.md): dashboard operacional.
- [telas/05-lista-de-pacientes.md](./telas/05-lista-de-pacientes.md): diretório operacional de pacientes.
- [telas/06-ficha-do-paciente.md](./telas/06-ficha-do-paciente.md): detalhe principal do paciente.
- [telas/07-agenda-do-terapeuta.md](./telas/07-agenda-do-terapeuta.md): agenda e disponibilidade.
- [telas/08-detalhe-da-sessao.md](./telas/08-detalhe-da-sessao.md): ponto de entrada da consulta.
- [telas/09-videochamada-no-web.md](./telas/09-videochamada-no-web.md): sessão ao vivo no web.
- [telas/10-fila-de-revisao-clinica.md](./telas/10-fila-de-revisao-clinica.md): inbox pós-sessão.
- [telas/11-transcript-e-rascunho-ia.md](./telas/11-transcript-e-rascunho-ia.md): revisão humana do transcript e do rascunho.
- [telas/12-prontuario-longitudinal.md](./telas/12-prontuario-longitudinal.md): prontuário final do paciente.
- [telas/13-documentos-e-consentimentos.md](./telas/13-documentos-e-consentimentos.md): documentos e consentimentos.
- [telas/14-financeiro.md](./telas/14-financeiro.md): cobranças e acompanhamento financeiro.
- [telas/15-configuracoes.md](./telas/15-configuracoes.md): governança operacional do terapeuta.
- [telas/16-admin-interno.md](./telas/16-admin-interno.md): backoffice interno da plataforma.

## Documentos compartilhados que continuam fora deste pacote

- [../arquitetura/arquitetura-do-sistema.md](../arquitetura/arquitetura-do-sistema.md): arquitetura técnica geral.
- [../arquitetura/modelo-de-dados.md](../arquitetura/modelo-de-dados.md): entidades e relações.
- [../arquitetura/seguranca-e-compliance.md](../arquitetura/seguranca-e-compliance.md): segurança, retenção e compliance.
- [../planejamento/roadmap-e-backlog.md](../planejamento/roadmap-e-backlog.md): roadmap macro e backlog.
- [../planejamento/unidade-e-precificacao.md](../planejamento/unidade-e-precificacao.md): economics e precificação.
- [../planejamento/perguntas-em-aberto.md](../planejamento/perguntas-em-aberto.md): decisões ainda pendentes.

## Regra de uso

Para qualquer trabalho de construção do `web`, começar por este pacote e recorrer aos documentos compartilhados apenas quando a decisão depender de arquitetura, compliance ou planejamento macro.
