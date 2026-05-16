-- ============================================================
-- Luwia — Review Ownership Migration
-- Run AFTER 004_rls_hardening.sql in Supabase SQL Editor
-- ============================================================
-- What this does:
--   1. Adds user_id to reviews (nullable — existing reviews kept)
--   2. Replaces anonymous review policies with auth-required ones
--   3. Users can only edit/delete their own reviews
-- ============================================================

-- ─── Step 1: Add user_id column ──────────────────────────────
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ─── Step 2: Drop all old review policies ────────────────────
-- (from migration 001 and any from 004)
DROP POLICY IF EXISTS "Reviews are publicly readable"           ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews"               ON reviews;
DROP POLICY IF EXISTS "Allow image upload on new reviews only"  ON reviews;
DROP POLICY IF EXISTS "No public deletes on reviews"            ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews"            ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews"            ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews"  ON reviews;

-- ─── Step 3: New review policies ─────────────────────────────

-- Anyone can read reviews (public storefront)
CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (true);

-- Only signed-in users can insert, and user_id must match their session
CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND star_rating BETWEEN 1 AND 5
    AND char_length(reviewer_name) BETWEEN 1 AND 100
    AND char_length(review_text) BETWEEN 1 AND 2000
  );

-- Users can update only their own reviews (edit text/rating/images)
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()                  -- cannot transfer ownership
    AND star_rating BETWEEN 1 AND 5
  );

-- Users can delete only their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (user_id = auth.uid());
