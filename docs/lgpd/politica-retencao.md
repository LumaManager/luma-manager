# Política de Retenção de Dados — Luma Manager

## Dados de conta (terapeuta)
- Mantidos enquanto a conta estiver ativa
- Após solicitação de exclusão: anonimizados em 30 dias
- Logs de acesso (audit_logs): retidos por 5 anos (obrigação legal — CFP)

## Dados de paciente
- Prontuários: retidos por 5 anos após último atendimento (Resolução CFP 01/2009)
- Após solicitação: terapeuta é responsável pela exclusão (é o controlador dos dados)
- Luma Manager (operadora) executa a exclusão técnica conforme instrução do terapeuta

## Dados financeiros
- Retidos por 5 anos (obrigação fiscal brasileira)
- CPF/CNPJ encriptados em repouso com AES-256-GCM

## Direito ao esquecimento
- Endpoint: DELETE /v1/account
- Ação: soft-delete da conta (status = "pending_deletion"), anonimização do email em 30 dias, remoção de sessões ativas
- Dados de prontuário: transferência ou deleção comunicada ao terapeuta

## Dados de sessão (IP, User-Agent)
- Retidos por 90 dias nos audit_logs
- Finalidade: segurança e detecção de fraude (legítimo interesse)

---
_Atualizado em: 2026-05-12_
