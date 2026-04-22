import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ShopCard } from '@/components/shop-card';
import { listCities } from '@/lib/cities';
import { listContent } from '@/lib/content/mdx';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const METHOD_OPTIONS = [
  { key: 'espresso', label: 'Espresso' },
  { key: 'v60', label: 'V60' },
  { key: 'aeropress', label: 'Aeropress' },
  { key: 'chemex', label: 'Chemex' },
  { key: 'kalita', label: 'Kalita' },
  { key: 'cold_brew', label: 'Cold brew' },
];

const OPTION_OPTIONS = [
  { key: 'decaf', label: 'Décaf' },
  { key: 'oat_milk', label: 'Lait d’avoine' },
  { key: 'soy_milk', label: 'Lait de soja' },
  { key: 'beans_to_go', label: 'Grains à emporter' },
];

type SearchParams = {
  city?: string;
  method?: string | string[];
  option?: string | string[];
  selection?: string;
};

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { city } = await searchParams;
  if (!city) {
    return {
      title: 'Coffee shops de spécialité',
      description: 'Tous les coffee shops de spécialité référencés par Dripper en France.',
    };
  }
  const cities = await listCities();
  const cityEntry = cities.find((c) => c.slug === city);
  if (!cityEntry) return { title: 'Ville introuvable' };
  return {
    title: `Coffee shops de spécialité à ${cityEntry.name}`,
    description: `Les ${cityEntry.count} coffee shops de spécialité de ${cityEntry.name} référencés par Dripper. Grains travaillés, extraction maîtrisée, adresses vérifiées.`,
  };
}

export default async function ShopsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const cities = await listCities();

  const citySlug = params.city ?? null;
  const cityEntry = citySlug ? cities.find((c) => c.slug === citySlug) : null;
  if (citySlug && !cityEntry) notFound();

  const selectedMethods = toArray(params.method);
  const selectedOptions = toArray(params.option);
  const onlySelection = params.selection === '1';

  let query = supabase
    .from('shops')
    .select('id, slug, name, city, description, is_selection, methods, options, photos')
    .eq('status', 'published')
    .order('name');

  if (cityEntry) query = query.ilike('city', cityEntry.name);
  if (onlySelection) query = query.eq('is_selection', true);
  for (const m of selectedMethods) query = query.contains('methods', [m]);
  for (const o of selectedOptions) query = query.contains('options', [o]);

  const { data: shops } = await query;

  const scoresByShop = new Map<string, number>();
  if (shops?.length) {
    const { data: scores } = await supabase
      .from('shop_scores')
      .select('shop_id, avg_cup_score')
      .in(
        'shop_id',
        shops.map((s) => s.id),
      );
    for (const row of scores ?? []) {
      if (row.avg_cup_score !== null && row.shop_id) {
        scoresByShop.set(row.shop_id, Number(row.avg_cup_score));
      }
    }
  }

  const guides = cityEntry ? await listContent('guides') : [];
  const matchingGuide = cityEntry
    ? guides.find((g) => (g.city ?? '').toLowerCase() === cityEntry.name.toLowerCase())
    : null;

  const count = shops?.length ?? 0;
  const title = cityEntry
    ? cityEntry.name
    : 'Toute la France';

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-20">
      <nav className="text-muted-foreground mb-4 text-xs">
        <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
          Accueil
        </Link>{' '}
        ·{' '}
        <Link href="/shops" className="hover:text-foreground underline-offset-4 hover:underline">
          Shops
        </Link>
        {cityEntry ? ` · ${cityEntry.name}` : null}
      </nav>

      <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
        Coffee shops de spécialité
      </p>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          À <em className="italic">{title}.</em>
        </h1>
        <Link
          href={cityEntry ? `/carte?city=${cityEntry.slug}` : '/carte'}
          className="border-border hover:bg-muted/40 rounded-full border px-4 py-2 text-sm transition-colors"
        >
          Voir sur la carte
        </Link>
      </div>

      {matchingGuide ? (
        <div className="border-border mt-8 rounded-md border p-6 md:p-8">
          <p className="text-muted-foreground mb-2 text-xs tracking-[0.2em] uppercase">
            Guide éditorial
          </p>
          <h2 className="font-serif text-2xl leading-tight">{matchingGuide.title}</h2>
          {matchingGuide.excerpt ? (
            <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
              {matchingGuide.excerpt}
            </p>
          ) : null}
          <Link
            href={`/guides/${matchingGuide.slug}`}
            className="mt-4 inline-block text-sm underline underline-offset-4"
          >
            Lire le guide complet
          </Link>
        </div>
      ) : null}

      <form className="border-border mt-10 rounded-md border p-5">
        {citySlug ? <input type="hidden" name="city" value={citySlug} /> : null}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <fieldset>
            <legend className="text-muted-foreground mb-2 text-xs tracking-[0.2em] uppercase">
              Sélection
            </legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="selection"
                value="1"
                defaultChecked={onlySelection}
                className="size-4"
              />
              Uniquement shops Sélection
            </label>
          </fieldset>

          <fieldset>
            <legend className="text-muted-foreground mb-2 text-xs tracking-[0.2em] uppercase">
              Méthodes
            </legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {METHOD_OPTIONS.map((m) => (
                <label key={m.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="method"
                    value={m.key}
                    defaultChecked={selectedMethods.includes(m.key)}
                    className="size-4"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-muted-foreground mb-2 text-xs tracking-[0.2em] uppercase">
              Options
            </legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {OPTION_OPTIONS.map((o) => (
                <label key={o.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="option"
                    value={o.key}
                    defaultChecked={selectedOptions.includes(o.key)}
                    className="size-4"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="border-foreground hover:bg-foreground hover:text-background rounded-md border px-4 py-2 text-sm transition-colors"
          >
            Filtrer
          </button>
          <Link
            href={cityEntry ? `/shops?city=${cityEntry.slug}` : '/shops'}
            className="text-muted-foreground hover:text-foreground self-center text-sm"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      </form>

      <p className="text-muted-foreground mt-8 text-sm">
        {count} {count > 1 ? 'résultats' : 'résultat'}.
      </p>

      {!count ? (
        <p className="text-muted-foreground mt-6">Aucun shop ne correspond à ces critères.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-8">
          {shops!.map((s) => (
            <li key={s.id}>
              <ShopCard
                slug={s.slug}
                name={s.name}
                city={s.city}
                description={s.description}
                is_selection={s.is_selection}
                photos={s.photos}
                cup_score={scoresByShop.get(s.id) ?? null}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
