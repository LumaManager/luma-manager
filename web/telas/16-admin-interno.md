# Web Interno - Etapa 16 - Admin Interno

## 1. Objetivo

Definir de forma fechada a área de `admin interno` da plataforma, cobrindo:

- operação interna de tenants
- suporte operacional
- billing ops
- auditoria e compliance ops
- incidentes
- limites rígidos de acesso a dados sensíveis

## 2. Papel da área no produto

O admin interno é a `superfície operacional da empresa dona da plataforma`.

Ela precisa responder rapidamente:

1. quais contas/tenants existem e em que estado estão?
2. quais problemas de suporte, billing ou ativação precisam de ação?
3. como investigar eventos e incidentes sem expor conteúdo clínico?
4. como provar auditoria e governança interna?
5. como operar o produto sem transformar o backoffice em risco regulatório?

## 3. Escopo desta etapa

### Dentro do escopo

- lista e detalhe de tenants
- visão operacional de contas e status
- suporte interno baseado em metadata
- billing ops
- trilha de auditoria interna
- gestão de incidentes operacionais

### Fora do escopo

- leitura livre de prontuário
- leitura livre de transcript
- edição de conteúdo clínico
- impersonação irrestrita
- administração de infraestrutura low-level
- suíte enterprise de IAM interno completa

## 4. Decisões travadas nesta etapa

- o admin interno será uma `superfície separada` do web do terapeuta
- o prefixo de rota será `/internal`
- o acesso exige `MFA obrigatório` e perfil interno autorizado
- suporte interno opera por `metadata-first`, não por leitura de conteúdo clínico
- conteúdo clínico fica `indisponível por padrão` para o admin interno no MVP
- auditoria interna, billing e incidentes ficam separados em módulos claros
- qualquer ação interna sensível exige rastreabilidade reforçada
- o MVP não terá break-glass para leitura clínica ampla; esse fluxo só pode existir depois, se houver necessidade jurídica e técnica formalizada

## 5. Usuários e permissões

### Perfis internos do MVP

- `support_ops`
- `billing_ops`
- `compliance_ops`
- `security_admin`
- `platform_admin`

### Regras

- `platform_admin` não significa acesso automático ao conteúdo clínico
- cada perfil vê apenas os módulos compatíveis com sua função
- leitura e ação devem combinar `RBAC` e restrições adicionais por contexto
- permissões internas devem ser auditáveis e revisáveis

## 6. Rotas internas

### Rotas principais

- `/internal`
- `/internal/waitlist`
- `/internal/tenants`
- `/internal/tenants/:tenantId`
- `/internal/support`
- `/internal/billing`
- `/internal/audit`
- `/internal/incidents`

### Regras

- a navegação interna não reaproveita o mesmo shell do terapeuta
- o branding visual deve deixar claro que esta é uma área interna e restrita
- links profundos precisam respeitar permissão por módulo

## 7. Estrutura geral da área

Esta área usa um `shell interno` próprio.

Estrutura final:

1. header interno
2. navegação lateral por módulo
3. banner de segurança/compliance
4. conteúdo principal
5. barra contextual de filtros e ações

## 8. Header interno

### Conteúdo obrigatório

- identificação do usuário interno
- papel interno atual
- ambiente
- acesso rápido para sessão e segurança

### Regras

- ambiente precisa ser sempre visível para evitar erro operacional
- ações sensíveis não devem ficar escondidas em menus ambíguos

## 9. Navegação interna

### Módulos do MVP

1. `Visão geral`
2. `Waitlist`
3. `Tenants`
4. `Suporte`
5. `Billing`
6. `Auditoria`
7. `Incidentes`

### Regras

- cada módulo tem rota própria
- itens sem permissão não aparecem na navegação
- não existe item chamado `Prontuários` ou equivalente na navegação interna

## 10. Módulo: Visão geral

### Objetivo

Dar leitura rápida do estado operacional da plataforma.

### Conteúdo mínimo

- tenants ativos
- contas com onboarding incompleto
- falhas recentes de integração
- pendências de billing
- incidentes abertos
- alertas de compliance ops

### Regras

- é uma visão `operacional`, não BI corporativo
- não deve expor texto clínico, nomes de sessões ou conteúdo sensível desnecessário

## 11. Módulo: Tenants

### Objetivo

Permitir localizar e acompanhar contas da plataforma.

### Lista de tenants

Campos mínimos:

- nome da conta
- tipo de conta
- status operacional
- status do onboarding
- status de billing
- data de criação
- último evento relevante

### Detalhe do tenant

Conteúdo mínimo:

- dados cadastrais do tenant
- estado da conta
- quantidade de usuários
- quantidade de pacientes
- saúde operacional das integrações
- documentos críticos pendentes
- eventos recentes não clínicos

### Regras

- a tela de tenant usa `metadata` e indicadores operacionais
- nomes de pacientes podem aparecer apenas quando estritamente necessários para suporte operacional, e sem conteúdo clínico associado
- o detalhe do tenant deve oferecer links para tickets, billing e eventos relacionados

