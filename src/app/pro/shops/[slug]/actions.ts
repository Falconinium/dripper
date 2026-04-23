'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'Non authentifié.' };

  const { data: shop } = await supabase
    .from('shops')
    .select('id, claimed_by')
    .eq('slug', slug)
    .maybeSingle();
  if (!shop) return { status: 'error', message: 'Shop introuvable.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor';

  if (shop.claimed_by !== user.id && !isAdmin) {
    return { status: 'error', message: 'Vous n’êtes pas propriétaire de ce shop.' };
  }

  // Soft fields only — admin edits everything else via /admin/shops.
  const description = nullable(trim(fd.get('description')));
  const phone = nullable(trim(fd.get('phone')));
  const website = nullable(trim(fd.get('website')));
  const instagram = nullable(trim(fd.get('instagram')));
  const espresso_machine = nullable(trim(fd.get('espresso_machine')));

  const priceRaw = trim(fd.get('avg_flat_white_price'));
  const avg_flat_white_price = priceRaw ? Number(priceRaw) : null;
  if (avg_flat_white_price !== null && Number.isNaN(avg_flat_white_price)) {
    return { status: 'error', message: 'Prix invalide.' };
  }

  const methods = filterKeys(fd.getAll('methods') as string[], METHOD_KEYS);
  const options = filterKeys(fd.getAll('options') as string[], OPTION_KEYS);

  const { error } = await supabase
    .from('shops')
    .update({
      description,
      phone,
      website,
      instagram,
      espresso_machine,
      avg_flat_white_price,
      methods,
      options,
    })
    .eq('id', shop.id);

  if (error) return { status: 'error', message: error.message };

  revalidatePath(`/shops/${slug}`);
  revalidatePath(`/pro/shops/${slug}`);
  return { status: 'success', message: 'Modifications enregistrées.' };
}
