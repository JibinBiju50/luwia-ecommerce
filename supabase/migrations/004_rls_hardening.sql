-- ============================================================
-- Luwia — RLS Hardening Migration (Storage Bucket Policies)
-- Run this in Supabase Dashboard → SQL Editor
-- NOTE: Review table policies are handled in 005_review_ownership.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- ORDERS TABLE  (already server-only — no changes needed)
-- ────────────────────────────────────────────────────────────
-- The existing USING (false) policy blocks all anon/authenticated
-- access. The service role key bypasses RLS, so server-side
-- inserts via supabaseAdmin still work fine.

-- ────────────────────────────────────────────────────────────
-- SUBSCRIBERS TABLE  (already server-only — no changes needed)
-- ────────────────────────────────────────────────────────────

-- ────────────────────────────────────────────────────────────
-- REVIEW-IMAGES STORAGE BUCKET
-- ────────────────────────────────────────────────────────────

-- Public read (images display in review cards)
DROP POLICY IF EXISTS "Review images are publicly readable" ON storage.objects;
CREATE POLICY "Review images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

-- Authenticated users can upload images
DROP POLICY IF EXISTS "Authenticated users can upload review images" ON storage.objects;
CREATE POLICY "Authenticated users can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IS NOT NULL
    AND octet_length(name) < 200
  );

-- Block public deletes
DROP POLICY IF EXISTS "No public deletes on review images" ON storage.objects;
CREATE POLICY "No public deletes on review images"
  ON storage.objects FOR DELETE
  USING (bucket_id != 'review-images');

-- Block public updates
DROP POLICY IF EXISTS "No public updates on review images" ON storage.objects;
CREATE POLICY "No public updates on review images"
  ON storage.objects FOR UPDATE
  USING (false);
