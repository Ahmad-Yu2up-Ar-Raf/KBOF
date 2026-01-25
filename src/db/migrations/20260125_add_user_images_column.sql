-- Add images column to user table to store JSON array of image URLs
ALTER TABLE IF EXISTS "user" ADD COLUMN IF NOT EXISTS images text DEFAULT '[]';

-- Optionally backfill `images` from `image` if present
UPDATE "user" SET images = json_build_array(image) WHERE image IS NOT NULL AND (images IS NULL OR images = '[]');
