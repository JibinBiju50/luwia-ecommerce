-- ============================================================
-- Luwia — Make review_text optional
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================
-- The previous INSERT policy required char_length(review_text)
-- BETWEEN 1 AND 2000, forcing a non-empty review body.
-- We now allow empty text so users can submit a star-only rating.
-- ============================================================

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;

-- Re-create with review_text length check starting at 0
CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND star_rating BETWEEN 1 AND 5
    AND char_length(reviewer_name) BETWEEN 1 AND 100
    AND char_length(review_text) BETWEEN 0 AND 2000
  );
