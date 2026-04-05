# Sessão 27 - Pós-clique da waitlist

## Objetivo

Fechar o fluxo que acontece depois do clique em `Entrar na waitlist`.

## Ajustes feitos

- a captura mínima passou a aceitar `e-mail + perfil` sem exigir qualificação escondida
- o backend da waitlist foi ajustado para suportar enriquecimento posterior do mesmo lead
- o card da waitlist ficou focado só em captura inicial
- depois do envio, a landing passa para uma view única de confirmação em tela própria
- a confirmação deixa de competir com a hero lateralmente
- depois da confirmação, o lead pode abrir um questionário opcional também em tela própria
- o preview estático passou a simular esse estado pós-clique
- o pós-clique foi simplificado para evitar checklist corporativo e reforçar uma única ação opcional de continuidade
- o estado final deixou de permitir edição posterior do contexto
- a etapa concluída ganhou sinal visual forte de sucesso, com destaque de confirmação em verde

## Decisão

- primeiro converte
- depois enriquece
- o estado pós-clique precisa existir de forma explícita, não apenas como uma mensagem pequena acima do botão
- depois do clique, a pessoa precisa sentir que avançou de etapa, não apenas que recebeu um toast bonito
- o pós-clique da landing não deve compartilhar tela com a hero original
- confirmação boa para landing não é onboarding; ela deve ser curta, clara e orientada a uma próxima ação opcional só
- depois que o lead envia o contexto opcional, o fluxo precisa encerrar visualmente
- a tela final deve parecer concluída, não editável
