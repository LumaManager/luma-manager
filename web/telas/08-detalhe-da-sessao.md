# Web do Terapeuta - Etapa 8 - Detalhe da Sessão

## 1. Objetivo

Definir de forma fechada o `detalhe da sessão` no web admin do terapeuta, cobrindo:

- visão completa da consulta agendada
- contexto do paciente e do horário
- status de consentimentos e documentos relevantes
- status de pagamento resumido
- checklist pré-sessão
- acesso à sala virtual
- ações de reagendamento, cancelamento e atualização de estado

## 2. Papel da tela no produto

O detalhe da sessão é o `ponto de entrada operacional do atendimento`.

Ele precisa responder rapidamente:

1. esta sessão está pronta para acontecer?
2. o paciente certo está vinculado?
3. existe alguma pendência de documento, consentimento ou pagamento?
4. já posso entrar na sala?
5. se algo mudou, devo reagendar, cancelar ou atualizar o status?

## 3. Escopo desta etapa

### Dentro do escopo

- dados essenciais da sessão
- resumo do paciente
- status da consulta
- consentimentos relevantes
- pagamento resumido
- checklist pré-sessão
- acesso à sala
- ações operacionais sobre a sessão

### Fora do escopo

- tela da videochamada
- transcript
- rascunho IA
- prontuário
- gestão documental completa
- fluxo financeiro completo

## 4. Decisões travadas nesta etapa

- o detalhe da sessão será uma `página dedicada`, não modal
- a rota principal será `/app/appointments/:appointmentId`
- a tela será `pré-sessão-first`, ou seja, prioriza prontidão do atendimento
- o topo da tela sempre mostrará status da sessão e CTA principal contextual
- consentimentos e documentos aparecem como `status resumidos`, não como biblioteca documental completa
- pagamento aparece como `status resumido`, não como extrato financeiro completo
- entrar na sala só fica disponível dentro da janela permitida da sessão
- a tela não deve embutir a videochamada; ela encaminha para a próxima etapa

## 5. Rota e permissão

### Rota

- `/app/appointments/:appointmentId`

### Permissão

- terapeuta autenticado com vínculo válido ao paciente e à sessão

### Regra crítica

- a sessão não deve ser exibida para terapeuta sem vínculo correto
- o sistema deve negar acesso sem expor dados além do necessário

## 6. Estrutura geral da tela

Esta tela usa o `Template C: Detalhe com abas ou seções` definido na Etapa 1, mas sem necessidade de muitas abas no MVP.

Estrutura final:

1. breadcrumbs
2. cabeçalho da sessão
3. barra de ações
4. grid principal com blocos operacionais
5. timeline resumida de eventos da sessão

## 7. Breadcrumbs

Formato:

- `Agenda / Sessão de DD MMM AAAA - HH:MM`

Se vier pela ficha do paciente, ainda manter o caminho funcional da agenda para consistência da entidade sessão.

## 8. Cabeçalho da sessão

### Objetivo

Mostrar rapidamente o que é a sessão, com quem é, quando acontece e em que estado está.

### Conteúdo obrigatório

- data e hora da sessão
- duração
- paciente
- modalidade
- status da sessão
- status resumido da sala

### Status operacionais da sessão no detalhe

- `Agendada`
- `Confirmada`
- `Em andamento`
- `Concluída`
- `Cancelada`
- `No-show`

### Ações de topo

- CTA principal contextual
- `Reagendar`
- `Cancelar`
- `Abrir paciente`

### Regra adicional de UX

- `Reagendar` e `Cancelar` devem abrir drawers operacionais na própria tela
- o terapeuta não deve perder contexto ao fazer mutações simples da sessão
- feedback de sucesso ou erro precisa aparecer na própria página após a ação

## 9. CTA principal contextual

### Ordem de prioridade

1. se a sessão estiver `Em andamento`: `Entrar na sala`
2. se estiver dentro da janela de entrada e tudo estiver pronto: `Iniciar atendimento`
3. se houver bloqueio crítico: `Resolver pendência`
4. se a sessão já terminou e aguarda fluxo clínico futuro: `Abrir revisão`, quando essa etapa existir

### Regra

- o CTA principal nunca deve ser ambíguo
- a tela deve deixar claro por que o CTA está habilitado ou bloqueado

## 10. Bloco 1 - Resumo do paciente

### Objetivo

Dar contexto mínimo do paciente sem forçar navegação.

### Conteúdo

- nome
- idade ou data de nascimento resumida
- contato principal
- responsável legal, quando existir
- link para ficha do paciente

### Regra

- não mostrar conteúdo clínico textual aqui

## 11. Bloco 2 - Dados da sessão

### Objetivo

Consolidar a informação operacional da consulta.

### Conteúdo

- data
- horário inicial
- horário final
- duração
- modalidade
- origem da criação da sessão, se útil
- observação operacional curta, se existir

### Regra

- observação aqui é administrativa e operacional, nunca nota clínica

## 12. Bloco 3 - Consentimentos e documentos

### Objetivo

Mostrar apenas o que impacta a realização segura da sessão.

### Conteúdo resumido

- consentimento LGPD
- consentimento de teleatendimento
- consentimento de transcript/IA
- documentos obrigatórios pendentes

### Estados visuais

- `OK`
- `Pendente`
- `Crítico`

