# Playbook de Handoff Jurídico — Pacote LGPD do Luma

Documento de instruções para o **advogado(a) especializado(a)** que vai revisar e validar o pacote LGPD do Luma Manager antes do go-live.

O objetivo é que o advogado chegue com contexto suficiente para se concentrar em **revisar e endurecer** o que foi escrito, em vez de escrever do zero.

## 1. Contexto em 3 parágrafos

O Luma é um SaaS em construção para psicólogos autônomos brasileiros gerirem a prática clínica. O MVP atende apenas adultos (18+), não suporta chat assíncrono nem sessão em grupo, e o agendamento segue modelo Calendly. A precificação alvo é R$ 300/mês.

O posicionamento LGPD escolhido é **SaaS operadora**: o psicólogo é controlador dos dados clínicos (prontuário, anotações, áudio, transcrição, rascunho de IA) e a Luma opera em seu nome. A Luma é controladora independente apenas para dados operacionais (cadastro do terapeuta, cobrança da assinatura, analytics sem conteúdo clínico, segurança). Esse posicionamento já foi travado em `arquitetura/licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md`.

Os recursos de gravação de áudio, transcrição e rascunho por IA são **opcionais e opt-in do paciente**, com consentimento destacado (art. 11, I LGPD), descarte automático do áudio após transcrição, descarte da transcrição após geração do rascunho, e revisão humana obrigatória do rascunho antes de ser salvo como prontuário (art. 20 LGPD). Essa arquitetura foi definida para mitigar os riscos específicos do domínio (ver `arquitetura/licitude-brasil/04-matriz-de-cenarios-audio-ia-e-registro.md`).

## 2. Documentos no pacote (por ordem recomendada de leitura)

| # | Documento | O que é | Atenção prioritária |
|---|---|---|---|
| 00 | `00-INDICE-LGPD-LUMA.md` | Índice e ordem | — |
| — | `VARIAVEIS-LUMA.md` | Checklist de campos a preencher | Campos marcados ⚠️ são decisão do fundador |
| 05 | `05-ripd.md` | Mapa de risco e mitigações | **Ler primeiro.** Explica a lógica do produto |
| 01 | `01-politica-privacidade.md` | Público, LGPD + CFP | Revisar claims, sub-operadores, retenção |
| 02 | `02-termos-de-uso.md` | Relação B2B com o terapeuta | Claims de "não é prestadora de serviço" |
| 03 | `03-contrato-terapeuta.md` | Versão formal/contratada | Usar em cliente enterprise |
| 04 | `04-dpa.md` | Acordo de tratamento | **Central**: cadeia operador/controlador |
| 06 | `06-politica-retencao.md` | Tabela de retenção por categoria | Validar contra CFP 6/2019 e Marco Civil |
| 07 | `07-politica-incidentes.md` | Plano de resposta | Validar prazos contra Res. ANPD 15/2024 |
| 08 | `08-playbook-direitos-titular.md` | Art. 18 LGPD | Validar SLA interno |
| 09 | `09-termo-consentimento-paciente.md` | Aceite do paciente | Conteúdo informacional |
| 10 | `10-termo-teleatendimento.md` | CFP 9/2024 | Validar contra a resolução |
| 11 | `11-termo-ia-transcricao.md` | Consentimento destacado | **Crítico.** Aqui é onde a fiscalização incide |

## 3. Perguntas específicas onde preciso do seu parecer

Perguntas que o fundador tem, fora da revisão geral. Respostas afetam decisões de produto:

### 3.1 Cadeia LGPD

1. O posicionamento "psicólogo é controlador, Luma é operadora" se sustenta em todos os fluxos descritos? Há algum em que a Luma inadvertidamente vire controladora (IA? analytics? suporte com acesso a clínico?)?
2. Para dados coletados **antes** do vínculo com o terapeuta (ex.: landing page, cadastro inicial do paciente por convite), a controladoria compartilhada até o aceite está desenhada de forma defensável?
3. Na hipótese de o paciente pagar diretamente pela plataforma (portal de cobrança), a base legal (art. 7º, V + II) está correta? Há regra específica sobre posição da Luma nesse fluxo?

