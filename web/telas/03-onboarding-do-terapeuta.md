# Web do Terapeuta - Etapa 3 - Onboarding do Terapeuta

## 1. Objetivo

Definir de forma fechada o onboarding do terapeuta no `web admin`, cobrindo:

- criação e ativação da conta profissional
- coleta dos dados mínimos operacionais e regulatórios
- aceite contratual
- configuração inicial da agenda
- configuração inicial de cobrança
- configuração inicial de consentimentos
- regra de prontidão da conta para começar a atender

## 2. Escopo desta etapa

### Dentro do escopo

- psicólogo dono da conta no MVP
- fluxo de ativação inicial após cadastro
- checklist de prontidão da conta
- pendências que bloqueiam operação

### Fora do escopo

- onboarding de paciente
- onboarding de secretária
- clínica multiusuário
- SSO corporativo
- configuração fiscal avançada com integração externa

## 3. Decisões travadas nesta etapa

- o onboarding do terapeuta será `wizard por etapas`
- o terapeuta só entra no dashboard operacional completo quando concluir os blocos obrigatórios
- o sistema pode permitir salvar progresso parcial, mas não liberar atendimento sem conta apta
- `CRP` é obrigatório no onboarding
- dados bancários para recebimento são obrigatórios no onboarding
- dados tributários mínimos são obrigatórios no onboarding
- aceite de contrato e DPA é obrigatório antes do uso operacional
- configuração inicial de agenda é obrigatória
- configuração inicial de consentimentos padrão é obrigatória
- configuração avançada de fiscal fica fora do onboarding do MVP

## 4. Princípio do fluxo

O onboarding não deve ser um cadastro genérico. Ele deve funcionar como `ativação assistida da prática profissional`.

O sistema precisa responder duas perguntas:

1. essa pessoa é um psicólogo apto a operar a conta?
2. essa conta está configurada o suficiente para atender um paciente com segurança e rastreabilidade?

## 5. Estrutura do wizard

O onboarding será composto por `7 etapas`.

1. Boas-vindas e contexto
2. Perfil profissional
3. Dados operacionais e de recebimento
4. Dados tributários mínimos
5. Contrato e DPA
6. Configuração inicial da agenda
7. Consentimentos padrão e checklist final

## 5.1 Rota web

- `/app/onboarding`

Regra:

- contas `draft` e `pending_setup` usam esta rota como fluxo principal de ativação
- o shell continua existindo, mas entra em `modo de ativação`

## 6. Regras gerais do wizard

- o progresso deve ser salvo por etapa
- etapas concluídas ficam marcadas visualmente
- o usuário pode voltar para etapas anteriores
- o usuário não pode pular etapas obrigatórias
- erros devem apontar exatamente o campo pendente
- se o usuário abandonar o fluxo, o sistema deve retomá-lo da última etapa válida
- o shell do produto pode existir, mas a conta fica em `modo de ativação` até o checklist final

## 7. Estados da conta durante o onboarding

### `draft`

- conta criada, onboarding não iniciado ou incompleto

### `pending_setup`

- onboarding iniciado, mas ainda com requisitos faltantes

### `ready_for_operations`

- conta pronta para cadastrar pacientes, agendar e atender

### `restricted`

- conta já ativada, mas voltou a ter pendência crítica posterior

## 8. Tela 1 - Boas-vindas e contexto

### Objetivo

Explicar o que será configurado e quanto falta para a conta ficar pronta.

### Conteúdo

- resumo das etapas
- tempo estimado
- lista do que será necessário ter em mãos
- aviso de que dados clínicos exigem configuração correta da conta

### Ações

- começar onboarding
- continuar depois, se permitido antes da primeira ativação completa

### Regras

- esta tela não pede dados
- deve preparar expectativa e reduzir abandono

## 9. Tela 2 - Perfil profissional

### Objetivo

Identificar o psicólogo e registrar os dados profissionais mínimos.

### Campos obrigatórios

- nome completo
- nome social, se aplicável
- CRP
- estado do CRP
- CPF
- data de nascimento
- telefone
- e-mail profissional, se diferente do login

### Campos opcionais do MVP

- especialidade
- mini bio profissional
- foto de perfil

### Regras

- CRP deve seguir máscara e validação sintática básica
- o sistema pode marcar `validação externa futura`, mas no MVP não depende de integração automática
- CPF é obrigatório para fins contratuais e operacionais

## 10. Tela 3 - Dados operacionais e de recebimento

### Objetivo

Coletar os dados mínimos para operação da prática e recebimento financeiro.

### Campos obrigatórios

- nome de exibição da prática ou conta
- telefone de contato da prática
- timezone
- chave Pix ou método principal de recebimento
- nome do favorecido

### Campos opcionais do MVP

- endereço comercial
- logo da prática
- instruções padrão de pagamento

### Regras

- timezone padrão inicial: `America/Sao_Paulo`, editável
- sem configuração de recebimento a conta não pode gerar cobrança

## 11. Tela 4 - Dados tributários mínimos

### Objetivo

Registrar o mínimo necessário para relatórios financeiros e futura automação fiscal.

### Campos obrigatórios

- regime de atuação declarado
- CPF ou CNPJ de faturamento
- município principal de operação
- tipo de emissão atual

### Campos opcionais do MVP

- inscrição municipal
- contador responsável
- observações fiscais

### Regras

- esta etapa não integra com prefeitura nem Receita no MVP
- o objetivo é preparar a base de dados e evitar retrabalho futuro

