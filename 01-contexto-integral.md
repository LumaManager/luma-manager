# Contexto Integral do Projeto

## 1. O que este projeto é

Este projeto é um SaaS para psicólogos no Brasil, com foco em operação clínica e administrativa completa. A plataforma deve centralizar:

- cadastro de pacientes
- agenda
- teleatendimento
- transcript seguro da sessão, quando juridicamente habilitado
- rascunho clínico assistido por IA
- prontuário com revisão humana
- cobrança
- documentos e consentimentos
- trilhas de auditoria e compliance

## 2. Tese central do produto

O valor principal não é só agenda ou cobrança. O núcleo do produto é transformar a sessão em material clínico útil, com segurança, governança e continuidade de caso, sem tirar do psicólogo a responsabilidade profissional.

## 3. Decisões já tomadas

### Mercado e público

- mercado inicial: Brasil
- público inicial: psicólogos
- paciente entra como usuário orientado pelo terapeuta
- ICP inicial definido: `psicólogo autônomo`, com `clínica privada própria`, `sem convênio` e `sem vínculo institucional`, que documenta manualmente após as sessões
- racional do ICP: menor atrito regulatório, compra individual mais rápida e dor de documentação mais direta
- benchmark direto do `Berries` confirma que o valor principal desse tipo de produto está em `documentação assistida browser-first`, com múltiplos modos de entrada e navegação enxuta

Documento de referência:

- [planejamento/mercado-e-icp.md](./planejamento/mercado-e-icp.md)

### Plataformas

- a visão do produto inclui `web admin` e `app móvel`
- a visão de longo prazo para mobile continua sendo `app único`, com perfis diferentes para terapeuta e paciente
- o `beta inicial` será `web-first`, sem depender de app nativo

### Stack e infraestrutura

- a stack de aplicação segue recomendada como `Next.js + NestJS + Drizzle`
- a decisão atual é usar `Supabase` como infraestrutura gerenciada em `Postgres`, `Storage` e `Auth`
- a recomendação atual `não` é substituir a arquitetura por `frontend + supabase-js` como espinha dorsal do produto
- o `backend` continua sendo a fonte de verdade para autorização clínica, regras de domínio e auditoria sensível

Documento de referência:

- [web/fundacao/07-avaliacao-do-supabase.md](./web/fundacao/07-avaliacao-do-supabase.md)

### Papel do paciente

- o paciente terá acesso operacional guiado
- o paciente poderá entrar por convite, assinar documentos, pagar, agendar conforme regra e participar da videochamada
- o paciente não terá acesso ao prontuário clínico, transcript ou notas privadas do terapeuta

### Papel da IA

- a IA será assistiva
- a IA gera rascunhos e estrutura a sessão
- a IA não publica automaticamente no prontuário
- todo registro clínico final exige revisão e aprovação do terapeuta
- a direção atual é `resumo em tópicos`, não nota clínica completa multi-seções
- não haverá sugestão automática de `CID/diagnóstico` por IA no produto
- o terapeuta valida os tópicos antes de qualquer registro
- o benchmark direto do `Berries` reforça que `assistente longitudinal` e `múltiplos modos de input` já são práticas reais desse mercado

### Teleatendimento

- o atendimento virtual acontecerá dentro da plataforma
- a videochamada usará provedor terceirizado seguro
- transcript e inteligência clínica ficarão em camada própria do produto, quando o contexto regulatório concreto permitir
- armazenar vídeo bruto não deve ser padrão do MVP
- a direção atual é `não reter áudio bruto`
- a direção atual é `não reter transcript bruto` após geração dos tópicos
- o produto deve suportar fallback para modos sem áudio, mas a tese principal continua sendo testar ajuda documental derivada da sessão

### Compliance

- o produto deve nascer com postura de compliance máxima
- consentimento, auditoria, retenção e descarte entram desde o MVP
- retenção deve ser configurável por política, e não hardcoded em regra fixa

### Licitude no Brasil

- a tese regulatória de trabalho mais defensável hoje é `plataforma SaaS para psicólogos`, não `prestadora direta de serviços de Psicologia`
- o produto parece `viável em tese` no Brasil, mas o go-live depende de fechamento jurídico aplicado
- `transcrição com IA` não foi encontrada como proibida de forma geral pelas fontes oficiais consultadas
- ao mesmo tempo, `áudio/transcrição` não pode ser tratado como funcionalidade universal; o módulo deve ser `condicional`
- a IA deve ser posicionada como `assistência documental`, não como diagnóstico, conduta clínica autônoma ou substituição do psicólogo
- prontuário, workspace clínico auxiliar e CRM operacional devem continuar separados
- se a empresa vier a ser enquadrada como `prestadora de serviços de Psicologia`, a carga regulatória sobe e o tema `registro/cadastro de PJ no CRP` entra com força
- a direção de infraestrutura atualmente assumida para reduzir risco é `processamento no Brasil`, sem transferência internacional na primeira versão

