-- Public bucket for roaster photos, admin-only writes.
insert into storage.buckets (id, name, public)
values ('roaster-photos', 'roaster-photos', true)
on conflict (id) do nothing;

create policy "roaster photos public read"
  on storage.objects for select
  using (bucket_id = 'roaster-photos');

create policy "roaster photos admin insert"
  on storage.objects for insert
  with check (bucket_id = 'roaster-photos' and public.is_admin(auth.uid()));

create policy "roaster photos admin update"
  on storage.objects for update
  using (bucket_id = 'roaster-photos' and public.is_admin(auth.uid()));

create policy "roaster photos admin delete"
  on storage.objects for delete
  using (bucket_id = 'roaster-photos' and public.is_admin(auth.uid()));
