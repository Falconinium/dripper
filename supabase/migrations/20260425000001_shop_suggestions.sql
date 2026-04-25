-- Shop suggestions: signed-in users propose new coffee shops to be reviewed
-- editorially. Admin can read and delete. No conversion-to-shop flow at this
-- stage — the shop is created manually from the suggestion data.

create table public.shop_suggestions (
  id              uuid primary key default gen_random_uuid(),
  submitted_by    uuid not null references public.profiles(id) on delete cascade,

  name            text not null,
  address         text,
  city            text,
  website         text,
  instagram       text,
  notes           text,

  created_at      timestamptz not null default now()
);

create index shop_suggestions_user_idx on public.shop_suggestions (submitted_by);
create index shop_suggestions_created_idx on public.shop_suggestions (created_at desc);

-- ============================================================
-- RLS
-- ============================================================
alter table public.shop_suggestions enable row level security;

-- Authenticated users can submit a suggestion for themselves only.
create policy "shop_suggestions users insert own"
  on public.shop_suggestions for insert
  with check (auth.uid() = submitted_by);

-- Users can read their own submissions; admins can read everything.
create policy "shop_suggestions owner or admin read"
  on public.shop_suggestions for select
  using (auth.uid() = submitted_by or public.is_admin(auth.uid()));

-- Only admins can delete.
create policy "shop_suggestions admins delete"
  on public.shop_suggestions for delete
  using (public.is_admin(auth.uid()));
