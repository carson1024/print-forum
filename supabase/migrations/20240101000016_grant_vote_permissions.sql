-- Migration: 20240101000016_grant_vote_permissions.sql
-- Description: Grant necessary permissions for vote table
-- Created: 2024-01-01

-- Grant permissions for vote table
GRANT ALL PRIVILEGES ON public.vote TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vote TO anon, authenticated;
