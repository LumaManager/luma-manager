# Web do Terapeuta - Etapa 2 - Login e Segurança

## 1. Objetivo

Definir de forma fechada os fluxos de autenticação e segurança do `web admin do terapeuta`, cobrindo:

- login
- MFA
- recuperação de acesso
- recuperação de senha
- gestão de sessões e dispositivos
- step-up authentication para ações sensíveis

## 1.1 Estado atual do build

- a superfície pública materializada hoje é `/login`
- a mesma tela resolve `credenciais + MFA` em duas etapas, sem rota pública separada para TOTP
- o login interno usa a mesma entrada pública e redireciona a sessão para `/internal`
- recuperação de senha, setup dedicado de MFA e step-up continuam definidos no domínio, mas ainda não existem como rotas públicas separadas no build atual

## 2. Escopo desta etapa

### Dentro do escopo

- terapeuta no web admin
- fluxo de acesso principal
- MFA obrigatório
- gerenciamento de sessões ativas
- segurança da conta

### Fora do escopo

- login do paciente
- SSO corporativo
- login social
- biometria nativa
- autenticação para admin interno

## 3. Decisões travadas nesta etapa

- o terapeuta entra com `e-mail + senha`
- o segundo fator obrigatório será `TOTP via aplicativo autenticador`
- `SMS` não será usado como MFA do terapeuta no MVP
- `magic link` não será o método principal de login do terapeuta no MVP
- `social login` não entra no MVP
- `SSO` não entra no MVP
- todo login do terapeuta exige MFA
- no primeiro acesso válido, o terapeuta é obrigado a configurar MFA antes de entrar no produto
- códigos de recuperação serão obrigatórios no setup inicial de MFA
- ações sensíveis exigem `step-up authentication`

## 4. Motivo dessas decisões

- terapeuta acessa dados sensíveis de saúde; o padrão precisa ser mais forte que conveniências de produto geral
- TOTP oferece segurança melhor que SMS para esse contexto
- magic link como método principal adiciona risco operacional e dependência excessiva do e-mail
- exigir MFA em todos os logins simplifica a política e reduz brechas

## 5. Telas desta etapa

1. `Login`
2. `Verificação MFA`
3. `Setup de MFA`
4. `Exibição e confirmação de códigos de recuperação`
5. `Esqueci minha senha`
6. `Redefinir senha`
7. `Segurança da conta` dentro de `Configurações`
8. `Sessões e dispositivos` dentro de `Configurações`
9. `Step-up modal` para ações críticas

## 6. Rotas

### Rotas públicas do build atual

- `/login`

### Rotas autenticadas

- `/app/settings/security`

Observação:

- `sessões e dispositivos` será uma seção interna de `/app/settings/security`
- não criar rota separada para sessões no MVP
- os fluxos `forgot/reset`, `setup de MFA` e `step-up` seguem como contrato alvo, mas não estão materializados como páginas públicas distintas nesta fase

## 7. Fluxo principal de acesso

### Fluxo A: login padrão

1. terapeuta abre `/login`
2. informa e-mail e senha
3. backend valida credenciais primárias
4. sistema exige MFA
5. terapeuta informa código TOTP
6. sistema cria sessão autenticada
7. usuário é redirecionado para `/app/dashboard`

### Fluxo B: primeiro login após cadastro

1. terapeuta conclui cadastro inicial
2. acessa `/login`
3. informa e-mail e senha
4. backend identifica ausência de MFA ativo
5. no build atual, o usuário segue pela própria superfície de login; a rota dedicada de setup de MFA continua planejada
6. escaneia QR code no app autenticador
7. informa primeiro código TOTP
8. sistema gera códigos de recuperação
9. terapeuta confirma que salvou os códigos
10. só então entra no `/app/dashboard`

### Fluxo C: esqueci a senha