## 10A. Módulo: Waitlist

### Objetivo

Dar leitura rápida de intenção de mercado sem sair do admin interno.

### Conteúdo mínimo

- entradas totais
- leads com contexto enriquecido
- leads com campanha identificada
- origem mais frequente
- dor principal mais frequente
- tabela recente com perfil, gargalo, origem e última atualização

### Regras

- esta visão continua `metadata-first`
- não é CRM completo nem automação de marketing
- o foco é entender aderência da landing e qualidade dos sinais capturados

## 12. Módulo: Suporte

### Objetivo

Operar atendimento interno a problemas do cliente sem abrir acesso amplo a dados sensíveis.

### Conteúdo mínimo

- fila de tickets
- status do ticket
- tenant relacionado
- categoria
- prioridade
- último evento

### Regras

- ticket deve referenciar tenant, usuário e fluxo afetado
- logs operacionais exibidos no suporte precisam ser redigidos e sem payload clínico
- suporte pode ver status de sessão, falha de integração e estados de pipeline, mas não transcript nem prontuário

## 13. Módulo: Billing

### Objetivo

Centralizar a operação financeira da plataforma no nível da conta cliente.

### Conteúdo mínimo

- plano
- status da assinatura
- faturas internas da plataforma
- inadimplência
- eventos de cobrança da conta cliente

### Regras

- billing interno trata a relação comercial SaaS, não a cobrança do paciente final
- billing ops não precisa ler nenhum dado clínico para operar

## 14. Módulo: Auditoria

### Objetivo

Dar visibilidade a eventos sensíveis para investigação e governança.

### Conteúdo mínimo

- busca por evento
- filtros por ator, tenant, módulo e intervalo
- eventos de login
- eventos de alteração sensível
- eventos de acesso a documento ou domínio clínico
- exportações e revogações

### Regras

- o módulo mostra `event metadata`, não conteúdo integral do dado acessado
- eventos clínicos devem apontar que houve acesso, sem replicar o conteúdo clínico no log
- exportação de logs exige permissão específica

## 15. Módulo: Incidentes

### Objetivo

Controlar incidentes operacionais, de segurança e de compliance.

### Conteúdo mínimo

- lista de incidentes
- severidade
- status
- responsável
- tenants impactados
- timeline do incidente

### Regras

- incidentes devem ter trilha clara de abertura, contenção, investigação e encerramento
- incidentes ligados a dados sensíveis precisam de marcação explícita
- o módulo não substitui ferramentas técnicas de observabilidade, mas centraliza o processo operacional

## 16. Segurança do admin interno

### Controles mínimos

- MFA obrigatório
- expiração curta de sessão
- revogação de sessão
- step-up authentication para ações críticas
- trilha de auditoria reforçada
- revisão periódica de acesso interno

### Regras críticas

- acesso interno não pode ser compartilhado
- ações destrutivas ou exportações exigem confirmação forte
- a política interna deve assumir que usuários internos também são fonte potencial de risco

## 17. Limites de acesso ao conteúdo clínico

### Regra principal

- admin interno não navega livremente por conteúdo clínico

### Consequências práticas no MVP

- não existe tela interna de leitura de prontuário
- não existe tela interna de leitura de transcript
- suporte vê estado do pipeline clínico, não o conteúdo
- auditoria registra o acesso clínico do terapeuta sem replicar o conteúdo acessado

### Fluxo excepcional

- fora do escopo do MVP
- qualquer futuro break-glass exigirá desenho próprio, aprovação formal, justificativa obrigatória e auditoria máxima

## 18. Estados da área

### Loading

- skeleton de cards, listas e tabelas

### Empty states

- sem incidentes abertos
- sem tickets pendentes
- sem tenants no filtro

### Error states

- falha ao carregar módulo
- acesso negado
- tenant inexistente

## 19. Eventos e rastreabilidade

### Eventos internos mínimos

- login interno
- falha de login interno
- alteração de permissão
- abertura de ticket
- mudança de status de incidente
- exportação de auditoria
- ação sensível em tenant

### Regras

- todo evento interno deve registrar ator, data/hora, módulo e alvo

## Nota de implementação - Sessão 10

- o build atual já materializa o shell `/internal` e os módulos `Visão geral`, `Tenants`, `Suporte`, `Billing`, `Auditoria` e `Incidentes`
- o login mock interno usa `ops@terapia.internal` e resolve o destino da sessão sem reutilizar o shell do terapeuta
- a UI segue `metadata-first`, sem qualquer superfície livre de leitura clínica
- justificativa é obrigatória para ações sensíveis definidas por política

## 20. Dados mínimos para renderizar a área

- internalUserProfile
- internalRoleSet
- internalSecurityStatus
- platformOpsSummary
- tenantList
- supportQueueSummary
- billingOpsSummary
- auditEventSummary
- incidentSummary
