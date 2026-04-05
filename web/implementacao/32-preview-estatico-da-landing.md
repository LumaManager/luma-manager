# Sessão 24 - Preview estático da landing

## Motivo

O processo local do `Next dev` ficou aceitando conexão na porta do web, mas sem responder nem a um route handler mínimo (`/healthz`). Para não bloquear a avaliação de copy, layout e hierarquia visual da landing, foi criado um preview estático fora do runtime do Next.

## Entregável

- `preview/landing-preview.html`

## Uso

Abrir o arquivo diretamente no navegador para revisar:

- hero
- CTA principal
- formulário de waitlist
- blocos de confiança
- explicação de fluxo
- FAQ
- CTA final

## Observação

O preview estático é apenas para avaliação visual e de copy. O formulário nesse modo não escreve na API; ele apenas confirma visualmente o comportamento esperado.
