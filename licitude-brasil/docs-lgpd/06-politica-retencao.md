<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# Política de Retenção de Dados — Luma

**Versão:** 1.0
**Vigente desde:** ⚠️TODO_GABRIEL[preencher na publicação]
**Responsável técnico:** Gabriel de Oliveira Frozi (engenharia)
**Aprovada pelo DPO:** Gabriel de Oliveira Frozi (dpo@lumamanager.com.br)

## 1. Princípio

Nenhum dado é mantido além do estritamente necessário para cumprir a finalidade declarada, observadas as obrigações legais (LGPD art. 6º, III; art. 15; Res. CFP nº 6/2019; Marco Civil arts. 13-15).

## 2. Tabela-mãe de retenção

| # | Categoria | Base legal | Prazo | Local | Eliminação |
|---|---|---|---|---|---|
| 1 | **Cadastro do terapeuta (ativo)** | Art. 7º, V | Enquanto durar o contrato | Postgres principal | Soft-delete + hard-delete em 30 dias após encerramento |
| 2 | **Cadastro do terapeuta (encerrado)** | Art. 7º, VI; contábil | 5 anos após encerramento (prescrição) | Arquivo morto | Eliminação automática |
| 3 | **Credenciais (senha hash, TOTP)** | Art. 11, II, g | Enquanto durar o contrato | Vault / auth service | Revogação imediata no encerramento |
| 4 | **Logs de autenticação (Marco Civil)** | Art. 15 Marco Civil | **6 meses** (mínimo legal) | Log storage | Job de rotação diária |
| 5 | **Cadastro do paciente (ativo)** | Art. 7º, V (vínculo com terapeuta) | Enquanto paciente estiver vinculado + 5 anos (prontuário) | Postgres | — |
| 6 | **Prontuário clínico** | Art. 11, II, a e b | **Mínimo 5 anos** após última sessão (Res. CFP 6/2019) | Postgres + backup criptografado | Após 5 anos, revisar: se houver pendência (processo, reclamação), manter; se não, anonimizar ou eliminar |
| 7 | **Anotação clínica livre** | Art. 11, II, a | Parte do prontuário — mesmo prazo | Postgres | Idem |
| 8 | **Áudio bruto da sessão** | Art. 11, I (consentimento) + II, a | **Descarte em horas** após geração da transcrição | Storage de vídeo/áudio do provedor + bucket temporário | Job automático + TTL no bucket |
| 9 | **Transcrição temporária** | Art. 11, I + II, a | **Descarte em horas** após geração do rascunho | Postgres temporário | Job automático |
| 10 | **Rascunho de IA não aprovado** | Art. 11, II, a + consentimento IA | 30 dias ou até decisão do terapeuta | Postgres | Job noturno |
| 11 | **Rascunho de IA aprovado** | Vira prontuário → item 6 | Idem prontuário | Postgres | Idem |
| 12 | **Dados de pagamento — terapeuta** | Art. 7º, V + II | 5 anos (prescrição fiscal) | Gateway + Postgres (referência) | Eliminação após 5 anos |
| 13 | **Dados de pagamento — paciente** | Art. 7º, V (se cobrado pelo portal) | 5 anos | Gateway | Mesmo |
| 14 | **Notas fiscais** | Obrigação fiscal | 5 anos mínimo (pode variar) | Bucket dedicado | Manual / trimestral |
| 15 | **Logs de acesso a aplicação (Marco Civil)** | Art. 15 Marco Civil | **6 meses** mínimo | Log storage | Rotação diária |
| 16 | **Logs de auditoria clínica** | Art. 11, II, a + governança | 5 anos | Tabela de auditoria | Rotação anual para arquivo frio |
| 17 | **Backups operacionais** | Segurança | 30 dias (rolling) | Provider de hospedagem | Expiração automática |
| 18 | **Backups de conformidade** | Segurança + dever de guarda | Enquanto o prontuário estiver em guarda | Frio, criptografado | Rotação anual |
| 19 | **Tickets de suporte** | Art. 7º, V | 2 anos após fechamento | Ferramenta de suporte | Eliminação automática |
| 20 | **Tickets com dado clínico** | Exceção — regra especial | Removidos após resolução; apenas o metadado fica | Ferramenta | Eliminação imediata do conteúdo clínico |
| 21 | **Eventos de analytics agregados** | Art. 7º, IX | 2 anos | Data warehouse | Retenção rolante |
| 22 | **Eventos pessoais pseudonimizados** | Art. 7º, IX | 6 meses | Idem | Retenção rolante |
| 23 | **Contato de marketing opt-in** | Art. 7º, IX / consentimento | Até opt-out + 12 meses (prova de opt-in) | CRM | Rotação |
| 24 | **Sessões de videoconferência (metadados)** | Art. 7º, V | 1 ano | Provedor de vídeo | Rotação |
| 25 | **Dados de conta encerrada** | Após encerramento | 30 dias para exportar; depois anonimizar, preservando guarda legal | Postgres | Script de encerramento |