Documentos de referência adicionais:

- [planejamento/benchmark-heyberries.md](./planejamento/benchmark-heyberries.md)
- [planejamento/perguntas-em-aberto.md](./planejamento/perguntas-em-aberto.md)

Documentos de referência:

- [licitude-brasil/00-indice-licitude-br.md](./licitude-brasil/00-indice-licitude-br.md)
- [licitude-brasil/01-tese-de-licitude-no-brasil.md](./licitude-brasil/01-tese-de-licitude-no-brasil.md)
- [licitude-brasil/05-gates-juridicos-para-go-live.md](./licitude-brasil/05-gates-juridicos-para-go-live.md)

### Modelo operacional do MVP

- o MVP deve começar por `terapeuta individual`
- a arquitetura deve estar pronta para evoluir para clínica multiusuário depois
- o projeto já está `pronto para começar a gerar código` no core web, desde que o build comece por foundation, auth, shell, onboarding e fluxo core sem áudio
- o projeto ainda `não` está pronto para tratar áudio/transcrição como capability universal de produção

Documento de referência:

- [web/implementacao/05-prontidao-para-codificar.md](./web/implementacao/05-prontidao-para-codificar.md)

## 4. O que significa "arquitetura pronta para clínica depois"

Significa que o MVP não implementa ainda a operação completa de clínica, mas já evita decisões que bloqueiem essa evolução.

Na prática:

- existe o conceito de `tenant/conta`
- usuários e papéis não são modelados como um único dono fixo
- pacientes, agenda, documentos e cobrança são ligados à conta e aos vínculos corretos
- o modelo já suporta futura entrada de múltiplos terapeutas, secretária e permissões por função

Conclusão:

- começa simples no MVP
- evita reescrita estrutural quando a fase de clínica chegar

## 5. O que definir primeiro: web ou aplicativo

A orientação atual é:

- definir os dois desde já
- começar pela experiência `web do terapeuta`

## 6. Motivo para começar pelo web

Os fluxos mais densos do produto estão do lado do terapeuta:

- cadastro de pacientes
- agenda
- cobrança
- documentos
- revisão de transcript
- edição de prontuário
- configurações
- compliance e auditoria

Esses fluxos:

- mudam muito no início
- são mais rápidos de validar no web
- permitem iteração mais eficiente com usuários reais

## 7. Estratégia recomendada de canais

### Web primeiro para terapeuta

O `web admin` deve ser tratado como a superfície principal do MVP para operação clínica e administrativa.

### Mobile enxuto para paciente

O app do paciente deve ser simples e operacional, cobrindo:

- convite e cadastro
- assinatura de documentos
- visualização de próximas sessões
- pagamento
- entrada na videochamada

### Mobile mais leve para terapeuta no início

O app do terapeuta pode nascer mais enxuto, cobrindo:

- agenda
- lembretes
- entrar na sessão
- consulta rápida de paciente
- ações urgentes de revisão

## 8. Decisão operacional atual

A recomendação vigente do projeto é:

- `web primeiro para operação do terapeuta`
- `experiência mínima do paciente via web responsivo` no beta
- `mobile do terapeuta` e `mobile do paciente` ficam para depois da validação do núcleo do produto

## 8.1 Ajuste de estratégia posterior

A estratégia foi refinada para um modelo `beta web-first`.

Isso significa:

- o produto pode começar a ser desenvolvido e validado sem depender de app nativo
- o `web do terapeuta` passa a ser a prioridade absoluta de construção
- o `paciente` entra no beta por fluxo `web responsivo` nos casos essenciais
- os apps nativos ficam para depois da validação de aderência do núcleo do produto

Motivo:

- os fluxos mais densos e críticos estão no web
- isso reduz retrabalho, acelera teste com profissionais e simplifica rollout do beta

## 8.2 Organização física da documentação

A documentação foi reorganizada para um `pacote dedicado do web` em `/web`.

Estrutura atual:

