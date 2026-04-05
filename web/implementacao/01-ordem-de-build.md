# Ordem de Build do Web

## 1. Objetivo

Definir a ordem de construção técnica do `beta web-first`, reduzindo retrabalho e garantindo que autenticação, compliance e domínio clínico nasçam na sequência certa.

## 2. Princípios de implementação

- construir por `fatias verticais`, não por camadas isoladas demais
- travar `auth`, `RBAC` e `audit` cedo
- não começar por `áudio/transcrição` antes de sessão, consentimento e revisão estarem claros
- garantir que o produto seja `útil sem áudio`
- cada fase deve deixar o produto mais usável por um terapeuta real
- o fluxo do paciente no beta deve nascer em `web responsivo`, não em app nativo
- manter a primeira versão compatível com `processamento no Brasil` e `descarte automático do bruto`

## 3. Estrutura técnica recomendada do repositório

### Recomendação

Usar uma estrutura única com:

- `apps/web`
- `apps/api`
- `packages/contracts`
- `packages/ui`
- `packages/config`

### Motivo

- permite compartilhar contratos tipados entre web e API
- evita duplicação de componentes e validações
- reduz atrito de build no começo

## 4. Sequência oficial de build

### Fase 0: Foundation do repositório

Construir primeiro:

- workspace
- lint
- format
- teste unitário base
- variáveis de ambiente
- CI mínimo
- design tokens base
- base de configuração para provedores por região
- política de descarte técnico do bruto

Saída da fase:

- web e API sobem localmente
- pipeline básico roda

### Fase 1: Identidade, sessão e tenancy

Construir:

- login
- MFA
- sessão
- proteção de rota
- tenant solo
- papéis base
- audit log mínimo

Saída da fase:

- terapeuta autenticado consegue entrar no shell protegido

### Fase 2: Shell do web e navegação principal

Construir:

- layout do `app`
- sidebar
- header
- breadcrumbs
- estados globais
- bootstrap da sessão autenticada

Saída da fase:

- o terapeuta navega pelo shell do produto com rotas protegidas

### Fase 3: Onboarding do terapeuta e configurações mínimas

Construir:

- wizard de onboarding
- estado da conta
- MFA obrigatório no primeiro acesso
- perfil profissional
- conta/consultório
- segurança da conta

Saída da fase:

- terapeuta consegue ativar a conta até `ready_for_operations`

### Fase 4: Documentos e consentimentos base

Construir:

- modelos padrão
- geração documental
- coleta de aceite
- versionamento
- vínculo com consentimentos
- estrutura para consentimento específico de áudio/transcrição, quando habilitado

Saída da fase:

- produto consegue criar e rastrear documentos obrigatórios

### Fase 5: Patient Ops

Construir:

- lista de pacientes
- criação rápida
- ficha do paciente
- alertas administrativos
- responsável legal

Saída da fase:

- terapeuta consegue operar pacientes no web

### Fase 6: Scheduling

Construir:

- disponibilidade
- bloqueios
- agenda
- criar sessão
- reagendar
- cancelar
- detalhe da sessão

Saída da fase:

- terapeuta consegue agendar e operar a sessão até o momento do atendimento

### Fase 7: Fluxo essencial do paciente em web

Construir:

- aceite de convite
- cadastro inicial
- assinatura de documentos
- pagamento
- acesso à sessão agendada

Saída da fase:

- paciente consegue completar o fluxo operacional essencial sem app nativo

### Fase 8: Teleatendimento

Construir:

- provisionamento de sala
- waiting room
- entrada do terapeuta
- entrada do paciente
- presença
- encerramento
- webhooks do provedor

Saída da fase:

- sessão online funciona ponta a ponta no web

### Fase 9: Pós-sessão core sem áudio

Construir:

- fila de revisão clínica
- modo `texto/ditado` do terapeuta
- pipeline assíncrono de pós-sessão
- geração de resumo em tópicos
- aprovação humana
- prontuário longitudinal
- descarte automático de artefatos brutos, quando existirem

Saída da fase:

- pós-sessão central do SaaS funciona sem depender de captura de áudio

### Fase 10: Billing core

Construir:

- criação de cobrança
- status
- baixa manual ou automática
- exportação
- resumo financeiro

Saída da fase:

- terapeuta enxerga cobrança e pagamento ligados ao atendimento

### Fase 11: Admin interno mínimo

Construir:

- visão geral
- tenants
- suporte por metadata
- billing ops
- auditoria
- incidentes

Saída da fase:

- operação interna consegue suportar o beta sem abrir acesso clínico indevido

### Fase 12: Áudio/transcrição condicional

Construir:

- capability flag por tenant/conta
- consentimento específico de áudio/transcrição
- integração com ASR compatível com processamento no Brasil
- descarte automático de áudio bruto e transcript bruto
- auditoria específica do caminho de áudio

Saída da fase:

- modo `áudio/transcrição` pode ser habilitado apenas em contextos aprovados

### Fase 13: Endurecimento para beta

Construir:

- observabilidade ponta a ponta
- métricas de custo por sessão
- processos de suporte
- runbooks
- revisão de segurança
- testes de fluxo completo

Saída da fase:

- produto pronto para beta privado com profissionais reais

## 5. Primeiras fatias verticais recomendadas

### Fatia 1

- login
- MFA
- shell autenticado

### Fatia 2

- onboarding do terapeuta
- estado da conta
- bloqueio por pendência crítica

### Fatia 3

- paciente
- documento obrigatório
- criação de sessão

### Fatia 4

- entrada do paciente por web
- videochamada
- fila clínica

### Fatia 5

- modo `texto/ditado`
- resumo em tópicos
- aprovação clínica

### Fatia 6

- cobrança básica
- prontuário longitudinal

### Fatia 7

- áudio/transcrição condicional

## 6. O que não começar primeiro

- semântica avançada de prontuário
- analytics sofisticado
- integrações fiscais profundas
- mobile nativo
- customizações enterprise
- sugestão de CID ou classificação clínica por IA
- dependência estrutural de transcript como único caminho de valor

## 7. Regra de saída entre fases

Cada fase só deve ser considerada concluída quando houver:

- fluxo funcional ponta a ponta daquela fase
- autorização e trilha mínima corretas
- estados de erro mínimos tratados
- telemetria ou logs suficientes para suporte
