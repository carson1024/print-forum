-- Migration: 20240101000003_create_calls_table.sql
-- Description: Create calls table for trading calls and predictions
-- Created: 2024-01-01

-- Create calls table for trading calls
CREATE TABLE IF NOT EXISTS public.calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_address VARCHAR(44) NOT NULL,
    token_name VARCHAR(100),
    token_symbol VARCHAR(20),
    price DECIMAL(20, 8) NOT NULL,
    supply BIGINT NOT NULL,
    decimals INTEGER NOT NULL,
    init_market_cap DECIMAL(20, 2) NOT NULL,
    changed_price DECIMAL(20, 8),
    changed_cap DECIMAL(20, 2),
    percentage DECIMAL(5, 2),
    featured INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    add_xp INTEGER DEFAULT 0,
    xp_check INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for calls table
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON public.calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_token_address ON public.calls(token_address);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_is_featured ON public.calls(is_featured);
CREATE INDEX IF NOT EXISTS idx_calls_featured ON public.calls(featured DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all calls
CREATE POLICY "Anyone can view calls" ON public.calls
    FOR SELECT USING (true);

-- Policy: Users can insert their own calls
CREATE POLICY "Users can insert own calls" ON public.calls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own calls
CREATE POLICY "Users can update own calls" ON public.calls
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own calls
CREATE POLICY "Users can delete own calls" ON public.calls
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE public.calls IS 'Trading calls and predictions made by users';
COMMENT ON COLUMN public.calls.token_address IS 'Solana token contract address';
COMMENT ON COLUMN public.calls.price IS 'Token price at time of call';
COMMENT ON COLUMN public.calls.supply IS 'Total token supply';
COMMENT ON COLUMN public.calls.init_market_cap IS 'Initial market capitalization';
COMMENT ON COLUMN public.calls.featured IS 'Featured multiplier (2x, 5x, 10x, etc.)';
COMMENT ON COLUMN public.calls.is_featured IS 'Whether the call achieved featured status';
COMMENT ON COLUMN public.calls.add_xp IS 'XP points to add/remove for this call';
COMMENT ON COLUMN public.calls.xp_check IS 'Whether XP has been processed for this call';