- `/web` concentra os documentos diretamente ligados à construção e validação do web
- `/web/telas` concentra as 16 etapas do web
- `/web/produto` concentra PRD, ordem de definição e mapa de telas
- `/web/planejamento` concentra a estratégia específica do beta web-first
- `/arquitetura` e `/planejamento` continuam guardando documentos compartilhados do produto
- existe uma skill global criada para futuros agentes em [SKILL.md](/Users/gabrielfrozi/.codex/skills/saas-conversion-builder/SKILL.md), focada em criação de SaaS com conversão, clareza operacional e auth objetivo

Regra prática:

- agentes que vão trabalhar no web devem começar por `/web/00-indice-web.md`
- agentes que precisam da visão global continuam começando por `/00-indice-mestre.md`

## 8.3 Ordem de definição das telas

A ordem oficial de definição foi fixada assim:

1. estrutura-base do web
2. login e segurança
3. onboarding do terapeuta
4. dashboard
5. lista de pacientes
6. ficha do paciente
7. agenda
8. detalhe da sessão
9. videochamada
10. fila de revisão clínica
11. transcript e rascunho IA
12. prontuário longitudinal
13. documentos e consentimentos
14. financeiro
15. configurações
16. admin interno

Documento de referência:

- [web/produto/ordem-de-definicao-de-telas.md](./web/produto/ordem-de-definicao-de-telas.md)

## 8.4 Etapa 1 já definida

A estrutura-base do web admin do terapeuta já foi fechada em:

- [web/telas/01-estrutura-base-do-web.md](./web/telas/01-estrutura-base-do-web.md)

Decisões principais dessa etapa:

- web admin é desktop-first
- sidebar é a navegação principal
- não haverá busca global no MVP
- não haverá command palette no MVP
- não haverá troca de tenant no MVP
- prontuário não entra como item isolado do menu principal
- menu principal do terapeuta fica:
  - Dashboard
  - Pacientes
  - Agenda
  - Revisão Clínica
  - Financeiro
  - Documentos
  - Configurações

## 8.5 Etapa 2 já definida

Os fluxos de acesso e segurança do web do terapeuta já foram fechados em:

- [web/telas/02-login-e-seguranca.md](./web/telas/02-login-e-seguranca.md)

Decisões principais dessa etapa:

- login com `e-mail + senha`
- MFA obrigatório com `TOTP`
- sem `SMS` como MFA no MVP
- sem `social login`
- sem `magic link` como login principal do terapeuta
- primeiro acesso obriga setup de MFA
- códigos de recuperação são obrigatórios
- ações sensíveis exigem `step-up authentication`
- sessões do web expiram por inatividade e podem ser revogadas pelo terapeuta

## 8.6 Etapa 3 já definida

O onboarding do terapeuta no web já foi fechado em:

- [web/telas/03-onboarding-do-terapeuta.md](./web/telas/03-onboarding-do-terapeuta.md)

Decisões principais dessa etapa:

- onboarding em `wizard por etapas`
- `CRP`, dados operacionais, dados tributários mínimos, contrato/DPA, agenda inicial e consentimentos padrão são obrigatórios
- a conta tem estados explícitos: `draft`, `pending_setup`, `ready_for_operations` e `restricted`
- o terapeuta só pode operar quando a conta estiver `ready_for_operations`
- pendências críticas bloqueiam cadastro de pacientes, agenda, teleatendimento e cobrança

## 8.7 Etapa 4 já definida

O dashboard do terapeuta no web já foi fechado em:

- [web/telas/04-dashboard-do-terapeuta.md](./web/telas/04-dashboard-do-terapeuta.md)

Decisões principais dessa etapa:

- o dashboard é `operacional`, não analítico
- a visão padrão é a `visão do dia`
- o foco visual principal é: atendimento próximo, revisão clínica, pendências críticas e operação imediata
- o dashboard terá cards resumidos e listas operacionais, sem gráficos avançados
- o terapeuta entra por `/app/dashboard` e deve entender o que precisa fazer em poucos segundos

## 8.8 Etapa 5 já definida

A lista de pacientes no web já foi fechada em:

- [web/telas/05-lista-de-pacientes.md](./web/telas/05-lista-de-pacientes.md)

Decisões principais dessa etapa:

- a lista de pacientes é um `diretório operacional`, não um dashboard paralelo
- a visualização principal é `tabela`
- a ordenação padrão é `nome A-Z`
- status, documentos e financeiro aparecem como sinais separados
- `Novo paciente` será criação rápida em `drawer`
- a lista leva o terapeuta para a ficha do paciente, que continua sendo a tela de detalhe principal

