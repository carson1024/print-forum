-- Create favourites table to store user-to-user favorites

CREATE TABLE IF NOT EXISTS public.favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- who favorites
  target_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- favorited trader
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON public.favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_target_user_id ON public.favourites(target_user_id);

-- Enable RLS
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own favourites" ON public.favourites;
CREATE POLICY "Users can view own favourites" ON public.favourites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create favourites for self" ON public.favourites;
CREATE POLICY "Users can create favourites for self" ON public.favourites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favourites" ON public.favourites;
CREATE POLICY "Users can delete own favourites" ON public.favourites
  FOR DELETE USING (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, DELETE ON public.favourites TO anon, authenticated;

-- Additional explicit grants to ensure permissions are properly set
GRANT ALL ON public.favourites TO authenticated;
GRANT SELECT ON public.favourites TO anon;


