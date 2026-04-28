'use server';

import { redirect } from 'next/navigation';

import { sendSuggestionToAdmin } from '@/lib/emails/send';
import { createClient } from '@/lib/supabase/server';

export type SuggestionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

function clean(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? '').trim();
  return s.length ? s : null;
}

export async function submitSuggestion(
  _prev: SuggestionState,
  formData: FormData,
): Promise<SuggestionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?next=/proposer-un-shop');

  const terms = formData.get('terms') === 'on';
  if (!terms) {
    return {
      status: 'error',
      message: 'Vous devez accepter les CGU et la politique de confidentialité.',
    };
  }

  const name = clean(formData.get('name'));
  const address = clean(formData.get('address'));
  const city = clean(formData.get('city'));
  const website = clean(formData.get('website'));
  const instagram = clean(formData.get('instagram'));
  const notes = clean(formData.get('notes'));

  if (!name || name.length < 2) {
    return { status: 'error', message: 'Le nom du shop est requis.' };
  }
  if (!city) {
    return { status: 'error', message: 'La ville est requise.' };
  }

  const { error } = await supabase.from('shop_suggestions').insert({
    submitted_by: user.id,
    name,
    address,
    city,
    website,
    instagram,
    notes,
  });

  if (error) {
    return { status: 'error', message: error.message };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .maybeSingle();

  const submittedBy = `${profile?.display_name ?? profile?.username ?? user.email ?? '—'} <${user.email ?? '—'}>`;

  await sendSuggestionToAdmin({
    shopName: name,
    city,
    address,
    website,
    instagram,
    notes,
    submittedBy,
  });

  return {
    status: 'success',
    message: 'Merci ! Votre proposition a bien été envoyée à l’équipe.',
  };
}
