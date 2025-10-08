-- Migration: 20240101000005_create_copytrading_tables.sql
-- Description: Create copy trading related tables
-- Created: 2024-01-01

-- Create copy_traders table for tracking copy relationships
CREATE TABLE IF NOT EXISTS public.copy_traders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    trader_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, trader_id)
);

-- Create copy_trades table for tracking copied trades
CREATE TABLE IF NOT EXISTS public.copy_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    copy_trader_id UUID NOT NULL REFERENCES public.copy_traders(id) ON DELETE CASCADE,
    call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    copied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' -- active, closed, cancelled
);

-- Create portfolios table for user portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    total_value DECIMAL(20, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_items table for portfolio holdings
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
    call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_copy_traders_follower_id ON public.copy_traders(follower_id);
CREATE INDEX IF NOT EXISTS idx_copy_traders_trader_id ON public.copy_traders(trader_id);
CREATE INDEX IF NOT EXISTS idx_copy_traders_is_active ON public.copy_traders(is_active);

CREATE INDEX IF NOT EXISTS idx_copy_trades_copy_trader_id ON public.copy_trades(copy_trader_id);
CREATE INDEX IF NOT EXISTS idx_copy_trades_call_id ON public.copy_trades(call_id);
CREATE INDEX IF NOT EXISTS idx_copy_trades_status ON public.copy_trades(status);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio_id ON public.portfolio_items(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_call_id ON public.portfolio_items(call_id);

-- Add RLS policies
ALTER TABLE public.copy_traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copy_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Copy traders policies
CREATE POLICY "Users can view own copy relationships" ON public.copy_traders
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = trader_id);

CREATE POLICY "Users can create copy relationships" ON public.copy_traders
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update own copy relationships" ON public.copy_traders
    FOR UPDATE USING (auth.uid() = follower_id);

-- Copy trades policies
CREATE POLICY "Users can view own copy trades" ON public.copy_trades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.copy_traders ct 
            WHERE ct.id = public.copy_trades.copy_trader_id 
            AND (ct.follower_id = auth.uid() OR ct.trader_id = auth.uid())
        )
    );

-- Portfolios policies
CREATE POLICY "Users can view own portfolios" ON public.portfolios
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own portfolios" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

-- Portfolio items policies
CREATE POLICY "Users can view portfolio items" ON public.portfolio_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p 
            WHERE p.id = public.portfolio_items.portfolio_id 
            AND (p.user_id = auth.uid() OR p.is_public = true)
        )
    );

CREATE POLICY "Users can manage own portfolio items" ON public.portfolio_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.portfolios p 
            WHERE p.id = public.portfolio_items.portfolio_id 
            AND p.user_id = auth.uid()
        )
    );

-- Add comments
COMMENT ON TABLE public.copy_traders IS 'Copy trading relationships between users';
COMMENT ON TABLE public.copy_trades IS 'Individual trades that have been copied';
COMMENT ON TABLE public.portfolios IS 'User portfolios for organizing calls';
COMMENT ON TABLE public.portfolio_items IS 'Items (calls) within portfolios';
