-- Create comments and admincomments tables with RLS and policies

-- comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- admincomments table
CREATE TABLE IF NOT EXISTS public.admincomments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_on_comments ON public.comments;
CREATE TRIGGER set_updated_at_on_comments
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_on_admincomments ON public.admincomments;
CREATE TRIGGER set_updated_at_on_admincomments
BEFORE UPDATE ON public.admincomments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admincomments ENABLE ROW LEVEL SECURITY;

-- Policies for comments: anyone can read; owners can insert/update/delete
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own comments" ON public.comments;
CREATE POLICY "Users can insert own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for admincomments: anyone can read; only "service_role" or users with 'admin' role can write
DROP POLICY IF EXISTS "Anyone can read admincomments" ON public.admincomments;
CREATE POLICY "Anyone can read admincomments" ON public.admincomments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage admincomments" ON public.admincomments;
CREATE POLICY "Admins can manage admincomments" ON public.admincomments
  FOR ALL USING (
    auth.role() = 'service_role'
  ) WITH CHECK (
    auth.role() = 'service_role'
  );

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_comments_address ON public.comments(address);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_admincomments_address ON public.admincomments(address);


