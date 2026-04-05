# Segurança e Compliance

## 1. Postura geral

O produto deve ser construído como plataforma de dados sensíveis de saúde, com proteção reforçada em identidade, criptografia, autorização, rastreabilidade e retenção. O objetivo é impedir acesso indevido, reduzir exposição operacional e provar governança em auditorias.

## 2. Bases de conformidade que orientam o desenho

- LGPD: tratamento de dados pessoais sensíveis de saúde.
- Regras e ética profissional aplicáveis aos psicólogos e ao atendimento mediado por tecnologias digitais.
- Retenção documental compatível com a política jurídica validada para prontuário e documentos associados.

Observação: as regras exatas de guarda por faixa etária devem ser revisadas pelo jurídico antes do go-live. O sistema deve suportar políticas configuráveis sem reescrever código.

## 3. Classificação de dados

### Classe A: identidade e operação

- nome
- contato
- agenda
- cobrança
- status de pagamento

### Classe B: documentos regulatórios

- termos
- consentimentos
- assinaturas
- comprovantes

### Classe C: conteúdo clínico

- transcript
- rascunho IA
- prontuário
- histórico clínico

Classes B e C exigem trilha de auditoria reforçada. Classe C exige isolamento máximo.

## 4. Controles obrigatórios

### Autenticação e acesso

- MFA obrigatório para terapeuta e admin.
- Sessões com expiração curta e refresh token rotativo.
- Revogação de sessão e de dispositivo.
- Rate limit e proteção contra brute force.
- RBAC + ABAC por vínculo terapeuta-paciente.

### Criptografia

- TLS para todo tráfego.
- Criptografia em repouso para banco e storage.
- KMS com rotação de chaves.
- Segregação de chaves por ambiente e, quando viável, por tenant.

### Logs e auditoria

- Evento auditável para leitura de prontuário, transcript, documentos, exportações e mudanças de política.
- Logs imutáveis e centralizados.
- Conteúdo clínico não deve ser replicado em logs de aplicação.

### Ambientes e segredos

- Segredos fora do código.
- Ambientes separados.
- Acesso de produção por menor privilégio.
- Administração privilegiada com registro e justificativa.

## 5. Consentimento

Consentimentos devem ser:

- explícitos
- versionados
- vinculados ao documento exibido
- com trilha de aceite
- revogáveis quando juridicamente aplicável

Consentimentos mínimos do produto:

- uso da plataforma
- teleatendimento
- transcript da sessão
- uso de IA como apoio ao terapeuta
- ciência sobre política de privacidade e retenção

Para menores de idade:

- vínculo com responsável legal
- assinatura pelo responsável
- política específica de acesso e retenção

## 6. Teleatendimento e transcript

### Princípios

- A sessão deve ocorrer em sala efêmera, atrelada a uma consulta agendada.
- O transcript deve ser gerado sob consentimento explícito.
- O rascunho da IA nunca substitui o registro profissional.
- Armazenamento de mídia bruta deve ser evitado como padrão do MVP.

### Pipeline seguro

1. Encerramento da sessão dispara job.
2. Transcript é processado em pipeline restrito.
3. Identificadores desnecessários são minimizados quando possível.
4. Rascunho IA é gerado com contrato sem treino sobre dados.
5. Saída é marcada como `draft`.
6. Terapeuta aprova ou descarta.

## 7. Retenção e descarte

### O sistema deve suportar

- políticas por tipo de dado
- políticas por faixa etária
- gatilho de início da contagem
- suspensão por legal hold
- revisão manual antes do descarte
- registro integral do descarte

### Defaults operacionais sugeridos

- prontuário final: regra configurável com baseline mínimo de 5 anos
- transcript bruto: retenção curta e separada do prontuário
- consentimentos e contratos: retenção longa e vinculada à relação contratual
- logs de auditoria: retenção estendida

### Importante

Não hardcode a regra "10 anos para crianças" como verdade universal no produto. Implemente uma policy engine configurável e formalize o valor final depois da validação jurídica.

## 8. Direitos do titular e governança

O produto deve prever:

- canal para solicitações do titular
- exportação de dados autorizados
- correção cadastral
- revogação de consentimentos quando aplicável
- registro do tratamento
- RIPD/DPIA
- inventário de suboperadores

## 9. Segurança de fornecedores

Todo fornecedor que toque dados do produto deve passar por avaliação mínima:

- termos contratuais de privacidade
- retenção de dados
- uso para treinamento
- localização e transferência internacional
- criptografia
- disponibilidade
- trilhas de auditoria

Fornecedores críticos:

- vídeo
- transcript
- LLM
- pagamento
- assinatura eletrônica

## 10. Operação e incidentes

### DevSecOps mínimo

- SAST e análise de dependências no CI
- varredura de containers, se aplicável
- rotação periódica de chaves
- revisão de permissões
- backups testados
- plano de desastre

### Resposta a incidentes

- classificação
- contenção
- investigação
- comunicação
- evidências
- lições aprendidas

## 11. Critérios de segurança para beta privado

- MFA ativo para perfis críticos
- trilha de auditoria funcionando para conteúdo clínico
- consentimentos versionados
- retenção configurável habilitada
- exportação e descarte protegidos por workflow
- fornecedores críticos contratualmente aprovados
