# Roadmap e Backlog Inicial

## 1. Estratégia de execução

Construir em cinco ondas, com `beta web-first`:

1. Fundação regulatória e estrutural.
2. Web do terapeuta e operação clínica.
3. Experiência web essencial do paciente.
4. Teleatendimento, transcript e IA.
5. Beta privado, custos e endurecimento de segurança.

Regra operacional:

- o desenvolvimento não deve esperar app iOS ou Android para começar validação real com profissionais
- o web do terapeuta é a superfície principal do MVP
- o paciente entra no beta por fluxo web responsivo nos casos essenciais

## 2. Roadmap por fase

### Fase 0: Descoberta e congelamento

Objetivo: travar as decisões que impactam contrato, arquitetura e monetização.

Entregas:

- definição do escopo final do MVP
- matriz de consentimentos
- shortlist de fornecedores
- política de retenção proposta
- mapa de dados
- modelo preliminar de pricing

Saída da fase:

- sem decisões críticas em aberto para começar a construção

### Fase 1: Foundation

Objetivo: preparar identidade, domínio base e governança.

Épicos:

- autenticação e MFA
- tenant solo practice
- onboarding do terapeuta
- convite do paciente
- documentos e consentimentos
- auditoria base

Saída da fase:

- terapeuta cadastrado
- paciente convidado
- consentimentos registrados
- logs auditáveis operando

### Fase 2: Operação clínica

Objetivo: tornar possível organizar a rotina do consultório.

Épicos:

- cadastro e ficha do paciente
- agenda e disponibilidade
- criação de sessão
- lembretes
- cobrança básica

Saída da fase:

- terapeuta consegue operar cadastro, agenda e cobrança simples

### Fase 2.5: Experiência essencial do paciente em web

Objetivo: permitir que o paciente participe do fluxo sem depender de app nativo.

Épicos:

- aceite de convite
- cadastro inicial
- assinatura de documentos
- pagamento
- acesso à sessão agendada

Saída da fase:

- paciente consegue completar o fluxo operacional essencial por web responsivo

### Fase 3: Teleatendimento e prontuário assistido

Objetivo: realizar a sessão e transformar o atendimento em registro útil.

Épicos:

- sala virtual
- transcript
- pipeline IA
- revisão do terapeuta
- prontuário longitudinal

Saída da fase:

- uma sessão digital completa pode ser realizada e fechada no sistema

### Fase 4: Beta privado

Objetivo: endurecer o produto, medir custos e validar uso real.

Épicos:

- relatórios operacionais
- telemetria de custo por sessão
- revisão de segurança
- processos de suporte
- runbooks de incidentes

Saída da fase:

- beta privado com psicólogos reais
- análise de margem e custo por sessão

## 3. Backlog por épico

### Épico A: Identidade e acesso

- login
- MFA
- sessões
- papéis
- convites
- gestão de dispositivos

Critério de aceite:

- terapeuta e paciente entram na plataforma com experiências segregadas e compatíveis com seus papéis

### Épico B: Pacientes e cadastro

- perfil do paciente
- vínculo terapeuta-paciente
- responsável legal
- documentos pendentes
- alertas administrativos

Critério de aceite:

- terapeuta consegue abrir a ficha do paciente com visão operacional centralizada

### Épico C: Agenda e sessões

- disponibilidade
- marcação
- reagendamento
- cancelamento
- sala vinculada

Critério de aceite:

- sessão marcada aparece para ambos e abre sala no horário certo

### Épico D: Telehealth

- integração com provedor
- provisionamento de sala
- sala de espera
- controle de presença
- encerramento confiável

Critério de aceite:

- terapeuta e paciente entram e encerram a sessão com rastreabilidade

### Épico E: Transcript e IA

- job de transcript
- armazenamento seguro
- geração de rascunho
- revisão
- aprovação

Critério de aceite:

- nada entra no prontuário final sem ação explícita do terapeuta

### Épico F: Financeiro

- cobrança
- status de pagamento
- exportação
- relatório

Critério de aceite:

- terapeuta sabe o que foi cobrado, pago e pendente

### Épico G: Segurança e compliance

- trilha de auditoria
- retenção
- descarte
- legal hold
- solicitação do titular

Critério de aceite:

- operações sensíveis são rastreáveis e sujeitas a política

## 4. Dependências críticas

- Sem política de consentimento não deve existir transcript.
- Sem tenant e RBAC não deve existir ficha do paciente.
- Sem webhooks do provedor de vídeo não deve existir pipeline confiável de pós-sessão.
- Sem trilha de auditoria mínima o beta privado não deve começar.

## 5. Ordem de implementação sugerida

1. Identidade, papéis e tenant.
2. Consentimentos e documentos.
3. Pacientes e agenda.
4. Cobrança básica.
5. Fluxo web essencial do paciente.
6. Teleatendimento.
7. Transcript.
8. Rascunho IA e prontuário.
9. Observabilidade, métricas de custo e beta.

## 6. Critérios de saída para lançamento privado

- 100% das sessões com transcript exigem consentimento válido.
- 100% dos prontuários gerados por IA passam por revisão humana.
- logs de acesso clínico estão disponíveis para auditoria.
- custo por sessão está mensurado.
- processos de incidente e suporte estão operacionais.