1. usuário acessa o fluxo público de recuperação quando ele existir como rota dedicada
2. informa e-mail
3. sistema sempre responde com mensagem neutra
4. se o e-mail existir, envia link de redefinição
5. usuário redefine a senha
6. no próximo login, MFA continua obrigatório

### Fluxo D: perdi o dispositivo de MFA

1. usuário tenta entrar e não tem o segundo fator
2. usa um `código de recuperação`
3. sistema permite acesso controlado
4. usuário é obrigado a reconfigurar o MFA

Se o usuário não tiver código de recuperação:

- o acesso depende de suporte manual e fluxo forte de verificação de identidade
- esse fluxo deve ser raro, auditado e fora da experiência padrão

## 8. Tela 1 - Login

### Objetivo

Permitir autenticação primária do terapeuta.

### Campos

- e-mail
- senha

### Ações

- entrar
- esqueci minha senha
- ir para criação de conta, se habilitado pelo negócio

### Regras

- mensagens de erro devem ser genéricas
- não informar se o e-mail existe
- botão de entrar só habilita com campos mínimos válidos

### Estados

- padrão
- carregando
- credencial inválida
- conta bloqueada temporariamente
- conta pendente de ativação

## 9. Tela 2 - Verificação MFA

### Objetivo

Validar o segundo fator antes da criação da sessão completa.

### Campos

- código TOTP de 6 dígitos
- opção para usar código de recuperação

### Ações

- verificar código
- usar código de recuperação
- voltar ao login

### Regras

- o código deve expirar conforme a janela padrão do TOTP
- após número excessivo de tentativas, aplicar bloqueio temporário

## 10. Tela 3 - Setup de MFA

### Objetivo

Obrigar a configuração do segundo fator antes do primeiro uso real do sistema.

### Conteúdo

- explicação curta do porquê do MFA
- QR code
- chave secreta manual como fallback
- campo para inserir o primeiro código

### Ações

- copiar chave secreta
- validar configuração
- continuar

### Regras

- o usuário não pode pular este passo
- o setup só é concluído depois da validação bem-sucedida do primeiro código

## 11. Tela 4 - Códigos de recuperação

### Objetivo

Garantir que o terapeuta tenha um método de recuperação forte sem depender de SMS.

### Conteúdo

- lista de códigos de recuperação de uso único
- instrução para salvar em local seguro

### Ações

- copiar
- baixar
- confirmar que salvou

### Regras

- o usuário precisa confirmar explicitamente que salvou os códigos
- reexibição dos códigos completos só pode acontecer com `step-up authentication`

## 12. Tela 5 - Esqueci minha senha

### Objetivo

Iniciar o fluxo de redefinição sem vazar existência de conta.

### Campos

- e-mail

### Ações

- enviar instruções

## Nota de implementação - Revamp visual do login

- a tela de login do build atual foi reposicionada como `superfície de conversão e confiança`, não como formulário neutro
- a composição passou a separar claramente `promessa do produto` e `painel de acesso`
- o painel de acesso agora destaca presets de avaliação visual para `conta inicial`, `conta pronta` e `operação interna`
- MFA continua explícito e obrigatório, mas com progressão visual mais clara entre `identidade` e `TOTP`
- voltar ao login

### Regra crítica

- a resposta visual deve ser a mesma para e-mails existentes ou inexistentes

## 13. Tela 6 - Redefinir senha

### Objetivo

Permitir criação de nova senha a partir de token temporário.

### Campos

- nova senha
- confirmar nova senha

### Regras

- o token deve ter expiração curta
- a nova senha invalida sessões anteriores, exceto a sessão corrente de redefinição
- o próximo login volta a exigir MFA

### Política de senha

- mínimo de 12 caracteres
- bloquear senhas fracas conhecidas
- exigir combinação mínima de classes ou avaliação forte de entropia

## 14. Tela 7 - Segurança da conta

### Objetivo

Concentrar as configurações sensíveis da conta do terapeuta.

### Seções

- status do MFA
- regenerar códigos de recuperação
- alterar senha
- histórico recente de acesso
- sessões e dispositivos

