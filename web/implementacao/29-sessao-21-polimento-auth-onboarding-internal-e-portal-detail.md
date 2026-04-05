# Sessão 21: Polimento de auth, onboarding, internal e portal detail

## Objetivo

Continuar a passada forte de polish visual nas superfícies restantes mais importantes do core web:

- login
- onboarding
- shell interno
- overview interno
- detalhes restantes do portal
- call do paciente

## Entregas principais

### 1. Login ficou mais convincente como tela de conversão

Além da revisão anterior, a tela ganhou uma nova faixa de confiança no rodapé com:

- backend como fonte de verdade
- utilidade já no core sem áudio
- direção Brasil-first da fase

O objetivo foi reduzir a sensação de “landing bonita, mas genérica”.

### 2. Onboarding virou superfície de prontidão operacional

O onboarding agora começa com hero operacional e sinais rápidos de:

- etapas concluídas
- bloqueios restantes
- etapa atual

Isso reforça que o wizard existe para levar a conta a `ready_for_operations`, não para coletar dado por hábito.

### 3. Internal ganhou mais presença de produto

O shell interno ficou mais robusto com:

- cabeçalho mais sólido
- cartão de sessão atual
- banner principal com maior peso
- cópia mais consistente

Também houve ajuste de texto na visão geral interna para manter o padrão do resto do produto.

### 4. Portal detail e call do paciente

As superfícies que ainda faltavam no portal agora usam o mesmo sistema visual do restante do portal:

- detalhe documental
- detalhe de pagamento
- call do paciente

Todas com:

- hero próprio
- estado principal visível
- painéis mais claros
- CTA evidente quando existe ação do paciente

## Componentes reaproveitados

- `apps/web/src/components/shared/operational-surface.tsx`
- `apps/web/src/components/portal/portal-surface.tsx`

## Validação

- `npm run typecheck --workspace @terapia/web` passou com `Node 22`

## Observação

Ainda existem áreas internas com cópia antiga fora desta sessão de polish. Esta rodada focou as superfícies mais visíveis do fluxo principal e do portal.
