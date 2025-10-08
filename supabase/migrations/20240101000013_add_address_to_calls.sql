-- Migration: 20240101000013_add_address_to_calls.sql
-- Description: Add missing address column to calls table
-- Created: 2024-01-01

-- Add address column to calls table
ALTER TABLE public.calls 
ADD COLUMN IF NOT EXISTS address VARCHAR(44);

-- Add index for the new address column
CREATE INDEX IF NOT EXISTS idx_calls_address ON public.calls(address);

-- Add comment for documentation
COMMENT ON COLUMN public.calls.address IS 'Token pair address (used for duplicate checking)';
