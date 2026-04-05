# Backlog Técnico do MVP Web

## 1. Objetivo

Transformar a definição funcional do produto em um backlog técnico inicial, pronto para quebrar em issues, sprints ou tarefas de agente.

## 2. Regras de priorização

- `P0`: bloqueia o beta web-first
- `P1`: necessário para operação real do terapeuta
- `P2`: importante, mas pode entrar depois do fluxo principal

## 3. Backlog P0

### Fundação

- configurar workspace de `web`, `api` e contratos compartilhados
- configurar lint, format, testes base e CI
- configurar autenticação, sessão e MFA
- configurar shell autenticado do terapeuta
- configurar audit log mínimo
- configurar base de processamento no Brasil
- configurar políticas de descarte automático do bruto

### Operação do terapeuta

- implementar onboarding do terapeuta
- implementar estados da conta
- implementar lista e ficha do paciente
- implementar documentos e consentimentos base
- implementar agenda e detalhe da sessão

### Paciente web essencial

- implementar aceite de convite
- implementar cadastro inicial
- implementar assinatura de documentos
- implementar acesso à sessão

### Sessão e pós-sessão

- integrar videochamada no web
- implementar fila de revisão clínica
- implementar modo `texto/ditado` do terapeuta para geração assistida
- implementar pipeline de pós-sessão
- implementar geração de resumo em tópicos
- implementar aprovação de prontuário
- implementar descarte automático de áudio bruto e transcript bruto
- implementar bloqueio explícito de CID/diagnóstico por IA

## 4. Backlog P1

- financeiro com criação de cobrança
- baixa manual/automática
- resumo financeiro
- configurações completas do terapeuta
- portal de pagamentos do paciente
- admin interno mínimo
- incidentes e auditoria interna
- observabilidade de custo por sessão
- consentimento específico para áudio/transcrição quando o módulo estiver habilitado

## 5. Backlog P2

- importação de pacientes
- automações de lembrete mais ricas
- dashboards mais elaborados
- busca clínica futura
- suporte avançado a clínica multiusuário
- habilitação do modo `áudio/transcrição` em contextos aprovados

## 6. Dependências técnicas por bloco

### Auth e shell

Dependem de:

- estrutura do repositório
- estratégia de sessão
- contratos de `me`

### Pacientes e agenda

Dependem de:

- tenant
- permissões
- onboarding do terapeuta

### Teleatendimento

Dependem de:

- sessão
- consentimento
- provedor de vídeo

### Pós-sessão assistido por IA

Dependem de:

- encerramento de sessão confiável
- pipeline assíncrono
- política de retenção e descarte
- provedor de ASR compatível com processamento no Brasil
- provedor de LLM

## 7. Definition of Done do backlog técnico

Cada item só deve ser considerado concluído quando houver:

- fluxo principal funcionando
- estados de loading, vazio e erro mínimos
- logs ou telemetria suficientes
- auditoria mínima quando o item for sensível
- cobertura de teste proporcional ao risco

## 8. Primeiro lote recomendado de implementação

### Lote 1

- workspace
- auth
- MFA
- shell

### Lote 2

- onboarding
- settings mínimos
- estados da conta

### Lote 3

- pacientes
- documentos
- consentimentos

### Lote 4

- agenda
- detalhe da sessão
- patient portal essencial

### Lote 5

- teleatendimento
- cobrança
- fila clínica
- modo `texto/ditado`

### Lote 6

- resumo em tópicos
- descarte automático do bruto
- prontuário
- modo `áudio/transcrição` condicional
- endurecimento para beta
