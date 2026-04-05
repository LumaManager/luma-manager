# Estratégia de Beta Web-First

## 1. Objetivo

Registrar a decisão operacional atual de produto e execução:

- o `beta inicial` será `web-first`
- o desenvolvimento começa pelo `web do terapeuta`
- o produto não dependerá de aplicativo móvel para iniciar validação com profissionais

## 2. Decisão travada

### Decisão principal

- o MVP de validação será conduzido com `web como superfície principal`

### Consequência prática

- o time pode começar a desenvolver o web agora
- a validação de aderência com psicólogos não precisa esperar app iOS ou Android
- o app do paciente e o app do terapeuta ficam para uma fase posterior, depois da validação do núcleo do produto

## 3. O que isso significa na prática

### Para o terapeuta

O `web do terapeuta` passa a ser tratado como o produto principal do beta.

Ele precisa cobrir o fluxo completo de operação:

- onboarding
- pacientes
- agenda
- sessão
- teleatendimento
- transcript
- revisão clínica
- prontuário
- documentos
- financeiro
- configurações

### Para o paciente

No beta, o paciente não depende de app nativo.

A experiência inicial do paciente deve existir em `web responsivo`, cobrindo o mínimo necessário para o ciclo operacional:

- aceitar convite
- concluir cadastro
- assinar documentos
- pagar
- ver sessão agendada
- entrar na videochamada

## 4. Por que essa estratégia faz sentido

### Produto

- os fluxos mais densos e com maior risco de retrabalho estão no web do terapeuta
- a maior parte do valor percebido pelo psicólogo está no fluxo operacional e no pós-sessão
- a aderência do produto pode ser validada antes de investir em UX mobile nativa

### Engenharia

- reduz a superfície inicial de entrega
- evita paralelizar cedo demais web, iOS e Android
- acelera iteração de regra de negócio, modelo de dados e arquitetura
- simplifica QA, suporte e rollout do beta

### Operação

- evita dependência de App Store e Play Store para começar testes reais
- permite onboarding mais rápido de profissionais do beta
- facilita correções rápidas durante a fase de validação

## 5. O que continua valendo

- a visão de produto de longo prazo continua podendo incluir `app único` para terapeuta e paciente
- a arquitetura continua preparada para mobile
- as decisões de segurança, consentimento, auditoria e retenção continuam obrigatórias desde o beta

## 6. O que muda em relação ao plano anterior

- `mobile` deixa de ser pré-condição do MVP validado
- `web do terapeuta` vira prioridade absoluta de construção
- `experiência mínima do paciente` passa a ser via web responsivo no beta
- apps nativos passam a depender de evidência de aderência, uso e necessidade real

## 7. Escopo recomendado para o beta web-first

### Deve existir no beta

- web completo do terapeuta
- acesso web do paciente para fluxos operacionais essenciais
- teleatendimento funcionando em web
- transcript e revisão humana funcionando
- prontuário final aprovado funcionando
- documentos, consentimentos e cobrança básicos funcionando

### Pode ficar para depois

- app iOS do paciente
- app Android do paciente
- app móvel do terapeuta
- push notifications nativas
- UX mobile avançada fora do fluxo essencial

## 8. Riscos da estratégia

### Risco 1: experiência mobile do paciente ficar limitada

Mitigação:

- desenhar a experiência mínima do paciente em web responsivo desde o início
- priorizar convite, documentos, pagamento e entrada na sessão

### Risco 2: videochamada em navegador móvel exigir mais cuidado

Mitigação:

- escolher provedor de vídeo com bom suporte a mobile web
- testar desde cedo iPhone e Android em cenários reais

### Risco 3: percepção de produto "incompleto" sem app

Mitigação:

- posicionar o beta como validação profissional da operação clínica
- medir se a ausência de app é realmente impeditiva antes de investir

## 9. Critérios para revisitar o mobile

O investimento em app nativo deve ser reavaliado quando houver evidência de uma ou mais condições:

- psicólogos ativos usando o web com recorrência real
- retenção suficiente para justificar expansão de canal
- fricção relevante do paciente em mobile web
- necessidade operacional clara de notificações/presença móvel nativa
- demanda comprovada por uso do terapeuta fora do desktop

## 10. Regra para próximos agentes

Enquanto esta estratégia estiver vigente:

- priorizar decisões e desenvolvimento do `web`
- não bloquear a construção do MVP esperando definição completa do app
- tratar mobile como fase posterior, a menos que uma nova decisão formal altere esta estratégia
