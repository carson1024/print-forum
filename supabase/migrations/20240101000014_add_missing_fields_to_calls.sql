-- Migration: 20240101000014_add_missing_fields_to_calls.sql
-- Description: Add missing display fields to calls used by frontend (image, name, symbol)
-- Created: 2024-01-01

-- Add columns if they do not exist
ALTER TABLE public.calls 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS symbol TEXT;

-- Optional: comments for clarity
COMMENT ON COLUMN public.calls.image IS 'Token/project image URL';
COMMENT ON COLUMN public.calls.name IS 'Token/project name at time of call';
COMMENT ON COLUMN public.calls.symbol IS 'Token symbol at time of call';
