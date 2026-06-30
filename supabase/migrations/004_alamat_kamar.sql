-- Migration 004: Add alamat + maps_url per kamar
ALTER TABLE kamar ADD COLUMN IF NOT EXISTS alamat TEXT NOT NULL DEFAULT '';
ALTER TABLE kamar ADD COLUMN IF NOT EXISTS maps_url TEXT;
