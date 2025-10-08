-- Fix notifications table permissions
-- Ensure authenticated users can insert notifications

-- Grant INSERT permission specifically for notifications table
GRANT INSERT ON TABLE public.notifications TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;