## 8.9 Etapa 6 já definida

A ficha do paciente no web já foi fechada em:

- [web/telas/06-ficha-do-paciente.md](./web/telas/06-ficha-do-paciente.md)

Decisões principais dessa etapa:

- a ficha do paciente é a tela principal de detalhe do caso
- ela usa `abas internas` na rota `/app/patients/:patientId`
- o `prontuário` continua separado em `/app/patients/:patientId/clinical-record`
- a ficha mostra contexto operacional e metadata clínica mínima, mas não texto clínico detalhado
- o cabeçalho do paciente é persistente e concentra ações como `Agendar sessão` e `Abrir prontuário`

## 8.10 Etapa 7 já definida

A agenda do terapeuta no web já foi fechada em:

- [web/telas/07-agenda-do-terapeuta.md](./web/telas/07-agenda-do-terapeuta.md)

Decisões principais dessa etapa:

- a agenda é `calendar-first`
- a visão padrão é `semana`
- há alternância entre `dia`, `semana` e `mês`
- `Nova sessão` abre em `drawer`
- disponibilidade estrutural e bloqueios pontuais são entidades separadas
- reagendamento pode acontecer por ação explícita e por drag and drop controlado
- cancelamento exige confirmação e preserva histórico operacional

## 8.11 Etapa 8 já definida

O detalhe da sessão no web já foi fechado em:

- [web/telas/08-detalhe-da-sessao.md](./web/telas/08-detalhe-da-sessao.md)

Decisões principais dessa etapa:

- o detalhe da sessão é uma `página dedicada` em `/app/appointments/:appointmentId`
- a tela é `pré-sessão-first`
- o topo mostra status da sessão e CTA principal contextual
- consentimentos, documentos e pagamento aparecem como resumos operacionais
- a sala virtual é tratada como recurso efêmero ligado à sessão
- a tela não embute a videochamada; ela prepara a entrada para a próxima etapa

## 8.12 Etapa 9 já definida

A videochamada no web já foi fechada em:

- [web/telas/09-videochamada-no-web.md](./web/telas/09-videochamada-no-web.md)

Decisões principais dessa etapa:

- a experiência tem duas fases: `pré-entrada` e `chamada ao vivo`
- a rota é `/app/appointments/:appointmentId/call`
- o fluxo do MVP é `1 terapeuta x 1 paciente`
- há `waiting room`, mas sem admissão manual no MVP
- teleatendimento sem consentimento válido bloqueia entrada
- transcript sem consentimento válido não bloqueia a chamada, mas fica desativado
- não haverá gravação integral de vídeo no MVP
- encerrar a chamada dispara o próximo estágio operacional da sessão

## 8.13 Etapa 10 já definida

A fila de revisão clínica no web já foi fechada em:

- [web/telas/10-fila-de-revisao-clinica.md](./web/telas/10-fila-de-revisao-clinica.md)

Decisões principais dessa etapa:

- a fila de revisão é um `inbox operacional`, não dashboard
- a rota é `/app/clinical-review`
- a ordenação padrão é por prioridade operacional
- transcript e rascunho aparecem como estados de pipeline, sem expor conteúdo clínico
- a fila mostra SLA interno visual
- o terapeuta pode abrir diretamente o próximo item pendente

## 8.14 Etapa 11 já definida

A tela de transcript e rascunho IA no web já foi fechada em:

- [web/telas/11-transcript-e-rascunho-ia.md](./web/telas/11-transcript-e-rascunho-ia.md)

Decisões principais dessa etapa:

- a rota é `/app/clinical-review/:appointmentId`
- a tela é dividida em `transcript` e `rascunho`
- o transcript é insumo, o rascunho é `draft` e o prontuário aprovado é registro final
- nada entra no prontuário sem ação explícita do terapeuta
- o transcript não é editável no MVP
- o terapeuta pode descartar o rascunho sem perder rastreabilidade

## 8.15 Etapa 12 já definida

O prontuário longitudinal no web já foi fechado em:

- [web/telas/12-prontuario-longitudinal.md](./web/telas/12-prontuario-longitudinal.md)

Decisões principais dessa etapa:

- a rota é `/app/patients/:patientId/clinical-record`
- o prontuário é uma tela dedicada e separada da ficha do paciente
- a visão padrão é uma timeline clínica decrescente
- o prontuário mostra apenas registros finais aprovados como visão principal
- transcript e rascunho continuam fora da leitura principal
- versões aprovadas são rastreáveis, mas a versão atual é a principal exibida

