# Web do Terapeuta - Etapa 1 - Estrutura-Base

## 1. Objetivo

Definir o shell do `web admin do terapeuta` de forma fechada, para que todas as próximas telas usem a mesma estrutura de navegação, hierarquia visual, padrões de ação e contratos de dados.

Esta etapa define:

- layout-base do produto
- navegação principal
- header
- breadcrumbs
- padrões globais de listas, detalhes e formulários
- rotas de topo
- regras responsivas do web admin

## 2. Usuário e permissão

### Usuário principal desta etapa

- psicólogo dono da conta no MVP

### Fora do escopo desta etapa

- paciente
- admin interno
- clínica multiusuário com secretária e múltiplos terapeutas

## 3. Decisões travadas nesta etapa

- o web admin é a `superfície principal` de operação do terapeuta no MVP
- o shell será `desktop-first`
- o menu lateral será a navegação principal
- não haverá `busca global` no MVP
- não haverá `command palette` no MVP
- não haverá `troca de organização/tenant` no MVP
- não haverá `dark mode` no MVP
- não haverá `central global de notificações` no MVP
- `prontuário` não entra como item isolado na navegação principal; ele será acessado pela ficha do paciente e pela fila de revisão clínica

## 4. Motivo dessas decisões

- busca global antes de fechar pacientes, agenda e prontuário gera retrabalho de indexação e permissões
- command palette e notification center aumentam esforço sem destravar o produto
- troca de tenant não faz sentido para o MVP de terapeuta individual
- prontuário como item global nesta fase duplica a função de pacientes e revisão clínica
- desktop-first acelera validação dos fluxos densos do terapeuta

## 5. Suporte de viewport

### Prioridade

- experiência principal: `1280px+`
- experiência suportada: `1024px+`

### Comportamento

- `>= 1280px`: sidebar expandida por padrão
- `1024px a 1279px`: sidebar recolhível, conteúdo mais comprimido
- `< 1024px`: o web admin completo não é suportado; o sistema deve exibir mensagem para usar desktop ou app móvel

### Exceções abaixo de 1024px

- login
- recuperação de acesso
- algumas páginas informativas simples, se necessário

## 6. Estrutura geral do shell

O shell terá quatro regiões fixas:

1. `Sidebar lateral`
2. `Header superior`
3. `Faixa de alertas globais`
4. `Área principal de conteúdo`

## 7. Sidebar lateral

### Função

Ser a navegação estrutural principal do terapeuta.

### Largura

- expandida: `264px`
- recolhida: `80px`

### Conteúdo da sidebar

No topo:

- logotipo/nome do produto
- nome curto da conta

Navegação principal:

1. `Dashboard`
2. `Pacientes`
3. `Agenda`
4. `Revisão Clínica`
5. `Financeiro`
6. `Documentos`
7. `Configurações`

No rodapé:

- avatar/nome do terapeuta
- menu de conta
- ação de sair

### Regras

- apenas um item principal ativo por vez
- itens com pendência podem mostrar badge numérico
- `Revisão Clínica` pode exibir badge de pendentes
- `Documentos` pode exibir badge de pendências
- `Financeiro` pode exibir badge de cobranças vencidas, se existir dado para isso

## 8. Header superior

### Função

Exibir contexto da tela atual e ações de utilidade global.

### Estrutura

Lado esquerdo:

- botão de recolher/expandir sidebar
- breadcrumbs

Lado direito:

- indicador de timezone da conta
- estado resumido da conta quando houver pendência crítica
- menu do usuário

### O que não entra no header do MVP

- busca global
- inbox de notificações
- troca de workspace
- ações clínicas globais complexas

## 9. Faixa de alertas globais

### Função

Exibir pendências críticas que bloqueiam operação ou geram risco.

### Exemplos

- MFA não concluído
- contrato pendente
- consentimento padrão não configurado
- integração essencial desconectada
- política de cobrança incompleta

### Regras

