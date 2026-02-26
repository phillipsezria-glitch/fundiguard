-- Migration: Add Clerk authentication support
-- Date: 2026-02-26
-- Purpose: Update users table to work with Clerk authentication

-- Add clerk_user_id column (unique identifier from Clerk)
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) UNIQUE;

-- Create index for fast lookups by clerk_user_id
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Make phone_number optional (Clerk provides email/auth, phone is still needed for M-Pesa)
ALTER TABLE users ALTER COLUMN phone_number DROP NOT NULL;

-- Make password_hash optional (Clerk manages passwords)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add profile_image and status columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted'));

-- Create index for status to find active users quickly
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Ensure email is unique (Clerk will manage unique emails)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;

-- Add trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_users_timestamp();

-- ==================== MIGRATION COMPLETE ====================
-- Users table is now compatible with Clerk authentication
-- Key changes:
-- 1. clerk_user_id: Primary identifier from Clerk
-- 2. phone_number: Still required for M-Pesa/escrow, but optional for auth
-- 3. password_hash: No longer required (Clerk manages auth)
-- 4. email: Unique, sourced from Clerk
-- 5. All existing data remains intact
