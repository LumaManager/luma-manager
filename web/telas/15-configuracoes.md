# Web do Terapeuta - Etapa 15 - Configurações

## 1. Objetivo

Definir de forma fechada a área de `configurações` no web admin do terapeuta, cobrindo:

- perfil profissional
- conta e dados do consultório
- segurança da conta
- políticas operacionais padrão
- preferências de notificação
- regras de versionamento e impacto regulatório

## 2. Papel da tela no produto

Configurações é a `superfície de governança operacional do terapeuta`.

Ela precisa responder rapidamente:

1. quais dados definem meu perfil profissional e meu consultório?
2. onde ajusto políticas que impactam agenda, teleatendimento, transcript e cobrança?
3. como reviso a segurança da conta e as sessões ativas?
4. quais notificações eu recebo e por quais canais?
5. quais mudanças afetam só o futuro e quais exigem controle reforçado?

## 3. Escopo desta etapa

### Dentro do escopo

- edição do perfil profissional
- manutenção dos dados da conta/consultório
- segurança da conta
- políticas operacionais do tenant do terapeuta
- preferências de notificações
- auditoria resumida de alterações sensíveis

### Fora do escopo

- gestão multiusuário de clínica
- permissões por função para equipe
- edição avançada de templates jurídicos
- integrações customizadas
- white-label
- administração interna da plataforma

## 4. Decisões travadas nesta etapa

- a rota principal será `/app/settings`
- a área não será um `depósito de opções`; ela será organizada por `seções de governança`
- dados capturados no onboarding passam a ser mantidos aqui depois da ativação da conta
- mudanças sensíveis exigem `step-up authentication`
- alterações relevantes de compliance e operação geram `audit trail`
- configurações com impacto regulatório ou operacional devem ser `prospectivas`, não retroativas por padrão
- o MVP não terá área de integrações nem customização visual avançada
- a conta `pending_setup` continua sendo tratada pelo fluxo de onboarding, não pela área de configurações

## 5. Rotas e permissão

### Rotas

- `/app/settings`
- `/app/settings/profile`
- `/app/settings/practice`
- `/app/settings/security`
- `/app/settings/policies`
- `/app/settings/notifications`

### Permissão

- terapeuta autenticado

### Regras de acesso

- `ready_for_operations`: acesso completo
- `restricted`: acesso permitido com banners de remediação e eventuais bloqueios parciais
- `pending_setup`: redireciona para onboarding

### Regra crítica

- o terapeuta só pode alterar configurações do seu próprio tenant
- alterações sensíveis devem ser auditadas com ator, data/hora e tipo de mudança

## 6. Estrutura geral da área

Esta área usa o `Template C: Detalhe com navegação interna por seções`.

Estrutura final:

1. breadcrumbs
2. cabeçalho da área
3. banners de status/remediação
4. navegação interna
5. conteúdo da seção ativa
6. barra de ações da seção

## 7. Cabeçalho da área

### Título

- `Configurações`

### Subtítulo

- frase curta explicando que a área concentra perfil, conta, segurança e políticas operacionais

Exemplo:

- `Gerencie dados do consultório, segurança da conta e políticas padrão de operação.`

### Indicadores auxiliares permitidos

- status da conta
- status do MFA
- data da última alteração sensível

### Ações globais

- nenhuma ação global destrutiva no cabeçalho do MVP

## 8. Navegação interna

### Seções do MVP

1. `Perfil profissional`
2. `Conta e consultório`
3. `Segurança`
4. `Políticas operacionais`
5. `Notificações`

### Regras

- cada seção deve ter rota própria
- a navegação deve suportar deep link
- salvar acontece por seção, não para a página inteira

## 9. Seção: Perfil profissional

### Objetivo

Permitir manutenção do perfil público e operacional do terapeuta.

### Campos mínimos

- nome completo
- nome social, quando aplicável
- e-mail profissional de contato
- telefone profissional
- CRP e UF do registro
- especialidade/áreas de atuação
- timezone

### Regras

- alteração de `CRP` exige step-up authentication
- mudança de `CRP` ou nome legal precisa gerar auditoria reforçada
- dados visíveis ao paciente devem ficar claramente identificados na interface
- `timezone` afeta agenda e notificações futuras, não reescreve histórico passado

## 10. Seção: Conta e consultório

### Objetivo

Manter os dados institucionais e fiscais mínimos usados pelo produto.

### Campos mínimos

- nome do consultório
- nome exibido ao paciente
- CPF/CNPJ
- endereço principal
- cidade/UF
- telefone do consultório
- dados mínimos para cobrança/recibo, quando aplicável

### Regras

- alteração de CPF/CNPJ ou dados de recebimento exige step-up authentication
- documentos e cobranças já emitidos devem preservar o snapshot histórico necessário
- esta seção não substitui uma suíte fiscal completa

## 11. Seção: Segurança

### Objetivo

Centralizar os controles de acesso já definidos na etapa de login e segurança.

### Conteúdo mínimo

- e-mail de login
- status do MFA
- gerenciamento de códigos de recuperação
- resumo de sessões/dispositivos ativos
- alteração de senha
- revogação de sessões
- último evento crítico de segurança

### Regras

