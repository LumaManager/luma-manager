# Decisões de Produto do MVP

Fechadas em 19 de abril de 2026. Este documento consolida as decisões que travam escopo, código e contrato antes de iniciar a execução da Fase 1.

## 1. Escopo do MVP — solo, adulto, sem chat

| Item | Decisão | Racional curto |
|---|---|---|
| Tipo de conta | Solo — um terapeuta autônomo por conta | Clínica multi-terapeuta triplica complexidade (RBAC, governança, responsável técnico). Fica para Fase 2. |
| Público atendido | Adultos apenas | Infantil é especialização distinta; junta responsável legal, retenção para menores ainda aberta e UX com duas identidades. Vira feature dedicada na Fase 2. |
| Agendamento | Paciente agenda sozinho em slots livres publicados pelo terapeuta | Reduz atrito de marcação (dor real para quem tem 10-20 pacientes) e é o driver de valor claro já no primeiro dia. Estilo Calendly. |
| Chat assíncrono entre sessões | Fora do MVP | Cria expectativa de latência, risco clínico em emergências, e dobra escopo de retenção de prontuário. Paciente e terapeuta seguem trocando por WhatsApp. |

## 2. ICP travado

Psicólogo autônomo com:

- CRP ativo
- Atua em clínica privada própria, sem vínculo institucional
- Atende **adultos**
- Já tem **10 ou mais pacientes ativos**
- Disposição de investir **~R$300/mês** em ferramenta

**Estagiário e estudante de psicologia não são ICP do MVP.** Podem ser canal de aquisição de longo prazo ("conheça a ferramenta desde a formação") mas não são cliente pagante.

O ICP exclui:

- Psicólogo infanto-juvenil (entra na Fase 2 com a feature infantil)
- Psicólogo em início de carreira sem base consolidada (pode usar quando atingir ~10 pacientes)
- Psicólogo vinculado a convênio ou instituição (barreira contratual — ver `investigacao.md`)
- Clínica multi-terapeuta (Fase 2)

## 3. Pricing alvo

R$300/mês por terapeuta solo, a ser validado no beta privado.

Sanidade do número:

- Benchmark Berries (EUA): US$79/mês ≈ R$400 em paridade de mercado local
- Ticket médio de sessão privada no Brasil: R$150-300
- Com 10 pacientes semanais (~40 sessões/mês), o terapeuta fatura R$6.000-12.000/mês
- R$300/mês = 2,5% a 5% do faturamento — alinhado com padrão de gastos com ferramenta profissional

O preço final pode ser mensalidade pura ou mensalidade + franquia de uso (ver `unidade-e-precificacao.md` — depende da instrumentação de custo por sessão).

## 4. O que essas decisões implicam em código

### Some ou simplifica
- **Sem módulo de chat assíncrono** — não construir `chat`, `threads`, `messages` como entidades.
- **Sem fluxo de responsável legal** — todo o caminho de `patient.guardian`, convite duplo, UX de dupla identidade e pagamento pelo responsável fica fora do MVP.
- **Sem multi-terapeuta por tenant** — `tenants` continua existindo para isolamento de dados, mas 1 tenant = 1 terapeuta. Sem RBAC de múltiplos papéis dentro do tenant, sem governança clínica institucional.
- **Retenção para menores** — sai da matriz de políticas do MVP. Reentra com a feature infantil.

### Cresce
- **Agendamento público** — terapeuta precisa poder publicar slots livres e o paciente precisa conseguir marcar sem estar logado (ou com login leve). Isso é mais complexo que a UX atual de "terapeuta cria appointment". Exige: página pública por terapeuta, regras de disponibilidade recorrente + bloqueios + buffer, reserva com expiração, confirmação por email, cancelamento por paciente, política de no-show.
- **Onboarding qualificado** — precisa filtrar ICP desde o cadastro: validação de CRP, pergunta sobre base de pacientes, sobre público atendido (adulto/infantil) — para recusar educadamente quem não é ICP do MVP.

### Continua igual
- Auth + MFA
- Dashboard, ficha, prontuário, financeiro (adultos apenas)
- Videochamada, transcript, rascunho IA com revisão humana
- Documentos e consentimentos

## 5. O que abre ainda precisa ser fechado

Estas decisões não estão cobertas aqui e seguem em `perguntas-em-aberto.md`:

- Política final de guarda de prontuário adulto (Gate 4 jurídico)
- Provedor de vídeo, provedor de transcript e LLM contratados
- Pacote documental LGPD completo (Gate 6)
- Base legal do tratamento (consentimento vs. execução de contrato)

## 6. Próximos passos após essas decisões

1. Refletir as decisões em código: remover do escopo os módulos que caíram (chat, responsável legal), expandir agendamento público, ajustar onboarding para qualificar ICP.
2. Seguir para o gate jurídico (pacote LGPD mínimo) e decisões de fornecedor (vídeo, transcript, LLM).
3. Fechar pricing após instrumentação mínima de custo por sessão.
