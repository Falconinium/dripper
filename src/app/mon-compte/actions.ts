'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export type ProfileFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
};

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'Non authentifié.' };

  const username = String(formData.get('username') ?? '').trim().toLowerCase();
  const display_name = String(formData.get('display_name') ?? '').trim() || null;
  const bio = String(formData.get('bio') ?? '').trim() || null;

  if (!/^[a-z0-9_.-]{3,30}$/.test(username)) {
    return {
      status: 'error',
      message: 'Nom d’usage : 3 à 30 caractères (lettres, chiffres, . _ -).',
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ username, display_name, bio })
    .eq('id', user.id);

  if (error) {
    if (error.code === '23505') {
      return { status: 'error', message: 'Ce nom d’usage est déjà pris.' };
    }
    return { status: 'error', message: error.message };
  }

  revalidatePath('/mon-compte');
  return { status: 'success', message: 'Profil mis à jour.' };
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const confirm = String(formData.get('confirm') ?? '').trim();
  if (confirm !== 'SUPPRIMER') {
    redirect('/mon-compte?delete=invalid');
  }

  const admin = createAdminClient();

  await admin
    .from('shops')
    .update({ claimed_by: null, subscription_tier: 'free', subscription_id: null })
    .eq('claimed_by', user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    redirect(`/mon-compte?delete=error&msg=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();
  redirect('/?account=deleted');
}
