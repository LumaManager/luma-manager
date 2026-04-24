<!-- =============================================
MINUTA LGPD — Luma Manager
Gerada pela skill lgpd-psicoterapia em 2026-04-19

Status: MINUTA PRELIMINAR. Pendente revisão de advogado.

Variáveis preenchidas com decisões travadas até abril/2026.
Marcações ⚠️TODO_GABRIEL indicam o que ainda precisa decisão.
Ver VARIAVEIS-LUMA.md para a checklist completa.
============================================= -->


# Playbook de Direitos do Titular — Luma

**Vigente desde:** ⚠️TODO_GABRIEL[DATA_VIGENCIA — na publicação]
**DPO:** Gabriel de Oliveira Frozi (dpo@lumamanager.com.br)

## 1. Os nove direitos (art. 18 LGPD)

| # | Direito | Significado operacional |
|---|---|---|
| 1 | Confirmação da existência de tratamento | "A Luma trata dados meus? Quais?" |
| 2 | Acesso aos dados | "Quero uma cópia dos meus dados" |
| 3 | Correção | "Há um dado errado, corrija" |
| 4 | Anonimização, bloqueio, eliminação de dado desnecessário/excessivo/tratado em desconformidade | "Estão tratando a mais, tirem o excesso" |
| 5 | Portabilidade | "Quero levar meus dados para outro fornecedor" |
| 6 | Eliminação dos dados tratados com consentimento | "Revogo meu consentimento, apaguem" |
| 7 | Informação sobre compartilhamento | "Com quem vocês compartilharam?" |
| 8 | Informação sobre possibilidade de não consentir | "O que acontece se eu não consentir?" |
| 9 | Revogação do consentimento | "Retiro meu consentimento para X" |

Soma-se o direito de **revisão humana** (art. 20 LGPD) para decisões automatizadas.

## 2. Canal de entrada

- **Email dedicado:** dpo@lumamanager.com.br
- **Na plataforma:** seção "Meus dados e privacidade" no perfil
- **Terceiros (a pedido do titular):** aceitamos com procuração

Todo pedido é aberto como ticket interno de LGPD (controle por planilha/ferramenta interna), com prioridade LGPD e SLA de 15 dias.

## 3. Fluxo geral

1. **Recebimento** (D0) — confirmação automática ao titular em até 24h
2. **Verificação de identidade** (D0-D2) — pedir documento compatível com o que já temos, para evitar fraude
3. **Qualificação do pedido** (D1-D3) — qual direito, qual dado, quem é o controlador relevante
4. **Execução** (D2-D12) — dependendo do direito
5. **Resposta** (até D15) — confirmação da ação ou justificativa de negativa parcial
6. **Prorrogação** (se necessário) — comunicar ao titular antes de D15 com justificativa
7. **Arquivamento** — registrar no log do DPO

## 4. Fluxos específicos

### 4.1 Confirmação + acesso (direitos 1 e 2)

- Levantar dados em todas as tabelas pertinentes: cadastro, login, cobrança, comunicação
- **Se for paciente:** redirecionar ao Terapeuta para dados clínicos (sigilo profissional), preservando que Luma é operadora
- Gerar export em formato estruturado (JSON + PDF legível)
- Entregar por canal seguro

### 4.2 Correção (direito 3)

- Validar que o dado está de fato incorreto
- Executar correção em base principal e propagar
- Confirmar ao titular

### 4.3 Eliminação/anonimização (direitos 4 e 6)

Casos típicos:

- **Conta operacional encerrada** — seguir Política de Retenção
- **Revogação de consentimento para IA/áudio** — encerrar processamento pela IA, apagar rascunhos não convertidos em prontuário
- **Pedido de exclusão total** — só se aplica ao que não esteja sob obrigação legal

**Importante:** prontuário clínico **não** é eliminado a pedido, em regra, pois há guarda legal (Res. CFP 6/2019) e base legal independente (art. 11, II, a e b). Explicar ao titular e registrar a negativa com fundamento.

### 4.4 Portabilidade (direito 5)

- Export em formato legível por máquina e estruturado
- Se for prontuário, exportar em PDF com assinatura digital + JSON, organizado por sessão
- Enviar ao titular ou direto ao novo fornecedor (se indicado)

