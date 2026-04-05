# Avaliação do Supabase para Este Projeto

Data de consolidação: `30/03/2026`.

## 1. Resposta curta

`Não`, não teria problema usar `Supabase`.

Na verdade, para este projeto, `faz sentido sim` considerar Supabase, principalmente porque:

- você já tem familiaridade com a plataforma
- ela acelera setup e operação
- suporta `Postgres`, `Storage`, `Auth`, `RLS`, backups e região em `São Paulo`

Mas a forma correta de usar Supabase aqui `não` é:

- deixar o frontend conversar direto com tudo
- tratar Supabase como arquitetura inteira do produto

A forma correta é:

- usar Supabase como `infra gerenciada`
- manter `Next.js + NestJS + Drizzle` como arquitetura principal de aplicação
- deixar o `backend` controlar o domínio clínico

## 2. Minha recomendação prática

### Recomendação final

Usar Supabase como base de infraestrutura para:

- `Postgres`
- `Storage`
- eventualmente `Auth`

E manter:

- `Next.js` no web
- `NestJS` na API principal
- `Drizzle` como ORM
- `Redis + BullMQ` para jobs

### Tradução disso

A stack deixa de ser:

- Postgres genérico
- S3 genérico

e passa a ser:

- `Supabase Postgres`
- `Supabase Storage`

sem abandonar a arquitetura que já definimos.

## 3. Onde Supabase encaixa bem

## 3.1 Banco principal

Isso encaixa muito bem.

O Supabase fornece Postgres completo e documentação oficial de conexão para backend com string nativa e pooler.

Fonte oficial:

- https://supabase.com/docs/guides/database
- https://supabase.com/docs/reference/postgres/connection-strings

Leitura prática:

- `NestJS + Drizzle` continuam funcionando normalmente
- você não precisa usar o Data API deles se não quiser
- pode tratar o Supabase só como Postgres gerenciado

## 3.2 Storage de documentos

Também encaixa bem.

O Supabase Storage já traz:

- controle fino de acesso
- políticas
- buckets
- suporte S3-compatible

Fonte oficial:

- https://supabase.com/docs/guides/storage

Leitura prática:

- dá para usar bem para documentos, anexos e artefatos não clínicos
- para conteúdo clínico sensível, a política de acesso deve continuar muito controlada

## 3.3 Região Brasil

Isso pesa a favor do Supabase no nosso caso.

A documentação oficial lista `South America (São Paulo) sa-east-1` entre as regiões disponíveis.

Fonte oficial:

- https://supabase.com/docs/guides/platform/regions

Leitura prática:

- isso combina com a nossa direção atual de `processamento no Brasil`
- reduz atrito de latência e de narrativa regulatória

## 3.4 Auth

`Pode encaixar`, mas aqui existe tradeoff real.

O Supabase Auth oferece:

- senha
- magic link
- OTP
- SSO
- integração com JWT
- TOTP MFA
- audit logs de auth

Fontes oficiais:

- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/auth/auth-mfa/totp
- https://supabase.com/docs/guides/auth/audit-logs

Leitura prática:

- para velocidade de MVP, ele é atraente
- para controle máximo de domínio sensível, auth própria ainda continua sendo uma tese forte

## 4. Onde eu teria cuidado

## 4.1 Não usar Supabase em modo “frontend direto em tudo”

O maior erro aqui seria:

- usar `supabase-js` no frontend para acessar diretamente tabelas clínicas sensíveis como caminho principal

Mesmo com `RLS`, eu não recomendo isso como arquitetura central do nosso produto.

Motivo:

- nosso domínio é sensível demais
- precisamos de autorização contextual mais rica
- queremos concentrar lógica, auditoria e compliance no backend

RLS em Supabase é forte, mas deve funcionar como:

- `defense in depth`

e não como única camada de controle do produto.

Fonte oficial:

- https://supabase.com/docs/guides/database/postgres/row-level-security

## 4.2 Network restrictions têm limite importante

A documentação oficial diz que `Network Restrictions` se aplicam ao Postgres e pooler, mas `não` às APIs HTTPS, incluindo:

- PostgREST
- Storage
- Auth
- uso de client libraries como `supabase-js`

Fonte oficial:

