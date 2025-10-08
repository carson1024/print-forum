-- Grant UPDATE permissions for users table to authenticated role
-- This fixes "permission denied for table users" when updating profiles

-- Grant UPDATE permission to authenticated users
GRANT UPDATE ON TABLE public.users TO authenticated;

-- Ensure the existing RLS policy allows updates
-- The policy "Users can update own profile" should already exist from migration 20240101000007
-- This just ensures the authenticated role has the necessary table-level permissions

COMMENT ON TABLE public.users IS 'User profiles with social links and achievements - authenticated users can update their own profiles';
