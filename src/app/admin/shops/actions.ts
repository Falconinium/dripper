'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth/require-admin';
import { geocodeAddress } from '@/lib/mapbox/geocode';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils/slug';

export type ShopFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
};

const METHOD_KEYS = ['espresso', 'v60', 'aeropress', 'chemex', 'kalita', 'cold_brew'] as const;
const OPTION_KEYS = ['decaf', 'oat_milk', 'soy_milk', 'beans_to_go', 'wifi', 'seating'] as const;

function parseList(formData: FormData, key: string, allowed: readonly string[]) {
  const values = formData.getAll(key).map((v) => String(v));
  return values.filter((v) => allowed.includes(v));
}

function nullable(value: FormDataEntryValue | null): string | null {
  const s = typeof value === 'string' ? value.trim() : '';
  return s.length ? s : null;
}

function parseNumber(value: FormDataEntryValue | null): number | null {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return null;
  const n = Number(s.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

async function buildPayload(formData: FormData) {
  const name = nullable(formData.get('name'));
  const address = nullable(formData.get('address'));
  if (!name || !address) {
    return { error: 'Nom et adresse requis.' as string };
  }

  let lng = parseNumber(formData.get('lng'));
  let lat = parseNumber(formData.get('lat'));

  if (lng === null || lat === null) {
    const geo = await geocodeAddress(address);
    if (!geo) {
      return { error: 'Géocodage impossible. Saisissez lat/lng manuellement.' as string };
    }
    lng = geo.lng;
    lat = geo.lat;
  }

  return {
    payload: {
      name,
      slug: nullable(formData.get('slug')) ?? slugify(name),
      description: nullable(formData.get('description')),
      address,
      city: nullable(formData.get('city')),
      postal_code: nullable(formData.get('postal_code')),
      phone: nullable(formData.get('phone')),
      website: nullable(formData.get('website')),
      instagram: nullable(formData.get('instagram')),
      espresso_machine: nullable(formData.get('espresso_machine')),
      methods: parseList(formData, 'methods', METHOD_KEYS),
      options: parseList(formData, 'options', OPTION_KEYS),
      is_selection: formData.get('is_selection') === 'on',
      status: nullable(formData.get('status')) ?? 'draft',
      location: `SRID=4326;POINT(${lng} ${lat})`,
    },
  };
}

export async function createShop(
  _prev: ShopFormState,
  formData: FormData,
): Promise<ShopFormState> {
  await requireAdmin();
  const result = await buildPayload(formData);
  if ('error' in result) return { status: 'error', message: result.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shops')
    .insert(result.payload)
    .select('id')
    .single();

  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/shops');
  revalidatePath('/carte');
  redirect(`/admin/shops/${data.id}`);
}

export async function updateShop(
  id: string,
  _prev: ShopFormState,
  formData: FormData,
): Promise<ShopFormState> {
  await requireAdmin();
  const result = await buildPayload(formData);
  if ('error' in result) return { status: 'error', message: result.error };

  const supabase = await createClient();
  const { error } = await supabase.from('shops').update(result.payload).eq('id', id);

  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/shops');
  revalidatePath(`/admin/shops/${id}`);
  revalidatePath('/carte');
  revalidatePath(`/shops/${result.payload.slug}`);
  return { status: 'success', message: 'Enregistré.' };
}

export async function deleteShop(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('shops').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/shops');
  revalidatePath('/carte');
  redirect('/admin/shops');
}

export async function uploadShopPhoto(shopId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error' as const, message: 'Fichier manquant.' };
  }

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${shopId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('shop-photos')
    .upload(path, file, { contentType: file.type, cacheControl: '3600' });

  if (uploadError) return { status: 'error' as const, message: uploadError.message };

  const { data: urlData } = supabase.storage.from('shop-photos').getPublicUrl(path);

  const { data: shop } = await supabase
    .from('shops')
    .select('photos')
    .eq('id', shopId)
    .single();

  const existing = Array.isArray(shop?.photos)
    ? (shop.photos as Array<{ url: string; path: string; alt?: string }>)
    : [];
  const photos = [...existing, { url: urlData.publicUrl, path, alt: '' }];

  const { error: updateError } = await supabase
    .from('shops')
    .update({ photos })
    .eq('id', shopId);

  if (updateError) return { status: 'error' as const, message: updateError.message };

  revalidatePath(`/admin/shops/${shopId}`);
  return { status: 'success' as const };
}

export async function linkShopRoasters(shopId: string, slug: string, formData: FormData) {
  await requireAdmin();
  const selected = formData.getAll('roaster_id').map((v) => String(v));
  const primaryId = String(formData.get('primary_roaster_id') ?? '');

  const supabase = await createClient();

  // Wipe and reinsert — simplest and keeps primary in sync.
  const { error: delErr } = await supabase.from('shop_roasters').delete().eq('shop_id', shopId);
  if (delErr) return { status: 'error' as const, message: delErr.message };

  if (selected.length) {
    const rows = selected.map((roaster_id) => ({
      shop_id: shopId,
      roaster_id,
      is_primary: roaster_id === primaryId,
    }));
    const { error: insErr } = await supabase.from('shop_roasters').insert(rows);
    if (insErr) return { status: 'error' as const, message: insErr.message };
  }

  revalidatePath(`/admin/shops/${shopId}`);
  revalidatePath(`/shops/${slug}`);
  revalidatePath('/torrefacteurs');
  return { status: 'success' as const };
}

export async function removeShopPhoto(shopId: string, path: string) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.storage.from('shop-photos').remove([path]);

  const { data: shop } = await supabase
    .from('shops')
    .select('photos')
    .eq('id', shopId)
    .single();

  const existing = Array.isArray(shop?.photos) ? (shop.photos as Array<{ path?: string }>) : [];
  const photos = existing.filter((p) => p.path !== path);

  await supabase.from('shops').update({ photos }).eq('id', shopId);
  revalidatePath(`/admin/shops/${shopId}`);
}