### 4.5 Revogação de consentimento (direito 9)

- Consentimento específico revogado: parar imediatamente aquela finalidade específica
- Outros consentimentos permanecem ativos
- Dado gerado exclusivamente com base naquele consentimento é eliminado (ressalvada base legal independente)

### 4.6 Revisão humana (art. 20)

Aplicável ao **rascunho de IA** sempre que o paciente questionar o conteúdo. O fluxo:

- paciente relata para o terapeuta (primeira linha)
- se a resposta do terapeuta não satisfaz, paciente acione o DPO
- a Luma fornece ao terapeuta e ao paciente a trilha do rascunho (o que a IA produziu, o que foi alterado na revisão)
- decisão final é clínica, do terapeuta

### 4.7 Informação sobre compartilhamento (direito 7)

- Enviar a lista atual de sub-operadores (pública), com a relação que se aplica ao titular
- Indicar mecanismos de transferência internacional quando aplicável

## 5. Casos especiais

### 5.1 Pedido de paciente para acessar seu prontuário

A Luma é **operadora**. O acesso ao conteúdo clínico é decidido pelo Terapeuta. A Luma:

- confirma que trata dados em nome daquele terapeuta
- informa dados operacionais (se houver — login do paciente no portal, por ex.)
- encaminha o pedido de conteúdo clínico ao terapeuta, com apoio operacional
- se o terapeuta se recusar sem fundamento, a Luma comunica ao titular que o pedido foi encaminhado ao controlador e cabe a ele a decisão

### 5.2 Pedido em contexto de disputa entre paciente e terapeuta

Manter neutralidade. A Luma preserva trilhas e dados, responde apenas ao seu papel como operadora, e não se envolve no mérito clínico.

### 5.3 Pedido feito por terceiro (advogado, familiar)

Aceitar apenas com procuração específica ou decisão judicial. Nunca entregar dado sensível a terceiro sem autorização formal.

### 5.4 Pedido de paciente falecido

Seguir CFP — o prontuário permanece sob guarda do terapeuta. Acesso por herdeiros depende de ordem judicial ou de consentimento em vida do paciente, conforme caso.

### 5.5 Pedido em caso de menor (fora do MVP)

Bloquear até o fluxo infantil estar pronto. Redirecionar ao suporte.

## 6. Script padrão de resposta ao titular

> Prezado(a) {{NOME_TITULAR}},
>
> Recebemos sua solicitação relativa ao exercício de direitos previstos no art. 18 da LGPD em {{DATA_PEDIDO}}.
>
> A Luma está processando seu pedido e retornará com a resposta em até 15 dias, prorrogáveis por igual período com justificativa.
>
> Registro do pedido: {{NUMERO_TICKET}}
>
> Atenciosamente,
> Gabriel de Oliveira Frozi — Encarregado de Proteção de Dados

## 7. Script de negativa parcial

> Prezado(a) {{NOME_TITULAR}},
>
> Seu pedido de {{DESCRICAO_PEDIDO}} foi analisado. Informamos que atendemos parcialmente:
>
> **Atendido:** {{PARTE_ATENDIDA}}
> **Não atendido:** {{PARTE_NAO_ATENDIDA}}
>
> Fundamento da recusa: {{FUNDAMENTO_LEGAL}} — por exemplo, guarda obrigatória de prontuário nos termos da Resolução CFP nº 6/2019 e art. 11, II, b LGPD.
>
> Caso discorde, você pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).
>
> Atenciosamente,
> Gabriel de Oliveira Frozi — Encarregado de Proteção de Dados

## 8. Registro e relatório

Cada pedido é registrado no sistema interno de controle de pedidos LGPD com:

- data de entrada
- tipo de direito
- solicitante
- ações tomadas
- prazo cumprido
- resultado

Relatório mensal ao DPO e trimestral à diretoria. Base para o RIPD e eventual requisição da ANPD.

## 9. Histórico de versões

| Versão | Data | Responsável | Alteração |
|---|---|---|---|
| 1.0 | ⚠️TODO_GABRIEL[DATA_VIGENCIA — na publicação] | Gabriel de Oliveira Frozi | Versão inicial |

---

**Caveat:** minuta para revisão do DPO, advogado e suporte. Testar com caso-piloto antes de validar o fluxo.
