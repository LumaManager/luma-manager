# Sessão 22: Normalização Documental do Estado Real da UI

## Objetivo

Alinhar a documentação do pacote `web` ao estado real do build depois da sequência de polimento visual e fechamento dos fluxos operacionais principais.

## Escopo desta sessão

- revisar `web/telas`
- corrigir `web/implementacao/02-modelo-de-rotas.md`
- corrigir `web/implementacao/03-apis-e-contratos.md`
- atualizar índices e trilha de implementação

## Ajustes aplicados

### `web/telas`

- inclusão de notas de `atualização de fase` nas telas que ainda descreviam uma versão anterior do build
- alinhamento do shell atual com três superfícies distintas:
  - terapeuta em `/app/*`
  - paciente em `/portal/*`
  - interno em `/internal/*`
- atualização do estado real de:
  - login público em `/login`
  - onboarding em `/app/onboarding`
  - dashboard operacional
  - lista e ficha de pacientes
  - agenda com bloqueios, disponibilidade, quick view e reposicionamento pela grade
  - detalhe da sessão com drawers de reagendamento e cancelamento
  - videochamada com continuidade também no portal do paciente
  - revisão clínica, transcript/rascunho e prontuário já polidos
  - portal do paciente com detalhes e call

### `02-modelo-de-rotas`

- remoção da leitura de que `/mfa` e `/recover` já existem como rotas públicas materializadas
- reforço de que o build atual concentra `credenciais + MFA` em `/login`
- correção do deep link público do paciente para `/invite/:token`, sem rota `/portal/invite/:token`

### `03-apis-e-contratos`

- remoção de contratos ainda não implementados do bloco principal
- alinhamento dos endpoints reais de:
  - auth
  - pacientes
  - clinical review
  - financeiro
- marcação explícita dos endpoints de áudio/transcrição como `planejados`, não materializados
- registro da padronização visual compartilhada:
  - `OperationalHero` e `ToolbarPanel` no web do terapeuta
  - `PortalHero` e `PortalPanel` no portal do paciente

## Resultado

A documentação do pacote `web` volta a refletir o estado real da UI e das rotas do build atual, reduzindo contradições entre:

- tela publicada
- rota existente
- endpoint implementado
- e direção de produto registrada
