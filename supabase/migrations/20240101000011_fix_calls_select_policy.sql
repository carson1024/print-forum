-- Ensure RLS and permissive SELECT on public.calls

-- Enable Row Level Security (safe if already enabled)
ALTER TABLE IF EXISTS public.calls ENABLE ROW LEVEL SECURITY;

-- Create permissive SELECT policy if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calls'
      AND policyname = 'Anyone can view calls'
  ) THEN
    CREATE POLICY "Anyone can view calls" ON public.calls
      FOR SELECT USING (true);
  END IF;
END $$;