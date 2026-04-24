# Relatório de Revisão Crítica — Pacote LGPD da Luma

**Data:** 2026-04-20
**Revisor:** Gabriel + Claude
**Escopo:** 11 documentos LGPD + anexos de apoio (VARIAVEIS-LUMA, PLAYBOOK-HANDOFF-JURIDICO)
**Checklist aplicado:** LGPD (arts. 5º, 6º, 7º, 11, 14, 18, 20, 33-36, 37-42, 46-49) · Resoluções CFP 6/2019, 9/2024, 10/2005, 11/2018, 13/2022 · Resoluções ANPD 2/2022, 15/2024, 18/2024, 19/2024 · Marco Civil

---

## 1. O que mudou na rodada de revisão

### 1.1 Identidade jurídica travada em todos os docs

| Item | Decisão travada | Docs atingidos |
|---|---|---|
| Razão social | GABRIEL DE OLIVEIRA FROZI - ME | 01, 02, 03, 05, 09 |
| Nome fantasia | Luma Manager | todos |
| Sede | Mogi das Cruzes/SP | 01, 02, 03, 05 |
| Foro | Mogi das Cruzes/SP | 02, 03, 04 (DPA) |
| Domínio | lumamanager.com.br | todos |
| Suporte | suporte@lumamanager.com.br | 02, 03, 09, 10 |
| DPO | Gabriel de Oliveira Frozi — dpo@lumamanager.com.br | 01, 05, 06, 07, 08, 09, 10 |
| Canal de segurança | seguranca@lumamanager.com.br | 07 |

### 1.2 Stack de fornecedores travada

| Função | Fornecedor | Base de transferência | Docs atingidos |
|---|---|---|---|
| Hospedagem + DB | Railway | SCC | 01, 04 |
| Email transacional | Resend | SCC | 01, 04 |
| Video | Daily.co (Recording API) | SCC + não-retenção | 01, 04, 05, 10 |
| Transcrição | AssemblyAI (Enterprise, zero retention) | SCC + zero retention contratual + opt-out treino | 01, 04, 05, 11 |
| IA (geração de rascunho) | Anthropic — Claude (Business/Enterprise, zero retention) | SCC + zero retention + opt-out treino | 01, 04, 05, 11 |
| Monitoramento | Sentry (com filtro de PII) | SCC | 01, 04 |

Sub-operadores ficam refletidos em tabela no DPA (seção 6.2), na Política de Privacidade (seção 7) e no RIPD (fluxos 3.4 / 3.6 / 3.7).

### 1.3 Hardenings jurídicos aplicados

| # | Hardening | Fundamento | Docs |
|---|---|---|---|
| H1 | Registro como agente de tratamento de pequeno porte | Res. CD/ANPD nº 2/2022 | 01 (seção 1), 05 (identificação) |
| H2 | DPO designado formalmente (interno acumulando função) | Res. CD/ANPD nº 18/2024, art. 2º, §4º | 01 (seção 13), 07 (cabeçalho) |
| H3 | Cláusula 2.1(j) no contrato: capacidade técnica do terapeuta para telepsicologia | CFP 9/2024, art. 3º | 03 |
| H4 | Cláusula 2.1.1 no contrato: não-intermediação explícita (Luma não indica, qualifica, ranqueia, encaminha) | CFP 11/2018 | 03 |
| H5 | Prazo de notificação de incidente ao controlador: **48 horas úteis** (antes "prazo razoável") | Boa prática ANPD 15/2024 | 03 (8.2), 04 (DPA), 07 (4.7) |
| H6 | Cláusula 8.3 no contrato: Luma pode notificar ANPD diretamente em cooperação quando escala/gravidade/contato recomendarem | Res. CD/ANPD 15/2024 | 03 |
| H7 | Limite de responsabilidade em 10.1: exceção para violação de segurança que cause vazamento de dado pessoal sensível e casos de dolo/culpa grave | boa prática + art. 42 LGPD | 03 |
| H8 | Revogação de consentimento IA/áudio com efeito prospectivo explícito — não retroage sobre prontuário já aprovado (base legal autônoma 11, II, a e b) | art. 8º, §5º; art. 11, II, a, b | 09 (seção 12) |
| H9 | Controladoria compartilhada para dados pré-vínculo do paciente (landing, cadastro inicial) | art. 5º, VI LGPD | 03 (3.3) |

---

## 2. Mapa de aderência aos normativos

### 2.1 LGPD — artigos críticos

