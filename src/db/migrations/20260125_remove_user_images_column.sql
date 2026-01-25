-- Remove images column from user table (revert to single image column)
ALTER TABLE IF EXISTS "user" DROP COLUMN IF EXISTS images;
