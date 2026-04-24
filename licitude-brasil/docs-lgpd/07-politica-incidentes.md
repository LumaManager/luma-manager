<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# Política de Resposta a Incidentes — Luma

**Versão:** 1.0
**Vigente desde:** ⚠️TODO_GABRIEL[DATA_VIGENCIA — na publicação]
**Líder de Resposta:** Gabriel de Oliveira Frozi (engenharia)
**DPO:** Gabriel de Oliveira Frozi (dpo@lumamanager.com.br)
**Canal para reportar externamente:** seguranca@lumamanager.com.br

## 1. Objetivo

Definir processo consistente para identificar, conter, investigar, comunicar e encerrar incidentes de segurança da informação que envolvam dados pessoais, especialmente dados sensíveis de saúde mental tratados pela plataforma, de modo a:

- proteger titulares e controladores
- cumprir obrigações do art. 48 LGPD e da Res. CD/ANPD nº 15/2024
- preservar relação contratual com os terapeutas e com os sub-operadores
- proteger a reputação da Luma

## 2. Definições

- **Incidente de segurança** — evento confirmado que afeta confidencialidade, integridade ou disponibilidade de dado pessoal. Exemplos: vazamento, acesso indevido, ransomware, perda de dispositivo, erro de configuração expondo dados.
- **Quase-incidente (near miss)** — evento que poderia ter causado incidente mas foi contido antes. Ex.: tentativa de intrusão bloqueada, configuração incorreta detectada por auditoria antes de exposição. **Logar também** — insumo de melhoria.
- **Incidente que enseja notificação** — o que puder acarretar risco ou dano relevante aos titulares. Na dúvida, notificar.

## 3. Classificação

| Severidade | Critério | Exemplo |
|---|---|---|
| **S1 — Crítico** | Dado sensível exposto a terceiros não autorizados OU indisponibilidade grave OU ransomware com risco de exfiltração | Vazamento de prontuário; dump público |
| **S2 — Alto** | Dado pessoal comum exposto OU acesso interno indevido sem evidência de exfiltração | Colaborador acessou dado sem necessidade |
| **S3 — Médio** | Risco sem exposição confirmada; bug com potencial exposição | Bug de permissão que expôs dado para outro terapeuta por minutos |
| **S4 — Baixo** | Quase-incidente | Pentest identificou falha depois corrigida |

## 4. Fluxo de resposta

### 4.1 Detecção (T0)

Origens possíveis:
- alerta automatizado (SIEM, WAF, log anômalo)
- relato de colaborador
- relato de terapeuta ou paciente
- relato externo (pesquisador de segurança, bug bounty)
- notificação de sub-operador

Qualquer pessoa que identifique indício deve abrir incidente no canal interno de incidentes (email seguranca@lumamanager.com.br + abertura de ticket interno) imediatamente, sem pré-análise.

### 4.2 Triagem (T0 → T+1h)

O líder de resposta (Gabriel de Oliveira Frozi) ou plantonista:

- confirma o evento
- classifica severidade inicial
- monta war room com engenharia e DPO (para S1/S2)
- abre registro formal (ID, timeline, ações)

### 4.3 Contenção (T+1h → T+4h para S1)

- isolar sistema afetado
- revogar credenciais comprometidas
- bloquear IPs/acessos maliciosos
- preservar evidências (imagens forenses, logs)
- não destruir evidência tentando "consertar rápido"

### 4.4 Investigação (T+4h → T+48h para S1)

- escopo do incidente: quais dados, quantos titulares, que período
- vetor: como ocorreu
- atores: interno, externo, sub-operador
- extensão: exfiltração confirmada? Só leitura?
- impacto: sensibilidade do dado, possibilidade de dano ao titular

Output: **relatório preliminar**.

### 4.5 Decisão de notificação (até T+72h após identificação — prazo interno)

Critérios para notificar ANPD e titular (art. 48 LGPD):

- risco ou dano relevante ao titular
- volume ou natureza sensível do dado
- dificuldade do titular em mitigar por conta própria
- extensão territorial

**Na dúvida, notifica.** A prática conservadora pesa menos que a multa por omissão.

### 4.6 Comunicação externa (dentro do prazo ANPD)

Seguir o formulário oficial da Res. CD/ANPD nº 15/2024. Conteúdo mínimo:
- descrição da natureza dos dados afetados
- titulares envolvidos (número estimado, categorias)
- medidas técnicas e organizacionais utilizadas para proteger os dados
- riscos relacionados ao incidente
- motivos de eventual atraso na notificação
- medidas adotadas para reverter ou mitigar efeitos

Comunicação ao titular em linguagem clara, via canal oficial (email, notificação in-app), em até 72h da decisão de notificar.

### 4.7 Comunicação ao terapeuta (controlador)

