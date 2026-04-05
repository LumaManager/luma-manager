# Gates Jurídicos para Go-Live

Sem estes gates, o produto não deveria entrar em produção no Brasil.

## Gate 1: fechar o enquadramento da empresa

Pergunta:

- a empresa é `plataforma SaaS` ou `prestadora de serviços de Psicologia`?

Precisamos travar:

- contrato
- site institucional
- material de vendas
- onboarding
- papel operacional da empresa

Se a resposta se aproximar de `prestadora de serviços de Psicologia`, revisar impacto de:

- registro/cadastro de PJ no CRP
- responsável técnica(o)
- governança clínica institucional

## Gate 2: fechar mapa de agentes de tratamento

Precisamos definir por fluxo:

- quem é controlador
- quem é operador
- quando a plataforma atua como controladora independente
- se existe algum cenário de controladoria conjunta

Isso deve cobrir:

- prontuário
- teleatendimento
- transcript
- IA
- billing
- suporte
- analytics
- antifraude

## Gate 3: parecer específico sobre áudio e transcrição

Perguntas mínimas:

- o fluxo de áudio é defensável juridicamente?
- qual base legal sustenta esse tratamento?
- consentimento precisa ser destacado, específico e separado?
- em quais contextos o áudio deve ser desabilitado?
- qual retenção é admissível para áudio bruto e transcript bruto?

## Gate 4: política de retenção e descarte

Precisamos travar:

- prontuário oficial
- registro auxiliar
- transcript bruto
- áudio bruto
- documentos assinados
- logs de auditoria
- backups

Ponto fechado por fonte oficial:

- registro documental e prontuário têm guarda mínima de `5 anos`, com possibilidade de ampliação

Ponto ainda aberto:

- política exata para transcript bruto, áudio bruto e casos de menores

## Gate 5: fornecedores e transferência internacional

Antes do go-live:

- listar todos os suboperadores
- definir país de processamento e armazenamento
- validar mecanismo de transferência internacional
- revisar DPA e cláusulas contratuais
- bloquear treino em dados do cliente
- definir retenção e deleção

## Gate 6: pacote documental LGPD

Mínimos esperados:

- política de privacidade
- termos de uso
- contrato com terapeuta
- DPA
- inventário de dados
- mapa de bases legais
- RIPD/DPIA
- política de retenção e descarte
- política de resposta a incidentes
- fluxo de direitos dos titulares

## Gate 7: revisão de interface e consentimentos

Precisamos revisar juridicamente:

- onboarding do terapeuta
- onboarding do paciente
- termos de teleatendimento
- textos sobre IA
- textos sobre áudio/transcrição
- fluxos de menores e responsáveis

## Gate 8: revisão de segurança mínima

Sem isso, a tese de licitude fica tecnicamente fraca:

- segregação entre dado clínico e dado operacional
- criptografia em trânsito e em repouso
- MFA para terapeuta e admin interno
- trilha de auditoria
- controles de exportação
- runbook de incidentes
- backups testados

## Gate 9: revisão de claims do produto

Antes de publicar site e demo:

- revisar claims de marketing
- retirar linguagem de diagnóstico ou conduta
- reforçar caráter assistivo da IA
- evitar linguagem que reclassifique o produto como decisão clínica automatizada

## Gate 10: validação com pilotos reais

Antes do rollout mais amplo:

- coletar o texto exato dos termos assinados por terapeutas piloto
- validar se clínicas, serviços-escola ou contratantes proíbem áudio
- documentar cenários em que a feature deve ser desligada

## Fechamento

Se todos os gates acima estiverem fechados, o produto ainda não ganha blindagem absoluta.

Mas passa a ter:

- tese jurídica mais robusta
- postura regulatória defensável
- muito menos chance de construir em cima de suposições frágeis
