-- Migration 0003: audit logs
-- Rastreabilidade LGPD — quem acessou/modificou dados de saúde, quando e de onde

CREATE TABLE IF NOT EXISTS audit_logs (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  therapist_id  TEXT        NOT NULL,
  tenant_id     TEXT        NOT NULL,
  action        TEXT        NOT NULL,   -- 'login' | 'logout' | 'read' | 'create' | 'update' | 'delete'
  resource      TEXT        NOT NULL,   -- 'patient' | 'clinical_record' | 'document' | 'appointment' | 'billing' | 'auth'
  resource_id   TEXT,                   -- ID do recurso afetado (pode ser null para listagens)
  patient_id    TEXT,                   -- ID do paciente, se aplicável
  ip_address    TEXT        NOT NULL DEFAULT '',
  user_agent    TEXT        NOT NULL DEFAULT '',
  metadata      TEXT,                   -- JSON extra (ex: campos alterados, motivo)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_therapist_created ON audit_logs(therapist_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_patient            ON audit_logs(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_resource           ON audit_logs(resource, resource_id);
