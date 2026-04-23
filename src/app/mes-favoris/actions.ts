'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function removeFavorite(shopId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('favorites').delete().eq('shop_id', shopId).eq('user_id', user.id);
  revalidatePath('/mes-favoris');
}
