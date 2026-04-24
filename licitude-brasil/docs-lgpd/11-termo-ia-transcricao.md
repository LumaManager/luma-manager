<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# Termo de Consentimento — Gravação de Áudio, Transcrição e Uso de IA

Este termo é específico e separado dos demais acordos firmados com a plataforma Luma e com o(a) psicólogo(a) {{NOME_TERAPEUTA}} — {{CRP}}.

**Você pode recusar esses recursos sem qualquer prejuízo para o seu atendimento.** Sua recusa não afeta a sessão, o prontuário, o preço ou a relação com seu(ua) psicólogo(a).

---

## O que está sendo pedido

Você está sendo convidado(a) a autorizar o uso dos seguintes recursos durante suas sessões:

- **[A] Gravação de áudio da sessão**
- **[B] Transcrição automatizada desse áudio em texto**
- **[C] Geração de rascunho do prontuário por IA a partir da transcrição**

Esses recursos existem para **apoiar o(a) psicólogo(a)** na documentação do atendimento, permitindo que ele(a) fique mais presente na conversa em vez de anotar durante a sessão.

## 1. Como funciona, passo a passo

1. Durante a sessão, o áudio é capturado (se você consentiu em **[A]**).
2. Ao final, o áudio é processado por um serviço de transcrição (provedor: AssemblyAI (Estados Unidos, sob plano Enterprise com zero retention contratual)), gerando um texto.
3. O áudio bruto é **descartado** após a transcrição (em questão de horas).
4. A transcrição é então processada por um modelo de IA (provedor: Anthropic (Claude, Estados Unidos, sob plano Business/Enterprise com zero retention contratual)) que produz um **rascunho** estruturado — tópicos, organização cronológica, referências que você fez.
5. A transcrição é **descartada** após a geração do rascunho.
6. O(a) psicólogo(a) **revisa, edita e aprova** o rascunho antes de salvá-lo no prontuário.
7. Sem a revisão e aprovação do(a) psicólogo(a), **nada vira prontuário**.

## 2. O que a IA **não** faz

- **Não diagnostica.** Não produz CID, nem nome de transtorno, nem "impressão diagnóstica", nem conduta clínica. Isso é vedado por Código de Ética do Psicólogo e pela CFP 9/2024.
- **Não substitui o(a) psicólogo(a).** É ferramenta de apoio.
- **Não decide sobre o seu tratamento.** A condução clínica é humana, profissional e intransferível.
- **Não usa seus dados para treinar modelos.** Nem os da plataforma, nem os do fornecedor de IA — cláusula contratual com Anthropic (Claude, Estados Unidos, sob plano Business/Enterprise com zero retention contratual) proíbe.
- **Não envia seus dados a terceiros** fora da lista de sub-operadores da Política de Privacidade.

## 3. Seus dados neste fluxo

- **Áudio:** existe apenas o tempo necessário à transcrição (horas). Descartado em seguida.
- **Transcrição:** existe apenas o tempo necessário à geração do rascunho. Descartada em seguida.
- **Rascunho:** existe até a decisão do(a) psicólogo(a). Se aprovado, vira prontuário; se descartado, é eliminado; se deixado pendente, é eliminado automaticamente em 30 dias.
- **Prontuário aprovado:** guardado por prazo mínimo de 5 anos após última sessão (Res. CFP 6/2019), com base legal distinta (art. 11, II, a e b LGPD), que permanece mesmo após eventual revogação deste consentimento.

## 4. Base legal

- Para **[A] áudio** e **[B] transcrição**: seu consentimento específico e destacado (art. 11, I LGPD), combinado com a finalidade de tutela da saúde por profissional de saúde (art. 11, II, a).
- Para **[C] rascunho por IA**: sua manifestação específica para o uso de IA, aliada ao art. 11, II, a.

## 5. Riscos conhecidos e como mitigamos

| Risco | Mitigação |
|---|---|
| Vazamento de áudio | Criptografia, contrato com provedor que não retém, descarte automático |
| Erro de transcrição (ASR) | Revisão humana obrigatória antes de salvar |
| Alucinação da IA (invenção de conteúdo) | Revisão humana, label visual "rascunho", prompt-system que proíbe conteúdo especulativo |
| Uso do dado para treino | Contrato com cláusula de não-treino |
| Transferência internacional (provedor fora do BR) | Cláusulas Padrão Contratuais da ANPD (Res. CD/ANPD 19/2024) |
| Citação de terceiros pelo você | Os trechos que mencionem terceiros não são armazenados como dado do terceiro; ficam restritos ao seu prontuário |

## 6. Sobre pausar, encerrar e revogar

- **Durante a sessão:** você pode pedir ao(à) psicólogo(a) para pausar ou desligar a gravação a qualquer momento. Ele(a) o fará imediatamente.
- **Entre sessões:** você pode revogar este consentimento a qualquer tempo, entrando em contato com seu(ua) psicólogo(a) ou pela seção "Meus dados e privacidade" na plataforma.
- **Efeito da revogação:** a partir da revogação, o recurso é desligado para sessões futuras. Rascunhos ainda não convertidos em prontuário são eliminados. O prontuário já aprovado **permanece**, porque tem base legal própria (tutela da saúde), salvo se houver dever de eliminação por outra razão.

## 7. Transferência internacional

Os provedores de transcrição (AssemblyAI (Estados Unidos, sob plano Enterprise com zero retention contratual)) e de IA (Anthropic (Claude, Estados Unidos, sob plano Business/Enterprise com zero retention contratual)) podem estar localizados fora do Brasil. Os dados são transferidos sob **Cláusulas Padrão Contratuais aprovadas pela ANPD**, com cláusula específica de não-uso para treino e de descarte após processamento.

## 8. Seus direitos

Você pode, a qualquer tempo:

- acessar o rascunho que a IA gerou a partir da sua sessão, antes que ele vire prontuário
- pedir explicação sobre como a IA processou sua sessão (a revisão humana do art. 20 LGPD)
- corrigir o rascunho em conjunto com o(a) psicólogo(a)
- revogar o consentimento
- contatar o encarregado: dpo@lumamanager.com.br

## 9. Consentimento granular

Marque o que você consente:

- [ ] **[A] Consinto com a gravação de áudio** das minhas sessões para fins de transcrição e geração de rascunho.
- [ ] **[B] Consinto com a transcrição automatizada** do áudio por AssemblyAI (Estados Unidos, sob plano Enterprise com zero retention contratual).
- [ ] **[C] Consinto com o uso de IA (Anthropic (Claude, Estados Unidos, sob plano Business/Enterprise com zero retention contratual))** para gerar um rascunho do prontuário a partir da transcrição, com revisão humana obrigatória do(a) psicólogo(a).

Você pode consentir com parte e não com outra. Ex.: consentir **[A]** e **[B]** mas não **[C]** — a transcrição apoia o(a) psicólogo(a) sem rascunho por IA.

## 10. Declaração

Declaro que li este termo, entendi o funcionamento, os riscos e as mitigações, e que meu consentimento é livre e informado. Entendo que minha recusa não prejudica meu atendimento.

**Aceite registrado digitalmente**
Paciente: {{NOME_PACIENTE}}
Data/Hora: {{DATA_ACEITE}}
IP: {{IP_ACEITE}}
Versão do termo: 1.0

---

**Caveat:** minuta para revisão jurídica especializada em saúde + IA. Atenção à atualização dos provedores contratados e da cláusula de transferência internacional.