Como a plataforma é **operadora** dos dados clínicos, o Terapeuta é o controlador que decide sobre notificação ao paciente. A Luma notifica o Terapeuta em até **48 horas úteis** da identificação com:

- descrição do incidente
- pacientes afetados (quando identificáveis)
- medidas adotadas
- minuta de texto para comunicação ao paciente
- apoio operacional para notificação

### 4.8 Encerramento (T+7d a T+30d)

- relatório final com causa raiz
- plano de ação para evitar recorrência
- comunicação de encerramento à ANPD se houver (follow-up)
- arquivamento no registro de incidentes

### 4.9 Revisão pós-incidente

Post-mortem sem culpabilização individual (blameless):

- o que funcionou
- o que falhou
- melhorias no produto, processo, treinamento
- atualização do RIPD, desta política, do runbook técnico

## 5. Papéis e responsabilidades

| Papel | Responsabilidade |
|---|---|
| **Líder de Resposta** | Coordena toda a resposta, decide comunicação, autoridade máxima durante o incidente |
| **DPO** | Decide notificação à ANPD e aos titulares; aprova texto de comunicação |
| **Engenharia** | Contenção técnica, investigação, registro de evidência |
| **Comunicação** (ou CEO no MVP) | Assina comunicado, porta-voz com imprensa e clientes |
| **Jurídico** | Avalia exposição legal, prepara posicionamento para autoridade |
| **Suporte** | Escuta canais externos, encaminha ao líder |
| **Qualquer colaborador** | Reportar no canal interno de incidentes (seguranca@lumamanager.com.br) sem filtrar |

## 6. Canal público para reportar incidente

Pesquisadores de segurança e usuários podem reportar vulnerabilidades e incidentes em:

**seguranca@lumamanager.com.br**

Compromisso:

- confirmação de recebimento em 24h úteis
- primeira resposta técnica em 72h úteis
- proteção contra retaliação (safe harbor) para relatos de boa-fé
- reconhecimento público opcional após correção (hall of fame)

## 7. Textos modelo

### 7.1 Comunicação ao titular (modelo)

> Prezado(a) {{NOME_TITULAR}},
>
> Em {{DATA_INCIDENTE}}, identificamos um incidente de segurança que pode ter envolvido seus dados pessoais. Escrevemos para você com transparência, porque acreditamos que você tem direito a saber.
>
> **O que aconteceu:** {{DESCRICAO_SIMPLES}}
> **Quais dados podem ter sido afetados:** {{CATEGORIAS}}
> **O que fizemos:** {{ACOES_IMEDIATAS}}
> **Quais as possíveis consequências:** {{RISCOS}}
> **O que você pode fazer:** {{RECOMENDACAO_TITULAR}}
>
> Estamos à disposição para esclarecer. Contato do encarregado de proteção de dados: dpo@lumamanager.com.br.
>
> Gabriel de Oliveira Frozi — Encarregado da Luma

### 7.2 Comunicação ao terapeuta (modelo)

> Prezado(a) {{NOME_TERAPEUTA}},
>
> Escrevemos na qualidade de operadora dos dados de seus pacientes para informar um incidente de segurança identificado em {{DATA_INCIDENTE}}.
>
> **Natureza:** {{NATUREZA}}
> **Pacientes afetados:** {{LISTA_OU_NUMERO}}
> **Medidas adotadas:** {{MEDIDAS}}
> **Recomendação:** como controlador dos dados clínicos, você é quem decide sobre a notificação aos pacientes. Segue minuta sugerida em anexo; estamos à disposição para apoiar operacionalmente a comunicação.
>
> Gabriel de Oliveira Frozi — Encarregado da Luma

## 8. Exercícios de prontidão

- **Tabletop anual** — simulação de incidente S1 com todo o time de resposta
- **Teste de comunicação semestral** — envio de teste ao canal seguranca@lumamanager.com.br
- **Teste de restore trimestral** — validar backups
- **Pentest anual** — contratado externamente

## 9. Métricas

- tempo de detecção (T detecção − T evento)
- tempo de contenção
- tempo de notificação (quando aplicável)
- número de incidentes por categoria e severidade
- taxa de quase-incidentes (near miss)

Relatório trimestral ao DPO e à diretoria.

## 10. Anexo — Runbook técnico (referência)

- lista de sistemas e donos
- playbooks por categoria (vazamento de credencial, acesso indevido, ransomware, exposição de config)
- passo-a-passo de preservação de evidência
- scripts de investigação
- contatos 24/7

Runbook técnico é mantido em local de acesso restrito pela engenharia.

## 11. Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 1.0 | ⚠️TODO_GABRIEL[DATA_VIGENCIA — na publicação] | Gabriel de Oliveira Frozi | Versão inicial |

---

**Caveat:** minuta para revisão conjunta do DPO, engenharia e advogado. Os prazos e o formulário da ANPD devem ser validados contra a Res. CD/ANPD 15/2024 atualizada antes de publicar.
