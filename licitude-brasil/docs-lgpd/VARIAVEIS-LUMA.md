# Variáveis do Pacote LGPD — Luma Manager

Checklist do que precisa ser preenchido antes de o pacote ser publicado/assinado. Cada linha abaixo corresponde a uma marca `⚠️ TODO_GABRIEL` espalhada pelos documentos.

Status atualizado em 2026-04-20 com as decisões travadas pelo Gabriel.

## Status

- ✅ = travado
- ⚠️ = pendente, Gabriel precisa decidir/fornecer
- 🟡 = travado em direção, detalhe a fechar

## 1. Identidade jurídica da empresa

| Campo | Valor | Status |
|---|---|---|
| `{{NOME_COMERCIAL}}` | **Luma Manager** (nome fantasia) | ✅ |
| `{{NOME_EMPRESA}}` | **GABRIEL DE OLIVEIRA FROZI - ME** (razão social existente) | ✅ |
| `{{CNPJ}}` | CNPJ do ME do Gabriel (preencher número) | 🟡 preencher antes de publicar |
| `{{ENDERECO_SEDE}}` | Endereço do ME em Mogi das Cruzes/SP | 🟡 preencher endereço completo |
| `{{FORO}}` | Comarca de Mogi das Cruzes/SP | ✅ |
| `{{SITE}}` | lumamanager.com.br | ✅ |
| `{{DATA_VIGENCIA}}` | Data a partir da qual o pacote vigora | ⚠️ definir na publicação |
| `{{VERSAO}}` | 1.0 na versão inicial | ✅ |

**Ajuste administrativo pendente no CNPJ:** adicionar CNAE secundário 6202-3/00 (desenvolvimento de programas de computador customizáveis) antes da emissão da primeira NF do Luma. Pedido via contador. Sem isso, risco de autuação municipal por divergência cadastral.

**Nome fantasia:** pode operar sem registrar formalmente na JUCESP; fica como ajuste de escala.

## 2. Encarregado de Proteção de Dados (DPO)

| Campo | Valor | Status |
|---|---|---|
| `{{NOME_DPO}}` | Gabriel de Oliveira Frozi (próprio sócio) | ✅ (Res. CD/ANPD 18/2024 permite) |
| `{{EMAIL_DPO}}` | dpo@lumamanager.com.br | 🟡 criar caixa dedicada (pode ser alias no MVP) |
| `{{RESPONSAVEL_APROVACAO}}` | Gabriel (DPO + fundador) | ✅ |

## 3. Canais de comunicação

| Campo | Valor | Status |
|---|---|---|
| `{{EMAIL_SUPORTE}}` | suporte@lumamanager.com.br | ✅ |
| `{{EMAIL_COMUNICACAO_INCIDENTE}}` | seguranca@lumamanager.com.br | 🟡 criar caixa |
| `{{CANAL_INTERNO_TICKETS}}` | email interno / planilha no MVP | 🟡 definir ferramenta |
| `{{CANAL_INCIDENTE_INTERNO}}` | email + telefone do Gabriel no MVP | 🟡 formalizar runbook |

## 4. Responsáveis internos

| Campo | Valor | Status |
|---|---|---|
| `{{LIDER_RESPOSTA_INCIDENTES}}` | Gabriel | ✅ (no MVP) |
| `{{RESPONSAVEL_ELABORACAO}}` | Gabriel | ✅ |
| `{{RESPONSAVEL_DATA_ENGINEERING}}` | Gabriel (stack Next.js + NestJS + Drizzle + PostgreSQL em Railway) | ✅ |

## 5. Fornecedores (sub-operadores) — TRAVADOS

