-- Migration 003: Storage RLS Policies for kamar-photos bucket
-- Run this AFTER creating the bucket manually in Supabase Dashboard

-- Public: boleh baca/download file dari bucket kamar-photos
CREATE POLICY "Public read kamar-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'kamar-photos');

-- Authenticated admin: boleh upload file
CREATE POLICY "Admin upload kamar-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kamar-photos'
    AND auth.role() = 'authenticated'
  );

-- Authenticated admin: boleh update file
CREATE POLICY "Admin update kamar-photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'kamar-photos'
    AND auth.role() = 'authenticated'
  );

-- Authenticated admin: boleh hapus file
CREATE POLICY "Admin delete kamar-photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'kamar-photos'
    AND auth.role() = 'authenticated'
  );
