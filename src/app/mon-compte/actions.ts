'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
