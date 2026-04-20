-- RLS policies, triggers, helper functions.
-- Principle (CLAUDE.md §10.2): public read when appropriate, owner writes, admin overrides.

-- ============================================================
-- Helpers
-- ============================================================

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role in ('admin', 'editor')
  );
$$;

-- Generic updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_.-]', '', 'gi');
  base_username := lower(left(base_username, 24));
  if base_username = '' then
    base_username := 'user';
  end if;
  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, base_username);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Attach updated_at trigger to all tables with that column
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'roasters', 'shops', 'reviews',
    'tasting_notes', 'articles', 'events'
  ] loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at before update on public.%I
         for each row execute function public.tg_set_updated_at();',
      t, t
    );
  end loop;
end$$;

-- ============================================================
-- Enable RLS
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.roasters       enable row level security;
alter table public.shops          enable row level security;
alter table public.shop_roasters  enable row level security;
alter table public.reviews        enable row level security;
alter table public.tasting_notes  enable row level security;
alter table public.drink_echoes   enable row level security;
alter table public.favorites      enable row level security;
alter table public.articles       enable row level security;
alter table public.badges         enable row level security;
alter table public.user_badges    enable row level security;
alter table public.events         enable row level security;

-- ============================================================
-- profiles
-- ============================================================
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No public insert: inserts handled by the on_auth_user_created trigger.

-- ============================================================
-- roasters : editorial content, admin-only writes
-- ============================================================
create policy "roasters are publicly readable"
  on public.roasters for select
  using (true);

create policy "admins manage roasters"
  on public.roasters for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- shops : public reads limited to published, admin + claimant writes
-- ============================================================
create policy "published shops are publicly readable"
  on public.shops for select
  using (status = 'published' or public.is_admin(auth.uid()) or claimed_by = auth.uid());

create policy "admins manage all shops"
  on public.shops for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "pro claimants update their shop"
  on public.shops for update
  using (claimed_by = auth.uid() and subscription_tier = 'pro')
  with check (claimed_by = auth.uid() and subscription_tier = 'pro');

-- ============================================================
-- shop_roasters
-- ============================================================
create policy "shop_roasters are publicly readable"
  on public.shop_roasters for select
  using (true);

create policy "admins manage shop_roasters"
  on public.shop_roasters for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- reviews : public read, owner CRUD
-- ============================================================
create policy "reviews are publicly readable"
  on public.reviews for select
  using (true);

create policy "users create their reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "users update their reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users delete their reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ============================================================
-- tasting_notes : owner-only by default, public if is_public = true
-- ============================================================
create policy "tasting_notes public or owner read"
  on public.tasting_notes for select
  using (is_public is true or auth.uid() = user_id);

create policy "tasting_notes owner write"
  on public.tasting_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- drink_echoes
-- ============================================================
create policy "drink_echoes publicly readable"
  on public.drink_echoes for select
  using (true);

create policy "users manage their echoes"
  on public.drink_echoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- favorites : owner-only
-- ============================================================
create policy "favorites owner read"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites owner write"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- articles : public read when published, admin writes
-- ============================================================
create policy "published articles are publicly readable"
  on public.articles for select
  using (published_at is not null or public.is_admin(auth.uid()));

create policy "admins manage articles"
  on public.articles for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- badges : public read, admin writes
-- ============================================================
create policy "badges are publicly readable"
  on public.badges for select
  using (true);

create policy "admins manage badges"
  on public.badges for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- user_badges : public read, admin writes (awarded server-side)
-- ============================================================
create policy "user_badges are publicly readable"
  on public.user_badges for select
  using (true);

create policy "admins manage user_badges"
  on public.user_badges for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- events : public read, admin writes
-- ============================================================
create policy "events are publicly readable"
  on public.events for select
  using (true);

create policy "admins manage events"
  on public.events for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
