# Web do Terapeuta - Etapa 13 - Documentos e Consentimentos

## 1. Objetivo

Definir de forma fechada a área de `documentos e consentimentos` no web admin do terapeuta, cobrindo:

- biblioteca documental do produto
- documentos por paciente
- estados de assinatura
- consentimentos vinculados aos documentos
- pendências críticas e bloqueios operacionais
- rastreabilidade de geração, envio, aceite e revogação

## 2. Papel da tela no produto

Esta tela é a `superfície operacional de compliance documental`.

Ela precisa responder rapidamente:

1. quais documentos existem e para quem foram gerados?
2. quais pacientes têm pendência de assinatura?
3. qual consentimento está válido, pendente ou revogado?
4. o que bloqueia atendimento, transcript ou operação?
5. como reenviar, gerar ou abrir o documento correto?

## 3. Escopo desta etapa

### Dentro do escopo

- lista de documentos
- filtros por paciente, status e tipo
- status de assinatura
- vínculo com consentimentos
- geração e reenvio de documentos
- visualização de pendências

### Fora do escopo

- editor avançado de templates próprios
- gestão jurídica completa de bases legais
- assinatura fora do fluxo do provedor escolhido
- exportação massiva
- documentos clínicos narrativos do prontuário

## 4. Decisões travadas nesta etapa

- a rota principal será `/app/documents`
- a área será uma `lista operacional`, não repositório genérico de arquivos
- o foco do MVP será em `documentos regulatórios e operacionais`
- consentimento sempre aparece vinculado ao documento que o originou
- o sistema trabalhará com `modelos padrão da plataforma` no MVP
- a geração de documento acontece por paciente e por contexto operacional
- pendências documentais críticas ficam destacadas e precisam ser visíveis antes da sessão
- revogação de consentimento deve ser rastreável, mesmo quando o efeito operacional depender de política posterior

## 5. Rota e permissão

### Rotas

- `/app/documents`
- `/app/documents/:documentId`

### Permissão

- terapeuta autenticado

### Regra crítica

- o terapeuta só pode acessar documentos do seu próprio tenant e dos seus pacientes vinculados
- admin interno não usa esta superfície para ler conteúdo clínico

## 6. Tipos documentais do MVP

### Tipos mínimos

- termo LGPD do paciente
- termo de teleatendimento
- termo de transcript e IA
- contrato terapêutico
- comprovantes e documentos operacionais relacionados

### Fora do escopo do MVP

- laudos
- atestados
- relatórios clínicos externos
- formulários altamente customizados por clínica

## 7. Estrutura geral da tela

Esta tela usa o `Template B: Lista com detalhe por navegação`.

Estrutura final:

1. título e contexto
2. CTAs principais
3. faixa de filtros
4. tabela de documentos
5. paginação

## 8. Cabeçalho da página

### Título

- `Documentos`

### Subtítulo

- frase curta explicando que a área centraliza documentos e consentimentos operacionais do consultório

Exemplo:

- `Acompanhe assinaturas, consentimentos e pendências documentais dos pacientes.`

### Ações primárias

- `Gerar documento`
- `Ver pendências críticas`

### Ações secundárias

- nenhuma no MVP

## 9. Modelo documental

Cada item da lista representa um `documento gerado` para um paciente ou contexto específico.

### Campos principais do item

- paciente
- tipo documental
- versão do template
- status de assinatura
- status do consentimento relacionado
- data de geração
- data do último envio/assinatura

## 10. Estados de assinatura

### Estados do MVP

- `Não enviado`
- `Pendente`
- `Assinado`
- `Expirado`
- `Revogado`

### Regras

- `Revogado` não apaga histórico
- `Expirado` indica necessidade de novo envio ou nova geração
- assinatura e consentimento não são sinônimos perfeitos, mas no MVP caminham juntos em muitos casos

## 11. Estados de consentimento

### Estados do MVP

- `Válido`
- `Pendente`
- `Revogado`
- `Não aplicável`

### Regra

- um consentimento deve estar sempre vinculado ao documento/versionamento que foi apresentado
- revogação deve registrar data, ator e motivo operacional quando existir

## 12. Filtros da tela

### Filtros visíveis

- paciente
- tipo documental
- status de assinatura
- status de consentimento

### Busca local

Deve buscar por:

- nome do paciente
- código do documento, se existir
- tipo documental

### Filtros adicionais em drawer

- apenas críticos
- apenas da semana
- apenas revogados

### Regras

- filtros ativos viram chips
- deve existir botão `Limpar filtros`

## 13. Tabela principal

### Colunas obrigatórias

1. `Paciente`
2. `Documento`
3. `Assinatura`
4. `Consentimento`
5. `Atualização`

### Coluna 1 - Paciente

- nome completo
- atalho para ficha do paciente

### Coluna 2 - Documento

- tipo documental
- versão
- data de geração

### Coluna 3 - Assinatura

- badge de status

### Coluna 4 - Consentimento

- badge de status

### Coluna 5 - Atualização

- data do último evento relevante
- exemplo: enviado, assinado, revogado

## 14. Priorização visual

### Ordem de destaque

1. documentos críticos pendentes
2. documentos revogados
3. documentos expirados
4. pendentes comuns
5. assinados válidos

### Regra

