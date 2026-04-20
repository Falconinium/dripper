'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';

export type ReviewFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
};

function parseScore(raw: FormDataEntryValue | null): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n);
  return rounded >= 1 && rounded <= 10 ? rounded : null;
}

export async function submitReview(
  shopId: string,
  slug: string,
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?next=/shops/${slug}`);

  const cup = parseScore(formData.get('cup_score'));
  const exp = parseScore(formData.get('experience_score'));
  if (cup === null || exp === null) {
    return { status: 'error', message: 'Scores requis entre 1 et 10.' };
  }

  const comment = String(formData.get('comment') ?? '').trim() || null;
  const drink = String(formData.get('drink_ordered') ?? '').trim() || null;

  const { error } = await supabase.from('reviews').upsert(
    {
      shop_id: shopId,
      user_id: user.id,
      cup_score: cup,
      experience_score: exp,
      comment,
      drink_ordered: drink,
    },
    { onConflict: 'shop_id,user_id' },
  );

  if (error) return { status: 'error', message: error.message };

  revalidatePath(`/shops/${slug}`);
  return { status: 'success', message: 'Avis publié.' };
}

export async function deleteMyReview(shopId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('reviews').delete().eq('shop_id', shopId).eq('user_id', user.id);
  revalidatePath(`/shops/${slug}`);
}

export async function adminDeleteReview(reviewId: string, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath(`/shops/${slug}`);
}

export async function toggleFavorite(shopId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?next=/shops/${slug}`);

  const { data: existing } = await supabase
    .from('favorites')
    .select('shop_id')
    .eq('shop_id', shopId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('shop_id', shopId).eq('user_id', user.id);
  } else {
    await supabase.from('favorites').insert({ shop_id: shopId, user_id: user.id });
  }

  revalidatePath(`/shops/${slug}`);
  revalidatePath('/mon-compte');
}
