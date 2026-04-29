-- Address Supabase security advisors:
--   * function_search_path_mutable           (shop_coords, tg_set_updated_at)
--   * anon/authenticated_security_definer_function_executable
--       (handle_new_user, is_admin, is_shop_owner)
--   * public_bucket_allows_listing           (shop-photos, roaster-photos)
--
-- Note: warnings about postgis-owned functions (st_estimatedextent, etc.)
-- and `extension_in_public` for postgis/citext cannot be fixed without
-- moving the extension out of public, which would require breaking changes
-- to shops.location queries. Those are accepted as known issues.

-- ============================================================
-- 1. function_search_path_mutable
-- ============================================================

alter function public.tg_set_updated_at() set search_path = '';
alter function public.shop_coords(public.shops) set search_path = public, pg_temp;

-- ============================================================
-- 2. *_security_definer_function_executable
-- ------------------------------------------------------------
-- Revoke EXECUTE on the SECURITY DEFINER helpers so PostgREST stops
-- exposing them at /rest/v1/rpc/<fn>.
-- ============================================================

revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.is_admin(uuid) from anon, authenticated, public;
revoke execute on function public.is_shop_owner(uuid, uuid) from anon, authenticated, public;

-- ============================================================
-- 3. public_bucket_allows_listing
-- ------------------------------------------------------------
-- Drop the broad SELECT policies on storage.objects. Public URLs at
-- /storage/v1/object/public/<bucket>/<path> still work because the
-- bucket itself is marked public.
-- ============================================================

drop policy if exists "shop-photos public read" on storage.objects;
drop policy if exists "roaster photos public read" on storage.objects;

notify pgrst, 'reload schema';
