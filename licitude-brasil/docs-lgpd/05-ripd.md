<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# RIPD — Relatório de Impacto à Proteção de Dados Pessoais
## Luma

**Versão:** 1.0
**Data:** ⚠️TODO_GABRIEL[preencher data de publicação]
**Próxima revisão:** +12 meses da data de publicação
**Elaboração:** Gabriel de Oliveira Frozi (DPO / fundador)
**Aprovação:** Gabriel de Oliveira Frozi (DPO)

---

## 1. Identificação do controlador/operador

- **Razão social:** GABRIEL DE OLIVEIRA FROZI - ME
- **CNPJ:** ⚠️TODO_GABRIEL[inserir número]
- **Endereço:** Mogi das Cruzes/SP (endereço completo conforme cartão CNPJ)
- **Nome fantasia:** Luma Manager
- **Site:** lumamanager.com.br
- **Encarregado (DPO):** Gabriel de Oliveira Frozi — dpo@lumamanager.com.br
- **Regime ANPD:** agente de tratamento de pequeno porte (Res. CD/ANPD nº 2/2022)
- **Posicionamento LGPD:** operadora de dados clínicos em nome dos terapeutas (controladores) / controladora independente de dados operacionais

## 2. Objeto e contexto da avaliação

Este RIPD avalia os riscos à proteção de dados pessoais decorrentes do tratamento realizado pela plataforma Luma, SaaS de gestão clínica para psicólogos autônomos no Brasil, com foco em dados sensíveis de saúde mental.

Motivadores para a elaboração:

- tratamento de dados pessoais sensíveis (art. 5º, II LGPD) em volume crescente
- uso de tecnologias emergentes (IA assistiva, transcrição automatizada)
- transferência internacional para alguns sub-operadores
- inclusão na agenda regulatória ANPD 2025-2026 (saúde, biometria, IA)

## 3. Ciclo de vida do dado — fluxos principais

### 3.1 Cadastro e onboarding do terapeuta
- Coleta: nome, CPF, email, telefone, CRP
- Validação: consulta ao Cadastro Nacional de Psicólogos
- Base legal: art. 7º, V (execução de contrato)
- Riscos: fraude de identidade, uso por não-psicólogo → **mitigação:** validação CRP + MFA

### 3.2 Cadastro de paciente pelo terapeuta
- Coleta: nome, email, telefone do paciente
- Papel: Luma é operadora desde o cadastro; controladoria do terapeuta
- Base legal: art. 7º, V (execução de contrato com o terapeuta) + art. 7º, I no aceite
- Riscos: dado de paciente sem consentimento inicial → **mitigação:** convite com aceite formal obrigatório antes de qualquer dado clínico

### 3.3 Agendamento
- Coleta: horário, tipo de sessão, status
- Base legal: art. 7º, V
- Riscos: exposição de identidade/horário como dado sensível por inferência → **mitigação:** acesso restrito, logs

### 3.4 Videoconferência
- Coleta: stream de vídeo e áudio durante a sessão
- Sub-operador: **Daily.co** (US, SCC, Recording API com áudio extraível e descartável)
- Base legal: art. 11, II, a (tutela da saúde)
- Riscos: vazamento de stream, retenção indevida pelo provedor, uso para treino → **mitigação:** DPA assinado, cláusula de não-retenção, SCC; vídeo bruto não é persistido pela Luma, apenas o áudio para geração de transcrição opt-in

### 3.5 Gravação de áudio (opcional)
- Coleta: áudio da sessão, com consentimento destacado
- Base legal: art. 11, I (consentimento) + art. 11, II, a
- Retenção: descartado após transcrição (horas)
- Riscos: vazamento de biometria vocal, terceiro citado, retenção indevida → **mitigações:** consentimento específico por sessão, descarte automático, toggle "desligar gravação"

### 3.6 Transcrição
- Coleta: texto gerado a partir do áudio, com diarização (identificação de paciente vs. terapeuta)
- Sub-operador: **AssemblyAI** (US, plano Enterprise com zero retention contratual e opt-out de treino)
- Base legal: art. 11, I (consentimento destacado) + art. 11, II, a
- Retenção: descartada após geração do rascunho de IA (janela máxima 24h)
- Riscos: erro de ASR contaminando prontuário, uso para treino → **mitigações:** DPA Enterprise com zero retention, revisão humana obrigatória do rascunho, descarte automático por job

