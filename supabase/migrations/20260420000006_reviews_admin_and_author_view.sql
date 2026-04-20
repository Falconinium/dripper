-- Admin can delete any review (moderation)
create policy "admins delete any review"
  on public.reviews for delete
  using (public.is_admin(auth.uid()));

-- Public view exposing reviews with author display_name/username for list rendering.
create or replace view public.reviews_with_author as
select
  r.id,
  r.shop_id,
  r.user_id,
  r.cup_score,
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
