'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils/slug';

export type RoasterFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
};

function nullable(v: FormDataEntryValue | null): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  return s.length ? s : null;
}

function buildPayload(formData: FormData) {
  const name = nullable(formData.get('name'));
  if (!name) return { error: 'Nom requis.' as const };
  return {
    payload: {
      name,
      slug: nullable(formData.get('slug')) ?? slugify(name),
      city: nullable(formData.get('city')),
      description: nullable(formData.get('description')),
      website: nullable(formData.get('website')),
      instagram: nullable(formData.get('instagram')),
    },
  };
}

export async function createRoaster(
  _prev: RoasterFormState,
  formData: FormData,
): Promise<RoasterFormState> {
  await requireAdmin();
  const r = buildPayload(formData);
  if ('error' in r) return { status: 'error', message: r.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('roasters')
    .insert(r.payload)
    .select('id')
    .single();

  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/roasters');
  revalidatePath('/torrefacteurs');
  redirect(`/admin/roasters/${data.id}`);
}

export async function updateRoaster(
  id: string,
  _prev: RoasterFormState,
  formData: FormData,
): Promise<RoasterFormState> {
  await requireAdmin();
  const r = buildPayload(formData);
  if ('error' in r) return { status: 'error', message: r.error };

  const supabase = await createClient();
  const { error } = await supabase.from('roasters').update(r.payload).eq('id', id);
  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/roasters');
  revalidatePath(`/admin/roasters/${id}`);
  revalidatePath('/torrefacteurs');
  revalidatePath(`/torrefacteurs/${r.payload.slug}`);
  return { status: 'success', message: 'Enregistré.' };
}

export async function deleteRoaster(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('roasters').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/roasters');
  revalidatePath('/torrefacteurs');
  redirect('/admin/roasters');
}

export async function uploadRoasterPhoto(roasterId: string, formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error' as const, message: 'Fichier manquant.' };
  }

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${roasterId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('roaster-photos')
    .upload(path, file, { contentType: file.type, cacheControl: '3600' });
  if (uploadError) return { status: 'error' as const, message: uploadError.message };

  const { data: urlData } = supabase.storage.from('roaster-photos').getPublicUrl(path);

  const { data: roaster } = await supabase
    .from('roasters')
    .select('photos')
    .eq('id', roasterId)
    .single();

  const existing = Array.isArray(roaster?.photos)
    ? (roaster.photos as Array<{ url: string; path: string; alt?: string }>)
    : [];
  const photos = [...existing, { url: urlData.publicUrl, path, alt: '' }];

  const { error: updateError } = await supabase
    .from('roasters')
    .update({ photos })
    .eq('id', roasterId);
  if (updateError) return { status: 'error' as const, message: updateError.message };

  revalidatePath(`/admin/roasters/${roasterId}`);
  return { status: 'success' as const };
}

export async function removeRoasterPhoto(roasterId: string, path: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.storage.from('roaster-photos').remove([path]);

  const { data: roaster } = await supabase
    .from('roasters')
    .select('photos')
    .eq('id', roasterId)
    .single();

  const existing = Array.isArray(roaster?.photos)
    ? (roaster.photos as Array<{ path?: string }>)
    : [];
  const photos = existing.filter((p) => p.path !== path);

  await supabase.from('roasters').update({ photos }).eq('id', roasterId);
  revalidatePath(`/admin/roasters/${roasterId}`);
}