### 3.7 Rascunho de IA
- Coleta: texto gerado a partir da transcrição (tópicos e organização de queixa/evolução/conduta/plano)
- Sub-operador: **Anthropic (Claude, API)** (US, plano Business/Enterprise com zero retention e opt-out de treino)
- Base legal: art. 11, II, a + consentimento específico para IA (art. 11, I)
- Retenção: o rascunho vive no banco com `status = 'draft'` por até 30 dias; se não for aprovado pelo Terapeuta, é descartado. Se aprovado, passa a prontuário oficial.
- Riscos: invenção de conteúdo (alucinação), linguagem diagnóstica, dado em provedor estrangeiro → **mitigações:** prompt-system instrui o modelo a não emitir diagnóstico nem sugerir CID; label visual "rascunho não revisado" na UI; revisão humana obrigatória antes do submit (art. 20 LGPD); SCC + zero retention + opt-out de treino; rascunho não é enviado de volta ao modelo em sessões subsequentes

### 3.8 Prontuário
- Coleta: texto clínico aprovado pelo terapeuta
- Base legal: art. 11, II, a + art. 11, II, b (guarda obrigatória)
- Retenção: **mínimo 5 anos** após última sessão (Res. CFP nº 6/2019)
- Riscos: acesso indevido, vazamento → **mitigações:** criptografia em repouso, trilha auditada, MFA

### 3.9 Cobrança (apenas assinatura do Terapeuta)
- Coleta: valor, método, CPF do Terapeuta
- Sub-operador: ⚠️TODO_GABRIEL (Asaas ou Stripe)
- Observação importante: **a Luma não intermedia o pagamento paciente–terapeuta no MVP.** O paciente paga o Terapeuta diretamente, fora da plataforma.
- Base legal: art. 7º, V + art. 7º, II
- Retenção: 5 anos (prescrição)

### 3.10 Suporte
- Coleta: tickets, conteúdo compartilhado pelo terapeuta
- Base legal: art. 7º, V (operacional) + art. 11, II, a quando envolver dado clínico
- Riscos: exposição de conteúdo clínico ao time de suporte → **mitigações:** suporte **não** acessa prontuário por padrão; acesso excepcional somente com ticket explícito, trilha auditada, não-retenção

### 3.11 Analytics e antifraude
- Coleta: eventos agregados, IP, user agent, comportamento
- Base legal: art. 7º, IX (legítimo interesse) + teste de ponderação documentado
- Regra-mãe: **conteúdo clínico nunca entra**

## 4. Necessidade e proporcionalidade

Para cada finalidade, o tratamento é necessário? Poderia ser feito com menos dado?

| Finalidade | Tratamento é o mínimo necessário? | Observação |
|---|---|---|
| Cadastro | Sim | CRP valida profissão |
| Prontuário | Sim | Exigência legal (Res. CFP 6/2019) |
| Áudio | Não é essencial, é opt-in | Terapeuta e paciente podem desativar |
| Transcrição | Derivada do áudio | Some com o áudio após uso |
| IA | Assistiva, opt-in | Funciona também sobre notas, sem áudio |
| Analytics | Pseudonimizado, sem conteúdo clínico | — |
| Antifraude | Baseado em metadados | — |

## 5. Partes interessadas

- **Titulares principais:** pacientes (maiores de 18), terapeutas
- **Titulares eventuais:** terceiros citados pelo paciente em sessão (família, médicos, parceiros) — risco específico
- **Controladores conjuntos / independentes:** terapeutas (clínico), Luma (operacional)
- **Sub-operadores:** listados em `cadeia-controlador-operador.md`
- **Autoridades:** ANPD, CFP, CRPs regionais

## 6. Medidas técnicas

