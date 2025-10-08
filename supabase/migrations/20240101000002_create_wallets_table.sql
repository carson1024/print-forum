-- Migration: 20240101000002_create_wallets_table.sql
-- Description: Create wallets table for storing user wallets with encrypted private keys
-- Created: 2024-01-01

-- Create wallets table for storing user wallets
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    public_key VARCHAR(44) NOT NULL UNIQUE,
    private_key_encoded TEXT NOT NULL,
    wallet_name VARCHAR(100) DEFAULT 'Main Wallet',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deactivated_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for wallets table
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_public_key ON public.wallets(public_key);
CREATE INDEX IF NOT EXISTS idx_wallets_is_active ON public.wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_wallets_created_at ON public.wallets(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own wallets
CREATE POLICY "Users can view own wallets" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own wallets
CREATE POLICY "Users can insert own wallets" ON public.wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own wallets
CREATE POLICY "Users can update own wallets" ON public.wallets
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own wallets
CREATE POLICY "Users can delete own wallets" ON public.wallets
    FOR DELETE USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE public.wallets IS 'Stores user wallet information with encrypted private keys';
COMMENT ON COLUMN public.wallets.public_key IS 'Solana wallet public key (base58 encoded)';
COMMENT ON COLUMN public.wallets.private_key_encoded IS 'Encrypted private key (AES encrypted)';
COMMENT ON COLUMN public.wallets.wallet_name IS 'User-defined wallet name';
COMMENT ON COLUMN public.wallets.is_active IS 'Whether the wallet is currently active';
COMMENT ON COLUMN public.wallets.deactivated_at IS 'Timestamp when wallet was deactivated';