## 8.16 Etapa 13 já definida

A área de documentos e consentimentos no web já foi fechada em:

- [web/telas/13-documentos-e-consentimentos.md](./web/telas/13-documentos-e-consentimentos.md)

Decisões principais dessa etapa:

- a rota principal é `/app/documents`
- a área é operacional e regulatória, não um repositório genérico de arquivos
- consentimento sempre aparece vinculado ao documento/versionamento correspondente
- o MVP usa modelos padrão da plataforma
- pendências críticas documentais precisam aparecer como bloqueios operacionais
- assinatura, consentimento, reenvio e revogação ficam rastreáveis

## 8.17 Etapa 14 já definida

A área financeira no web já foi fechada em:

- [web/telas/14-financeiro.md](./web/telas/14-financeiro.md)

Decisões principais dessa etapa:

- a rota principal é `/app/finance`
- a área é `cobrança-first`, não contabilidade-first
- a unidade principal é a `cobrança`
- particular e convênio aparecem como classificação operacional
- a ordenação padrão prioriza vencidas e cobranças críticas
- há resumo mensal e exportação para contador, sem fiscal avançado no MVP

## 8.18 Etapa 15 já definida

A área de configurações no web já foi fechada em:

- [web/telas/15-configuracoes.md](./web/telas/15-configuracoes.md)

Decisões principais dessa etapa:

- a rota principal é `/app/settings`
- a área é uma superfície de `governança operacional`, não um depósito genérico de opções
- dados capturados no onboarding passam a ser mantidos aqui depois da ativação da conta
- o MVP terá seções de `Perfil profissional`, `Conta e consultório`, `Segurança`, `Políticas operacionais` e `Notificações`
- mudanças sensíveis exigem `step-up authentication`
- mudanças de política são prospectivas por padrão e não reescrevem histórico regulatório
- a conta `pending_setup` continua no onboarding, e não em configurações

## 8.19 Etapa 16 já definida

A área de admin interno no web já foi fechada em:

- [web/telas/16-admin-interno.md](./web/telas/16-admin-interno.md)

Decisões principais dessa etapa:

- o admin interno é uma superfície separada do web do terapeuta
- o prefixo de rota é `/internal`
- acesso interno exige MFA obrigatório e perfil autorizado
- suporte interno opera em modo `metadata-first`
- conteúdo clínico fica indisponível por padrão para o admin interno no MVP
- os módulos do MVP são `Visão geral`, `Tenants`, `Suporte`, `Billing`, `Auditoria` e `Incidentes`
- qualquer futuro break-glass para leitura clínica ficou explicitamente fora do escopo do MVP

## 8.20 Portal web essencial do paciente no build atual

O build web agora inclui também uma primeira versão dummy do `portal do paciente`, apoiada no modelo de rotas já documentado:

- [web/telas/17-portal-do-paciente-essencial.md](./web/telas/17-portal-do-paciente-essencial.md)

Decisões principais dessa fase:

- o portal usa prefixo `/portal` e shell separado do terapeuta e do admin interno
- o convite público começa em `/invite/:token`
- o fluxo cobre `aceite do convite`, `cadastro inicial`, `documentos`, `pagamentos`, `sessões` e `entrada na call`
- o portal continua sem prontuário, transcript ou qualquer leitura clínica detalhada
- a sessão do portal foi mantida dummy e separada da sessão do terapeuta para reduzir acoplamento nesta fase
- a UX do portal prioriza `clareza operacional` e `mobile web responsivo`

## 9. Estado das integrações

### Já orientado

- vídeo via provedor seguro terceirizado
- transcript via provedor terceirizado
- LLM para rascunho clínico com contrato que impeça treino em dados do cliente
- pagamento e assinatura eletrônica por adapters

### Ainda em aberto

- quais fornecedores específicos serão usados
- qual política final de retenção será validada pelo jurídico
- qual modelo comercial será adotado

## 10. Modelo comercial ainda não fechado

O preço não deve ser congelado antes de medir custo real por sessão. É preciso medir:

- minutos de vídeo
- minutos de transcript
- custo da IA por sessão
- storage
- notificações
- suporte

O produto deve ser construído de forma que permita pricing futuro por:

- terapeuta
- paciente ativo
- franquia de uso
- modelo híbrido

## 11. Perguntas ainda abertas

As principais dúvidas restantes estão em [planejamento/perguntas-em-aberto.md](./planejamento/perguntas-em-aberto.md), com destaque para:

