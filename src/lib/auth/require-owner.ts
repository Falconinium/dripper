import { notFound, redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function requireShopOwner(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/connexion?next=/pro/shops/${slug}`);

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!shop) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor';
  if (shop.claimed_by !== user.id && !isAdmin) {
    redirect('/mes-demandes');
  }

  return { user, shop, isAdmin };
}
