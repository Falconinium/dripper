import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { deleteRoaster, updateRoaster } from '../actions';
import { RoasterForm } from '../roaster-form';
import { RoasterPhotoManager } from './photo-manager';

export const dynamic = 'force-dynamic';

type Photo = { url: string; path: string; alt?: string };

export default async function EditRoasterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: roaster } = await supabase
    .from('roasters')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!roaster) notFound();

  const action = updateRoaster.bind(null, id);
  const del = async () => {
    'use server';
    await deleteRoaster(id);
  };

  const photos: Photo[] = Array.isArray(roaster.photos)
    ? (roaster.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-serif text-2xl">{roaster.name}</h2>
          <p className="text-muted-foreground text-sm">{roaster.slug}</p>
        </div>
        <form action={del}>
          <button type="submit" className="text-destructive text-sm hover:underline">
            Supprimer
          </button>
        </form>
      </div>

      <section>
        <h3 className="font-serif text-xl mb-4">Photos</h3>
        <RoasterPhotoManager roasterId={id} photos={photos} />
      </section>

      <section>
        <h3 className="font-serif text-xl mb-4">Infos</h3>
        <RoasterForm
          action={action}
          submitLabel="Enregistrer"
          initial={{
            name: roaster.name,
            slug: roaster.slug,
            city: roaster.city,
            description: roaster.description,
            website: roaster.website,
            instagram: roaster.instagram,
          }}
        />
      </section>
    </div>
  );
}
