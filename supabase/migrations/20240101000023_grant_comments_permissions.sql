-- Explicit grants for comments and admincomments tables

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.comments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admincomments TO anon, authenticated;

-- Note: RLS policies still enforce row-level access


