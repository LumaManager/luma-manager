# Plataforma SaaS para Terapeutas — Visão Geral

> Documento gerado em 30/03/2026. Registra a visão inicial do produto, análise de viabilidade e implicações legais discutidas na fase de ideação.

---

## O Problema (Dor)

Terapeutas no Brasil usam anotações manuais para registrar sessões, o que gera:
- Desorganização entre consultas
- Dificuldade em retomar o fio condutor da terapia
- Tempo perdido com tarefas administrativas (cobrança, agenda, impostos)

---

## A Solução

Uma plataforma SaaS B2B vendida diretamente para terapeutas, com as seguintes funcionalidades:

### Gestão da Prática
- Dashboard centralizado de pacientes
- Agendamento de consultas
- Cobrança e faturamento
- Apoio ao pagamento de impostos (Carnê-Leão, DARF, NFS-e)

### Inteligência Artificial
- Durante ou após a sessão, a IA captura os tópicos discutidos
- Gera resumo automático da consulta
- Indica onde a conversa parou e sugere ponto de retomada na próxima sessão
- O documento central de cada paciente é alimentado e atualizado pela IA ao longo do tempo

### Acesso
- O paciente é direcionado para a plataforma pelo terapeuta como parte da prática
- O conteúdo clínico (resumos, prontuários) fica acessível **apenas para o terapeuta**

---

## Público-Alvo

**Cliente pagante:** O terapeuta (psicólogos, psiquiatras, terapeutas holísticos)
**Usuário final dirigido:** O paciente (acessa sob orientação do terapeuta)

**Mercado:** ~500 mil psicólogos registrados no CRP no Brasil. Sem equivalente local robusto ao SimplePractice (EUA).

---

## Viabilidade

**Veredicto: Viável**, com a condição de que a arquitetura de privacidade seja pensada desde o início.

O maior risco não é regulatório no lançamento — é um terapeuta ter problema com o CRP por usar a ferramenta, gerando PR negativo.

---

## Implicações Legais e Compliance

### 1. LGPD (Lei 13.709/2018)

Dados de saúde são **dados sensíveis** (Art. 5º, II).

| Obrigação | Detalhe |
|---|---|
| Base legal | Consentimento explícito do paciente ou tutela da saúde |
| RIPD | Relatório de Impacto obrigatório para tratamento em larga escala de dados sensíveis |
| DPO (Encarregado) | Tecnicamente obrigatório quando o core business trata dados sensíveis em escala |
| Armazenamento | Não obrigatório ser no Brasil, mas reduz riscos regulatórios |

### 2. CFP — Conselho Federal de Psicologia

| Ponto | Detalhe |
|---|---|
| Resolução CFP 001/2009 | Define prontuário psicológico, acesso e tempo de guarda (mín. 5 anos para adultos) |
| Código de Ética | Sigilo profissional absoluto — terapeuta é responsável mesmo usando ferramentas de terceiros |
| IA em prontuários | Zona cinzenta — sem resolução específica ainda. Tendência: seguir CFM (IA auxilia, responsabilidade é do profissional) |

### 3. Fiscal

| Funcionalidade | Solução Técnica |
|---|---|
| NFS-e para terapeutas | Integrar com API de prefeituras via PlugNotas ou NFe.io |
| Carnê-Leão / DARF | Calcular e gerar guias mensais via integradores ou API da Receita |
| Simples Nacional vs. Lucro Presumido | A plataforma orienta, mas não substitui contador |

---

## Arquitetura de Privacidade (Requisito Crítico)

A pergunta que todo terapeuta vai fazer: **"A empresa vai ler o que eu converso com meu paciente?"**

A resposta precisa ser arquiteturalmente verdadeira e verificável:

```
┌─────────────────────────────────────────────────────┐
│  PRINCÍPIOS DA ARQUITETURA DE PRIVACIDADE           │
│                                                     │
│  1. Conteúdo da sessão → IA sem identificadores     │
│     (nome, CPF removidos antes do processamento)    │
│                                                     │
│  2. Resumo gerado → criptografado                   │
│     Acessível apenas com a chave do terapeuta       │
│                                                     │
│  3. A empresa NÃO tem acesso ao conteúdo            │
│     Zero-knowledge architecture (ideal)             │
│                                                     │
│  4. Se usar OpenAI/Anthropic API:                   │
│     Configurar zero data retention (enterprise)     │
└─────────────────────────────────────────────────────┘
```

### Checklist de Compliance para Lançamento

| Ação | Prioridade |
|---|---|
| Política de Privacidade robusta (LGPD) | Alta |
| Termo de Consentimento do Paciente | Alta |
| DPA (Data Processing Agreement) com terapeutas | Alta |
| Criptografia em repouso e em trânsito | Alta |
| Não treinar modelos com dados dos pacientes | **Crítico** |
| Anonimização antes de enviar para LLM | Alta |
| Consultor jurídico especializado em LGPD + saúde | Média |
| Registrar empresa e produto no ANPD | Baixa (por ora) |

---

## Nome do Produto

- **Idioma definido:** Português puro
- **Personalidade:** Produtividade/controle (A) ou Inteligência/tecnologia (B)
- **Formato:** A definir
- **Status:** Nomeação adiada — foco na viabilização técnica primeiro

---

## Próximos Passos

- [ ] Definir stack tecnológica
- [ ] Arquitetura do sistema (módulos, integrações)
- [ ] Fluxo de consentimento do paciente
- [ ] MVP: quais funcionalidades entram primeiro
- [ ] Modelo de precificação

---

*Documento vivo — atualizar conforme o projeto evolui.*
