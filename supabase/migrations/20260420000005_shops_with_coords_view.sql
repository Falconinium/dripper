-- Public view exposing shops with lng/lat extracted, for client-friendly queries.
create or replace view public.shops_public as
select
  s.id,
  s.slug,
  s.name,
  s.description,
  s.address,
  s.city,
  s.postal_code,
  s.phone,
  s.website,
  s.instagram,
  s.opening_hours,
  s.espresso_machine,
  s.methods,
  s.options,
  s.photos,
  s.avg_flat_white_price,
  s.status,
  s.is_selection,
  s.selection_granted_at,
  s.selection_expires_at,
  s.updated_at,
  case when s.location is null then null else st_x(s.location::geometry) end as lng,
  case when s.location is null then null else st_y(s.location::geometry) end as lat
from public.shops s;

grant select on public.shops_public to anon, authenticated;
