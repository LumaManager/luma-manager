# PRD do MVP

## 1. Resumo

Construir um SaaS para psicólogos no Brasil que centraliza a operação clínica e administrativa do consultório, incluindo cadastro de pacientes, agenda, teleatendimento, documentação assistida por IA, cobrança, documentos e trilhas de compliance.

O recorte inicial do MVP foi estreitado para o ICP com menor atrito regulatório e comercial:

- psicólogo autônomo
- clínica privada própria
- sem convênio
- sem vínculo institucional
- documentação manual feita pelo próprio terapeuta

O MVP deve provar três teses:

1. O psicólogo confia na plataforma para operar a prática sem risco ético desnecessário.
2. O fluxo de pós-sessão com IA reduz tempo administrativo e melhora continuidade clínica.
3. O produto possui base de segurança, retenção mínima e governança suficiente para crescer sem refatoração estrutural imediata.

## 2. Personas

### Psicólogo dono da conta

- Atende particular, sem convênio e sem vínculo institucional.
- Faz agenda, cobrança, documentação e evolução clínica sozinho.
- Quer reduzir trabalho administrativo sem terceirizar responsabilidade profissional.

### Paciente convidado

- Entra na plataforma por convite.
- Usa a plataforma primeiro por `web responsivo` no beta, para agenda, documentos, pagamentos e videochamada.
- Não acessa prontuário, transcript ou notas clínicas.

### Admin interno

- Opera billing, suporte, incidentes e governança.
- Não tem acesso padrão ao conteúdo clínico em texto claro.

## 3. Princípios do MVP

- `Beta web-first`: o MVP validado começa pelo web, sem depender de app nativo para entrar em uso real.
- `Web admin obrigatório`: o terapeuta precisa de uma superfície web para operação intensiva.
- `Mobile posterior ao beta`: a visão de longo prazo pode continuar sendo um app único com perfis distintos, mas isso não bloqueia a validação inicial.
- `IA assistiva`: a IA propõe; o terapeuta decide.
- `Resumo em tópicos`: o produto gera síntese enxuta e validável, não nota clínica completa multi-seções.
- `Privacy by design`: conteúdo clínico é tratado como domínio separado e altamente protegido.
- `Compliance first`: consentimento, auditoria, retenção e descarte entram no MVP.
- `Retenção mínima`: áudio bruto e transcript bruto não são retidos após processamento.
- `Brasil first`: a primeira versão deve operar com processamento no Brasil, sem transferência internacional.
- `Sem CID por IA`: o MVP não sugere CID, diagnóstico ou classificação clínica automatizada.
- `Utilidade sem áudio`: o MVP precisa continuar útil mesmo quando o modo de áudio estiver desabilitado.

## 4. Objetivos e métricas

### Objetivos

- Permitir que um psicólogo conduza o ciclo completo de atendimento digital.
- Reduzir o tempo de pós-sessão gasto com documentação.
- Aumentar previsibilidade de cobrança e organização documental.
- Validar aderência no ICP de menor atrito regulatório e maior autonomia de compra.

### Métricas do MVP

- Tempo médio de finalização do prontuário após sessão.
- Percentual de sessões com resumo em tópicos revisado e aprovado.
- Taxa de comparecimento às sessões.
- Tempo de onboarding do paciente.
- Custo médio por sessão de 50-60 minutos.
- Margem bruta por conta ativa.

## 5. Escopo funcional

### 5.1 Identidade e acesso

- Cadastro do psicólogo com CRP, dados tributários e aceite contratual.
- Convite do paciente por e-mail/telefone.
- MFA obrigatório para terapeuta.
- Gestão de sessões ativas e dispositivos conectados.

### 5.2 Pacientes

- Cadastro e perfil administrativo.
- Vínculo terapeuta-paciente.
- Documentos, termos e status de consentimento.
- Alertas operacionais e histórico resumido.

### 5.3 Agenda

- Definição de disponibilidade.
- Criação, reagendamento e cancelamento de consultas.
- Sala virtual vinculada ao horário da sessão.
- Lembretes automáticos.

### 5.4 Teleatendimento

- Sala de espera.
- Teste de áudio e vídeo.
- Entrada autorizada por vínculo, horário e status da sessão.
- Encerramento com disparo do pipeline de pós-sessão.

### 5.5 Pós-sessão e IA clínica

- Modos suportados:
  - `texto/ditado do terapeuta`
  - `áudio/transcrição`, apenas quando o contexto jurídico e operacional permitir
- Geração de `resumo em tópicos`, não nota clínica completa.
- Estrutura assistida com:
  - tópicos centrais
  - continuidade do caso
  - pendências
  - memória longitudinal baseada em registros aprovados
- Aprovação manual do terapeuta antes de qualquer registro final.
- Sem sugestão automática de CID, diagnóstico ou conduta clínica.
- Descarte automático de áudio bruto e transcript bruto após processamento.

### 5.6 Cobrança e financeiro

- Cadastro de forma de pagamento.
- Cobrança particular.
- Geração de cobrança.
- Registro de pagamento.
- Relatórios básicos.
- Preparação de base fiscal para exportação.

### 5.7 Documentos e consentimentos

- LGPD.
- Teleatendimento.
- Uso de IA.
- Uso de áudio/transcrição, quando o módulo estiver habilitado.
- Contrato terapêutico.
- Assinatura eletrônica.
- Versionamento de documentos.

### 5.8 Auditoria e governança

- Logs imutáveis de acesso e alteração.
- Registro de aceite e revogação.
- Política de retenção configurável por tipo documental.
- Exportação e descarte governados por workflow.

## 6. Fora do MVP

- Integração nativa com operadoras de convênio.
- Origem `convênio` como fluxo operacional do produto.
- Fiscal full-service com emissão municipal automatizada.
- Gravação integral de vídeo como padrão.
- Nota clínica completa multi-seções no estilo `scribe` médico/psiquiátrico.
- Sugestão automática de CID, diagnóstico ou classificação clínica por IA.
- Portal rico de conteúdo terapêutico para paciente.
- Chat assíncrono clínico.
- Multi-clínica completa com secretária e múltiplos terapeutas.

## 7. Requisitos não funcionais

- Dados clínicos segregados de dados operacionais.
- Criptografia em trânsito e repouso.
- MFA para perfis críticos.
- Logs auditáveis para eventos sensíveis.
- Observabilidade de ponta a ponta.
- Interfaces de integração com provedores de vídeo, ASR e LLM desacopladas.
- Pipeline de descarte automático para áudio bruto e transcript bruto.
- Capacidade de operar no Brasil sem transferência internacional na primeira versão.
- Arquitetura pronta para retenção por política, não por regra fixa no código.

## 8. Premissas de negócio

- O cliente pagante principal é o psicólogo autônomo.
- O modelo de monetização ainda depende de medição real de custo por sessão.
- O produto deve suportar precificação híbrida no futuro:
  - base fixa
  - consumo de IA
  - limites por plano

## 9. Critérios de aceite do MVP

- O psicólogo consegue cadastrar paciente, marcar sessão, realizar videochamada, revisar rascunho clínico e fechar prontuário no mesmo fluxo.
- O paciente consegue entrar por convite, assinar termos, pagar e participar da sessão por fluxo web seguro, sem acessar conteúdo clínico.
- Todo conteúdo gerado pela IA passa por revisão humana antes de virar registro clínico final.
- O sistema registra consentimentos, acessos e alterações com rastreabilidade.
- O produto descarta automaticamente áudio bruto e transcript bruto após processamento.
- O produto opera com política de retenção configurável e suporte a descarte controlado.
