import type { Metadata } from 'next';

import { createClient } from '@/lib/supabase/server';

import { MapView, type ShopPin } from './map-view';

export const metadata: Metadata = {
  title: 'Carte',
  description:
    'Tous les coffee shops de spécialité référencés par Dripper, sur une carte interactive de France.',
};

export const dynamic = 'force-dynamic';

export default async function CartePage() {
  const supabase = await createClient();
  const { data: shops } = await supabase
    .from('shops_public')
    .select('id, slug, name, city, is_selection, lng, lat')
    .eq('status', 'published');

  const pins: ShopPin[] = (shops ?? [])
    .map((s) => {
      if (!s.id || !s.slug || !s.name || typeof s.lng !== 'number' || typeof s.lat !== 'number') {
        return null;
      }
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        city: s.city,
        isSelection: !!s.is_selection,
        lng: s.lng,
        lat: s.lat,
      } satisfies ShopPin;
    })
    .filter((p): p is ShopPin => p !== null);

  return (
    <main className="flex flex-1 flex-col">
      <div className="border-border border-b px-6 py-6">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Carte</p>
        <h1 className="font-serif text-3xl md:text-4xl">
          Les cafés de spécialité, <em className="italic">en France.</em>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {pins.length} {pins.length > 1 ? 'adresses référencées' : 'adresse référencée'}.
        </p>
      </div>
      <MapView pins={pins} token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''} />
    </main>
  );
}
