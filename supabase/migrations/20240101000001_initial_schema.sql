-- Migration: 20240101000001_initial_schema.sql
-- Description: Initial database schema setup
-- Created: 2024-01-01

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 1,
    winrate INTEGER DEFAULT 0,
    callcount INTEGER DEFAULT 0,
    weekrate INTEGER DEFAULT 0,
    monthrate INTEGER DEFAULT 0,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_xp ON public.users(xp DESC);
CREATE INDEX IF NOT EXISTS idx_users_rank ON public.users(rank DESC);

-- Add comments
COMMENT ON TABLE public.users IS 'User accounts and profile information';
COMMENT ON COLUMN public.users.xp IS 'Experience points for ranking system';
COMMENT ON COLUMN public.users.rank IS 'User rank based on XP';
COMMENT ON COLUMN public.users.winrate IS 'Percentage of successful calls';
COMMENT ON COLUMN public.users.achievements IS 'JSON array of user achievements';
