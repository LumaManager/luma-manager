# Sessão 23: Landing Page de Conversão e Waitlist

## Objetivo

Abrir uma frente pública de captura de intenção de mercado sem sair da direção web-first do produto.

## O que foi implementado

- landing pública em `/`
- formulário de waitlist acima da dobra
- copy de posicionamento explicando como o SaaS funciona
- FAQ de redução de risco
- resumo vivo da fila
- endpoint backend para captura de intenção
- proxy no web para submissão do formulário

## Decisões desta sessão

- o motion desta fase é `waitlist-first / invite-only`
- o CTA dominante da página é `Entrar na waitlist`
- a waitlist coleta só o mínimo útil para priorização:
  - nome
  - e-mail
  - WhatsApp opcional
  - perfil
  - volume
  - maior gargalo
- a captura de intenção fica separada do login do produto

## Endpoints adicionados

- `GET /v1/marketing/waitlist/summary`
- `POST /v1/marketing/waitlist`
- `POST /api/marketing/waitlist`

## Estrutura visual aplicada

- hero forte de valor
- prova concreta do fluxo do produto
- bloco de fit
- bloco de no-hype
- FAQ
- CTA final reforçando waitlist

## Observação de fase

- o storage atual da waitlist é simples e stateful, suficiente para a fase inicial de validação
- a troca posterior por persistência mais robusta deve preservar:
  - deduplicação por e-mail
  - atualização de contexto do lead
  - resumo agregado para leitura rápida da demanda
