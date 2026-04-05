# Implementação do Web

Este diretório transforma a definição funcional do `web` em uma trilha de execução técnica.

## Documentos

- [01-ordem-de-build.md](./01-ordem-de-build.md): sequência recomendada de construção do produto.
- [02-modelo-de-rotas.md](./02-modelo-de-rotas.md): organização das rotas do web, guards e grupos de navegação.
- [03-apis-e-contratos.md](./03-apis-e-contratos.md): contratos iniciais entre frontend, backend e jobs assíncronos.
- [04-backlog-do-mvp.md](./04-backlog-do-mvp.md): backlog técnico inicial do beta web-first.
- [05-prontidao-para-codificar.md](./05-prontidao-para-codificar.md): avaliação objetiva do que já está pronto para build e do que ainda precisa ficar condicional.
- [06-prompt-para-nova-sessao-de-build.md](./06-prompt-para-nova-sessao-de-build.md): prompt operacional completo para abrir uma nova sessão já focada em implementação.
- [19-ajustes-de-ui-e-copia.md](./19-ajustes-de-ui-e-copia.md): decisões recentes de densidade visual, acentuação da cópia e comportamento do shell em notebook.
- [20-sessao-12-polimento-core-e-mutacoes-da-sessao.md](./20-sessao-12-polimento-core-e-mutacoes-da-sessao.md): polimento do core web, agenda mais sólida e mutações reais de reagendar/cancelar.
- [21-sessao-13-agenda-bloqueios-e-polimento.md](./21-sessao-13-agenda-bloqueios-e-polimento.md): criação real de bloqueios, lateral mais operacional e nova passada de polish na agenda.
- [22-sessao-14-edicao-e-exclusao-de-bloqueios.md](./22-sessao-14-edicao-e-exclusao-de-bloqueios.md): ciclo completo de bloqueios com edição e exclusão direto na agenda.
- [23-sessao-15-disponibilidade-recorrente-na-agenda.md](./23-sessao-15-disponibilidade-recorrente-na-agenda.md): edição da disponibilidade recorrente sem sair da agenda.
- [24-sessao-16-quick-view-da-sessao-na-agenda.md](./24-sessao-16-quick-view-da-sessao-na-agenda.md): contexto rápido da sessão direto na grade.
- [25-sessao-17-reposicionamento-pela-grade.md](./25-sessao-17-reposicionamento-pela-grade.md): remarcação controlada escolhendo o novo slot diretamente no calendário.
- [26-sessao-18-sinalizacao-visual-da-agenda.md](./26-sessao-18-sinalizacao-visual-da-agenda.md): destaque visual do item ativo e do item em reposicionamento.
- [27-sessao-19-polimento-visual-das-superficies.md](./27-sessao-19-polimento-visual-das-superficies.md): hero operacional compartilhado e passada forte de polish nas telas prontas.
- [28-sessao-20-polimento-shell-settings-e-portal.md](./28-sessao-20-polimento-shell-settings-e-portal.md): refinamento visual do shell, de configurações e do portal do paciente.
- [29-sessao-21-polimento-auth-onboarding-internal-e-portal-detail.md](./29-sessao-21-polimento-auth-onboarding-internal-e-portal-detail.md): revisão visual do login, onboarding, internal e telas restantes do portal.
- [30-sessao-22-normalizacao-documental.md](./30-sessao-22-normalizacao-documental.md): alinhamento de `web/telas`, `02-modelo-de-rotas`, `03-apis-e-contratos` e índices ao estado real da UI.
- [31-sessao-23-landing-page-waitlist.md](./31-sessao-23-landing-page-waitlist.md): landing pública orientada à conversão e captura de intenção via waitlist.
- [32-preview-estatico-da-landing.md](./32-preview-estatico-da-landing.md): fallback temporário para avaliação visual da landing quando o runtime local do `Next` não estiver respondendo.
- [33-sessao-25-refino-da-dobra-inicial-da-landing.md](./33-sessao-25-refino-da-dobra-inicial-da-landing.md): correção da dobra inicial, do scroll e da legibilidade do formulário da landing.
- [34-sessao-26-refino-da-hierarquia-da-waitlist.md](./34-sessao-26-refino-da-hierarquia-da-waitlist.md): limpeza da hierarquia visual do hero e compactação do bloco lateral da waitlist.
- [35-sessao-27-pos-clique-da-waitlist.md](./35-sessao-27-pos-clique-da-waitlist.md): captura mínima funcional e estado explícito depois do clique em `Entrar na waitlist`.
- [36-sessao-28-landing-real-tracking-e-waitlist-interna.md](./36-sessao-28-landing-real-tracking-e-waitlist-interna.md): ligação da landing ao summary real, tracking leve de origem e visão interna da fila capturada.
- [37-plano-operacional-de-distribuicao-da-landing.md](./37-plano-operacional-de-distribuicao-da-landing.md): cadência manual, UTMs e templates de outreach para distribuir a landing com qualidade.

## Como usar

1. Ler os documentos de `web/produto` e `web/telas`.
2. Entrar nesta pasta para transformar definição em build order.
3. Usar os documentos compartilhados de `arquitetura/` e `planejamento/` quando a decisão sair do escopo do web.

## Setup local desta fase

- runtime recomendado: `Node 22`
- faixa suportada para o monorepo atual: `Node >=20 <23`
- se o `login` mostrar `Failed to fetch`, validar primeiro se a API respondeu em `http://localhost:4000/v1/health`
