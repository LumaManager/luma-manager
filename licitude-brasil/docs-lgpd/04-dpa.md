<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# Acordo de Tratamento de Dados (DPA) — Luma

Anexo ao Contrato de Licença de Uso de Software / Termos de Uso.

## 1. Definições

Os termos abaixo seguem a LGPD (Lei nº 13.709/2018):

- **Controlador:** Terapeuta, nos termos do art. 5º, VI LGPD e art. 11, II, a LGPD.
- **Operadora:** Luma, nos termos do art. 5º, VII LGPD.
- **Titular:** o paciente ou qualquer pessoa natural a quem se refiram os dados pessoais tratados (art. 5º, V).
- **Sub-operador:** terceiro contratado pela Operadora para apoiar parte específica do tratamento.
- **Dado pessoal sensível:** aquele que se refere a saúde, incluindo saúde mental (art. 5º, II LGPD).
- **Incidente:** ocorrência de segurança da informação com potencial efeito sobre dados pessoais.

## 2. Objeto

2.1 Este DPA regula o tratamento dos **dados pessoais de pacientes** realizado pela Luma **em nome do Terapeuta** no âmbito da plataforma.

2.2 Os **dados operacionais** (cadastro do Terapeuta, login, cobrança da assinatura, analytics) não estão sob este DPA, pois a Luma atua como controladora desses dados — a base para eles está na Política de Privacidade.

## 3. Escopo do tratamento

| Item | Conteúdo |
|---|---|
| Natureza | Armazenamento, organização, estruturação, consulta, transmissão, extração, apagamento de dados clínicos |
| Finalidade | Viabilizar a gestão da prática clínica do Terapeuta — agendamento, prontuário, documentação da sessão, cobrança, comunicação com o paciente |
| Categorias de titulares | Pacientes do Terapeuta (maiores de 18 anos), terceiros citados incidentalmente pelo paciente |
| Categorias de dados | Nome, contato, histórico clínico, anotações, áudio de sessão (quando ativado), transcrição, rascunho de IA, dados de pagamento do paciente (quando cobrado pela plataforma) |
| Duração | Enquanto o Contrato vigorar, preservado o prazo de guarda legal do prontuário |

## 4. Obrigações do Terapeuta (Controlador)

O Terapeuta, como controlador, é responsável por:

(a) definir a finalidade, os meios e os limites do tratamento;
(b) obter consentimentos destacados quando exigidos (áudio, IA);
(c) oferecer informações adequadas ao paciente;
(d) atender aos direitos do titular em primeira linha (art. 18 LGPD);
(e) manter a própria conta segura (credenciais, MFA);
(f) zelar pelo sigilo profissional (Código de Ética do Psicólogo);
(g) não inserir dados incompatíveis com a finalidade da plataforma;
(h) revisar pessoalmente rascunhos de IA antes de incorporá-los ao prontuário.

## 5. Obrigações da Luma (Operadora)

A Luma, como operadora, se obriga a:

(a) tratar os dados **exclusivamente** conforme instruções documentadas do Terapeuta — sendo a operação do produto a instrução permanente de base;
(b) manter confidencialidade sobre os dados, inclusive após o fim do contrato;
(c) aplicar medidas técnicas e organizacionais proporcionais ao risco (criptografia em trânsito e em repouso, segregação de ambientes, controle de acesso, auditoria);
(d) auxiliar o Terapeuta no atendimento aos direitos de titular, observando prazos compatíveis com os prazos legais;
(e) notificar o Terapeuta, em prazo máximo de **48 horas úteis**, sobre qualquer incidente de segurança com potencial impacto em dados pessoais tratados, fornecendo informações para que o Terapeuta avalie a necessidade de notificação à ANPD e ao titular (art. 48 LGPD);
(f) manter lista atualizada de sub-operadores, com DPA encadeado, e informar o Terapeuta sobre mudanças materiais com antecedência mínima de 30 dias;
(g) **não** utilizar os dados clínicos para treinar modelos próprios ou de terceiros;
(h) **não** comercializar os dados, agregados ou não;
(i) manter auditoria de acesso a conteúdo clínico, disponibilizada ao Terapeuta;
(j) ao fim do contrato, e ressalvada a guarda legal, devolver ou eliminar os dados em **30 dias**.

## 6. Sub-operadores

6.1 A Luma está autorizada a utilizar sub-operadores para partes específicas do tratamento (hospedagem, videoconferência, transcrição, IA, email transacional, pagamento, analytics), desde que:

(a) cada sub-operador esteja vinculado por DPA com obrigações equivalentes às aqui previstas;
(b) a Luma responda pela atuação do sub-operador perante o Terapeuta;
(c) a lista de sub-operadores seja pública e mantida atualizada.

6.2 **Lista de sub-operadores atuais:**

