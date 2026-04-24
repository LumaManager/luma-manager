# Pacote Documental LGPD — Luma Manager

**Status:** MINUTA. Gerada pela skill `lgpd-psicoterapia` em `2026-04-19`. Preenchida parcialmente com decisões travadas até abril/2026. **Pendente revisão de advogado especializado em privacidade e saúde.**

## O que tem neste pacote

| # | Documento | Destinatário | Público? |
|---|---|---|---|
| 01 | [Política de Privacidade](01-politica-privacidade.md) | Terapeutas, pacientes, visitantes | Sim |
| 02 | [Termos de Uso](02-termos-de-uso.md) | Terapeuta (cliente) | Sim |
| 03 | [Contrato de Licença de Uso de Software](03-contrato-terapeuta.md) | Terapeuta (uso em contratação formal) | Não, por demanda |
| 04 | [DPA — Acordo de Tratamento de Dados](04-dpa.md) | Terapeuta, anexo ao contrato | Sim (ou por demanda) |
| 05 | [RIPD — Relatório de Impacto](05-ripd.md) | ANPD (se requerido), DPO, direção | **Não** — interno |
| 06 | [Política de Retenção](06-politica-retencao.md) | Time interno | Resumo público; detalhe interno |
| 07 | [Política de Resposta a Incidentes](07-politica-incidentes.md) | Time interno, canal público | Canal público; playbook interno |
| 08 | [Playbook de Direitos do Titular](08-playbook-direitos-titular.md) | DPO, suporte | Resumo na Política de Privacidade |
| 09 | [Termo de Consentimento do Paciente](09-termo-consentimento-paciente.md) | Paciente | Sim — aceito no onboarding |
| 10 | [Termo de Teleatendimento (Res. CFP 9/2024)](10-termo-teleatendimento.md) | Paciente | Sim — aceito antes da 1ª sessão |
| 11 | [Termo de IA/Transcrição/Áudio](11-termo-ia-transcricao.md) | Paciente | Sim — aceito destacado, granular |

## Variáveis que ainda precisam ser travadas

**Ver [`VARIAVEIS-LUMA.md`](VARIAVEIS-LUMA.md).** Até preencher o que está marcado ali, o pacote não é publicável.

## Ordem sugerida para o advogado

1. Ler este índice + `VARIAVEIS-LUMA.md` + `arquitetura/licitude-brasil/01-tese-de-licitude-no-brasil.md` + `arquitetura/licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md` (contexto)
2. Revisar **05-ripd.md** (é o "mapa geral" do risco, informa tudo o resto)
3. Revisar **01-politica-privacidade.md** (documento mais público, precisa estar defensável)
4. Revisar **02-termos-de-uso.md** e **03-contrato-terapeuta.md** (relação B2B)
5. Revisar **04-dpa.md** (cadeia LGPD)
6. Revisar **09, 10, 11** (fluxo do paciente, com atenção ao destaque do consentimento)
7. Revisar **06, 07, 08** (governança operacional)

Ver também [`PLAYBOOK-HANDOFF-JURIDICO.md`](PLAYBOOK-HANDOFF-JURIDICO.md) — instruções específicas para o advogado.

## Decisões já travadas (incorporadas no pacote)

- **Modelo:** SaaS para psicólogos autônomos (nunca "prestadora de serviço de psicologia")
- **Cadeia LGPD:** psicólogo é controlador do dado clínico, Luma é operadora
- **ICP MVP:** psicólogo autônomo, CRP ativo, atende apenas adultos (18+), 10+ pacientes, capacidade de investir R$ 300/mês
- **Fora do escopo MVP:** menor de idade, chat assíncrono, sessão em grupo
- **IA:** assistiva, com revisão humana obrigatória; prompt-system proíbe linguagem diagnóstica
- **Áudio/transcrição:** opt-in destacado do paciente, descartado após geração do rascunho
- **Treino de IA:** conteúdo clínico **nunca** é usado para treino (cláusula com fornecedores)
- **Guarda do prontuário:** mínimo 5 anos após última sessão (Res. CFP 6/2019)
- **Res. CFP 9/2024:** termo de teleatendimento específico, separado do aceite geral

## Fontes regulatórias consideradas

- LGPD (Lei 13.709/2018) — artigos 5º, 6º, 7º, 11, 14, 18, 20, 33-36, 37, 38, 41, 46-49
- Res. CFP 9/2024 (telepsicologia)
- Res. CFP 10/2005 (Código de Ética)
- Res. CFP 6/2019 (guarda de prontuário)
- Res. CFP 13/2022 (validação CRP)
- Res. CD/ANPD 2/2022, 4/2023, 15/2024, 18/2024, 19/2024
- Marco Civil da Internet (Lei 12.965/2014)
- Lei 13.787/2018 (prontuário eletrônico)
- ECA (Lei 8.069/1990) — referenciado para Fase 2

## Caveat permanente

Este pacote é **minuta estruturada, não parecer jurídico**. A publicação e o uso contratual final dependem de revisão de advogado especializado em privacidade e saúde. O documento foi pensado para facilitar a revisão (minuta boa = horas de revisão em vez de horas de redação).
