# Modelo de Dados Base

## 1. Entidades centrais

### tenant

- `id`
- `type` (`solo_practice`, `clinic_future`)
- `status`
- `plan_code`
- `country`
- `timezone`
- `created_at`

### user

- `id`
- `tenant_id`
- `email`
- `phone`
- `password_hash` ou identificador do provedor
- `mfa_enabled`
- `status`
- `last_login_at`

### role_assignment

- `id`
- `user_id`
- `tenant_id`
- `role` (`therapist`, `patient`, `internal_admin`)
- `scopes`

### therapist_profile

- `id`
- `user_id`
- `full_name`
- `crp_number`
- `tax_document`
- `banking_data_ref`
- `specialty`

### patient_profile

- `id`
- `user_id`
- `external_code`
- `full_name`
- `birth_date`
- `primary_contact`
- `guardian_contact`
- `payment_origin`
- `status`

### therapist_patient_link

- `id`
- `tenant_id`
- `therapist_profile_id`
- `patient_profile_id`
- `start_date`
- `end_date`
- `status`

## 2. Sessões e agenda

### availability_rule

- `id`
- `therapist_profile_id`
- `weekday`
- `start_time`
- `end_time`
- `mode`

### appointment

- `id`
- `tenant_id`
- `therapist_profile_id`
- `patient_profile_id`
- `scheduled_start_at`
- `scheduled_end_at`
- `mode`
- `status`
- `payment_status`
- `room_id`

### session_room

- `id`
- `appointment_id`
- `provider`
- `external_room_id`
- `room_status`
- `join_window_start_at`
- `join_window_end_at`

## 3. Conteúdo clínico

### transcript_job

- `id`
- `appointment_id`
- `provider`
- `status`
- `source_type`
- `started_at`
- `completed_at`

### transcript_document

- `id`
- `appointment_id`
- `job_id`
- `storage_ref`
- `redaction_status`
- `retention_policy_id`

### ai_draft

- `id`
- `appointment_id`
- `prompt_version`
- `provider`
- `status`
- `storage_ref`
- `generated_at`

### clinical_note

- `id`
- `patient_profile_id`
- `appointment_id`
- `author_therapist_id`
- `version`
- `status`
- `storage_ref`
- `approved_at`

## 4. Financeiro

### charge

- `id`
- `appointment_id`
- `patient_profile_id`
- `amount_cents`
- `currency`
- `origin_type`
- `status`
- `due_at`

### payment

- `id`
- `charge_id`
- `provider`
- `provider_reference`
- `status`
- `paid_at`

## 5. Documentos e consentimento

### document_template

- `id`
- `code`
- `version`
- `audience`
- `requires_signature`

### generated_document

- `id`
- `patient_profile_id`
- `template_id`
- `storage_ref`
- `status`
- `generated_at`

### consent_event

- `id`
- `patient_profile_id`
- `document_id`
- `consent_type`
- `status`
- `captured_at`
- `captured_by_user_id`

## 6. Compliance

### audit_event

- `id`
- `tenant_id`
- `actor_user_id`
- `action`
- `resource_type`
- `resource_id`
- `metadata_json`
- `occurred_at`

### retention_policy

- `id`
- `resource_type`
- `audience_type`
- `start_rule`
- `duration_rule`
- `legal_hold_supported`
- `review_required`

### legal_hold

- `id`
- `resource_type`
- `resource_id`
- `reason`
- `created_by_user_id`
- `created_at`

## 7. Relações principais

- Um `tenant` possui muitos `users`.
- Um `user` pode receber muitos `role_assignments`.
- Um `therapist_profile` pode se relacionar com muitos `patients` por meio de `therapist_patient_link`.
- Cada `appointment` pertence a um terapeuta e a um paciente.
- Cada `appointment` pode gerar um `session_room`, um `transcript_job`, um `ai_draft`, uma `clinical_note` e uma `charge`.
- Cada `patient` pode ter muitos `generated_documents`, `consent_events` e `clinical_notes`.

## 8. Regras de modelagem

- Dados clínicos não devem compartilhar tabelas genéricas com dados de operação.
- Conteúdo textual sensível deve ser armazenado por referência segura (`storage_ref`) quando o volume ou sensibilidade recomendarem separação.
- Todo recurso sujeito a retenção deve apontar para `retention_policy`.
- Todo recurso clínico sensível deve gerar `audit_event` em leitura, criação, edição e exportação.
