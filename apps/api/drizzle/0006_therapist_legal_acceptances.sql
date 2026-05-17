CREATE TABLE IF NOT EXISTS therapist_legal_acceptances (
  id TEXT PRIMARY KEY,
  therapist_id TEXT NOT NULL REFERENCES therapists(id),
  document_type TEXT NOT NULL,
  document_version TEXT NOT NULL DEFAULT '1.0',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS therapist_legal_acceptances_therapist_idx
  ON therapist_legal_acceptances (therapist_id);
