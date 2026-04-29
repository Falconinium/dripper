'use server';

import { revalidatePath } from 'next/cache';

import { normalizeLabel } from '@/lib/shops/labels';
import { createClient } from '@/lib/supabase/server';

type ShopPhoto = { url: string; path: string; alt?: string };

async function assertOwner(slug: string): Promise<
  | { ok: true; shopId: string }
  | { ok: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Non authentifié.' };

  const { data: shop } = await supabase
    .from('shops')
    .select('id, claimed_by')
    .eq('slug', slug)
    .maybeSingle();
  if (!shop) return { ok: false, message: 'Shop introuvable.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor';

  if (shop.claimed_by !== user.id && !isAdmin) {
    return { ok: false, message: 'Non autorisé.' };
  }
  return { ok: true, shopId: shop.id };
}

const METHOD_KEYS = new Set([
  'espresso',
  'v60',
  'aeropress',
  'chemex',
  'kalita',
  'cold_brew',
]);
const OPTION_KEYS = new Set([
  'decaf',
  'oat_milk',
  'soy_milk',
  'beans_to_go',
  'wifi',
  'seating',
]);

export type OwnerUpdateState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; message: string };

function trim(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function nullable(s: string): string | null {
  return s.length ? s : null;
}

function filterKeys(values: string[], allowed: Set<string>): string[] {
  return values.filter((v) => allowed.has(v));
}

export async function updateOwnedShop(
  prev: OwnerUpdateState,
  fd: FormData,
): Promise<OwnerUpdateState> {
  const slug = trim(fd.get('slug'));
  if (!slug) return { status: 'error', message: 'Shop introuvable.' };

  if (fd.get('photo_rights') !== 'on') {
    return {
      status: 'error',
      message:
        'Vous devez certifier détenir les droits sur les photos et accepter de les céder à Dripper.',
    };
  }

  const auth = await assertOwner(slug);
  if (!auth.ok) return { status: 'error', message: auth.message };
  const supabase = await createClient();

  // Soft fields only — admin edits everything else via /admin/shops.
  const description = nullable(trim(fd.get('description')));
  const phone = nullable(trim(fd.get('phone')));
  const website = nullable(trim(fd.get('website')));
  const instagram = nullable(trim(fd.get('instagram')));
  const espresso_machine = nullable(trim(fd.get('espresso_machine')));

  const methods = filterKeys(fd.getAll('methods') as string[], METHOD_KEYS);
  const options = filterKeys(fd.getAll('options') as string[], OPTION_KEYS);
  const labels = Array.from(
    new Set(
      (fd.getAll('labels') as string[]).map((v) => normalizeLabel(v)).filter(Boolean),
    ),
  );

  const { error } = await supabase
    .from('shops')
    .update({
      description,
      phone,
      website,
      instagram,
      espresso_machine,
      methods,
      options,
      labels,
    })
    .eq('id', auth.shopId);

  if (error) return { status: 'error', message: error.message };

  revalidatePath(`/shops/${slug}`);
  revalidatePath(`/pro/shops/${slug}`);
  return { status: 'success', message: 'Modifications enregistrées.' };
}

export type PhotoActionResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadOwnerShopPhoto(
  slug: string,
  formData: FormData,
): Promise<PhotoActionResult> {
  const auth = await assertOwner(slug);
  if (!auth.ok) return { status: 'error', message: auth.message };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'Fichier manquant.' };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { status: 'error', message: 'Fichier trop volumineux (max 8 Mo).' };
  }
  if (!file.type.startsWith('image/')) {
    return { status: 'error', message: 'Le fichier doit être une image.' };
  }

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${auth.shopId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('shop-photos')
    .upload(path, file, { contentType: file.type, cacheControl: '3600' });
  if (uploadError) return { status: 'error', message: uploadError.message };

  const { data: urlData } = supabase.storage.from('shop-photos').getPublicUrl(path);

  const { data: shop } = await supabase
    .from('shops')
    .select('photos')
    .eq('id', auth.shopId)
    .single();

  const existing = Array.isArray(shop?.photos) ? (shop.photos as ShopPhoto[]) : [];
  const photos = [...existing, { url: urlData.publicUrl, path, alt: '' }];

  const { error: updateError } = await supabase
    .from('shops')
    .update({ photos })
    .eq('id', auth.shopId);

  if (updateError) return { status: 'error', message: updateError.message };

  revalidatePath(`/shops/${slug}`);
  revalidatePath(`/pro/shops/${slug}`);
  return { status: 'success' };
}

export async function removeOwnerShopPhoto(
  slug: string,
  path: string,
): Promise<PhotoActionResult> {
  const auth = await assertOwner(slug);
  if (!auth.ok) return { status: 'error', message: auth.message };

  // Defense in depth: path must be scoped to this shop.
  if (!path.startsWith(`${auth.shopId}/`)) {
    return { status: 'error', message: 'Chemin invalide.' };
  }

  const supabase = await createClient();
  await supabase.storage.from('shop-photos').remove([path]);

  const { data: shop } = await supabase
    .from('shops')
    .select('photos')
    .eq('id', auth.shopId)
    .single();

  const existing = Array.isArray(shop?.photos) ? (shop.photos as ShopPhoto[]) : [];
  const photos = existing.filter((p) => p.path !== path);

  await supabase.from('shops').update({ photos }).eq('id', auth.shopId);

  revalidatePath(`/shops/${slug}`);
  revalidatePath(`/pro/shops/${slug}`);
  return { status: 'success' };
}

export async function reorderOwnerShopPhotos(
  slug: string,
  order: string[],
): Promise<PhotoActionResult> {
  const auth = await assertOwner(slug);
  if (!auth.ok) return { status: 'error', message: auth.message };

  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('photos')
    .eq('id', auth.shopId)
    .single();

  const existing = Array.isArray(shop?.photos) ? (shop.photos as ShopPhoto[]) : [];
  const byPath = new Map(existing.map((p) => [p.path, p]));
  const ordered: ShopPhoto[] = [];
  for (const p of order) {
    const found = byPath.get(p);
    if (found) {
      ordered.push(found);
      byPath.delete(p);
    }
  }
  for (const remaining of byPath.values()) ordered.push(remaining);

  await supabase.from('shops').update({ photos: ordered }).eq('id', auth.shopId);
  revalidatePath(`/shops/${slug}`);
  revalidatePath(`/pro/shops/${slug}`);
  return { status: 'success' };
}
