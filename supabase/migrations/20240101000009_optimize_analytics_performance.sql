-- Optimize analytics performance with indexes and RPC functions
-- This migration adds database-side functions to handle analytics processing efficiently

-- 1) Create indexes for better query performance
CREATE INDEX IF NOT EXISTS calls_user_created_idx
  ON public.calls (user_id, created_at);

CREATE INDEX IF NOT EXISTS calls_user_featured_created_idx
  ON public.calls (user_id, is_featured, created_at);

-- Note: Partial index with time-based predicate removed due to IMMUTABLE requirement
-- Consider using a regular index on created_at for recent queries
CREATE INDEX IF NOT EXISTS calls_created_at_idx
  ON public.calls (created_at);

-- 2) Win rates (week/month/total) — single statement
CREATE OR REPLACE FUNCTION public.update_user_win_rates()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH agg AS (
    SELECT
      user_id,
      count(*)                                                     AS total_calls,
      count(*) FILTER (WHERE is_featured)                          AS total_wins,
      count(*) FILTER (WHERE created_at >= now() - interval '30 days')                                AS month_calls,
      count(*) FILTER (WHERE is_featured AND created_at >= now() - interval '30 days')                 AS month_wins,
      count(*) FILTER (WHERE created_at >= now() - interval '7 days')                                  AS week_calls,
      count(*) FILTER (WHERE is_featured AND created_at >= now() - interval '7 days')                  AS week_wins
    FROM public.calls
    GROUP BY user_id
  )
  UPDATE public.users u
  SET
    winrate   = coalesce(ceil((a.total_wins::numeric * 100) / nullif(a.total_calls, 0)), 0)::int,
    monthrate = coalesce(ceil((a.month_wins::numeric * 100) / nullif(a.month_calls, 0)), 0)::int,
    weekrate  = coalesce(ceil((a.week_wins::numeric  * 100) / nullif(a.week_calls,  0)), 0)::int
  FROM agg a
  WHERE u.id = a.user_id;

  UPDATE public.users u
  SET winrate = 0, monthrate = 0, weekrate = 0
  WHERE NOT EXISTS (SELECT 1 FROM public.calls c WHERE c.user_id = u.id);
$$;

-- 3) Rank updates (from XP) + notifications + achievements (set-based)
-- Assumes users.achievements is text[]. Adjust if it's jsonb.
CREATE OR REPLACE FUNCTION public.update_ranks_from_xp()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH ranked AS (
    SELECT
      id AS user_id,
      xp,
      CASE
        WHEN xp >= 364 THEN 10
        WHEN xp >= 292 THEN 9
        WHEN xp >= 244 THEN 8
        WHEN xp >= 184 THEN 7
        WHEN xp >= 144 THEN 6
        WHEN xp >= 104 THEN 5
        WHEN xp >=  72 THEN 4
        WHEN xp >=  44 THEN 3
        WHEN xp >=  20 THEN 2
        ELSE 1
      END AS new_rank
    FROM public.users
  ),
  changed AS (
    SELECT u.id, u.rank AS old_rank, r.new_rank
    FROM public.users u
    JOIN ranked r ON r.user_id = u.id
    WHERE coalesce(u.rank, 0) <> r.new_rank
  ),
  upd AS (
    UPDATE public.users u
    SET rank = c.new_rank,
        achievements = coalesce(achievements, '[]'::jsonb) || jsonb_build_array(c.new_rank::text || 'x')
    FROM changed c
    WHERE u.id = c.id
    RETURNING u.id, c.new_rank
  )
  INSERT INTO public.notifications (user_id, type, title, value, content)
  SELECT
    id,
    'rankup',
    'Rank' || new_rank || ' reached',
    new_rank::text,
    'Congratulations! You reached Rank' || new_rank || '.'
  FROM upd;
$$;

-- 4) Bulk XP adjuster for users (single SQL from JSON)
CREATE OR REPLACE FUNCTION public.bulk_adjust_user_xp(items jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- items: [{ "user_id": "...", "delta": 6 }, ...]
  WITH src AS (
    SELECT
      (elem->>'user_id')::uuid AS user_id,
      (elem->>'delta')::int    AS delta
    FROM jsonb_array_elements(items) AS elem
  ),
  agg AS (
    SELECT user_id, sum(delta) AS delta
    FROM src
    GROUP BY user_id
  )
  UPDATE public.users u
  SET xp = greatest(0, u.xp + a.delta)
  FROM agg a
  WHERE u.id = a.user_id;
END;
$$;

-- 5) Timeout penalties — no row loops
CREATE OR REPLACE FUNCTION public.apply_timeout_penalties()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH expired AS (
    SELECT id, user_id, featured
    FROM public.calls
    WHERE xp_check = 0
      AND now() > created_at + interval '1 day'
  ),
  penalize AS (
    UPDATE public.calls c
    SET xp_check = 1,
        add_xp   = CASE WHEN e.featured = 1 THEN -6 ELSE coalesce(c.add_xp, 0) END
    FROM expired e
    WHERE c.id = e.id
    RETURNING c.user_id, CASE WHEN c.featured = 1 THEN -6 ELSE 0 END AS delta
  ),
  agg AS (
    SELECT user_id, sum(delta) AS delta
    FROM penalize
    GROUP BY user_id
    HAVING sum(delta) <> 0
  )
  UPDATE public.users u
  SET xp = greatest(0, u.xp + a.delta)
  FROM agg a
  WHERE u.id = a.user_id;
$$;