- terapeuta individual versus clínica no escopo comercial do MVP
- regras finais de retenção
- fornecedores
- modelo de monetização
- experiência final do paciente

## 12. Regra para próximos agentes

Qualquer nova decisão relevante precisa ser salva em `.md`.

## 13. Trilha de implementação do web

Foi criada uma trilha específica de implementação em `/web/implementacao`.

Documentos atuais:

- `/web/implementacao/README.md`
- `/web/implementacao/01-ordem-de-build.md`
- `/web/implementacao/02-modelo-de-rotas.md`
- `/web/implementacao/03-apis-e-contratos.md`
- `/web/implementacao/04-backlog-do-mvp.md`

Objetivo:

- transformar a definição funcional do web em ordem real de construção
- reduzir ambiguidades de rota, contrato e prioridade de build
- permitir que próximos agentes entrem direto em execução

## 14. Fase de fundação antes do build

Antes de começar a construir o web de fato, foi formalizado que ainda precisamos congelar uma camada de `fundação`.

Essa fundação cobre:

- stack end-to-end
- integração entre os componentes do sistema
- branding e direção visual
- layout e composição das telas
- leitura prática do que parece funcionar no mercado atual

Documentos criados para isso:

- `/web/fundacao/README.md`
- `/web/fundacao/01-gates-pre-build.md`
- `/web/fundacao/02-stack-recomendada.md`
- `/web/fundacao/03-direcao-de-branding-e-ui.md`
- `/web/fundacao/04-layout-e-composicao-do-web.md`
- `/web/fundacao/05-sinais-de-mercado.md`

## 15. Riscos estratégicos já explicitados

Foi criado um documento específico para registrar os riscos mais perigosos do projeto:

- `/planejamento/riscos-reais-e-modos-de-falha.md`

Os riscos centrais destacados até aqui são:

- confiança clínica e jurídica insuficiente para adoção
- transcript e draft não gerarem economia de tempo real
- unit economics ruins por sessão
- escopo excessivo antes de provar retenção

## 16. IA sem captura de áudio da sessão

Foi registrado um cenário importante: se o terapeuta estiver submetido a termo, política institucional ou obrigação prática que proíba `gravador` ou `captura de áudio da sessão`, então o produto não deve tratar transcript automático como premissa desse fluxo.

Conclusão operacional:

- sem captura de áudio, não há transcript automático defensável nesse contexto
- o caminho mais seguro passa a ser `IA sobre notas produzidas pela própria terapeuta`
- isso reposiciona o valor do produto para `pós-sessão assistido`, em vez de `ambient AI`

Documento de referência:

- `/planejamento/ia-sem-gravacao-da-sessao.md`

## 17. Investigação oficial sobre gravação e transcrição

Foi feita uma investigação adicional com base em fontes oficiais do CFP, CRP e LGPD.

Conclusão registrada:

- não foi encontrada proibição geral do CFP à gravação de sessões
- o CFP oficialmente admite gravação em casos necessários, com ciência, concordância e objetivo claros
- existe base normativa para registro documental sigiloso separado do prontuário
- portanto, não há base suficiente para afirmar que transcription com IA `realmente não pode` em termos gerais
- o ponto decisivo passa a ser o contexto específico do terapeuta, o texto do termo assinado e a revisão jurídica aplicada ao fluxo

Documento de referência:

- `/planejamento/investigacao-oficial-gravacao-transcricao-e-registro-auxiliar.md`

## 18. Dossiê central de investigação

Foi criado um arquivo consolidado para servir como ponto único de decisão antes de congelar o caminho do produto:

- `/investigacao.md`

Esse documento reúne:

- o que já foi confirmado
- o que ainda está em aberto
- as hipóteses regulatórias
- os cenários de produto
- as perguntas para jurídico, terapeuta e equipe técnica

Objetivo:

- permitir uma decisão final mais segura sobre transcription, CRM auxiliar e prontuário

## 19. Benchmark da HeyBerries

Foi registrado um benchmark específico da `HeyBerries / Berries`, empresa dos EUA focada em AI scribe para profissionais de saúde mental.

Conclusões principais registradas:

- a empresa valida a existência de mercado para documentação assistida por IA em mental health
- ela reforça que `não armazenar gravações` é parte central da narrativa de confiança
- ela sugere que um fluxo browser-first e integração leve com EHR pode ser suficiente para gerar valor
- ela não resolve, por si só, a viabilidade regulatória brasileira

Documento de referência:

- `/planejamento/benchmark-heyberries.md`

Não depender do chat como memória principal do projeto.
