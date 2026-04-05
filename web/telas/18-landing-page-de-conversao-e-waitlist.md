# Web Público - Etapa 18 - Landing Page de Conversão e Waitlist

## 1. Objetivo

Definir a landing page pública do produto para a fase inicial de captura de intenção, cobrindo:

- explicação clara de como o SaaS funciona
- posicionamento do produto para terapeuta e consultório enxuto
- captura de intenção via waitlist
- coleta mínima de dados para qualificação inicial
- redução explícita de risco antes do beta

## 2. Motion do produto nesta fase

O motion correto aqui é `waitlist-first / invite-only`.

Esta página não tenta vender plano, abrir trial e marcar demo ao mesmo tempo.

Ela existe para responder:

1. o que esse produto resolve na prática?
2. por que ele é diferente de um stack remendado?
3. esse beta parece feito para meu caso?
4. qual a ação certa agora? `Entrar na waitlist`

## 3. CTA dominante

O CTA dominante da landing é:

- `Entrar na waitlist`

CTAs secundários permitidos:

- `Ver como funciona`
- `Entrar no produto`

Regra:

- nenhum CTA secundário pode competir visualmente com a entrada na waitlist

## 4. Público-alvo desta fase

### Perfis prioritários

- psicólogo(a) clínico(a) solo
- consultório enxuto
- operação com rotina de teleatendimento ou híbrida
- profissionais que já sentem atrito entre agenda, pós-sessão, documento e cobrança

### Fora do alvo imediato

- clínica enterprise multiunidade
- operação hospitalar complexa
- quem procura software centrado em BI ou em prontuário genérico sem fluxo operacional forte

## 5. Estrutura da página

1. hero de valor
2. waitlist acima da dobra
3. prova de como o produto funciona
4. bloco curto de identificação de fit
5. FAQ de redução de risco
6. CTA final

### Observação de composição

- a dobra inicial não deve virar um bloco excessivamente alto
- o card de waitlist não pode esticar para acompanhar a altura do hero
- o formulário deve continuar legível em desktop sem depender de campos em duas colunas espremidas
- a prioridade é hero forte + formulário fácil + scroll natural
- em desktop largo, o container precisa aproveitar quase toda a largura útil da tela e evitar sensação de quadro estreito no centro
- para esta landing, o desktop pode operar quase full-width, com respiro lateral mínimo
- a hero precisa respirar na base; o conteúdo não deve encostar visualmente no rodapé do bloco
- a coluna da waitlist deve ser mais compacta que a hero e não parecer do mesmo peso visual
- highlights internos da hero devem morrer de forma suave e integrada ao gradiente, nunca como faixa rígida
- o respiro lateral deve existir, mas não como grandes faixas vazias decorativas
- elementos de apoio no hero não podem parecer botões ou CTAs falsos
- o bloco lateral de explicação do waitlist deve ser compacto e parecer sequência, não pilha de cards
- o bloco de fit deve ser curto, direto e com no máximo 3 perfis fortes
- objeções e limites do produto funcionam melhor na FAQ do que em um segundo card paralelo

## 6. Hero

### A mensagem principal

A hero precisa vender o produto como:

- sistema operacional da rotina clínica
- não prontuário genérico
- não pilha de ferramentas desconectadas

### Direção de copy

- agenda, sessão, revisão clínica, documentos e cobrança no mesmo fluxo
- útil sem áudio
- backend como fonte de verdade do domínio clínico

### Regra de linguagem

- a landing fala com terapeuta, psicólogo(a) e consultório pequeno
- não usar linguagem de arquitetura interna, backend, stack, domínio ou compliance como mensagem principal
- traduzir capacidades técnicas em benefício percebido na rotina
- quando ajudar a identificação, usar referências familiares da rotina como `Google Agenda`, `WhatsApp` e `planilha no Excel`
- essas referências entram como comparação de uso atual, não como integração oficial ou parceria

## 7. Waitlist

### Objetivo

Capturar intenção real de mercado com baixa fricção e dados suficientes para priorização.

### Campos mínimos

- e-mail profissional
- perfil profissional

### Qualificação opcional em segunda etapa

- nome completo
- WhatsApp opcional
- volume mensal de sessões
- maior gargalo atual

### Regras

- deduplicar por e-mail
- permitir atualização de contexto usando o mesmo e-mail
- priorizar captura inicial de intenção com baixa fricção
- mover enriquecimento de lead para etapa opcional depois do envio inicial
- após o clique em `Entrar na waitlist`, a tela deve sair da dobra inicial e entrar em uma view própria de confirmação
- a confirmação não pode concorrer visualmente com a hero nem continuar em uma coluna lateral
- depois da confirmação, o usuário deve poder abrir um questionário opcional em tela própria para enriquecer contexto
- o fluxo ideal desta etapa é:
  1. captura mínima
  2. confirmação full-view
  3. questionário opcional full-view
  4. estado final com contexto salvo

## 8. Como o produto funciona

A landing precisa mostrar a sequência operacional:

1. agenda e disponibilidade
2. detalhe da sessão com bloqueios e prontidão
3. revisão clínica e fechamento pós-sessão
4. documentos, consentimentos e cobrança no mesmo workspace

Regra:

- explicar em linguagem concreta
- não usar jargão de roadmap como copy principal

## 9. Redução de risco

Devem aparecer de forma clara:

- útil sem áudio
- sem retenção de bruto clínico após processamento
- direção Brasil-first
- IA não sugere CID nem diagnóstico

### Regra de FAQ

- a FAQ final deve soar como conversa com terapeuta, não como linguagem interna de marketing
- perguntas mais curtas convertem melhor do que títulos longos e analíticos
- o bloco deve reduzir objeção, não parecer documentação do produto

## 10. Rotas e integração

### Rotas públicas

- `/`
- `/login`
- `/invite/:token`

### API pública do backend

- `GET /v1/marketing/waitlist/summary`
- `POST /v1/marketing/waitlist`

### Proxy do web

- `POST /api/marketing/waitlist`

### Tracking mínimo desta fase

- `sourcePath`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `referrerHost`

### Regra

- o tracking continua leve e orientado à distribuição, não a analytics pesado
- a home pública em `/` já lê o `summary` real do backend no SSR e cai em `fallback` apenas se a API falhar
- a origem precisa ser suficiente para responder de onde veio o lead, sem abrir coleta excessiva cedo
- nesta fase, as entradas continuam em store local simples; a troca para Supabase vem depois, quando a distribuição já estiver gerando sinais consistentes

## 11. Estado atual do build

### O que já existe

- landing pública em `/`
- hero de conversão com CTA dominante de waitlist
- formulário real de captura com storage simples stateful
- fluxo pós-clique em tela cheia para confirmação e contexto opcional
- FAQ e blocos de explicação do produto
- link secundário para `/login`
- leitura server-side do `summary` real da waitlist
- captura mínima de origem via `sourcePath`, `UTM` e `referrerHost`

### Observação de fase

- o storage atual da waitlist é propositalmente simples e pensado para troca futura por persistência mais robusta
- a prioridade nesta etapa é medir intenção de mercado com clareza e não abrir infra desnecessária cedo