- alertas globais aparecem abaixo do header
- devem ser persistentes até resolução
- devem ter CTA claro
- máximo de um alerta crítico por vez em formato destacado

## 10. Área principal de conteúdo

### Regras

- padding horizontal padrão: `24px`
- padding vertical padrão: `24px`
- largura fluida
- páginas densas ocupam largura total
- páginas de formulário simples podem usar container mais estreito

### Estrutura interna padrão

Cada página deve seguir este esqueleto:

1. título da página
2. texto curto de contexto, quando necessário
3. ações primárias e secundárias
4. filtros/controles de página
5. conteúdo principal

## 11. Arquitetura de navegação

### Ordem final do menu

1. Dashboard
2. Pacientes
3. Agenda
4. Revisão Clínica
5. Financeiro
6. Documentos
7. Configurações

### Justificativa da ordem

- `Dashboard` abre a operação diária
- `Pacientes` é o eixo principal do produto
- `Agenda` vem logo depois como operação recorrente
- `Revisão Clínica` fica como área central de valor do SaaS
- `Financeiro` e `Documentos` sustentam a operação
- `Configurações` permanece por último por ser área administrativa

## 12. Rotas de topo do web admin

### Raiz autenticada

- `/app`
- redireciona para `/app/dashboard`
- `/app/onboarding`
  - rota dedicada do modo de ativação da conta antes de `ready_for_operations`

### Rotas principais

- `/app/dashboard`
- `/app/patients`
- `/app/patients/:patientId`
- `/app/patients/:patientId/clinical-record`
- `/app/agenda`
- `/app/appointments/:appointmentId`
- `/app/clinical-review`
- `/app/clinical-review/:appointmentId`
- `/app/finance`
- `/app/finance/charges/:chargeId`
- `/app/documents`
- `/app/documents/:documentId`
- `/app/settings/profile`
- `/app/settings/practice`
- `/app/settings/security`
- `/app/settings/policies`
- `/app/settings/notifications`

### Regras

- rotas principais devem ser profundas o suficiente para refletir domínio, mas sem excesso de níveis
- páginas complexas de edição usam rota própria, não modal
- modais ficam reservados para ações rápidas ou confirmações

## 13. Breadcrumbs

### Regra geral

Os breadcrumbs devem refletir o caminho funcional real, e não apenas a URL.

### Exemplos

- `Dashboard`
- `Pacientes / Maria Souza`
- `Pacientes / Maria Souza / Prontuário`
- `Agenda / Sessão de 30 Mar 2026 - 14:00`
- `Revisão Clínica / Maria Souza`
- `Configurações / Segurança`

### Limites

- máximo de `3 níveis` visíveis
- o último item não é clicável

## 14. Templates base de página

### Template A: Dashboard

Uso:

- visão geral
- cards
- listas resumidas

Estrutura:

- título
- faixa opcional de alertas
- grid de cards
- listas operacionais

### Template B: Lista com detalhe por navegação

Uso:

- pacientes
- documentos
- financeiro

Estrutura:

- título e CTA
- barra de filtros
- tabela
- clique na linha leva para página de detalhe

### Template C: Detalhe com abas ou seções

Uso:

- ficha do paciente
- sessão
- configurações

Estrutura:

- cabeçalho com identidade do objeto
- ações principais
- abas ou seções laterais
- conteúdo do contexto selecionado

### Template D: Agenda

Uso:

- visualização temporal

Estrutura:

- seletor de período
- controles de visualização
- grade/calendário
- painel lateral para ação rápida

### Template E: Revisão clínica

Uso:

- fila
- transcript
- rascunho

Estrutura:

- lista/fila à esquerda ou acima
- conteúdo clínico principal
- ações de aprovar, salvar, descartar

## 15. Padrão global de tabelas

### Estrutura obrigatória

- cabeçalho com nome da coluna
- ordenação apenas nas colunas úteis
- filtros acima da tabela
- paginação no rodapé
- clique na linha abre o detalhe