### 3.2 IA e transcrição

4. O texto do termo **11 (IA/Transcrição/Áudio)** é suficientemente claro sobre o risco e as mitigações para caracterizar consentimento "informado" no sentido do art. 11, I LGPD?
5. A exigência de revisão humana antes do rascunho virar prontuário (art. 20 LGPD) está formalizada de modo que, em caso de fiscalização, seja demonstrável? Que evidência interna (log, assinatura) você recomenda?
6. A cláusula de "não-treino" nos contratos com fornecedores de IA/transcrição — como redigir para ter força contra OpenAI/Anthropic/Gemini em seu plano business padrão, se for o caso?
7. "Transferência internacional para treinamento" é permitida na Res. CD/ANPD 19/2024? Ou a cláusula de não-treino precisa ser mais assertiva?

### 3.3 Contrato com o terapeuta

8. A limitação de responsabilidade por 12 meses pagos é defensável no B2B-profissional brasileiro? Ou há risco de ser afastada em relação de consumo?
9. A cláusula que obriga o terapeuta a "não atender menores de 18 anos" — se o terapeuta violar e atender mesmo assim, qual a exposição da Luma? Devemos ter termo reforçado de responsabilidade?
10. O encerramento com guarda mínima do prontuário — a Luma manter acesso mínimo por 5 anos para cumprir CFP é condição aceitável pelo terapeuta, ou precisa ser pago à parte / precisa de arranjo específico?

### 3.4 Pacientes e Res. CFP 9/2024

11. O termo **10 (teleatendimento)** cumpre o conteúdo mínimo da Res. CFP 9/2024? Há risco de a plataforma estar "prestando serviço de psicologia" ao facilitar esse termo?
12. Paciente falecido, paciente processando o terapeuta, paciente menor em fase 2 — fluxos de direitos do titular em **08** precisam de ajuste?
13. Emergência psiquiátrica mencionada nos termos — há risco de a Luma ser enquadrada em responsabilidade solidária se houver incidente e a plataforma for vista como "canal" de atendimento?

### 3.5 Marketing e posicionamento

14. Quais claims do site/material o advogado vê como arriscados (ex.: "documentação automática com IA", "sem esforço")?
15. Há algum claim que seria bom incluir proativamente como proteção (ex.: "não substitui o psicólogo")?

### 3.6 Operacional LGPD

16. DPO sendo o próprio fundador é aceitável pela Res. CD/ANPD 18/2024 enquanto a operação for pequena? A partir de que tamanho recomenda a troca?
17. Sem RIPD formal auditado, a Luma consegue operar? Ou a agenda 2025-2026 da ANPD (saúde + IA) torna o RIPD mandatório desde o go-live?
18. O pacote cobre o mínimo do "programa de governança em privacidade" do art. 50 LGPD? Ou falta peça?
19. A Luma deveria se registrar como agente de pequeno porte pela Res. CD/ANPD 2/2022? Vale ou não vale?

## 4. O que NÃO fazer na revisão

- **Não** trocar o posicionamento "SaaS operadora" por "prestadora de serviço de psicologia" sem discussão com o fundador — isso muda o modelo de negócio inteiro, o registro no CRP, a tributação, e está travado em `03-decisoes-estruturais`.
- **Não** reduzir as salvaguardas de IA (revisão humana, proibição de diagnóstico, não-treino) — são a tese de licitude.
- **Não** remover o termo destacado de áudio/IA transformando em aceite único — viola o art. 11, I LGPD ("destacado").
- **Não** esticar retenção de áudio/transcrição além do necessário — quanto mais rápido o descarte, menor o risco.
- **Não** esvaziar o RIPD — é o documento que mais protege em caso de fiscalização.

## 5. Entregáveis esperados do(a) advogado(a)

Em ordem de valor:

