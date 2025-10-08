-- Fix avatars storage RLS policy: match UUID prefix correctly
-- The previous policy used split_part(name, '-', 1) which fails for UUIDs
-- because UUIDs contain hyphens. Use a LIKE prefix match instead.

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;

-- Re-create policies with correct checks
CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND name LIKE auth.uid()::text || '-%'
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND name LIKE auth.uid()::text || '-%'
  );

CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND name LIKE auth.uid()::text || '-%'
  );

-- Ensure permissions remain
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;


