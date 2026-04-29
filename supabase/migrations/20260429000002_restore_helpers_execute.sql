-- Rollback of the EXECUTE revocations from 20260429000001:
--
-- public.is_admin and public.is_shop_owner are referenced from RLS
-- policies on tables that anon and authenticated must be able to read
-- (e.g. the shops SELECT policy). Even though the functions are
-- SECURITY DEFINER, PostgreSQL still requires the *caller* to hold
-- EXECUTE on them when the policy is evaluated. Revoking EXECUTE
-- broke `select` from anon (HTTP 401: permission denied for function
-- is_admin), so we restore the grants here.
--
-- Result: the security advisor warnings
--   anon_security_definer_function_executable
--   authenticated_security_definer_function_executable
-- for these three helpers will reappear. We accept them as known
-- false-positives — calling them via /rest/v1/rpc returns a boolean
-- with no privilege escalation, and handle_new_user() requires a
-- trigger context to do anything useful.

grant execute on function public.handle_new_user() to anon, authenticated;
grant execute on function public.is_admin(uuid) to anon, authenticated;
grant execute on function public.is_shop_owner(uuid, uuid) to anon, authenticated;

notify pgrst, 'reload schema';
