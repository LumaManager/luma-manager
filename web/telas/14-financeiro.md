# Web do Terapeuta - Etapa 14 - Financeiro

## 1. Objetivo

Definir de forma fechada a área de `financeiro` no web admin do terapeuta, cobrindo:

- contas a receber
- detalhe da cobrança
- status de pagamento
- filtros por origem particular/convênio
- visão mensal resumida
- exportação para contador

## 2. Papel da tela no produto

O financeiro é a `superfície operacional de cobrança e acompanhamento de receita`.

Ele precisa responder rapidamente:

1. o que já foi cobrado?
2. o que está em aberto ou vencido?
3. de qual paciente e de qual sessão veio cada cobrança?
4. qual a origem do pagamento: particular ou convênio?
5. o que posso exportar para controle contábil?

## 3. Escopo desta etapa

### Dentro do escopo

- lista de cobranças
- filtros operacionais
- detalhe da cobrança
- status de pagamento
- resumo mensal
- exportação operacional

### Fora do escopo

- integração profunda com convênios
- emissão fiscal municipal automatizada
- conciliação bancária avançada
- DRE e contabilidade completa
- automação fiscal full-service

## 4. Decisões travadas nesta etapa

- a rota principal será `/app/finance`
- a área será `cobrança-first`, não contabilidade-first
- a unidade principal da tela será a `cobrança`
- a origem do pagamento será exibida como `Particular` ou `Convênio`
- convênio no MVP é `classificação operacional`, não integração com operadora
- a ordenação padrão será por `vencimento mais próximo / mais crítico`
- a área terá visão mensal resumida, mas sem BI contábil avançado
- exportação para contador será via arquivo/relatório operacional, não integração direta no MVP

## 5. Rotas e permissão

### Rotas

- `/app/finance`
- `/app/finance/charges/:chargeId`

### Permissão

- terapeuta autenticado

### Regra crítica

- o terapeuta só acessa cobranças do seu tenant e dos seus pacientes vinculados
- a área não deve expor dados clínicos desnecessários

## 6. Estrutura geral da tela principal

Esta tela usa o `Template B: Lista com detalhe por navegação`.

Estrutura final:

1. título e contexto
2. ações primárias
3. resumo mensal
4. faixa de filtros
5. tabela de cobranças
6. paginação

## 7. Cabeçalho da página

### Título

- `Financeiro`

### Subtítulo

- frase curta explicando que a área centraliza cobranças e acompanhamento financeiro do consultório

Exemplo:

- `Acompanhe cobranças, pagamentos e pendências financeiras do consultório.`

### Ações primárias

- `Nova cobrança`
- `Exportar`

### Ações secundárias

- nenhuma no MVP

## 8. Resumo mensal

### Objetivo

Dar leitura rápida do mês atual sem transformar a tela em dashboard financeiro complexo.

### Blocos mínimos

- total cobrado no mês
- total recebido no mês
- total em aberto
- total vencido

### Regras

- resumo muda conforme período selecionado
- valores devem ser legíveis e objetivos
- sem gráficos avançados no MVP

## 9. Modelo de cobrança

Cada linha representa uma `charge`.

### Campos principais

- paciente
- referência da sessão, quando existir
- origem do pagamento
- valor
- vencimento
- status
- último evento financeiro

## 10. Estados de cobrança

### Estados do MVP

- `Pendente`
- `Pago`
- `Vencido`
- `Cancelado`

### Regras

- `Pendente` cobre cobrança criada e ainda dentro do prazo
- `Vencido` indica prazo expirado sem baixa
- `Cancelado` não apaga histórico
- o status operacional precisa ser simples e previsível

## 11. Origem do pagamento

### Valores do MVP

- `Particular`
- `Convênio`

### Regra

- no MVP, essa origem serve para classificação e filtro
- não implica integração com operadora nem fluxo de faturamento hospitalar

## 12. Filtros da tela

### Filtros visíveis

- status da cobrança
- origem do pagamento
- período

### Busca local

Deve buscar por:

- nome do paciente
- referência da cobrança
- valor, quando suportado

### Filtros adicionais em drawer

- apenas vencidas
- apenas sem sessão vinculada
- apenas do mês atual

### Regras

- filtros ativos viram chips
- deve existir botão `Limpar filtros`

## 13. Tabela principal

### Colunas obrigatórias

1. `Paciente`
2. `Cobrança`
3. `Origem`
4. `Vencimento`
5. `Valor`
6. `Status`

### Coluna 1 - Paciente

- nome completo
- atalho para ficha do paciente

### Coluna 2 - Cobrança

- identificador ou referência
- sessão relacionada, quando existir

### Coluna 3 - Origem

- `Particular` ou `Convênio`

### Coluna 4 - Vencimento

- data de vencimento

### Coluna 5 - Valor

- valor monetário formatado

### Coluna 6 - Status

- badge de status

## 14. Ordenação

### Ordenação padrão

1. vencidas primeiro
2. pendentes com vencimento mais próximo
3. pagas recentes
4. canceladas por último

### Regras

- a ordenação deve priorizar ação operacional
- não usar ordem alfabética como default

## 15. Interações por linha

### Comportamento principal

