-- Drop roaster directory entirely (not in active scope).
-- Note: roaster-photos storage bucket must be emptied + deleted manually via
-- the Supabase dashboard (direct DELETE on storage.objects is blocked).
drop table if exists public.shop_roasters cascade;
drop table if exists public.roasters cascade;

drop policy if exists "roaster photos public read" on storage.objects;
drop policy if exists "roaster photos admin insert" on storage.objects;
drop policy if exists "roaster photos admin update" on storage.objects;
drop policy if exists "roaster photos admin delete" on storage.objects;