- Criptografia TLS em trânsito
- Criptografia em repouso (AES-256) para conteúdo clínico
- Segregação de schemas/tenants por terapeuta
- Backups criptografados com rotação
- MFA obrigatório para administração; recomendado para terapeuta; passível de obrigatório em fase 2
- Controle de acesso por função (RBAC); princípio do menor privilégio
- Logs de auditoria clínica imutáveis; alertas por padrão anômalo
- Sanitização de PII em stack traces / logs operacionais (Sentry com PII filter)
- Testes de vulnerabilidade periódicos; pentest antes do go-live e anual
- Revisão de dependências (SCA)
- Rotação de secrets

## 7. Medidas organizacionais

- Encarregado (DPO) designado com canal público
- Política de Privacidade pública, versionada
- Termos de Uso e DPA contratualizados com o terapeuta
- DPAs com todos os sub-operadores, com não-treino e não-retenção
- Treinamento em privacidade e sigilo para toda a equipe, com refresh anual
- Política de acesso a dados clínicos (suporte só com ticket e trilha)
- Runbook de resposta a incidentes
- Canal de direitos do titular com prazo documentado
- Política de retenção documentada e implementada tecnicamente
- Processo de admissão e desligamento de colaboradores com revogação de acesso em 24h

## 8. Matriz de risco

Para cada risco, estimar **probabilidade** (baixa/média/alta) × **impacto** (baixo/médio/alto).

| # | Risco | Prob. | Imp. | Mitigação | Residual |
|---|---|---|---|---|---|
| 1 | Vazamento de prontuário por credencial | Média | Alto | MFA, monitoramento, criptografia | Médio |
| 2 | Insider mal-intencionado acessando dado clínico | Baixa | Alto | RBAC, trilha, separação de funções | Baixo |
| 3 | Sub-operador (LLM) usar dado para treino | Baixa | Alto | Contrato, opt-out, revisão periódica | Baixo |
| 4 | Erro de ASR virar prontuário sem revisão | Média | Médio | Revisão humana obrigatória, UI destaca "rascunho" | Baixo |
| 5 | IA sugerir linguagem diagnóstica | Média | Alto | Prompt-system restritivo, label visual, revisão | Baixo |
| 6 | Vazamento via provedor de vídeo | Baixa | Alto | Não-retenção contratual, seleção de fornecedor | Baixo |
| 7 | Uso indevido para atender menor sem fluxo | Média | Alto | Bloqueio no onboarding, termos explícitos | Baixo |
| 8 | Transferência internacional sem SCC | Baixa | Alto | SCC assinado com todos os fornecedores | Baixo |
| 9 | Ransomware | Baixa | Alto | Backup offline, segmentação, plano de resposta | Médio |
| 10 | Perda de acesso ao prontuário por falha (impacto no dever de guarda) | Baixa | Médio | Backup, SLA de disponibilidade, exportação | Baixo |
| 11 | Processo ético do terapeuta com uso como prova | Média | Médio | Trilha auditada a favor do terapeuta | Baixo |
| 12 | Não-atendimento de direito do titular no prazo | Média | Médio | Canal do DPO, SLA interno, run-sheet | Baixo |

## 9. Medidas adicionais sugeridas

- Seguro cibernético dedicado antes do primeiro contrato enterprise
- Programa de bug bounty a partir da segunda centena de clientes
- Certificação ISO 27001 ou SOC 2 Type II em horizonte de 18 meses
- Treinamento específico de sigilo clínico para engenheiros envolvidos em features com dado sensível
- Testes de restore de backup trimestrais

## 10. Avaliação final

Dado o conjunto de medidas técnicas e organizacionais, o risco residual do tratamento é considerado **aceitável** para operar a plataforma no escopo do MVP (adultos, sem chat, sem menor de idade). O RIPD será atualizado:

- a cada incidente relevante
- a cada mudança material no produto
- ao menos uma vez ao ano

## 11. Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 1.0 | ⚠️TODO_GABRIEL[preencher na publicação] | Gabriel de Oliveira Frozi (DPO) | Versão inicial |

---

**Caveat:** este RIPD é minuta estruturada para uso interno e revisão por advogado e pelo DPO. O documento vivo deve ser mantido pela organização, não substituído por esta minuta.
