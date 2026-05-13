-- Migration 0004: Row Level Security nas tabelas existentes
-- A API usa service_role (bypassa RLS) — isso não afeta o funcionamento.
-- RLS protege contra acesso via anon key ou authenticated role.
-- Tabelas de negócio (patients, appointments, etc.) receberão RLS
-- quando a migration 0001_business_tables for aplicada ao Supabase.

ALTER TABLE therapists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_secrets             ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_state        ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_entries        ENABLE ROW LEVEL SECURITY;

-- Sem policies = deny-by-default para anon/authenticated
-- Service role bypassa automaticamente
