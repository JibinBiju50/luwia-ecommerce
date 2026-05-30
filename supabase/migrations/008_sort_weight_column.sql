-- ============================================================
-- Luwia — Add sort_weight generated column to reviews
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================
-- Adds a STORED generated column that auto-computes sort priority:
--   0 = review has text AND images  (shown first)
--   1 = review has text only        (shown second)
--   2 = rating only, no text        (shown last)
--
-- This lets us ORDER BY sort_weight at the DB level so every
-- paginated query respects the priority without client sorting.
-- ============================================================

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS sort_weight SMALLINT GENERATED ALWAYS AS (
  CASE
    WHEN COALESCE(array_length(image_urls, 1), 0) > 0
      AND char_length(COALESCE(review_text, '')) > 0 THEN 0
    WHEN char_length(COALESCE(review_text, '')) > 0 THEN 1
    ELSE 2
  END
) STORED;

-- Composite index: product → sort_weight → newest first
-- Makes paginated queries very fast even with 500+ reviews
CREATE INDEX IF NOT EXISTS idx_reviews_paginate
ON reviews (product_id, sort_weight ASC, created_at DESC);
