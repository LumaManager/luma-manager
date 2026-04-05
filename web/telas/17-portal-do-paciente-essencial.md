# Web do Paciente - Etapa 17 - Portal do Paciente Essencial

## 1. Objetivo

Definir a primeira versão do `portal web do paciente` para o beta web-first, cobrindo o fluxo operacional mínimo necessário antes da sessão:

- aceite de convite
- cadastro inicial
- assinatura de documentos
- revisão de pagamento
- acesso à sessão agendada

## 2. Papel da área no produto

O portal do paciente existe para responder, com pouca ambiguidade:

1. o que eu preciso concluir antes da sessão?
2. quais documentos e cobranças estão ligados ao meu atendimento?
3. como eu entro na sessão sem instalar app?

## 3. Escopo desta etapa

### Dentro do escopo

- convite público via token
- shell simples do portal
- lista e detalhe de sessões
- lista e detalhe de documentos
- lista e detalhe de pagamentos
- perfil operacional do paciente
- entrada na call em web

### Fora do escopo

- prontuário
- transcript
- notas clínicas
- histórico clínico detalhado
- mensageria rica paciente-terapeuta
- app mobile nativo

## 4. Decisões travadas nesta etapa

- o prefixo do portal é `/portal`
- o deep link público de entrada é `/invite/:token`
- a sessão do portal é separada da sessão do terapeuta
- o portal do paciente continua `web-first` e responsivo
- o conteúdo do portal é `operacional`, não clínico
- assinatura e pagamento no MVP podem operar com dummy data stateful para avaliação visual

## 5. Rotas mínimas do portal

- `/invite/:token`
- `/portal`
- `/portal/appointments`
- `/portal/appointments/:appointmentId`
- `/portal/appointments/:appointmentId/call`
- `/portal/documents`
- `/portal/documents/:documentId`
- `/portal/payments`
- `/portal/payments/:chargeId`
- `/portal/profile`

## 6. Shell do portal

### Conteúdo mínimo

- identificação do paciente
- terapeuta e consultório
- próxima sessão
- alertas com pendências
- navegação curta por módulos

### Regras

- a navegação deve ser menor que a do terapeuta
- o CTA principal de cada área deve ser explícito
- o portal não pode parecer backoffice

## 7. Convite e ativação

### Objetivo

Ativar o acesso do paciente sem fricção excessiva.

### Conteúdo mínimo

- contexto do convite
- resumo da sessão
- dados básicos do paciente
- aceite de termos operacionais e privacidade

### Regra

- não pedir cadastro complexo antes do primeiro marco

## 8. Sessões

### Conteúdo mínimo

- próxima sessão
- sessões anteriores com trilha operacional
- checklist antes da entrada
- CTA de entrada na sessão

### Regra

- a sessão deve ser acessível no navegador
- a tela não expõe conteúdo clínico

## 9. Documentos

### Conteúdo mínimo

- lista de pendentes e concluídos
- detalhe com resumo objetivo
- ação de assinatura

### Regra

- documento precisa ficar escaneável em mobile web

## 10. Pagamentos

### Conteúdo mínimo

- lista de cobranças
- valor, status e vencimento
- detalhe financeiro simples
- CTA de pagamento ou confirmação dummy

### Regra

- cobrança do paciente final continua separada do billing SaaS interno

## 11. Perfil

### Conteúdo mínimo

- dados de contato
- preferência de comunicação
- contato de apoio
- diretrizes operacionais do portal

## 12. Limites clínicos

- o portal não mostra prontuário
- o portal não mostra transcript
- o portal não sugere CID, diagnóstico ou interpretação clínica
- o portal serve à operação do atendimento, não à leitura do caso

## 13. Critérios de aceite desta etapa

- paciente consegue ativar o portal por convite
- paciente consegue revisar e assinar documento obrigatório
- paciente consegue revisar pagamento ligado à sessão
- paciente consegue abrir a sessão no web
- toda a superfície é útil sem áudio

## 14. Atualização de fase

### O que já existe no build atual

- rota pública `/invite/:token`
- shell próprio em `/portal/*`
- listas e detalhes de `sessões`, `documentos`, `pagamentos` e `perfil`
- rota `/portal/appointments/:appointmentId/call`

### Decisões já refletidas na UI

- o portal ganhou superfície visual própria, distinta do shell do terapeuta
- cada área mantém CTA principal evidente e foco operacional, sem deriva para prontuário ou conteúdo clínico