## 12. Tela 5 - Contrato e DPA

### Objetivo

Formalizar o uso da plataforma e o enquadramento contratual mínimo.

### Conteúdo obrigatório

- termos de uso da plataforma
- contrato comercial
- DPA ou cláusula equivalente de tratamento de dados
- política de privacidade

### Ações

- ler documento
- aceitar
- baixar cópia

### Regras

- aceite deve ser versionado
- o terapeuta precisa aceitar todas as peças obrigatórias
- sem aceite contratual a conta não sai de `pending_setup`

## 13. Tela 6 - Configuração inicial da agenda

### Objetivo

Garantir que a conta tenha disponibilidade mínima antes de convidar pacientes e marcar sessões.

### Campos e ações

- dias da semana atendidos
- horários padrão
- duração padrão da sessão
- intervalo entre sessões
- modalidade padrão

### Defaults sugeridos

- duração padrão inicial: `50 minutos`
- intervalo padrão inicial: `10 minutos`
- modalidade padrão: `teleatendimento`

### Regras

- pelo menos um bloco de disponibilidade deve existir
- o terapeuta pode editar depois em configurações
- a conta sem agenda mínima não pode ser considerada pronta para operação

## 14. Tela 7 - Consentimentos padrão e checklist final

### Objetivo

Configurar as bases documentais mínimas para operação com pacientes.

### Itens obrigatórios

- termo LGPD do paciente configurado
- termo de teleatendimento configurado
- termo de transcript e IA configurado
- política padrão de coleta de consentimento definida

### Decisões do MVP

- o terapeuta escolhe entre modelos padrão fornecidos pela plataforma
- edição completa de templates próprios pode ficar para fase seguinte
- o sistema precisa deixar claro quais termos serão exigidos do paciente antes da sessão

### Checklist final de prontidão

A conta só vira `ready_for_operations` quando todos os itens abaixo estiverem completos:

- MFA ativo
- perfil profissional completo
- dados operacionais preenchidos
- dados tributários mínimos preenchidos
- contrato e DPA aceitos
- disponibilidade inicial configurada
- consentimentos padrão configurados

## 15. Resultado do onboarding

### Se tudo estiver completo

- status da conta muda para `ready_for_operations`
- usuário é redirecionado ao dashboard
- alertas globais críticos de ativação desaparecem

### Se houver pendência

- status permanece `pending_setup`
- o usuário vê claramente o que ainda falta
- ações operacionais críticas ficam bloqueadas

## 16. Bloqueios operacionais por pendência

### Deve bloquear completamente

- cadastrar paciente
- agendar sessão
- iniciar teleatendimento
- gerar cobrança

### Pode continuar permitido

- revisar perfil
- ler contratos
- concluir setup
- acessar ajuda

## 17. Salvamento e retomada

### Regras

- cada etapa salva seu progresso
- ao voltar ao sistema, o usuário é redirecionado para a próxima etapa pendente
- se o terapeuta fechar o navegador, nada preenchido em etapa salva deve ser perdido

## 18. Estados da experiência

### Loading

- carregamento inicial do wizard
- salvamento por etapa

### Erro

- erro de validação de campo
- falha de rede ao salvar etapa
- falha ao registrar aceite contratual

### Empty/assistido

- instruções claras em etapas mais regulatórias
- ajuda contextual curta em termos tributários ou contratuais

## 19. APIs mínimas necessárias

- `GET /v1/account/onboarding`
- `POST /v1/account/onboarding/start`
- `POST /v1/account/onboarding/complete-step`

Observação:

- nesta fase inicial, o backend aceita `complete-step` com payload discriminado por etapa
- os detalhes internos de persistência continuam encapsulados na API

## 20. Dados mínimos para bootstrap do onboarding

- identidade do usuário
- status da conta
- etapa atual
- etapas concluídas
- pendências bloqueantes
- versões documentais vigentes
- templates padrão de consentimento

## 21. Eventos de produto e auditoria

- `therapist_onboarding_started`
- `therapist_onboarding_step_completed`
- `therapist_contract_accepted`
- `therapist_dpa_accepted`
- `therapist_schedule_initialized`
- `therapist_default_consents_configured`
- `therapist_onboarding_completed`

## 22. Critérios de aceite da Etapa 3

- existe wizard claro de ativação do terapeuta
- a conta tem estados explícitos de prontidão
- está fechado o conjunto mínimo de dados obrigatórios
- está explícito o que bloqueia operação
- o terapeuta só começa a operar quando a conta estiver apta
- o onboarding salva progresso e pode ser retomado

## 23. Dependências que esta etapa destrava

- dashboard com contexto real da conta
- cadastro de pacientes
- agenda operacional
- cobrança inicial
- documentos e consentimentos do paciente

## 24. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/04-dashboard-do-terapeuta.md`

## 25. Atualização de fase

### O que já existe no build atual

- rota `/app/onboarding` com wizard real de `7 etapas`
- shell do terapeuta em `modo de ativação`, sem desaparecer durante o onboarding
- banners e sinais de bloqueio para contas fora de `ready_for_operations`
- login e bootstrap redirecionando contas `pending_setup` para o onboarding

### Decisões já refletidas na UI

- o onboarding atual usa hero operacional, resumo de progresso e checklist de prontidão
- o produto continua útil sem áudio; transcript permanece capability condicional fora do caminho crítico da ativação