### Regras

- `Crítico` significa impeditivo ou alto risco operacional
- se houver pendência crítica, a tela deve explicar o motivo do bloqueio
- CTA:
  - abrir área documental correta
  - ou abrir ficha do paciente com contexto

## 13. Bloco 4 - Pagamento resumido

### Objetivo

Dar visibilidade ao estado financeiro da sessão sem transformar a tela em financeiro completo.

### Conteúdo

- origem do pagamento
- status resumido
- valor, quando aplicável
- cobrança vinculada, quando existir

### Estados visuais

- `OK`
- `Em aberto`
- `Vencido`
- `Não configurado`

### Regras

- pagamento vencido não bloqueia automaticamente a entrada na sala por padrão do MVP
- se isso vier a mudar por política do negócio, a regra deve ser configurável
- CTA:
  - abrir cobrança
  - criar cobrança, quando aplicável

## 14. Bloco 5 - Checklist pré-sessão

### Objetivo

Informar se a sessão está pronta para começar.

### Itens do checklist no MVP

- paciente vinculado corretamente
- janela da sessão ativa ou próxima
- sala provisionada ou pronta para provisionar
- consentimentos críticos válidos
- documentos impeditivos resolvidos
- status da conta do terapeuta apto

### Resultado final

- `Pronto para iniciar`
- `Atenção necessária`
- `Bloqueado`

### Regras

- o checklist deve ser legível e objetivo
- o usuário deve entender exatamente o que falta
- o checklist não substitui auditoria técnica, mas orienta a operação

## 15. Bloco 6 - Sala virtual

### Objetivo

Controlar o acesso operacional à videochamada.

### Conteúdo

- status da sala
- janela de entrada
- indicador de disponibilidade do provedor, quando houver dado
- botão para entrar na sala

### Status da sala

- `Não provisionada`
- `Pronta`
- `Aberta`
- `Encerrada`
- `Falha`

### Regras

- a sala deve ser tratada como recurso efêmero ligado à sessão
- a tela pode disparar provisionamento quando necessário dentro da janela definida
- se houver falha, deve existir CTA para tentar novamente

## 16. Timeline operacional da sessão

### Objetivo

Mostrar eventos úteis relacionados à sessão.

### Conteúdo

- sessão criada
- reagendada
- cancelada
- pagamento atualizado
- documento assinado
- sala provisionada

### Regras

- não mostrar logs técnicos brutos
- não mostrar texto clínico

## 17. Ações operacionais permitidas

### Ações principais

- iniciar/entrar na sala
- reagendar
- cancelar
- abrir paciente

### Ações secundárias

- copiar informações da sessão
- abrir cobrança vinculada
- abrir documentos relacionados

### Regras

- ações destrutivas exigem confirmação
- reagendamento e cancelamento devem obedecer políticas de conflito e auditoria já definidas na agenda

## 18. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton dos blocos

### Empty/assistido

- sessão sem cobrança ainda
- sessão sem sala provisionada ainda

### Error state

- falha ao carregar sessão
- sessão não encontrada
- acesso negado
- falha no provisionamento da sala

## 19. Dados mínimos para renderizar a tela

- identificador e status da sessão
- paciente resumido
- modalidade
- janela temporal
- status da sala
- status documental/consentimento
- status de pagamento
- checklist agregado
- timeline resumida

## 20. APIs mínimas necessárias

- `GET /appointments/:appointmentId`
- `PATCH /appointments/:appointmentId`
- `POST /appointments/:appointmentId/cancel`
- `POST /appointments/:appointmentId/room`
- `GET /appointments/:appointmentId/readiness`

## 21. Payload recomendado de `GET /appointments/:appointmentId`

- `appointment`
- `patientSummary`
- `roomSummary`
- `consentSummary`
- `documentSummary`
- `paymentSummary`
- `readinessSummary`
- `activityTimeline`

## 22. Eventos de produto

- `appointment_detail_loaded`
- `appointment_primary_cta_clicked`
- `appointment_reschedule_clicked`
- `appointment_cancel_clicked`
- `appointment_open_patient_clicked`
- `appointment_room_retry_clicked`

## 23. Critérios de aceite da Etapa 8

- o terapeuta entende rapidamente se a sessão está pronta para acontecer
- consentimentos, documentos, pagamento e sala aparecem de forma resumida e acionável
- a tela serve como ponte natural entre agenda e videochamada
- o CTA principal é claro e contextual
- o detalhe da sessão não mistura operação com conteúdo clínico pós-sessão

## 24. Dependências que esta etapa destrava

- tela de videochamada
- entrada controlada na sala
- fluxo de encerramento de sessão
- geração posterior de transcript e revisão clínica

## 25. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/09-videochamada-no-web.md`

## Atualização de fase

### O que já existe no build atual

- `/app/appointments/:appointmentId` como página dedicada `pré-sessão-first`
- cabeçalho com status, CTA principal contextual e link para o paciente
- blocos de paciente, dados da sessão, consentimentos, pagamento, checklist e timeline
- drawers reais de `Reagendar` e `Cancelar` na própria tela
- rota `/app/appointments/:appointmentId/call` como continuação operacional do CTA principal

### Ainda pendente nesta fase

- provider real de sala e presença
- persistência real em banco e auditoria durável das mutações
