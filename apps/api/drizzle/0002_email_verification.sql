-- Migration 0002: email verification tokens
-- Aplicar manualmente no banco Railway antes do deploy

ALTER TABLE therapists
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  therapist_id  TEXT        NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  token         TEXT        NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  used_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_evt_token        ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_evt_therapist_id ON email_verification_tokens(therapist_id);
