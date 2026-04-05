# Sessao 02 de Implementacao Real

Data de consolidacao: `30/03/2026`.

## 1. Objetivo desta sessao

Implementar a proxima fatia correta do core web:

- onboarding do terapeuta
- estados da conta
- shell em modo de ativacao
- bloqueio operacional para contas fora de `ready_for_operations`

## 2. Entrega funcional desta fase

### Backend

- `GET /v1/account`
- `GET /v1/account/capabilities`
- `GET /v1/account/onboarding`
- `POST /v1/account/onboarding/start`
- `POST /v1/account/onboarding/complete-step`

### Web

- rota `/app/onboarding`
- wizard com `7 etapas`
- sidebar reduzida quando a conta esta em ativacao
- bloqueio de areas operacionais enquanto a conta estiver `pending_setup`
- login passando a direcionar para onboarding quando a conta nao esta pronta

## 3. Decisoes aplicadas no build

- o shell nao some durante onboarding; ele entra em `modo de ativacao`
- o dashboard continua acessivel, mas com conteudo reduzido e CTA dominante para concluir a ativacao
- a API passa a ser a fonte de verdade do estado atual da conta, mesmo quando o token de sessao foi emitido antes da conclusao do wizard
- o mock data agora tem pelo menos dois perfis:
  - `ana@institutovivace.com.br`: conta `pending_setup`
  - `ana.ready@institutovivace.com.br`: conta `ready_for_operations`

## 4. Estrutura adicionada nesta sessao

- `apps/api/src/modules/account`
- `apps/web/app/(protected)/app/onboarding`
- `apps/web/src/components/onboarding`
- `apps/web/app/api/account/onboarding/*`

## 5. Limites desta fase

- persistencia ainda esta em memoria
- o wizard ainda nao escreve em banco real
- setup de MFA, codigos de recuperacao e step-up continuam preparados, mas nao completos como feature final
- a conta `restricted` ainda nao tem fluxo de remediação proprio no web

## 6. Resultado esperado

Com esta fatia, o produto passa a refletir melhor a ordem oficial de build:

- login seguro
- shell autenticado
- onboarding
- estado da conta
- dashboard operacional condicionado pela prontidao da conta
