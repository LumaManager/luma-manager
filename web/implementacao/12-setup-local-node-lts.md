# Setup Local - Node LTS

## 1. Objetivo

Registrar o setup local mínimo para rodar o core web implementado até esta fase sem ruído de runtime.

## 2. Decisão

- o monorepo atual deve rodar em `Node 22`
- a faixa suportada fica `>=20 <23`
- `Node 25` fica fora do caminho recomendado nesta fase

## 3. Motivo

- o fluxo de `dev` usa `tsx watch` no backend
- a sessão atual evidenciou falha de execução com `Node 25.1.0`
- o projeto foi validado em build, lint e typecheck sob runtime LTS

## 4. Passo a passo local

```bash
cd /Users/gabrielfrozi/Desktop/northwind/APLICATIVOS/terapia/arquitetura
nvm use 22
cp .env.example .env
npm install
npm run dev
```

## 5. Verificação rápida

- API pronta: `http://localhost:4000/v1/health`
- Web pronto: `http://localhost:3000/login`

## 6. Credenciais mock

- conta pronta:
  - `ana.ready@institutovivace.com.br`
  - `12345678`
  - MFA `123456`
- conta em ativação:
  - `ana@institutovivace.com.br`
  - `12345678`
  - MFA `123456`

## 7. Observação

Se o web abrir mas o login mostrar `Failed to fetch`, a causa provável continua sendo a API ainda não ter subido ou ter caído antes de responder em `localhost:4000`.