- o objetivo é destacar o que pode bloquear sessão, transcript ou operação

## 15. Interações por linha

### Comportamento principal

- clique na linha abre `/app/documents/:documentId`

### Ações rápidas por linha

- abrir documento
- reenviar para assinatura
- abrir paciente
- gerar nova versão, se aplicável

### Regras

- ações destrutivas ou de revogação exigem confirmação
- não permitir edição inline de conteúdo do documento no MVP

## 16. Geração de documento

### Forma

- `drawer` ou modal guiado

### Campos mínimos

- paciente
- tipo documental
- versão padrão
- canal de envio

### Regras

- no MVP, o terapeuta escolhe a partir de modelos padrão da plataforma
- o sistema deve registrar qual versão foi usada
- geração pode ser automática em pontos específicos do fluxo, mas a área de documentos precisa permitir geração manual também

## 17. Reenvio e assinatura

### Reenvio

- permitido para documentos pendentes ou expirados

### Canais

- e-mail no MVP
- outros canais ficam para evolução posterior

### Regras

- cada envio gera trilha de auditoria
- o terapeuta deve conseguir saber se o documento foi reenviado e quando

## 18. Tela de detalhe do documento

### Objetivo

Mostrar o estado completo do documento sem virar biblioteca jurídica complexa.

### Conteúdo

- paciente
- tipo documental
- versão
- conteúdo visualizado ou referência ao arquivo
- histórico de eventos
- status de assinatura
- status de consentimento

### Ações

- reenviar
- abrir paciente
- gerar nova versão

## 19. Pendências críticas

### Objetivo

Destacar documentos cujo estado impacta diretamente operação clínica.

### Exemplos críticos

- teleatendimento não aceito
- transcript/IA não aceito para sessão que depende desse fluxo
- termo obrigatório expirado ou revogado

### Regras

- pendências críticas devem aparecer nesta área e também em contexto na ficha do paciente, detalhe da sessão e dashboard

## 20. Casos especiais

### Menor de idade

- o documento deve ficar vinculado ao responsável legal quando aplicável
- a interface deve deixar claro quem assinou

### Consentimento revogado

- o documento continua histórico
- o estado operacional muda para `Revogado`
- superfícies dependentes precisam refletir a consequência dessa revogação

### Documento expirado

- não apagar histórico
- indicar necessidade de renovação

## 21. Estados da tela

### Loading

- skeleton do cabeçalho
- skeleton da tabela

### Empty state inicial

- mensagem de que ainda não há documentos gerados
- CTA `Gerar primeiro documento`

### Empty state de filtro

- mensagem simples
- CTA `Limpar filtros`

### Error state

- falha ao carregar documentos
- botão `Tentar novamente`

## 22. Dados mínimos para renderizar a tela

- documentId
- patientSummary
- documentType
- templateVersion
- signatureStatus
- consentStatus
- generatedAt
- lastEventAt
- criticality

## 23. APIs mínimas necessárias

- `GET /documents`
- `GET /documents/:documentId`
- `POST /documents`
- `POST /documents/:documentId/sign`
- `POST /documents/:documentId/resend`
- `POST /documents/:documentId/revoke`

### Query params recomendados para `GET /documents`

- `patientId`
- `documentType`
- `signatureStatus`
- `consentStatus`
- `criticality`
- `search`
- `page`
- `pageSize`

## 24. Eventos de produto

- `documents_list_loaded`
- `documents_filter_applied`
- `document_opened`
- `document_generated`
- `document_resent`
- `document_revoked`

## 25. Critérios de aceite da Etapa 13

- o terapeuta entende rapidamente quais documentos estão pendentes ou críticos
- assinatura e consentimento ficam visíveis como estados distintos, mas relacionados
- a área centraliza geração, reenvio e acompanhamento de documentos
- pendências críticas aparecem de forma operacional e acionável
- toda ação relevante fica rastreável

## 26. Dependências que esta etapa destrava

- financeiro com contexto documental
- bloqueios operacionais por consentimento
- experiência documental do paciente
- governança de assinatura e revogação no MVP

## 27. Próximo documento a criar

Depois desta etapa, o próximo documento deve ser:

- `web/telas/14-financeiro.md`

## 28. Atualizacao de fase

### O que ja existe no build atual

- `GET /v1/documents`
- `POST /v1/documents`
- `GET /v1/documents/:documentId`
- `POST /v1/documents/:documentId/resend`
- `POST /v1/documents/:documentId/revoke`
- `POST /v1/documents/:documentId/sign`
- rota web `/app/documents`
- rota web `/app/documents/:documentId`

### Decisao aplicada nesta sessao

- os filtros adicionais do MVP foram implementados em `painel lateral`, mantendo a intencao original de drawer
- a geracao manual de documento foi implementada em `drawer lateral`
- a lista principal ja segue o modelo `lista-first`, com destaque visual para itens criticos, expirados e revogados
- o detalhe do documento ja centraliza contexto, preview resumido, impactos operacionais e trilha de eventos

### Observacao de fase

- `sign` existe como mutacao dummy de apoio visual e de QA, para acelerar avaliacao das transicoes de estado sem depender do portal do paciente
- o conteudo exibido no detalhe continua sendo `preview resumido`, nao editor juridico inline
