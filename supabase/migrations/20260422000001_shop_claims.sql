-- Shop claims: owners request to manage a shop. Admin validates.
-- See CLAUDE.md §5 "Revendiquer le coffee shop".

-- ============================================================
-- profiles.role : add 'owner'
-- ============================================================
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'editor', 'admin', 'owner'));

-- ============================================================
-- shop_claims
-- ============================================================
create table public.shop_claims (
  id                          uuid primary key default gen_random_uuid(),
  shop_id                     uuid not null references public.shops(id) on delete cascade,
  user_id                     uuid not null references public.profiles(id) on delete cascade,

  -- Claim fields (minimum viable set, per decision 2026-04-22)
  full_name                   text not null,
  siret                       text not null,
  role_in_company             text not null,        -- 'owner' | 'manager' | 'other'
  pro_email                   text not null,
  phone                       text not null,

  -- Domain email verification (only when shop.website is set)
  domain_verification_email   text,
  domain_verification_code    text,
  domain_verified_at          timestamptz,
  domain_skipped              boolean not null default false,

  -- Workflow
  status                      text not null default 'pending'
                              check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  decided_at                  timestamptz,
  decided_by                  uuid references public.profiles(id) on delete set null,
  rejection_reason            text,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- Only one active claim per (shop, user). Once rejected/cancelled the user can retry.
create unique index shop_claims_unique_active
  on public.shop_claims (shop_id, user_id)
  where status in ('pending', 'approved');

create index shop_claims_shop_idx on public.shop_claims (shop_id);
create index shop_claims_user_idx on public.shop_claims (user_id);
create index shop_claims_status_idx on public.shop_claims (status);

-- updated_at trigger
drop trigger if exists set_updated_at on public.shop_claims;
create trigger set_updated_at before update on public.shop_claims
  for each row execute function public.tg_set_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table public.shop_claims enable row level security;

-- Users see their own claims; admins see all.
create policy "shop_claims owner or admin read"
  on public.shop_claims for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Users create claims for themselves only.
create policy "shop_claims users insert own"
  on public.shop_claims for insert
  with check (auth.uid() = user_id);

-- Users can update their own pending claim to record verification / cancel.
-- Admin decision fields (status='approved'/'rejected', decided_at, decided_by)
-- are restricted to admins.
create policy "shop_claims owner updates own pending"
  on public.shop_claims for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status in ('pending', 'cancelled'));

create policy "shop_claims admins manage all"
  on public.shop_claims for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================
-- Allow owners (claimed_by) to update soft fields on their shop.
-- The existing "pro claimants update their shop" policy requires
-- subscription_tier='pro'. Owners without a Pro sub should still be
-- able to edit soft fields — we use a separate policy with column-level
-- restriction enforced by the Server Action (no column RLS in Postgres
-- RLS itself, so the action is the source of truth for which fields
-- are writeable).
-- ============================================================
create policy "owners update their shop"
  on public.shops for update
  using (claimed_by = auth.uid())
  with check (claimed_by = auth.uid());

-- Remove the old pro-only policy since "owners update their shop" covers it.
-- Pro-tier gating (for premium fields) is enforced in the Server Action.
drop policy if exists "pro claimants update their shop" on public.shops;
