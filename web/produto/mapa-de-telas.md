# Mapa de Telas e Experiência por Plataforma

## 1. Matriz de plataformas

| Área | iPhone/Android | Web Admin | Web Responsiva |
|---|---|---|---|
| Terapeuta | Sim | Sim | Opcional para fallback |
| Paciente | Sim | Não | Sim para convite, assinatura e entrada rápida |
| Admin interno | Não | Sim | Não |

## 2. Princípio de navegação

- O app móvel é único.
- O menu muda conforme papel e vínculo da conta.
- O terapeuta tem experiência completa no mobile, mas a operação densa acontece melhor no web admin.
- O paciente tem navegação curta e guiada.

## 3. Telas do terapeuta

### Login e segurança

- Login
- MFA
- Gestão de dispositivos
- Sessões ativas
- Recuperação de acesso

### Onboarding

- Cadastro profissional
- Dados do CRP
- Dados bancários e tributários
- Aceite de contrato e DPA
- Preferências de agenda
- Configuração de consentimentos padrão

### Dashboard

Deve conter:

- próximos atendimentos
- pacientes recentes
- cobranças em aberto
- pendências de documentos
- sessões com rascunho aguardando revisão
- métricas rápidas de operação

### Agenda

Deve conter:

- visualização diária, semanal e mensal
- filtros por status
- criação de sessão
- disponibilidade
- bloqueios de agenda
- ações rápidas para entrar na sala, reagendar e cancelar

### Pacientes

Lista deve conter:

- nome
- status
- próxima sessão
- pendências documentais
- indicador financeiro

Ficha do paciente deve conter:

- dados cadastrais
- responsável legal, quando existir
- histórico operacional
- documentos
- cobranças
- timeline clínica privada
- acesso rápido para prontuário e próximas sessões

### Sessão

Detalhe da sessão deve conter:

- dados de horário
- link/sala
- status de consentimento
- checklist pré-sessão
- status de pagamento
- botão de iniciar atendimento

Tela de videochamada deve conter:

- vídeo local/remoto
- status de áudio e câmera
- controle de entrada
- consentimento de transcript
- temporizador
- botão de encerrar

### Pós-sessão clínica

Fila de revisão deve conter:

- paciente
- horário da sessão
- status do transcript
- status do rascunho IA
- SLA interno de revisão

Tela de transcript/rascunho deve conter:

- transcript segmentado por tempo
- rascunho gerado
- tópicos sugeridos
- continuidade do caso
- campo livre de edição
- botão de aprovar como prontuário
- histórico de versões

### Financeiro

- contas a receber
- detalhe da cobrança
- status do pagamento
- filtros por particular/convênio
- relatório mensal
- exportação para contador

### Documentos

- lista de modelos
- documentos por paciente
- versões
- status de assinatura
- pendências

### Configurações

- perfil
- segurança
- agenda
- cobrança
- integrações
- preferências de notificação
- política de retenção visível apenas como configuração assistida

## 4. Telas do paciente

### Entrada

- convite
- cadastro
- aceite de termos
- verificação de contato

### Home

Deve conter:

- próxima sessão
- documentos pendentes
- cobranças pendentes
- botão de entrar na sala

### Agendamento

- ver horários disponíveis
- solicitar/reagendar
- cancelar dentro da política

### Pagamentos

- cobranças abertas
- histórico
- instruções de pagamento
- comprovantes

### Documentos

- lista de termos
- assinatura
- histórico de aceite

### Sessão

- sala de espera
- teste de câmera/microfone
- videochamada
- encerramento

### Perfil

- dados pessoais
- contato
- responsável legal
- preferências de notificação

## 5. Telas do admin interno

### Operação

- visão de tenants/contas
- status de faturamento
- integridade de integrações
- chamados e incidentes
- monitoramento de jobs

### Compliance

- trilhas de auditoria
- revisão de suboperadores
- políticas de retenção
- solicitações de titulares
- incidentes de segurança

### Restrições

- admin interno não navega prontuário clínico em texto claro no fluxo padrão.
- acessos excepcionais precisam de workflow, justificativa e auditoria reforçada.

## 6. Fluxos intertelas críticos

### Terapeuta

- Dashboard -> Agenda -> Detalhe da sessão -> Videochamada -> Fila de revisão -> Prontuário.
- Pacientes -> Ficha do paciente -> Documentos / Sessões / Financeiro / Prontuário.
- Financeiro -> Cobrança -> Confirmação de pagamento -> Atualização na ficha do paciente.

### Paciente

- Convite -> Cadastro -> Assinatura de termos -> Home -> Próxima sessão -> Sala de espera -> Videochamada.
- Home -> Pagamentos -> Quitação -> Atualização do status da sessão.

## 7. Observações de design de produto

- Conteúdo clínico nunca aparece em push notification.
- O paciente não deve ver linguagem técnica clínica.
- O terapeuta precisa de atalhos de alta densidade no web admin.
- O app do paciente deve ser operacional e simples, com baixa carga cognitiva.
