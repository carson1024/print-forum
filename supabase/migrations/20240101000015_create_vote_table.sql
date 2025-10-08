-- Migration: 20240101000015_create_vote_table.sql
-- Description: Create vote table for call like/dislike ratios
-- Created: 2024-01-01

-- Create vote table
CREATE TABLE IF NOT EXISTS public.vote (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_name VARCHAR(44) NOT NULL, -- matches calls.address
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  like_number INTEGER DEFAULT 0,
  dislike_number INTEGER DEFAULT 0,
  ratio INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(call_name, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vote_call_name ON public.vote(call_name);
CREATE INDEX IF NOT EXISTS idx_vote_user_id ON public.vote(user_id);

-- RLS
ALTER TABLE public.vote ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can read votes (to show ratios)
CREATE POLICY "Anyone can view votes" ON public.vote
  FOR SELECT USING (true);

-- Users can insert/update/delete their own vote rows
CREATE POLICY "Users can insert own votes" ON public.vote
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.vote
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.vote
  FOR DELETE USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE public.vote IS 'Per-user vote records for calls (like/dislike and computed ratio).';
COMMENT ON COLUMN public.vote.call_name IS 'References calls.address (not FK to allow legacy flexibility).';
