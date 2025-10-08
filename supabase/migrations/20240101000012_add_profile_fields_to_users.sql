-- Migration: 20240101000012_add_profile_fields_to_users.sql
-- Description: Add missing profile fields to users table
-- Created: 2024-01-01

-- Add missing profile fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS xaddress TEXT,
ADD COLUMN IF NOT EXISTS taddress TEXT,
ADD COLUMN IF NOT EXISTS saddress TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_users_xaddress ON public.users(xaddress) WHERE xaddress IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_taddress ON public.users(taddress) WHERE taddress IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_saddress ON public.users(saddress) WHERE saddress IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.users.xaddress IS 'X (Twitter) address/username';
COMMENT ON COLUMN public.users.taddress IS 'Telegram address/username';
COMMENT ON COLUMN public.users.saddress IS 'Solana wallet address';
COMMENT ON COLUMN public.users.bio IS 'User bio/description';