- esta seção complementa a etapa `02-login-e-seguranca`
- reset de MFA ou troca de e-mail de login exige step-up authentication
- eventos críticos de segurança não podem ser apagados pelo terapeuta

## 12. Seção: Políticas operacionais

### Objetivo

Definir defaults de operação do consultório sem transformar a área em rule engine complexa.

### Políticas mínimas do MVP

- duração padrão da sessão
- modalidade padrão de atendimento
- janela de cancelamento/reagendamento
- paciente pode ou não agendar sozinho
- teleatendimento habilitado ou desabilitado
- transcript habilitado por padrão, quando houver consentimento válido
- geração automática de cobrança após sessão, quando configurada

### Regras

- essas políticas funcionam como `defaults`
- mudanças afetam operações futuras por padrão
- nenhuma política pode sobrescrever ausência de consentimento válido
- desabilitar transcript não apaga transcripts ou revisões já existentes
- desabilitar teleatendimento não altera retrospectivamente sessões já concluídas

## 13. Seção: Notificações

### Objetivo

Permitir que o terapeuta controle o que quer receber de forma operacional.

### Canais do MVP

- `In-app`
- `E-mail`

### Preferências mínimas

- lembretes de sessão
- novo documento assinado
- consentimento revogado
- cobrança recebida
- cobrança vencida
- item pendente na revisão clínica
- alerta de segurança

### Regras

- alertas de segurança críticos não podem ser totalmente desligados
- preferências mudam o comportamento futuro das notificações, não o histórico
- configuração de notificações do terapeuta não altera o conteúdo notificado ao paciente

## 14. Modelo de salvamento

### Regras

- cada seção tem `Salvar alterações` próprio
- alterações não salvas precisam ficar visíveis
- mudanças sensíveis exigem reautenticação contextual
- após sucesso, mostrar confirmação objetiva e não intrusiva

### Estados mínimos

- `sem alterações`
- `alterações pendentes`
- `salvando`
- `salvo`
- `erro ao salvar`

## 15. Versionamento e impacto regulatório

### Regra principal

- configuração não deve reescrever passado regulatório sem fluxo explícito

### Consequências práticas

- políticas novas valem para novos fluxos ou novos artefatos
- documentos/consentimentos já emitidos preservam a versão e o contexto original
- alterações sensíveis precisam gerar evento de auditoria
- mudanças de política podem exigir reemissão documental futura, mas isso deve acontecer por fluxo explícito

## 16. Relação com outras áreas do produto

### Onboarding

- onboarding captura os dados iniciais
- configurações mantém esses dados após a ativação

### Agenda

- usa defaults como duração padrão e regras de cancelamento

### Videochamada e transcript

- respeitam política de teleatendimento e transcript, sem violar consentimentos

### Financeiro

- usa dados de conta/consultório e defaults de cobrança quando aplicável

### Documentos

- usa contexto institucional e políticas vigentes para novos envios, sem alterar histórico anterior

## 17. Estados da área

### Loading

- skeleton da navegação interna
- skeleton dos formulários

### Empty state

- não se aplica como estado principal

### Error state

- falha ao carregar configurações
- seção indisponível
- acesso bloqueado por status da conta

### Restricted state

- banner explicando o motivo da restrição
- CTA para corrigir o item pendente
- seções não relacionadas podem continuar acessíveis, quando seguro

## 18. Casos especiais

### Conta restrita

- a área deve destacar exatamente o que precisa ser corrigido
- o terapeuta não deve precisar procurar a pendência em várias telas

### Mudança de política de transcript com itens pendentes

- itens já pendentes continuam revisáveis
- a nova política vale para sessões futuras, conforme consentimentos válidos

### Mudança de e-mail de login

- exige verificação adicional e auditoria
- pode encerrar sessões ativas conforme política de segurança

### Mudança de dados fiscais

- não deve corromper histórico de cobranças ou documentos anteriores

## 19. Dados mínimos para renderizar a área

- accountStatus
- therapistProfile
- practiceProfile
- securitySummary
- policySettings
- notificationSettings
- pendingRemediationItems
- lastSensitiveChanges

## 20. Atualizacao de fase

### O que ja existe no build atual

- `GET /v1/settings`
- `POST /v1/settings/profile`
- `POST /v1/settings/practice`
- `POST /v1/settings/security`
- `POST /v1/settings/policies`
- `POST /v1/settings/notifications`
- rotas web:
  - `/app/settings/profile`
  - `/app/settings/practice`
  - `/app/settings/security`
  - `/app/settings/policies`
  - `/app/settings/notifications`

### Decisoes aplicadas nesta sessao

- a area foi implementada como `bootstrap unico + salvamento por secao`
- `pending_setup` agora redireciona para onboarding antes de abrir configuracoes
- o estado de seguranca segue enxuto no MVP: foco em MFA, sessoes, codigos de recuperacao e trilha critica
- a trilha de alteracoes sensiveis aparece fixa na lateral para reforcar governanca

### Observacao de fase

- mudanca de e-mail de login, CRP e dados fiscais gera `step-up required` no retorno da API, mas a reautenticacao continua simulada nesta fase
- politicas permanecem prospectivas por default e nao reescrevem documentos, cobrancas ou sessoes anteriores
