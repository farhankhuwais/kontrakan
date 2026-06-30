-- Migration 002: RLS Policies for Achi Kosan
-- Run this in Supabase SQL Editor after migration 001

-- 1. kos_profile
ALTER TABLE kos_profile ENABLE ROW LEVEL SECURITY;

-- Public: boleh baca (untuk landing page)
CREATE POLICY "Public can view kos_profile"
  ON kos_profile FOR SELECT
  USING (true);

-- Authenticated admin: boleh CRUD
CREATE POLICY "Admin can manage kos_profile"
  ON kos_profile FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 2. kamar
ALTER TABLE kamar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view kamar"
  ON kamar FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage kamar"
  ON kamar FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3. kamar_foto
ALTER TABLE kamar_foto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view kamar_foto"
  ON kamar_foto FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage kamar_foto"
  ON kamar_foto FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
