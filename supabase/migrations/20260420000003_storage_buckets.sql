-- Storage buckets + policies

-- shop-photos : public read, admin write
insert into storage.buckets (id, name, public)
values ('shop-photos', 'shop-photos', true)
on conflict (id) do nothing;

create policy "shop-photos public read"
  on storage.objects for select
  using (bucket_id = 'shop-photos');

create policy "shop-photos admin write"
  on storage.objects for insert
  with check (
    bucket_id = 'shop-photos'
    and public.is_admin(auth.uid())
  );

create policy "shop-photos admin update"
  on storage.objects for update
  using (bucket_id = 'shop-photos' and public.is_admin(auth.uid()))
  with check (bucket_id = 'shop-photos' and public.is_admin(auth.uid()));

create policy "shop-photos admin delete"
  on storage.objects for delete
  using (bucket_id = 'shop-photos' and public.is_admin(auth.uid()));