| Art. | Exigência | Onde foi tratado | Status |
|---|---|---|---|
| 7º | Hipóteses de base legal para dados comuns | 01 (seção 4), 09 (seção 3) | OK |
| 8º | Consentimento específico, destacado, informado, granular, revogável | 11 (seção 9 — consentimento granular com [A][B][C]) | OK |
| 9º | Informação clara ao titular | 01, 09, 10, 11 | OK |
| 11 | Tratamento de dado sensível — hipóteses | 01 (4.2), 09 (seção 3), DPA (3.2), RIPD (seção 2) | OK |
| 14 | Dados de crianças e adolescentes | 02 (seção 7), 03 (2.1.g), 10 (seção 8) — todos vedam menores no MVP | OK |
| 18 | Direitos do titular | 08 (playbook completo), 01 (seção 9), 09 (seção 6) | OK |
| 20 | Revisão humana de decisão automatizada | 03 (7.2), 08 (4.6), 11 (seções 1 e 2) | OK |
| 33–36 | Transferência internacional | 01 (seção 8), 04 (6.4), 05 (5.2), 11 (seção 7) com SCC da Res. ANPD 19/2024 | OK |
| 37 | Registro de operações de tratamento | 05 (RIPD) | OK |
| 38 | RIPD | 05 | OK |
| 41 | Encarregado | 01 (seção 13), cabeçalho de 07, 08 | OK |
| 46-49 | Segurança, incidentes, notificação | 04 (seção 7 — segurança), 07 (política de incidentes), 03 (8.2-8.3) | OK |

### 2.2 CFP — resoluções críticas

| Resolução | Matéria | Onde tratou |
|---|---|---|
| CFP 6/2019 | Guarda obrigatória de prontuário 5 anos após última sessão | 06 (retenção itens 5, 6, 7), 02 (6.1), 03 (5.4.b), 09 (seção 5) |
| CFP 9/2024 | Telepsicologia, capacidade técnica, atendimento adulto | 02 (2), 03 (2.1.j — NOVO), 10 (inteiro) |
| CFP 10/2005 | Código de Ética — sigilo | 02 (2), 03 (2.1.d), 10 (seção 3) |
| CFP 11/2018 | Não-intermediação de serviço psicológico por plataforma | 03 (2.1.1 — NOVO), 02 (seção 1 sobre "não indica profissionais") |
| CFP 13/2022 | Validação de registro em base pública | 02 (2), 03 (2.2) |

### 2.3 ANPD — resoluções críticas

| Resolução | Matéria | Onde tratou |
|---|---|---|
| CD/ANPD 2/2022 | Agentes de pequeno porte | 01 (1 — NOVO), 05 (identificação — NOVO) |
| CD/ANPD 15/2024 | Notificação de incidente, formulário, prazo | 07 (seção 4.5 e 4.6), 03 (8.2-8.3 — NOVO), 04 (seção 7) |
| CD/ANPD 18/2024 | DPO — atribuições e acumulação | 01 (seção 13 — fundamentada), 07 (cabeçalho) |
| CD/ANPD 19/2024 | Cláusulas Padrão Contratuais para transferência internacional | 01 (8), 04 (6.4), 05 (5.2), 11 (7) |

---

## 3. Achados por prioridade

### 3.1 Bloqueantes (precisam ser resolvidos antes de publicar)

| # | Achado | Ação | Responsável |
|---|---|---|---|
| B1 | CNPJ não preenchido em 01, 02, 03, 05, 09 | Inserir número real da GABRIEL DE OLIVEIRA FROZI - ME + verificar CNAE secundário 6202-3/00 (desenvolvimento de software customizável) | Gabriel |
| B2 | Gateway de pagamento (Asaas ou Stripe) não decidido | Decidir; impacta tabelas de sub-operadores em 01, 04, 05 | Gabriel |
| B3 | Analytics (Posthog self-host vs GA4 com PII filter) não decidido | Decidir; impacta tabela 01 (seção 7) e 04 (6.2) | Gabriel |
| B4 | DATA_VIGENCIA em todos os docs | Preenche automaticamente na publicação; não bloqueia escrita | auto |
| B5 | Cadastrar WhatsApp Business API (Meta) como sub-operador (decisão nova) | Adicionar linha em 01, 04, 05 e atualizar Política de Privacidade na seção de comunicações | Claude (fazer após confirmação) |

### 3.2 Desejável antes de operar em escala (primeiros 50 terapeutas)

| # | Achado | Ação |
|---|---|---|
| D1 | Publicar RIPD público com versão resumida em lumamanager.com.br/ripd | Criar rota pública; assinar digitalmente |
| D2 | Fluxo técnico de exportação de prontuário (JSON + PDF assinado) | Implementar endpoint; testar com caso real |
| D3 | Jobs de TTL (descarte de áudio, transcrição, rascunho não aprovado) | Implementar e monitorar em produção; garantir que falha de job dispara alerta |
| D4 | Canal seguranca@lumamanager.com.br + compromisso de hall of fame | Criar caixa, documentar disclosure policy |
| D5 | Tabletop anual de incidente S1 | Agendar primeiro antes do 6º mês de operação |
| D6 | Checar consentimento destacado na UI (art. 8º, §4º LGPD — "de forma destacada") | Auditar o componente de onboarding para garantir que [A][B][C] aparecem isolados dos demais aceites |
| D7 | Validar contratualmente "zero retention" na Anthropic (solicitar clause no Business plan) | Email para account manager ou confirmar via página oficial |
| D8 | Validar contratualmente "zero retention" na AssemblyAI (feature do Enterprise — confirmar com comercial) | Idem |