1. **Parecer escrito** respondendo às 19 perguntas da seção 3, com fundamento e citação legal
2. **Redlines em cada documento** (01 a 11) — ajustes de linguagem, cláusulas a endurecer ou suavizar
3. **Nota de riscos residuais** — o que fica em aberto mesmo com todo o pacote em vigor, para gestão
4. **Carta de opinião** (opcional mas forte) — curta, assinada, que a Luma pode guardar como evidência de due diligence para investidor, cliente enterprise ou ANPD
5. **Recomendações operacionais** — por ex.: "contrate seguro cibernético em X meses", "registre no CNPJ como X", "inclua DPO terceirizado em Y clientes"

## 6. Sinais de qualidade do parecer

O fundador vai avaliar a qualidade do parecer pelos seguintes sinais:

- **Cita artigos específicos.** Um parecer que só fala "LGPD exige" sem mencionar art. 7º, 11, 20, 33, 48 é superficial.
- **Conversa com Res. CFP 9/2024 e Código de Ética.** Se só fala LGPD, está faltando metade.
- **Conversa com a agenda ANPD 2025-2026.** IA + saúde estão no foco, e isso deveria estar no parecer.
- **Identifica riscos residuais** com honestidade. Um parecer que diz "está tudo ok" sem apontar o que ainda não está, não serve.
- **Sugere melhorias priorizadas.** O que precisa antes do go-live, o que pode ser mês 3, o que é mês 12.
- **Entende que é SaaS, não é clínica.** Advogado que trata a Luma como "plataforma de atendimento" não entendeu o modelo e vai quebrar a tese.

## 7. Sinais de alerta

- Advogado que pede para trocar todo o posicionamento sem justificar.
- Advogado que remove menções a CFP achando que LGPD basta.
- Advogado que aceita IA diagnóstica "porque o cliente pode decidir".
- Advogado que copia modelo de DPA genérico sem adaptar ao domínio.
- Advogado que subestima o risco regulatório de dado sensível em larga escala.

## 8. Honorários e prazo — sugestão

- **Revisão completa do pacote (1ª rodada):** 20-40 horas de trabalho técnico do advogado. Faixa de R$ 15.000 a R$ 40.000 no mercado brasileiro especializado em privacidade + saúde, dependendo da senioridade.
- **Prazo:** 3-4 semanas úteis.
- **2ª rodada (após ajustes pelo fundador):** 5-10 horas adicionais.
- **Manutenção (trimestral):** 2-4 horas por trimestre.
- **Emergências (incidente, fiscalização ANPD):** fora do pacote, acionado por demanda.

## 9. Materiais complementares para enviar ao advogado

Além deste pacote, encaminhar:

- `arquitetura/licitude-brasil/01-tese-de-licitude-no-brasil.md`
- `arquitetura/licitude-brasil/02-mapa-regulatorio-oficial.md`
- `arquitetura/licitude-brasil/03-decisoes-estruturais-para-operar-no-brasil.md`
- `arquitetura/licitude-brasil/04-matriz-de-cenarios-audio-ia-e-registro.md`
- `arquitetura/licitude-brasil/05-gates-juridicos-para-go-live.md`
- `arquitetura/licitude-brasil/06-perguntas-para-parecer-juridico.md`
- `arquitetura/planejamento/decisoes-de-produto-mvp.md`
- (Opcional) screenshots dos fluxos principais da plataforma

## 10. Depois do parecer

1. **Aplicar redlines** em cada documento
2. **Preencher ⚠️TODO_GABRIEL** (ver `VARIAVEIS-LUMA.md`)
3. **Publicar a Política de Privacidade + Termos** no site antes do primeiro cliente pagante
4. **Assinar DPA com cada terapeuta** no onboarding
5. **Contratualizar DPAs com os sub-operadores** (hospedagem, vídeo, IA, pagamento)
6. **Instalar fluxo de direitos do titular** no produto
7. **Configurar trilhas de auditoria** e políticas de retenção no código
8. **Treinar o fundador** (ou futuro DPO) em resposta a incidente
9. **Simular incidente** (tabletop) antes do go-live
10. **Arquivar o parecer** como evidência de due diligence

Esse é o caminho do papel para a operação com cobertura.
