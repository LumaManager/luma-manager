# Web do Terapeuta - Etapa 9 - Videochamada no Web

## 1. Objetivo

Definir de forma fechada a `videochamada no web` para o terapeuta, cobrindo:

- pré-entrada na sala
- teste de áudio e vídeo
- waiting room
- sala ao vivo
- status do transcript
- reconexão
- encerramento seguro da sessão

## 2. Papel da tela no produto

Esta tela é a `execução ao vivo do atendimento`.

Ela precisa responder rapidamente:

1. posso entrar na sessão agora?
2. meu áudio e vídeo estão funcionando?
3. o paciente já entrou ou está aguardando?
4. a transcrição está habilitada ou não?
5. se houver falha, como reconectar ou encerrar sem perder rastreabilidade?

## 3. Escopo desta etapa

### Dentro do escopo

- fluxo de pré-join
- testes de dispositivos
- waiting room
- sessão ao vivo 1:1
- controles básicos da chamada
- status de transcript
- reconexão
- encerramento pelo terapeuta

### Fora do escopo

- chat textual
- compartilhamento de tela
- envio de arquivos
- gravação integral de vídeo
- grupos ou terapia em grupo
- anotações clínicas dentro da tela da chamada

## 4. Decisões travadas nesta etapa

- a experiência terá `duas fases`: `pré-entrada` e `chamada ao vivo`
- a rota principal será `/app/appointments/:appointmentId/call`
- o fluxo do MVP é `1 terapeuta x 1 paciente`
- a videochamada não fica embutida no detalhe da sessão
- o paciente pode entrar na janela permitida e aguardar em waiting room
- no MVP, não haverá `admissão manual` do paciente; a chamada é liberada quando o terapeuta entra
- `teleatendimento` sem consentimento válido bloqueia a entrada
- `transcript/IA` sem consentimento válido não bloqueia a chamada, mas deixa a transcrição `desativada`
- não haverá gravação integral da chamada no MVP
- encerrar a chamada deve disparar o fluxo operacional de pós-sessão

## 5. Rota e permissão

### Rota

- `/app/appointments/:appointmentId/call`

### Permissão

- terapeuta autenticado com vínculo válido à sessão

### Regra crítica

- a tela só deve abrir para sessão válida e dentro das regras de janela temporal
- sem vínculo válido, o sistema nega acesso sem expor dados desnecessários

## 6. Janela de entrada

### Defaults do MVP

- terapeuta pode entrar até `15 minutos antes`
- paciente pode entrar até `10 minutos antes`

### Regras

- antes dessa janela, exibir estado `Ainda indisponível`
- após o horário final, a sala entra em estado de encerramento ou encerrada
- esses valores devem ser parametrizáveis no backend, mesmo que com defaults fixos no MVP

## 7. Estrutura geral da experiência

### Fase 1 - Pré-entrada

Objetivo:

- preparar dispositivos
- validar permissões
- mostrar status de prontidão
- permitir entrada segura

### Fase 2 - Chamada ao vivo

Objetivo:

- realizar o atendimento
- manter visibilidade de conexão, participantes e transcript
- permitir reconexão e encerramento controlado

## 8. Estados principais da experiência

- `Ainda indisponível`
- `Pré-entrada`
- `Aguardando paciente`
- `Aguardando terapeuta`
- `Ao vivo`
- `Reconectando`
- `Encerrando`
- `Encerrada`
- `Falha`

## 9. Fase 1 - Pré-entrada

### Objetivo

Garantir que o terapeuta não entre às cegas em uma sala com dispositivo quebrado ou com pendência operacional crítica.

### Blocos obrigatórios

- resumo da sessão
- status de prontidão
- teste de câmera e microfone
- status de transcript
- botão de entrar

## 10. Bloco - Resumo da sessão

### Conteúdo

- paciente
- horário
- modalidade
- duração prevista
- link de volta para o detalhe da sessão

### Regra

- essa informação deve sempre ficar visível na pré-entrada

## 11. Bloco - Teste de dispositivos

### Conteúdo

- preview da câmera local
- seleção de câmera
- seleção de microfone
- medidor simples de áudio
- status de permissão do navegador

### Ações

- trocar câmera
- trocar microfone
- silenciar antes de entrar
- entrar com câmera ligada ou desligada

### Regras

- se câmera ou microfone estiverem indisponíveis, a tela deve explicar o motivo
- a falta de câmera não precisa bloquear a chamada
- a falta de microfone deve gerar alerta forte, mas não necessariamente bloqueio absoluto

## 12. Bloco - Status de prontidão

### Objetivo

Reforçar os pontos essenciais antes da entrada.

### Itens exibidos

- sessão dentro da janela
- teleatendimento autorizado
- sala pronta
- dispositivos disponíveis
- transcript habilitado ou desativado

### Resultado final

- `Pronto para entrar`
- `Atenção necessária`
- `Bloqueado`

## 13. Bloco - Status de transcript

### Objetivo

Deixar explícito se a chamada está ou não apta a gerar transcript.

### Estados

- `Ativo`
- `Desativado por consentimento`
- `Desativado por política`
- `Indisponível temporariamente`

### Regra crítica

- ausência de consentimento para transcript não bloqueia teleatendimento no MVP
- se o transcript estiver desativado, a tela deve dizer claramente que não haverá processamento automático pós-sessão

## 14. Waiting room

### Objetivo

Controlar a espera até o início real da chamada.

### Comportamento do terapeuta

- se o paciente ainda não entrou, mostrar estado `Aguardando paciente`
- exibir tempo restante até o horário oficial

### Comportamento do paciente no modelo operacional esperado

- o paciente pode entrar na waiting room dentro da janela
- a chamada efetiva começa quando o terapeuta entra

