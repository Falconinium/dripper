-- Fix security_definer_view advisor errors.
--
-- Postgres 15+ creates views as SECURITY DEFINER by default, meaning the
-- view runs queries with the privileges of the view's owner (the migration
-- role), bypassing RLS for the calling user. Switch the three exposed views
-- to security_invoker = true so they respect the caller's RLS instead.
--
-- Affected views: shop_scores, shops_public, reviews_with_author.
-- All three are exposed read-only to anon/authenticated and only return
-- data that is already publicly readable through the underlying tables'
-- own SELECT policies, so this change should not affect any user-facing
-- behaviour.

alter view public.shop_scores         set (security_invoker = true);
alter view public.shops_public        set (security_invoker = true);
alter view public.reviews_with_author set (security_invoker = true);

notify pgrst, 'reload schema';
