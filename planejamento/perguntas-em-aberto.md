# Perguntas em Aberto

## 0. Decisões fechadas

### Fechadas em março 2026

| Decisão | Resposta |
|---|---|
| ICP do produto | Psicólogo autônomo, clínica privada, sem convênio ou vínculo institucional |
| Reter áudio | Não — descarte automático após transcrição |
| Reter transcript | Não — descarte automático após geração dos tópicos |
| Usar dados para treino | Não |
| Processamento | Brasil — sem transferência internacional |
| Sugerir CID/diagnóstico por IA | Não — CFP proíbe diagnóstico por IA |
| Profundidade da nota | Resumo em tópicos — não nota clínica completa como o Berries |
| Terapeuta valida os tópicos | Sim — terapeuta revisa e aprova antes de qualquer registro |

### Fechadas em abril 2026

| Decisão | Resposta |
|---|---|
| MVP solo ou multi-terapeuta | Solo — um terapeuta autônomo por conta. Clínica multi-terapeuta vira Fase 2. |
| Refinamento do ICP | Psicólogo autônomo com CRP ativo, atende adultos, 10+ pacientes ativos, capacidade de investir ~R$300/mês em ferramenta. Estagiário/estudante **não é** cliente pagante — no máximo canal de aquisição futura. |
| Agendamento no MVP | Paciente agenda sozinho em slots livres publicados pelo terapeuta (estilo Calendly). |
| Chat assíncrono entre sessões | Fora do MVP. Comunicação entre sessões segue por canal externo (WhatsApp). |
| Atendimento infantil no MVP | Fora do MVP. Apenas pacientes adultos. Infantil é especialização de público distinto e vira feature dedicada em Fase 2 — destrava o segundo ICP (psicólogo infanto-juvenil). |
| Pricing alvo do MVP | R$300/mês por terapeuta solo, a validar no beta. Benchmark: Berries cobra US$79/mês. |

Detalhamento dessas decisões em [decisoes-de-produto-mvp.md](./decisoes-de-produto-mvp.md).

---

## 1. Decisões bloqueantes antes de construir

### Produto

- ~~O MVP será para terapeuta individual apenas ou já precisa suportar clínica com vários terapeutas?~~ **Fechada — solo.**
- ~~O paciente poderá agendar sozinho ou apenas confirmar convites e horários oferecidos?~~ **Fechada — agenda sozinho em slots livres.**
- ~~Haverá chat assíncrono entre sessões?~~ **Fechada — fora do MVP.**
- ~~O produto precisa suportar atendimento infantil no MVP?~~ **Fechada — fora do MVP.**

### Jurídico e compliance

- Qual política final de guarda será aplicada a prontuário adulto?
- Qual política final de guarda será aplicada a pacientes menores de idade?
- `RESOLVIDO` O transcript bruto será insumo temporário ou parte do registro clínico? → não será retido
- Em quais cenários o consentimento é a base legal principal e em quais haverá outra base?

### Tecnologia

- Qual provedor de vídeo será contratado?
- Qual provedor de transcript será contratado?
- Qual LLM será contratado para o rascunho clínico?

### Comercial

- O preço será por terapeuta, por paciente ativo, por minutos/sessões ou híbrido?
- Haverá franquia de uso de transcript e IA?
- O plano do MVP já incluirá suporte fiscal avançado como diferencial comercial?

## 2. Decisões importantes para o beta privado

- Quais fluxos do paciente precisam existir no web beta desde o dia 1 e quais podem esperar?
- O terapeuta poderá delegar agenda/financeiro a assistente?
- Haverá importação de base de pacientes via CSV?
- Quais métricas determinarão sucesso do beta?

## 3. Decisões que podem esperar para fase 2

- Integração com convênios.
- Fiscal full-service com emissão municipal.
- Multi-clínica enterprise.
- Busca semântica em prontuário.
- Conteúdo terapêutico para o paciente.

## 4. Responsáveis sugeridos por decisão

- Produto: escopo do paciente, chat, importações, experiência web.
- Jurídico: retenção, base legal, contrato, suboperadores.
- Engenharia: stack, provedores, arquitetura de logs, isolamento clínico.
- Financeiro/comercial: pricing, franquias, margem alvo.
