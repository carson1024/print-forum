-- Enable RLS and add permissive read policy for public.users
-- This allows selecting related user rows via joins like users(*)

-- Enable Row Level Security on users table (idempotent)
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Create a permissive SELECT policy for everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Anyone can view users'
  ) THEN
    CREATE POLICY "Anyone can view users" ON public.users
      FOR SELECT USING (true);
  END IF;
END $$;

-- Optionally, tighten later to authenticated-only by replacing USING (true) with (auth.role() = 'authenticated')


