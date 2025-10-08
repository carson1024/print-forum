-- Grant all table permissions to anon and authenticated roles
-- This provides comprehensive access similar to the existing SELECT grant

-- Grant all permissions (SELECT, INSERT, UPDATE, DELETE) to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- This replaces the previous limited SELECT-only grants and provides full access
-- RLS policies will still control what users can actually do with their permissions

COMMENT ON SCHEMA public IS 'Public schema with full permissions for anon and authenticated roles, controlled by RLS policies';
