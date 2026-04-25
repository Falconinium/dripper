import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { deleteShop, updateShop } from '../actions';
import { ShopForm } from '../shop-form';
import { PhotoManager } from './photo-manager';
import { RoasterLinkForm } from './roaster-link';

export const dynamic = 'force-dynamic';

type Photo = { url: string; path: string; alt?: string };

export default async function EditShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!shop) notFound();

  const { data: shopCoords } = await supabase
    .from('shops_public')
    .select('lng, lat')
    .eq('id', id)
    .maybeSingle();

  const action = updateShop.bind(null, id);
  const deleteAction = async () => {
    'use server';
    await deleteShop(id);
  };

  const photos: Photo[] = Array.isArray(shop.photos)
    ? (shop.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];

  const { data: allRoasters } = await supabase
    .from('roasters')
    .select('id, name, city')
    .order('name');

  const { data: links } = await supabase
    .from('shop_roasters')
    .select('roaster_id, is_primary')
    .eq('shop_id', id);

  const coords =
    shopCoords && typeof shopCoords.lng === 'number' && typeof shopCoords.lat === 'number'
      ? { lng: shopCoords.lng, lat: shopCoords.lat }
      : null;

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-serif text-2xl">{shop.name}</h2>
          <p className="text-muted-foreground text-sm">{shop.slug}</p>
        </div>
        <form action={deleteAction}>
          <button
            type="submit"
            className="text-destructive hover:underline text-sm"
            aria-label="Supprimer"
          >
            Supprimer
          </button>
        </form>
      </div>

      <section>
        <h3 className="font-serif text-xl mb-4">Photos</h3>
        <PhotoManager shopId={id} photos={photos} />
      </section>

      <section>
        <h3 className="font-serif text-xl mb-4">Torréfacteurs associés</h3>
        <RoasterLinkForm
          shopId={id}
          slug={shop.slug}
          roasters={allRoasters ?? []}
          initial={links ?? []}
        />
      </section>

      <section>
        <h3 className="font-serif text-xl mb-4">Infos</h3>
        <ShopForm
          action={action}
          submitLabel="Enregistrer"
          mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''}
          initial={{
            name: shop.name,
            slug: shop.slug,
            description: shop.description,
            address: shop.address,
            city: shop.city,
            postal_code: shop.postal_code,
            phone: shop.phone,
            website: shop.website,
            instagram: shop.instagram,
            espresso_machine: shop.espresso_machine,
            methods: shop.methods,
            options: shop.options,
            is_selection: shop.is_selection,
            status: shop.status,
            coords,
          }}
        />
      </section>
    </div>
  );
}
