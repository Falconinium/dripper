'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';

export async function deleteSuggestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('shop_suggestions').delete().eq('id', id);

  revalidatePath('/admin/suggestions');
  revalidatePath('/admin');
}