- clique na linha abre `/app/finance/charges/:chargeId`

### Ações rápidas por linha

- abrir cobrança
- abrir paciente
- registrar pagamento, quando houver fluxo manual
- cancelar cobrança, quando permitido

### Regras

- ações destrutivas exigem confirmação
- não permitir edição inline complexa na lista

## 16. Nova cobrança

### Forma

- `drawer`

### Campos mínimos

- paciente
- valor
- vencimento
- origem do pagamento
- sessão relacionada, quando aplicável

### Regras

- paciente é obrigatório
- valor e vencimento são obrigatórios
- sessão vinculada é opcional, mas recomendada quando a cobrança nasce do atendimento
- após criação, oferecer:
  - abrir cobrança
  - continuar no financeiro

## 17. Tela de detalhe da cobrança

### Objetivo

Mostrar a cobrança de forma completa, sem virar uma suíte de billing enterprise.

### Conteúdo

- paciente
- valor
- origem do pagamento
- status
- vencimento
- sessão vinculada
- histórico de eventos financeiros

### Ações

- registrar pagamento
- cancelar cobrança
- abrir paciente
- abrir sessão vinculada

## 18. Registro de pagamento

### Objetivo

Permitir refletir baixa financeira quando o fluxo não vier automaticamente do gateway.

### Campos mínimos

- data de pagamento
- valor pago
- método/observação operacional

### Regras

- o fluxo manual deve coexistir com integração automática sem gerar ambiguidade
- qualquer baixa manual precisa gerar auditoria

## 19. Exportação para contador

### Objetivo

Permitir extração operacional para apoio contábil e fiscal.

### Escopo do MVP

- exportação por período
- exportação das cobranças e pagamentos

### Formatos

- CSV no MVP

### Regras

- exportação não substitui obrigação fiscal oficial
- exportação precisa respeitar escopo do tenant
- deve haver rastreabilidade de exportações sensíveis

## 20. Casos especiais

### Cobrança vinculada à sessão

- deve ter atalho para a sessão correspondente

### Cobrança sem sessão vinculada

- permitida no MVP para casos operacionais

### Convênio

- tratado como classificação
- não implica conta a receber complexa com operadora no MVP

## 21. Estados da tela

### Loading

- skeleton do resumo mensal
- skeleton da tabela

### Empty state inicial

- mensagem de que ainda não há cobranças registradas
- CTA `Nova cobrança`

### Empty state de filtro

- mensagem simples
- CTA `Limpar filtros`

### Error state

- falha ao carregar financeiro
- botão `Tentar novamente`

## 22. Dados mínimos para renderizar a tela

- chargeId
- patientSummary
- appointmentSummary
- originType
- amount
- dueAt
- status
- lastFinancialEventAt
- monthlySummary

## 23. APIs mínimas necessárias

- `GET /finance/charges`
- `GET /finance/charges/:chargeId`
- `POST /charges`
- `POST /charges/:chargeId/payments`
- `POST /charges/:chargeId/cancel`
- `GET /finance/summary`
- `GET /finance/export`

### Query params recomendados para `GET /finance/charges`

- `status`
- `originType`
- `periodStart`
- `periodEnd`
- `search`
- `page`
- `pageSize`

## 24. Eventos de produto

- `finance_loaded`
- `finance_filter_applied`
- `charge_created`
- `charge_opened`
- `charge_payment_registered`
- `charge_canceled`
- `finance_export_requested`

## 25. Critérios de aceite da Etapa 14

- o terapeuta entende rapidamente o que foi cobrado, pago e vencido
- a área financeira é operacional e clara, sem tentar resolver contabilidade inteira
- particular e convênio ficam visíveis como classificação útil
- a exportação para contador existe como apoio operacional
- a tela conecta cobrança a paciente e sessão de forma rastreável

## 26. Dependências que esta etapa destrava

- configuração de cobrança
- integração futura com gateway e fiscal
- relatórios financeiros básicos do MVP
- operação financeira diária do consultório

## 27. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/15-configuracoes.md`

## 28. Atualizacao de fase

### O que ja existe no build atual

- `GET /v1/finance/charges`
- `GET /v1/finance/charges/:chargeId`
- `GET /v1/finance/summary`
- `GET /v1/finance/export`
- `POST /v1/charges`
- `POST /v1/charges/:chargeId/payments`
- `POST /v1/charges/:chargeId/cancel`
- rota web `/app/finance`
- rota web `/app/finance/charges/:chargeId`

### Decisoes aplicadas nesta sessao

- a lista principal ja esta em modo `cobranca-first`, com resumo mensal curto e tabela operacional
- os filtros extras do MVP foram implementados em `painel lateral`, mantendo a intencao original de drawer
- o detalhe da cobranca ja centraliza contexto, historico financeiro, baixa manual e cancelamento
- `periodo` foi consolidado em select visivel com presets do MVP, em vez de datas livres na primeira versao visual

### Observacao de fase

- `GET /v1/charges` e `GET /v1/charges/:chargeId` continuam como contrato alvo historico, mas o build atual usa o prefixo operacional `finance/*` para leitura
- a exportacao atual retorna metadata da exportacao dummy para avaliacao visual; o CSV real fica para integracao posterior
