-- Dripper initial schema (CLAUDE.md §10)
-- Tables, indexes, foreign keys. RLS + triggers in migration 0002.

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists postgis;
create extension if not exists citext;

-- ============================================================
-- profiles : extends auth.users with public-facing fields
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     citext unique not null,
  display_name text,
  avatar_url   text,
  bio          text,
  role         text not null default 'user' check (role in ('user', 'editor', 'admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Public profile fields linked to auth.users.';
comment on column public.profiles.role is 'Used for admin-gated routes and editorial actions.';

-- ============================================================
-- roasters
-- ============================================================
create table public.roasters (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  city        text,
  description text,
  website     text,
  instagram   text,
  photos      jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- shops
-- ============================================================
create table public.shops (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique not null,
  name                   text not null,
  description            text,
  address                text,
  city                   text,
  postal_code            text,
  location               geography(Point, 4326),
  phone                  text,
  website                text,
  instagram              text,
  opening_hours          jsonb,
  espresso_machine       text,
  methods                text[] not null default '{}',
  options                text[] not null default '{}',
  photos                 jsonb not null default '[]'::jsonb,
  avg_flat_white_price   numeric(6, 2),
  status                 text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_selection           boolean not null default false,
  selection_granted_at   timestamptz,
  selection_expires_at   timestamptz,
  subscription_tier      text not null default 'free' check (subscription_tier in ('free', 'pro')),
  subscription_id        text,
  claimed_by             uuid references public.profiles(id) on delete set null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index shops_location_idx on public.shops using gist (location);
create index shops_city_idx on public.shops (city);
create index shops_status_idx on public.shops (status);
create index shops_is_selection_idx on public.shops (is_selection) where is_selection is true;

-- ============================================================
-- shop_roasters (many-to-many)
-- ============================================================
create table public.shop_roasters (
  shop_id    uuid not null references public.shops(id) on delete cascade,
  roaster_id uuid not null references public.roasters(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (shop_id, roaster_id)
);

create index shop_roasters_roaster_idx on public.shop_roasters (roaster_id);

-- ============================================================
-- reviews
-- ============================================================
create table public.reviews (
  id               uuid primary key default gen_random_uuid(),
  shop_id          uuid not null references public.shops(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  cup_score        smallint check (cup_score between 1 and 10),
  experience_score smallint check (experience_score between 1 and 10),
  comment          text,
  photos           jsonb not null default '[]'::jsonb,
  visited_at       date,
  drink_ordered    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (shop_id, user_id)
);

create index reviews_shop_idx on public.reviews (shop_id);
create index reviews_user_idx on public.reviews (user_id);

-- ============================================================
-- tasting_notes (private journal)
-- ============================================================
create table public.tasting_notes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  shop_id          uuid references public.shops(id) on delete set null,
  coffee_origin    text,
  coffee_producer  text,
  method           text,
  notes            text,
  rating           smallint check (rating between 1 and 10),
  photos           jsonb not null default '[]'::jsonb,
  is_public        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index tasting_notes_user_idx on public.tasting_notes (user_id);

-- ============================================================
-- drink_echoes ("I had it too" social signal)
-- ============================================================
create table public.drink_echoes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  review_id  uuid not null references public.reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, review_id)
);

create index drink_echoes_review_idx on public.drink_echoes (review_id);

-- ============================================================
-- favorites
-- ============================================================
create table public.favorites (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  shop_id    uuid not null references public.shops(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, shop_id)
);

create index favorites_shop_idx on public.favorites (shop_id);

-- ============================================================
-- articles (blog + city guides)
-- ============================================================
create table public.articles (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  type           text not null check (type in ('guide', 'article')),
  city           text,
  title          text not null,
  excerpt        text,
  body_mdx       text,
  cover_url      text,
  author_id      uuid references public.profiles(id) on delete set null,
  related_shops  uuid[] not null default '{}',
  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index articles_published_idx on public.articles (published_at desc) where published_at is not null;
create index articles_type_idx on public.articles (type);

-- ============================================================
-- badges + user_badges (gamification v1.5)
-- ============================================================
create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  icon        text,
  criteria    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create table public.user_badges (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ============================================================
-- events (v2)
-- ============================================================
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid references public.shops(id) on delete set null,
  title       text not null,
  description text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  ticket_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index events_starts_at_idx on public.events (starts_at);
