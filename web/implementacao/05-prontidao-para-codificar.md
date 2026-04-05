# Prontidão para Começar a Gerar Código

Data de consolidação: `30/03/2026`.

## 1. Resposta curta

`Sim`, você já está pronto para `começar a gerar código`.

Mas a resposta correta não é:

- `pronto para construir tudo`

e sim:

- `pronto para começar foundation, auth, shell, onboarding, pacientes, agenda, documentos e o fluxo core sem áudio`

O que ainda `não` está pronto para build irrestrito:

- decisões finais de go-live jurídico
- módulo de `áudio/transcrição` como capability em produção
- escolha fechada de todos os provedores
- política final de retenção para todos os artefatos

## 2. O que já está suficientemente fechado para build

### Produto

- ICP inicial definido
- web-first definido
- escopo do terapeuta muito bem detalhado
- mapa de telas do web fechado
- backlog inicial e ordem de build definidos
- tese de `resumo em tópicos` já travada
- sem CID por IA
- sem retenção de áudio bruto e transcript bruto

### UX

- shell do web definido
- auth e MFA definidos
- onboarding do terapeuta definido
- agenda, pacientes, sessão, documentos e revisão clínica definidos
- direção de UI e branding já documentada
- análise de UI do Berries já traduzida para o nosso CRM

### Arquitetura

- stack recomendada já definida
- modelo de rotas já definido
- contratos iniciais de API já definidos
- build order já definida
- backlog técnico inicial já definido

### Estratégia regulatória

- tese de licitude já é suficiente para orientar o build
- sabemos o que o produto `não deve` prometer nem automatizar
- sabemos que áudio/transcrição é `condicional`

## 3. O que ainda não está fechado

### Jurídico e compliance

- parecer jurídico aplicado ao fluxo final
- política final de guarda para adulto e menor
- base legal final por fluxo
- pacote contratual e LGPD completo para produção

### Tecnologia

- provedor de vídeo final
- provedor de ASR final
- provedor de LLM final

### Produto

- escopo mínimo final do portal do paciente
- política final sobre agendamento autônomo do paciente
- atendimento infantil no MVP ou não

### Comercial

- pricing final
- franquias de uso
- tese final de margem

## 4. Leitura correta da prontidão

Hoje o projeto está em estado:

- `pronto para desenvolvimento do core`
- `não pronto para produção ampla`

Isso é suficiente para começar a codar.

Na prática, significa:

### Pode começar agora

- monorepo
- auth
- MFA
- shell
- onboarding
- pacientes
- documentos
- agenda
- detalhe da sessão
- portal web essencial do paciente
- vídeo
- pós-sessão com `texto/ditado`
- geração de resumo em tópicos
- aprovação humana
- prontuário

### Deve ficar condicional ou para depois

- áudio/transcrição em tempo real
- qualquer retenção mais longa de transcript
- assistente longitudinal mais ambicioso
- claims comerciais definitivos
- rollout externo

## 5. Minha avaliação direta

Sem sugar coating:

Se você esperar fechar `100% de tudo` antes de começar a codar, vai perder tempo.

Se você começar a codar `sem respeitar os gates já identificados`, vai criar retrabalho e risco.

Então a decisão certa é:

1. começar o código agora
2. começar pelo `core web sem áudio`
3. manter `áudio/transcrição` atrás de capability e sem depender disso para o valor principal
4. tratar jurídico e provedores como trilha paralela de fechamento antes do go-live

## 6. Veredito operacional

### Sim, pronto para gerar código

Mas com esta regra:

`construir o core primeiro, e não o produto inteiro de uma vez`

## 7. Próximo passo recomendado

Começar imediatamente por:

1. `Fase 0` do build
2. `Fase 1` auth, sessão e tenancy
3. `Fase 2` shell
4. `Fase 3` onboarding

Só depois disso seguir para:

5. pacientes
6. agenda
7. documentos
8. pós-sessão core sem áudio

## 8. Estratégia de sessão para começar o build

### Resposta prática

`Não é obrigatório` abrir uma nova sessão.

Como toda a definição relevante já foi salva em `.md`, qualquer agente futuro consegue retomar o contexto pela trilha documental.

### Recomendação operacional

Mesmo assim, `é melhor` iniciar uma nova sessão quando o objetivo mudar de:

- planejamento e investigação

para:

- scaffold
- implementação
- execução de backlog

### Motivo

- reduz ruído de contexto
- força o agente a ler os documentos oficiais em vez de depender do histórico longo
- melhora foco em build order, stack e execução técnica

### Regra sugerida

- se ainda vamos decidir arquitetura, produto ou compliance: continuar na mesma sessão é aceitável
- se vamos começar a codar de verdade: abrir uma sessão nova focada em implementação é a melhor opção
