-- Aggregated scores per shop (public, used by shop pages and listings)
create or replace view public.shop_scores as
select
  s.id as shop_id,
  coalesce(round(avg(r.cup_score)::numeric, 1), null) as avg_cup_score,
  coalesce(round(avg(r.experience_score)::numeric, 1), null) as avg_experience_score,
  count(r.id)::int as review_count
from public.shops s
left join public.reviews r on r.shop_id = s.id
group by s.id;

grant select on public.shop_scores to anon, authenticated;

-- Extract lat/lng from the PostGIS geography for JSON serialization.
create or replace function public.shop_coords(shop public.shops)
returns jsonb
language sql
stable
as $$
  select case
    when shop.location is null then null
    else jsonb_build_object(
      'lng', st_x(shop.location::geometry),
      'lat', st_y(shop.location::geometry)
    )
  end;
$$;

grant execute on function public.shop_coords(public.shops) to anon, authenticated;
