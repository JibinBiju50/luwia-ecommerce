-- Add product_id column to the reviews table
ALTER TABLE reviews
ADD COLUMN product_id TEXT;

-- Migrate existing data
-- Assign Shibin's review to luwia-core
UPDATE reviews
SET product_id = 'luwia-core'
WHERE reviewer_name ILIKE '%shibin%';

-- Assign all other existing reviews to luwia-prime
UPDATE reviews
SET product_id = 'luwia-prime'
WHERE product_id IS NULL;

-- Make product_id NOT NULL going forward so future reviews don't miss it
ALTER TABLE reviews
ALTER COLUMN product_id SET NOT NULL;