| Categoria | Fornecedor | País | Status | Observação |
|---|---|---|---|---|
| **Hospedagem aplicação** | Railway | US (com planos de região EU) | ✅ | SCC via DPA padrão do Railway |
| **Banco de dados** | PostgreSQL gerenciado pelo Railway | US | ✅ | Criptografia em repouso nativa |
| **Email transacional** | Resend | US (data center em EU disponível) | ✅ | SCC + DPA padrão Resend |
| **Vídeo** | Daily.co | US | ✅ | SCC + Recording API; áudio extraído e descartado após transcrição |
| **Transcrição** | AssemblyAI | US | ✅ | Exigir plano Enterprise com **zero retention** contratual + opt-out de treino |
| **LLM** | Anthropic Claude (API) | US | ✅ | Plano Business/Enterprise com **zero retention** + opt-out de treino |
| **Pagamento assinatura terapeuta** | Asaas (sugestão) ou Stripe | BR ou US | ⚠️ Gabriel decide |
| **Pagamento paciente-terapeuta** | Não intermediado pela plataforma no MVP | — | ✅ | Paciente paga terapeuta fora da plataforma |
| **Analytics** | Posthog (self-host recomendado) ou GA4 | EU ou US | 🟡 Gabriel decide |
| **Monitoramento de erro** | Sentry | US | ✅ | Com PII filter habilitado |

## 6. Variáveis contratuais e operacionais

| Campo | Valor sugerido | Status |
|---|---|---|
| `{{PRECO_MENSAL}}` | R$ 300,00 | ✅ |
| `{{PRAZO_CONTRATO}}` | Indeterminado (mensal) | ✅ |
| `{{PRAZO_CANCELAMENTO}}` | 30 dias para exportar dados | ✅ |
| `{{PRAZO_ATIVIDADE_SLA}}` | 99,5% de disponibilidade mensal | 🟡 validar com capacidade do Railway |
| `{{JANELA_SLA}}` | Dias úteis 9h-18h | ✅ (MVP) |
| `{{PRAZO_NOTIFICACAO_INCIDENTE}}` | 48 horas úteis | ✅ |
| `{{PRAZO_ATENDIMENTO_DIREITO_TITULAR}}` | 5 dias úteis (apoio ao controlador) | ✅ |
| `{{PRAZO_RESPOSTA}}` | 15 dias (prazo LGPD) | ✅ |
| `{{PRAZO_PRORROGACAO}}` | +15 dias | ✅ |
| `{{PRAZO_DEVOLUCAO_ELIMINACAO}}` | 30 dias após fim de contrato | ✅ |
| `{{PRAZO_RETENCAO_PRONTUARIO}}` | 5 anos mínimo (Res. CFP 6/2019) | ✅ |

## 7. URLs

| Campo | Valor | Status |
|---|---|---|
| `{{URL_POLITICA_PRIVACIDADE}}` | lumamanager.com.br/privacidade | 🟡 confirmar rota |
| `{{URL_TERMOS}}` | lumamanager.com.br/termos | 🟡 |
| `{{URL_DPA}}` | lumamanager.com.br/dpa (ou entregue em onboarding) | 🟡 |

## 8. Regime ANPD e CFP

- **Agente de pequeno porte** (Res. CD/ANPD 2/2022): declarado na Política de Privacidade e no RIPD. Auto-declaração, sem necessidade de cadastro prévio. Reduz algumas obrigações formais; **não afasta** as obrigações relativas a dados sensíveis de saúde.
- **Regime CFP:** Resoluções 6/2019 (prontuário), 9/2024 (telepsicologia), 10/2005 (Código de Ética) incidem sobre o Terapeuta, e a Luma dá suporte operacional.

## 9. Itens que ainda dependem do Gabriel antes da publicação

1. Adicionar CNAE 6202-3/00 secundário ao CNPJ (contador)
2. Criar caixas `dpo@` e `seguranca@` no provedor de email
3. Preencher número do CNPJ e endereço completo nos documentos
4. Decidir gateway de cobrança da assinatura (Asaas ou Stripe)
5. Decidir provedor de analytics (Posthog self-host recomendado)
6. Confirmar rota da política/termos no site
7. Definir data de vigência e versionar

## 10. Pendências técnicas que viram cláusula de documento

- Plano Enterprise com **zero retention** e **opt-out de treino** precisa ser contratado junto à **AssemblyAI** e à **Anthropic** antes do go-live. Sem esses contratos, a tese de licitude da transcrição e IA não se sustenta.
- DPA assinado com cada sub-operador travado (Railway, Resend, Daily.co, AssemblyAI, Anthropic, Sentry). A maioria já oferece DPA padrão — revisar e assinar.
- Filtro de PII habilitado no Sentry (scrubbing de campos com dado sensível).

---

**Observação:** as pendências restantes são 90% administrativas e podem ser resolvidas em 3-5 dias úteis. A parte arquitetural já está decidida — o que falta é execução.
