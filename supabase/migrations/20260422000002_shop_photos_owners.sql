-- Allow claimed owners to manage photos in shop-photos for their shop.
-- Path convention: "{shop_id}/{timestamp}.{ext}" — we read the first
-- segment and match it against shops.claimed_by = auth.uid().

create or replace function public.is_shop_owner(shop uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.shops where id = shop and claimed_by = uid
  );
$$;

create policy "shop-photos owners insert"
  on storage.objects for insert
  with check (
    bucket_id = 'shop-photos'
    and public.is_shop_owner(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  );

create policy "shop-photos owners update"
  on storage.objects for update
  using (
    bucket_id = 'shop-photos'
    and public.is_shop_owner(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  )
  with check (
    bucket_id = 'shop-photos'
    and public.is_shop_owner(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  );

create policy "shop-photos owners delete"
  on storage.objects for delete
  using (
    bucket_id = 'shop-photos'
    and public.is_shop_owner(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  );
