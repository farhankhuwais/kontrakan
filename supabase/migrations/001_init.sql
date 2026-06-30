-- Migration 001: Initial schema for Achi Kosan
-- Run this in Supabase SQL Editor

-- 1. Kos Profile (single row)
CREATE TABLE kos_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kos TEXT NOT NULL DEFAULT 'Achi Kosan',
  alamat TEXT NOT NULL DEFAULT '',
  deskripsi TEXT NOT NULL DEFAULT '',
  no_whatsapp TEXT NOT NULL DEFAULT '',
  maps_embed_url TEXT,
  fasilitas JSONB NOT NULL DEFAULT '[]'::jsonb,
  foto_hero TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Kamar
CREATE TABLE kamar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kamar TEXT NOT NULL,
  harga NUMERIC(12, 0) NOT NULL DEFAULT 0,
  deskripsi TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'penuh')),
  urutan INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Kamar Foto
CREATE TABLE kamar_foto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kamar_id UUID NOT NULL REFERENCES kamar(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  urutan INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_kamar_urutan ON kamar(urutan);
CREATE INDEX idx_kamar_visible ON kamar(is_visible);
CREATE INDEX idx_kamar_foto_kamar ON kamar_foto(kamar_id);
CREATE INDEX idx_kamar_foto_urutan ON kamar_foto(urutan);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kos_profile_updated_at
  BEFORE UPDATE ON kos_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER kamar_updated_at
  BEFORE UPDATE ON kamar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for kamar photos
-- Run this separately in Supabase Dashboard > Storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('kamar-photos', 'kamar-photos', true);