### 3.3 Polimento (antes de marketing público)

| # | Achado | Ação |
|---|---|---|
| P1 | Texto público da Política de Privacidade em linguagem ainda mais simples | Reescrita em tom amigável para paciente leigo |
| P2 | Página /privacidade e /termos com versão HTML + PDF para download | Design + publicação |
| P3 | Changelog público das políticas (histórico de versões visível) | Componente na página |
| P4 | Playbook do terapeuta: como explicar ao paciente os recursos de IA/áudio em 3 frases | Copy curto para onboarding em vídeo |
| P5 | Guia interno para o suporte de como tratar pedido LGPD em 15 dias | Baseado em 08 (Playbook de Direitos) |

---

## 4. Inconsistências resolvidas nesta rodada

- **Prazo de notificação de incidente ao controlador:** antes estava "prazo razoável" no 03, padronizado em **48 horas úteis** em 03, 04 e 07 (4.7). O prazo de 72h em 07 (seção 4.5) é o **prazo interno** para decidir se notifica ANPD, distinto do prazo de notificação ao controlador.
- **Canal de incidente:** antes era TODO "Slack ou Linear", agora é o email `seguranca@lumamanager.com.br` + ticket interno, coerente com o porte atual.
- **Menção cruzada entre 09 e 10:** 09 (seção 7) referencia corretamente o **Termo de Ciência de Teleatendimento** (doc 10). OK.
- **Retroatividade da revogação de consentimento IA:** esclarecida em 09 (seção 12) — efeito prospectivo; prontuário aprovado pelo terapeuta permanece por base legal autônoma.

---

## 5. O que ainda não está coberto e merece atenção depois

- **Dados agregados e analytics de uso** — hoje o RIPD menciona "eventos pseudonimizados". Se no futuro a plataforma gerar relatórios de benchmarking entre terapeutas (ex.: "sua taxa de no-show está acima da média"), esse tratamento precisa de base legal específica e deve ser adicionado como nova finalidade no RIPD.
- **Marketing e e-mail opt-in** — hoje tratado em 06 (linha 50) e 01 (seção 4). Se for lançar newsletter ou conteúdo, o form de captação precisa ter consentimento separado do aceite dos Termos.
- **Pagamento paciente → terapeuta (quando habilitar no futuro)** — se a Luma intermediar cobrança do paciente pelo terapeuta em planos futuros, RIPD precisa de nova finalidade + nova base + eventual papel de controladora compartilhada.
- **Atendimento a menores** — quando habilitar (fora do MVP), precisa de fluxo próprio com consentimento dos responsáveis, revisão do RIPD (finalidade nova), adequação de termos e avaliação do art. 14 LGPD.
- **Revogação de consentimento em retroativo extremo ("esqueçam tudo"):** orientar o terapeuta no onboarding de que pedido extremo do paciente precisa ser avaliado caso a caso — não é automático apagar prontuário, mas sim bloquear finalidades não legalmente obrigatórias.

---

## 6. Checklist para seguir em paralelo ao desenvolvimento

- [ ] Preencher número do CNPJ em todos os docs (B1)
- [ ] Decidir gateway (B2) e refletir em 01, 04, 05
- [ ] Decidir analytics (B3) e refletir em 01, 04
- [ ] Adicionar WhatsApp Business API (Meta) como sub-operador nos docs (B5 — nova decisão)
- [ ] Implementar jobs de TTL de áudio/transcrição/rascunho (D3)
- [ ] Implementar fluxo de exportação de prontuário (D2)
- [ ] Validar zero retention com AssemblyAI e Anthropic por escrito (D7, D8)
- [ ] Criar rota pública /privacidade, /termos, /ripd (D1, P2)
- [ ] Componente de onboarding com consentimento destacado [A][B][C] (D6)
- [ ] Agendar tabletop anual (D5)
- [ ] Canal seguranca@lumamanager.com.br + disclosure policy (D4)

---

## 7. Caveat final

Este pacote está **pronto para uso operacional** como base de conformidade LGPD + CFP para um agente de pequeno porte lançando serviço a adultos, com todas as camadas críticas cobertas. Permanece uma **minuta** no sentido de que:

- revisão jurídica por advogado especializado em saúde digital + LGPD é recomendada **antes** dos primeiros 50 terapeutas ou antes de qualquer incidente sério
- revisão por consultoria especializada em Res. CFP 9/2024 é recomendada se a Luma passar a ter funcionalidades novas (tele-supervisão, tele-avaliação, tele-aplicação de testes)
- atualizações regulatórias da ANPD em 2026-2027 precisam ser acompanhadas (Res. CD/ANPD 19/2024 ainda está em período de adaptação contratual; atualizações subsequentes podem mexer nas cláusulas de transferência internacional)

**Este relatório fecha o bloco de elaboração e revisão crítica da conformidade LGPD do MVP.** A partir daqui, as ações migram para o plano operacional/técnico e para o handoff para advogado, conforme `PLAYBOOK-HANDOFF-JURIDICO.md`.