### No MVP

- não haverá fila de admissão manual
- a waiting room é um estado de espera, não um lobby com múltiplos participantes

## 15. Fase 2 - Chamada ao vivo

### Estrutura da tela

1. faixa superior de status
2. área principal de vídeo
3. barra de controles
4. painel lateral opcional de informações rápidas

## 16. Faixa superior de status

### Conteúdo

- nome do paciente
- timer da sessão
- status de conexão
- status de transcript

### Regras

- o timer deve contar o tempo corrido da chamada
- o status de transcript deve continuar visível durante toda a sessão

## 17. Área principal de vídeo

### Conteúdo

- vídeo remoto em destaque
- vídeo local em miniatura

### Regras

- quando o paciente estiver sem câmera, exibir placeholder apropriado
- quando o terapeuta desligar a câmera, a miniatura local deve refletir isso
- layout deve priorizar clareza, não múltiplas opções de composição no MVP

## 18. Barra de controles

### Controles obrigatórios

- ligar/desligar microfone
- ligar/desligar câmera
- trocar dispositivo
- copiar link da sessão, se permitido pelo fluxo
- abrir detalhe da sessão em nova aba, se necessário
- encerrar atendimento

### O que não entra no MVP

- chat
- compartilhar tela
- gravação
- levantar mão

## 19. Painel lateral opcional

### Conteúdo permitido

- resumo da sessão
- status de transcript
- status de pagamento resumido
- pendência crítica residual, se existir

### Regra

- não mostrar texto clínico nem formulário de prontuário durante a chamada

## 20. Reconexão e falhas

### Estado `Reconectando`

Deve aparecer quando:

- a conexão cair
- o provedor sofrer instabilidade
- navegador perder acesso temporário ao dispositivo

### Comportamento

- tentar reconexão automática primeiro
- mostrar feedback claro de progresso
- se falhar, exibir CTA `Tentar novamente`

### Regras

- reconexão não deve encerrar a sessão automaticamente
- o terapeuta precisa entender se a falha é local ou do provedor

## 21. Encerramento da chamada

### Ação principal

- `Encerrar atendimento`

### Confirmação

Modal com:

- aviso de que a chamada será finalizada
- aviso de que o fluxo pós-sessão será disparado
- confirmação explícita

### Regras

- encerrar a chamada pelo terapeuta marca a sessão como encerrada no fluxo de teleatendimento
- se transcript estiver ativo, o pipeline pós-sessão deve ser disparado
- se transcript estiver desativado, o sistema não dispara processamento clínico automatizado

## 22. Comportamento após encerramento

### Resultado esperado

- status vai para `Encerrada`
- terapeuta recebe CTA para voltar ao detalhe da sessão
- se transcript estiver ativo, exibir mensagem de que o processamento foi iniciado
- se transcript estiver desativado, exibir mensagem neutra sem prometer automação clínica

## 23. Estados de erro

### Casos principais

- permissão de câmera negada
- permissão de microfone negada
- provedor indisponível
- janela da sessão inválida
- sessão já encerrada

### Regras

- cada erro deve ter mensagem clara e ação possível
- evitar linguagem técnica interna do provedor

## 24. Dados mínimos para renderizar a tela

- resumo da sessão
- estado da sala
- janela de entrada
- credenciais temporárias do provedor
- estado do transcript
- estado de conexão
- participante remoto presente ou ausente

## 25. APIs mínimas necessárias

- `GET /appointments/:appointmentId/call`
- `POST /appointments/:appointmentId/room`
- `POST /appointments/:appointmentId/check-in`
- `POST /appointments/:appointmentId/end-session`

### Payload agregado recomendado de `GET /appointments/:appointmentId/call`

- `appointment`
- `roomSummary`
- `joinWindow`
- `deviceRequirements`
- `transcriptState`
- `callPermissions`

## 26. Eventos de produto

- `call_prejoin_loaded`
- `call_device_test_completed`
- `call_join_clicked`
- `call_joined`
- `call_transcript_state_viewed`
- `call_reconnect_started`
- `call_reconnect_failed`
- `call_end_clicked`
- `call_ended`

## 27. Critérios de aceite da Etapa 9

- o terapeuta consegue entrar na chamada com previsibilidade e clareza
- a tela deixa explícito o estado do transcript
- waiting room e sala ao vivo têm comportamentos distintos e compreensíveis
- falhas de conexão têm tratamento claro
- encerrar a chamada dispara corretamente o próximo estágio operacional
- a tela não mistura atendimento ao vivo com prontuário ou edição clínica

## 28. Dependências que esta etapa destrava

- fila de revisão clínica
- transcript pós-sessão
- rascunho IA
- métrica de duração real da sessão

## 29. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/10-fila-de-revisao-clinica.md`

## Nota de implementação - Sessão 05

O core web entregue nesta sessão implementa:

- `/app/appointments/:appointmentId/call` com estados de `pre-entrada`, `ao vivo`, `aguardando paciente`, `encerrada` e `ainda indisponivel`
- bloco de dispositivos com camera, microfone, preview e medidor visual
- status explicito de transcript como capability/consentimento, sem bloquear chamada quando desativado por politica
- acoes de `Preparar sala`, `Entrar agora` e `Encerrar atendimento`
- proxies web e endpoints backend para `call`, `room`, `check-in` e `end-session`

Ainda pendente nesta fase:

- provedor real de video
- presenca real do paciente via portal
- reconexao de rede real
- webhooks do provedor e metrica de duracao real confiavel

### Complemento do build atual

- o portal do paciente também já materializa a rota `/portal/appointments/:appointmentId/call`
- terapeuta e paciente seguem shells separados, mantendo a distinção entre operação clínica e experiência do paciente