### Defaults

- paginação padrão: `25 itens`
- opções de paginação: `25`, `50`, `100`
- bulk actions: fora do MVP
- seleção múltipla: fora do MVP

### Busca

- busca é `local por módulo`
- pacientes terão busca própria
- documentos terão busca própria
- financeiro terá busca própria

## 16. Padrão global de filtros

### Regras

- filtros ficam logo abaixo do título da página
- filtros mais usados devem ficar visíveis sem menu extra
- filtros menos usados podem ir para drawer lateral

### Estrutura padrão

- campo de busca local
- chips de status
- filtro de período quando fizer sentido
- botão `Limpar filtros`

## 17. Padrão global de formulários

### Regras

- formulários simples usam coluna única
- formulários densos usam duas colunas apenas em desktop largo
- campos críticos devem ter ajuda contextual curta
- salvar deve ser explícito
- autosave: fora do MVP, salvo em áreas clínicas específicas no futuro

### Ações

- ação primária: salvar
- ação secundária: cancelar
- ação destrutiva: separada visualmente

### Padrão de abertura

- criação/edição complexa: página dedicada
- edição pequena: drawer
- confirmação: modal

## 18. Estados globais

### Loading

- skeletons em listas e cards
- spinners apenas em ações pontuais

### Empty states

Devem sempre responder:

- o que ainda não existe
- por que isso importa
- qual a ação principal para começar

### Error states

Devem sempre responder:

- o que falhou
- se o problema bloqueia a operação
- o que o terapeuta pode fazer agora

## 19. Regras de permissão no shell

### Terapeuta

- acesso total às áreas do menu principal do web admin

### Paciente

- não acessa o web admin do terapeuta

### Admin interno

- terá aplicação ou área separada depois
- não compartilha este shell do terapeuta

## 20. Shell bootstrap e dados mínimos

Para renderizar o shell, o frontend precisa receber:

- identidade do usuário
- papel
- nome da conta
- timezone da conta
- status de MFA
- pendências globais de onboarding/compliance
- badges resumidos do menu
- feature flags

### Interface recomendada

- `GET /v1/auth/me`
- `GET /v1/app-shell/bootstrap`

### Resposta mínima de `GET /app-shell/bootstrap`

- `tenant`
- `therapistProfile`
- `globalAlerts`
- `navigationBadges`
- `featureFlags`
- `timezone`

## 21. Eventos de produto gerados pelo shell

- `shell_loaded`
- `sidebar_item_clicked`
- `sidebar_collapsed`
- `global_alert_cta_clicked`
- `page_viewed`
- `local_filter_applied`

## 22. Atualização de fase

### O que já existe no build atual

- shell do terapeuta em `/app/*` com `sidebar`, `topbar`, faixa global de alertas e badges operacionais
- shell próprio do `portal do paciente` em `/portal/*`
- shell próprio do `admin interno` em `/internal/*`
- navegação sem busca global, preservando a decisão `desktop-first`

### Ajustes documentais desta normalização

- o bootstrap técnico do shell foi alinhado para os endpoints versionados do backend
- a separação de shells por papel deixa de ser só direção futura e passa a ser `estado atual do build`

### Interface recomendada atualizada

- `GET /v1/auth/me`
- `GET /v1/app-shell/bootstrap`

## 22. Critérios de aceite da Etapa 1

- existe um shell único e consistente para todas as telas do terapeuta
- a navegação principal está congelada
- as rotas principais do web estão definidas
- há padrão fechado para listas, filtros, detalhes e formulários
- as regras de viewport do web admin estão definidas
- está explícito o que não entra no MVP do shell

## 23. Dependências que esta etapa destrava

- login e MFA
- onboarding do terapeuta
- dashboard
- pacientes
- agenda
- revisão clínica
- financeiro
- documentos
- configurações

## 24. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/02-login-e-seguranca.md`
