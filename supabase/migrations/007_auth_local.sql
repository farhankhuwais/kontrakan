-- Migration 007: Perbaikan skema + auth lokal (pengganti Supabase)
-- Selaraskan skema kamar dengan kode (types.ts & API)
ALTER TABLE kamar RENAME COLUMN nama TO nama_kamar;
ALTER TABLE kamar ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE kamar_foto RENAME COLUMN url TO foto_url;

-- Trigger updated_at (dari migration 001 asli)
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS kos_profile_updated_at ON kos_profile;
CREATE TRIGGER kos_profile_updated_at BEFORE UPDATE ON kos_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS kamar_updated_at ON kamar;
CREATE TRIGGER kamar_updated_at BEFORE UPDATE ON kamar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabel auth (pengganti Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Seed admin user (password default: AchiKosan#2026)
INSERT INTO admin_user (email, password_hash) VALUES (
  'admin@achi-kosan.com',
  'scrypt:524e57b5cb9251758d635415b9bf4514:ef893bca240cce5ab55a30b690999703259d75e20f8f18558667b55678b74b3ca277dfda64be5485778d2a70272725153bea9fdfb4b6a6d6f509c3d6e18e68af'
) ON CONFLICT (email) DO NOTHING;
