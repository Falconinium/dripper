-- Remove the "Tasse" score: only "Expérience" is kept.
-- Drop dependent views first, then the column, then recreate views without it.

drop view if exists public.reviews_with_author;
drop view if exists public.shop_scores;

alter table public.reviews drop column if exists cup_score;

create view public.shop_scores as
select
  s.id as shop_id,
  coalesce(round(avg(r.experience_score)::numeric, 1), null) as avg_experience_score,
  count(r.id)::int as review_count
from public.shops s
left join public.reviews r on r.shop_id = s.id
group by s.id;

grant select on public.shop_scores to anon, authenticated;

create view public.reviews_with_author as
select
  r.id,
  r.shop_id,
  r.user_id,
  r.experience_score,
  r.comment,
  r.drink_ordered,
  r.visited_at,
  r.created_at,
  p.username as author_username,
  p.display_name as author_display_name
from public.reviews r
left join public.profiles p on p.id = r.user_id;

grant select on public.reviews_with_author to anon, authenticated;
