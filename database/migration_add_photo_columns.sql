-- Migration: Add photo columns for image uploads
-- Date: February 24, 2026
-- Purpose: Add support for all 4 image upload features (jobs, completion, disputes, profile)
-- Run this in Supabase SQL Editor

-- 1. Profile photos in users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

COMMENT ON COLUMN users.profile_photo_url IS 'User profile picture URL from Supabase Storage';

-- 2. Job photos in jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS photos JSONB;

COMMENT ON COLUMN jobs.photos IS 'Array of job photo URLs uploaded by client (max 5 photos)';

-- 3. Completion photos in bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS completion_photos JSONB;

COMMENT ON COLUMN bookings.completion_photos IS 'Array of completion proof photos uploaded by fundi (max 5 photos)';

-- 4. Dispute evidence in disputes table
ALTER TABLE disputes 
ADD COLUMN IF NOT EXISTS evidence_files JSONB;

COMMENT ON COLUMN disputes.evidence_files IS 'Array of dispute evidence photo URLs (max 10 photos)';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_profile_photo ON users(profile_photo_url) WHERE profile_photo_url IS NOT NULL;

-- Verify migration
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('users', 'jobs', 'bookings', 'disputes')
AND column_name IN ('profile_photo_url', 'photos', 'completion_photos', 'evidence_files')
ORDER BY table_name, ordinal_position;