| Categoria | Fornecedor | País | Finalidade | Mecanismo de transferência |
|---|---|---|---|---|
| Hospedagem aplicação | Railway | US | Infraestrutura de aplicação | SCC (Res. ANPD 19/2024) |
| Banco de dados | PostgreSQL gerenciado pelo Railway | US | Persistência de dados clínicos e operacionais, com criptografia em repouso | SCC |
| Email transacional | Resend | US (data center EU disponível) | Envio de email transacional (confirmações, redefinição de senha); **sem conteúdo clínico no corpo do email** | SCC |
| Pagamento da assinatura do Terapeuta | ⚠️TODO_GABRIEL (Asaas ou Stripe) | BR (Asaas) ou US (Stripe) | Cobrança da mensalidade do Terapeuta | Nacional ou SCC |
| Pagamento paciente–terapeuta | **Não intermediado pela plataforma no MVP** | — | O paciente paga o Terapeuta diretamente, fora da Luma | — |
| Videoconferência | Daily.co | US | Stream de sessão e gravação opcional; o áudio da gravação é descartado logo após a transcrição | SCC + cláusula de não-retenção contratual |
| Transcrição (opt-in do paciente) | AssemblyAI | US | Conversão temporária do áudio em texto, com diarização (paciente/terapeuta); o áudio é descartado após a transcrição e a transcrição é descartada após a geração do rascunho | SCC + **zero retention contratual** (plano Enterprise) + opt-out de treino |
| LLM / IA (opt-in do paciente) | Anthropic (Claude, API) | US | Geração de rascunho de prontuário a partir da transcrição; o rascunho só se torna prontuário após revisão humana do Terapeuta | SCC + **zero retention contratual** (plano Business/Enterprise) + opt-out de treino |
| Analytics | ⚠️TODO_GABRIEL (Posthog self-host ou GA4 com PII filter) | EU ou US | Uso agregado do produto; **sem conteúdo clínico** | SCC se fora do Brasil |
| Monitoramento de erro | Sentry | US | Stack traces para engenharia, com scrubbing de PII habilitado | SCC |

6.3 O Terapeuta pode objetar à substituição de sub-operador que implique aumento relevante de risco, no prazo de 30 dias da comunicação. Persistindo a objeção, o Terapeuta pode rescindir sem multa.

## 7. Transferência internacional

7.1 Alguns sub-operadores estão fora do Brasil. O mecanismo adotado são as **Cláusulas Padrão Contratuais** aprovadas pela Resolução CD/ANPD nº 19/2024.

7.2 A Luma se compromete a:

(a) selecionar sub-operadores que aceitem cláusula de **não-treino** e **não-retenção** de conteúdo clínico além do necessário;
(b) priorizar, sempre que possível, processamento no Brasil para dado sensível;
(c) documentar a transferência no registro de operações de tratamento (art. 37 LGPD) e no RIPD (art. 38 LGPD).

## 8. Direitos do titular — apoio operacional

8.1 Quando o paciente exercer direito do art. 18 LGPD diretamente perante o Terapeuta, a Luma fornecerá apoio operacional em prazo máximo de **5 dias úteis**, incluindo:

(a) confirmação de tratamento e fornecimento de cópia dos dados;
(b) correção ou eliminação de dados indevidos;
(c) exportação em formato estruturado e interoperável (portabilidade);
(d) apoio na revisão de decisão automatizada (art. 20 LGPD).

8.2 A decisão final sobre a solicitação é do Terapeuta, como controlador. A Luma pode recusar eliminação de dados que integrem prontuário sujeito a guarda legal (Res. CFP nº 6/2019), anotando a recusa e o fundamento.

## 9. Incidente de segurança

9.1 A Luma manterá plano de resposta a incidentes, com runbook e textos de comunicação pré-aprovados.

9.2 Notificará o Terapeuta em **48 horas úteis** da identificação, informando ao menos:

(a) natureza do incidente e dados afetados;
(b) titulares afetados (quando identificáveis);
(c) medidas técnicas e organizacionais adotadas;
(d) medidas de mitigação em curso;
(e) contato do encarregado para acompanhamento.

9.3 O Terapeuta é responsável por decidir, à luz do caso, se haverá notificação à ANPD e/ou aos titulares. A Luma fornecerá minuta de texto e apoio na comunicação.

## 10. Auditoria

10.1 O Terapeuta tem direito a verificar o cumprimento deste DPA por meio de:

(a) relatórios e documentação de conformidade fornecidos pela Luma;
(b) relatórios de auditoria externa contratados pela Luma (ex.: ISO 27001, SOC 2, quando disponíveis);
(c) auditoria documental específica, mediante aviso prévio razoável, sujeita a acordo de confidencialidade e compatível com o volume e risco do tratamento;
(d) trilha auditável de acesso a conteúdo clínico.

## 11. Duração e término

11.1 Este DPA tem vigência enquanto durar o Contrato principal.

11.2 Ao fim do Contrato, a Luma:

(a) fornecerá ao Terapeuta export estruturado dos dados clínicos em 30 dias;
(b) depois do prazo, anonimizará ou eliminará os dados, ressalvada a guarda legal;
(c) manterá logs de conexão e acesso pelos prazos do Marco Civil;
(d) manterá cópia mínima dos dados sob guarda legal (Res. CFP nº 6/2019) em arquivo morto, com acesso restrito, pelo prazo estritamente necessário.

## 12. Obrigações em caso de requisição por autoridade

12.1 Recebida requisição de autoridade competente (judicial, administrativa) que envolva dados sob este DPA, a Luma:

(a) notificará o Terapeuta imediatamente, salvo vedação legal;
(b) cooperará apenas no estrito limite da requisição;
(c) buscará oposição à requisição excessiva, se houver base jurídica para tanto.

## 13. Responsabilidade específica

13.1 Cada parte responde pelas obrigações que lhe cabem nos termos deste DPA e da legislação de proteção de dados.

13.2 Na relação com o titular, o Terapeuta (controlador) responde em primeira linha pelos efeitos do tratamento, sendo a Luma responsável na forma do art. 42 LGPD (solidariedade quando houver descumprimento pela operadora).

## 14. Foro

14.1 Fica eleito o foro da comarca de Mogi das Cruzes/SP.

---

**Caveat:** este DPA é minuta estruturada para apoiar revisão jurídica. Deve ser revisado por advogado especializado em privacidade antes da assinatura.