- https://supabase.com/docs/guides/platform/network-restrictions

Leitura prática:

- isso é mais um motivo para não basear o domínio clínico em acesso direto do browser às APIs expostas do Supabase

## 4.3 Backup de banco não cobre objetos do Storage

O Supabase documenta que backups do banco `não` incluem os objetos armazenados via Storage API, apenas metadata.

Fonte oficial:

- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/database

Leitura prática:

- se usarmos Supabase Storage, precisamos de estratégia explícita para backup/export dos arquivos críticos
- isso importa para documentos regulatórios e anexos

## 4.4 Vendor lock-in moderado

Se você usar:

- Auth
- Storage
- policies
- funções
- realtime

o custo de saída aumenta.

Não é motivo para rejeitar a plataforma.

Só significa que devemos usar com disciplina.

## 5. O desenho que eu recomendo

## Opção A: recomendada

`Supabase como infra, não como app architecture`

### Composição

- `Next.js` no frontend
- `NestJS` como backend principal
- `Drizzle` conectando no `Supabase Postgres`
- `Supabase Storage` para documentos e objetos
- `Redis + BullMQ` fora do Supabase para jobs
- `Auth`:
  - opção 1: Supabase Auth
  - opção 2: auth própria

### Vantagem

- velocidade
- familiaridade
- menos DevOps
- preserva controle do domínio clínico

## Opção B: menos recomendada

`Frontend + supabase-js + RLS` como espinha dorsal do produto

### Problema

- aumenta espalhamento da lógica
- complica auditoria contextual
- piora governança do domínio clínico

## 6. Minha posição sobre auth

### Decisão fechada

Para este projeto, a decisão atual passa a ser:

1. `Supabase Postgres`
2. `Supabase Storage`
3. `Supabase Auth`
4. `NestJS` como backend obrigatório

Ou seja:

- eu `não` trocaria o backend por Supabase
- eu `sim` adotaria Supabase para banco, storage e auth

### Por que aceitei `Supabase Auth`

Com base na documentação oficial, ele cobre o que mais importa para o nosso recorte:

- `password auth`
- `TOTP MFA`
- `sessions`
- `sign out` com escopo local/global/others
- `custom access token hook` para claims
- `auth audit logs`

### Caveats que ficam registrados

- `Password Verification Hook` e `MFA Verification Attempt Hook` são `Teams/Enterprise`
- controles mais avançados de sessão ficam em `Pro+`
- o backend continua sendo o lugar da autorização clínica e das regras sensíveis do domínio

## 7. Conclusão final

`Supabase faz sentido para esse projeto`, especialmente por causa da sua familiaridade e da região Brasil.

Mas eu só seguiria se a decisão vier com esta regra:

`Supabase como infraestrutura gerenciada, não como atalho para expor o domínio clínico direto no frontend`

## 8. Decisão recomendada agora

### Decisão atual

Adotar:

`Next.js + NestJS + Drizzle + Supabase Postgres + Supabase Storage + Supabase Auth + Redis/BullMQ`

## 9. Fontes oficiais usadas

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase MFA TOTP: https://supabase.com/docs/guides/auth/auth-mfa/totp
- Supabase Auth Audit Logs: https://supabase.com/docs/guides/auth/audit-logs
- Supabase Sessions: https://supabase.com/docs/guides/auth/sessions
- Supabase Sign out: https://supabase.com/docs/guides/auth/signout
- Supabase Auth Hooks: https://supabase.com/docs/guides/auth/auth-hooks
- Supabase Password Verification Hook: https://supabase.com/docs/guides/auth/auth-hooks/password-verification-hook
- Supabase MFA Verification Hook: https://supabase.com/docs/guides/auth/auth-hooks/mfa-verification-hook
- Supabase Custom Access Token Hook: https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
- Supabase Database: https://supabase.com/docs/guides/database
- Supabase connection strings: https://supabase.com/docs/reference/postgres/connection-strings
- Supabase connecting to Postgres: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase regions: https://supabase.com/docs/guides/platform/regions
- Supabase network restrictions: https://supabase.com/docs/guides/platform/network-restrictions
- Supabase backups: https://supabase.com/docs/guides/platform/backups
