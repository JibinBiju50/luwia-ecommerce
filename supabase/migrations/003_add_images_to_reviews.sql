-- ================================================
-- Add image_urls column to reviews table
-- Run this SQL in your Supabase SQL Editor
-- ================================================

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';
