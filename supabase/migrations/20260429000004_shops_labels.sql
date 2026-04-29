-- Add labels column to shops: free-form lowercase tags
-- (e.g. "bio", "direct trade", "single origin"). Suggestions are
-- managed client-side; any custom value is persisted on the shop
-- but does not enrich the suggestion pool.

alter table public.shops
  add column if not exists labels text[] not null default '{}';
