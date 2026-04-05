# Modelo de Rotas do Web

## 1. Objetivo

Definir a organização das rotas do produto web para `terapeuta`, `paciente` e `admin interno`, reduzindo colisões de navegação e facilitando guards por papel.

## 2. Princípios

- grupos de rota separados por contexto de uso
- URL deve refletir domínio e permissão
- `terapeuta`, `paciente` e `admin interno` não compartilham o mesmo prefixo principal
- rotas profundas devem existir quando representam contexto real, não por excesso de nesting

## 3. Grupos de rota

### Públicas

Prefixos:

- `/login`
- `/invite/:token`

Objetivo:

- autenticação
- recuperação
- aceite de convite inicial

### Web do terapeuta

Prefixo:

- `/app`

Objetivo:

- operação clínica e administrativa do consultório

### Portal web do paciente

Prefixo:

- `/portal`

Objetivo:

- fluxo operacional essencial do paciente no beta web-first

### Admin interno

Prefixo:

- `/internal`

Objetivo:

- operação interna da plataforma

## 4. Rotas públicas

### Rotas mínimas

- `/`
- `/login`
- `/invite/:token`

### Regras

- não carregar shell autenticado nessas rotas
- aceitar deep link vindo de convite e documento
- validar token antes de expor qualquer dado do paciente
- o build atual concentra `credenciais + MFA` na mesma superfície pública `/login`
- `recover` e páginas públicas dedicadas de MFA continuam como extensões futuras, não como rotas já materializadas

## 5. Rotas do terapeuta

### Shell principal

- `/app`
- redireciona para `/app/dashboard`

### Rotas do terapeuta

- `/app/dashboard`
- `/app/patients`
- `/app/patients/:patientId`
- `/app/patients/:patientId/clinical-record`
- `/app/agenda`
- `/app/appointments/:appointmentId`
- `/app/appointments/:appointmentId/call`
- `/app/clinical-review`
- `/app/clinical-review/:appointmentId`
- `/app/finance`
- `/app/finance/charges/:chargeId`
- `/app/documents`
- `/app/documents/:documentId`
- `/app/settings`
- `/app/settings/profile`
- `/app/settings/practice`
- `/app/settings/security`
- `/app/settings/policies`
- `/app/settings/notifications`

### Guards

- terapeuta autenticado
- tenant válido
- conta com estado compatível com a rota

## 6. Rotas do paciente

### Rotas mínimas do beta

- `/portal`
- `/portal/appointments`
- `/portal/appointments/:appointmentId`
- `/portal/appointments/:appointmentId/call`
- `/portal/documents`
- `/portal/documents/:documentId`
- `/portal/payments`
- `/portal/payments/:chargeId`
- `/portal/profile`

### Regras

- portal do paciente é mais simples que o web do terapeuta
- nenhuma rota do portal expõe prontuário, transcript ou nota clínica
- documentos e pagamentos devem funcionar em mobile web responsivo

## 7. Rotas do admin interno

### Rotas mínimas

- `/internal`
- `/internal/waitlist`
- `/internal/tenants`
- `/internal/tenants/:tenantId`
- `/internal/support`
- `/internal/billing`
- `/internal/audit`
- `/internal/incidents`

### Regras

- usar shell separado
- permissão por módulo
- sem rota interna para leitura livre de prontuário ou transcript

## 8. Organização recomendada no Next.js App Router

### Estrutura

- `app/page.tsx`
- `app/(public)/login/page.tsx`
- `app/(public)/invite/[token]/page.tsx`
- `app/(therapist)/app/...`
- `app/(patient)/portal/...`
- `app/(internal)/internal/...`

### Motivo

- separa layouts e guards por grupo
- facilita bootstrap específico por papel
- evita ifs demais no mesmo layout

## 9. Regras de bootstrap por grupo

### Público

- sem sessão obrigatória

### Terapeuta

- carregar `me`
- carregar tenant atual
- carregar status da conta
- carregar badges globais mínimos

### Paciente

- carregar identidade do paciente
- carregar vínculo ativo
- carregar pendências operacionais mínimas

### Interno

- carregar perfil interno
- carregar permissões internas
- carregar ambiente

## 10. Convenções de rota

- usar plural em coleções
- usar `:id` ou segmento dinâmico equivalente para recursos reais
- evitar rotas que reflitam estado transitório sem necessidade
- drawers e modais não ganham rota própria, salvo quando precisarem deep link

## 11. Rotas que devem nascer depois

- busca global
- command palette
- centro de notificações
- rotas enterprise de clínica multiusuário
- superfícies mobile nativas