### Regras

- qualquer ação que altere MFA, senha ou códigos de recuperação exige `step-up authentication`

## 15. Tela 8 - Sessões e dispositivos

### Objetivo

Dar visibilidade e controle sobre acessos ativos do terapeuta.

### Dados exibidos por sessão

- dispositivo/navegador
- sistema operacional
- localização aproximada, se disponível
- IP mascarado quando necessário
- data de criação
- último acesso
- indicador de sessão atual

### Ações

- encerrar sessão específica
- encerrar todas as outras sessões

### Regras

- encerrar a sessão atual exige confirmação explícita
- revogar outras sessões deve invalidar refresh tokens imediatamente

## 16. Step-up authentication

### Quando exigir

- desabilitar ou reconfigurar MFA
- regenerar códigos de recuperação
- alterar e-mail
- alterar senha
- exportar dados sensíveis, quando esse fluxo existir

### Forma

- pedir senha atual + código TOTP

### Janela de validade

- step-up válido por `10 minutos` para a ação sensível em andamento

## 17. Sessão e expiração

### Política de sessão do web admin

- expiração por inatividade: `30 minutos`
- aviso de expiração: aos `25 minutos`
- tempo máximo absoluto da sessão: `12 horas`

### Regras

- a sessão ativa pode ser renovada silenciosamente dentro do limite absoluto
- o usuário deve ser deslogado ao atingir o limite absoluto
- durante uso ativo do sistema, a sessão não deve cair inesperadamente

## 18. Armazenamento e segurança técnica

### Regras técnicas

- access token curto em memória
- refresh token em cookie `HttpOnly`, `Secure` e com proteção adequada de `SameSite`
- proteção CSRF em operações autenticadas do web
- fingerprints leves do dispositivo apenas para segurança operacional, sem rastreamento invasivo

### O que não fazer

- armazenar tokens sensíveis em `localStorage`
- usar MFA por SMS como padrão
- manter sessões longas sem rotação

## 19. Proteções contra abuso

- rate limit no login
- rate limit no MFA
- bloqueio temporário progressivo após falhas repetidas
- auditoria de tentativas suspeitas
- notificação ao usuário em eventos relevantes de segurança

## 20. APIs mínimas necessárias

### Materializadas no build atual

- `POST /v1/auth/login`
- `POST /v1/auth/mfa/verify`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`
- `GET /v1/app-shell/bootstrap`
- `GET /v1/settings`
- `POST /v1/settings/security`

### Ainda como contrato alvo

- `POST /v1/auth/password/forgot`
- `POST /v1/auth/password/reset`
- `POST /v1/auth/mfa/setup/start`
- `POST /v1/auth/mfa/setup/complete`
- `GET /v1/auth/security-overview`
- `GET /v1/auth/sessions`
- `POST /v1/auth/sessions/revoke-others`
- `POST /v1/auth/sessions/:sessionId/revoke`
- `POST /v1/auth/step-up/verify`

## 21. Eventos de produto e auditoria

- `login_attempted`
- `login_failed`
- `login_succeeded`
- `mfa_setup_started`
- `mfa_setup_completed`
- `mfa_challenge_failed`
- `password_reset_requested`
- `password_reset_completed`
- `session_revoked`
- `other_sessions_revoked`
- `step_up_verified`

## 22. Critérios de aceite da Etapa 2

- terapeuta não entra no web admin sem MFA ativo
- o primeiro login obriga setup de MFA
- o terapeuta consegue redefinir senha sem vazar existência de conta
- o terapeuta consegue ver e revogar sessões/dispositivos
- ações sensíveis exigem step-up authentication
- as políticas de expiração e rotação de sessão estão explícitas

## 23. Dependências que esta etapa destrava

- onboarding do terapeuta
- shell com alertas de segurança reais
- dashboard autenticado
- configurações da conta
- trilhas de auditoria de segurança

## 24. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/03-onboarding-do-terapeuta.md`
