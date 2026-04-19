-- Add a JSONB column to store the array of ordered items.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
