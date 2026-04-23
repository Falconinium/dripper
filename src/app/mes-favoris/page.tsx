import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ShopCard } from '@/components/shop-card';
import { createClient } from '@/lib/supabase/server';

import { removeFavorite } from './actions';

export const metadata: Metadata = { title: 'Mes favoris' };

export default async function MesFavorisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/connexion?next=/mes-favoris');

  const { data: favorites } = await supabase
    .from('favorites')
    .select(
      'shop_id, created_at, shops:shops!inner(id, slug, name, city, description, is_selection, photos, status)',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const publishedFavorites =
    favorites?.filter((f) => f.shops && f.shops.status === 'published') ?? [];

  const scoresByShop = new Map<string, number>();
  if (publishedFavorites.length) {
    const { data: scores } = await supabase
      .from('shop_scores')
      .select('shop_id, avg_cup_score')
      .in(
        'shop_id',
        publishedFavorites.map((f) => f.shops!.id),
      );
    for (const row of scores ?? []) {
      if (row.avg_cup_score !== null && row.shop_id) {
        scoresByShop.set(row.shop_id, Number(row.avg_cup_score));
      }
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-20">
      <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">Mes favoris</p>
      <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
        Mes <em className="italic">adresses.</em>
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl">
        {publishedFavorites.length}{' '}
        {publishedFavorites.length > 1 ? 'shops enregistrés' : 'shop enregistré'}.
      </p>

      {!publishedFavorites.length ? (
        <p className="text-muted-foreground mt-10 text-sm">
          Aucun favori pour l’instant. Parcourez la{' '}
          <Link href="/carte" className="underline underline-offset-4">
            carte
          </Link>{' '}
          ou la{' '}
          <Link href="/shops" className="underline underline-offset-4">
            liste des shops
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-8">
          {publishedFavorites.map((f, i) => {
            const shop = f.shops!;
            const remove = async () => {
              'use server';
              await removeFavorite(f.shop_id);
            };
            return (
              <li key={f.shop_id} className="flex flex-col">
                <ShopCard
                  slug={shop.slug}
                  name={shop.name}
                  city={shop.city}
                  description={shop.description}
                  is_selection={shop.is_selection}
                  photos={shop.photos}
                  cup_score={scoresByShop.get(shop.id) ?? null}
                  priority={i === 0}
                />
                <form action={remove} className="mt-3 px-1">
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-destructive text-xs underline underline-offset-4"
                  >
                    Retirer des favoris
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