## 3. Regras especiais

### 3.1 Dever de guarda do prontuário

Res. CFP nº 6/2019 estabelece guarda mínima de 5 anos após a última sessão. Na prática:

- O Terapeuta é o titular do dever de guarda.
- A Luma apoia a guarda enquanto o terapeuta estiver contratualmente ativo.
- Se o terapeuta sair da plataforma, deve-se oferecer:
  - exportação completa do prontuário em formato estruturado (PDF assinado + JSON)
  - manter arquivo morto por prazo acordado (ressalva pago a parte ou preservado gratuitamente — decisão comercial)
  - ou confirmação formal de que o terapeuta assume a guarda em outro local

### 3.2 Processos e reclamações em andamento

Quando houver pendência (reclamação de paciente, processo ético no CRP, processo judicial), o prazo fica **suspenso** — o dado é mantido até decisão final, com fundamento no art. 7º, VI e art. 11, II, e LGPD.

### 3.3 Anonimização vs. eliminação

- **Eliminação:** remoção física do dado. Preferida quando não há finalidade residual.
- **Anonimização:** transformação irreversível em dado agregado/pseudônimo. Preferida quando o dado agregado tem valor para o produto e o paciente/terapeuta já não é identificável.

Tecnicamente, anonimização deve ser **auditável e irreversível** — não basta tirar o nome se a chave pode ser recuperada por outro campo.

### 3.4 Revogação de consentimento

Quando o titular revogar o consentimento (áudio, IA):

- a finalidade específica **para** imediatamente
- o dado gerado com base exclusiva naquele consentimento é eliminado
- dados já convertidos em prontuário **permanecem** sob base legal distinta (art. 11, II, a), com nota sobre a origem

### 3.5 Encerramento por inatividade

Se o terapeuta ficar inativo por 12 meses sem renovação:

- aviso aos 10, 11, 12 meses por email
- encerramento formal após 12 meses
- preservação da guarda legal em arquivo morto por mais 5 anos (ou acordo comercial diferente)

## 4. Implementação técnica

### 4.1 Responsabilidade

- **Cron jobs de TTL** — Gabriel de Oliveira Frozi (engenharia)
- **Monitoramento de prazos** — dashboard interno, relatório mensal ao DPO
- **Alertas de prazo expirado sem ação** — time de engenharia

### 4.2 Job list (exemplo)

- `job:descarte-audio` — roda após cada sessão, apaga áudio bruto após transcrição
- `job:descarte-transcricao` — roda após geração do rascunho, apaga transcrição
- `job:descarte-rascunho-nao-aprovado` — diário, remove rascunhos com mais de 30 dias sem ação
- `job:rotacao-logs-marco-civil` — diário, expira logs com mais de 6 meses
- `job:encerramento-conta-inativa` — mensal
- `job:revisao-retencao-prontuario` — mensal, sinaliza prontuários que completaram 5 anos após última sessão para decisão manual

### 4.3 Auditoria

- relatório trimestral de execução dos jobs de descarte
- amostragem trimestral para validar que dado expirado foi de fato removido
- teste anual de restore de backup para validar que backups antigos não persistem indevidamente

## 5. Alterações desta política

Alterações materiais (mudança de prazo, nova categoria, mudança de fornecedor) exigem:

1. revisão do DPO
2. revisão do jurídico
3. comunicação aos titulares quando afetados (via Política de Privacidade pública)
4. atualização do RIPD

## 6. Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 1.0 | ⚠️TODO_GABRIEL[DATA_VIGENCIA — na publicação] | Gabriel de Oliveira Frozi | Versão inicial |

---

**Caveat:** minuta para revisão conjunta do DPO e do advogado. Implementação técnica precisa ser verificada por engenharia antes de virar vigente.
