import type { Metadata } from 'next';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Sélection',
  description:
    'Tous les coffee shops labellisés Sélection Dripper, filtrés par ville, méthodes et options.',
};

export const dynamic = 'force-dynamic';

const METHOD_OPTIONS = [
  { key: 'espresso', label: 'Espresso' },
  { key: 'v60', label: 'V60' },
  { key: 'aeropress', label: 'Aeropress' },
  { key: 'chemex', label: 'Chemex' },
  { key: 'kalita', label: 'Kalita' },
];

const OPTION_OPTIONS = [
  { key: 'decaf', label: 'Décaf' },
  { key: 'oat_milk', label: 'Lait d’avoine' },
  { key: 'beans_to_go', label: 'Grains à emporter' },
];

type SearchParams = {
  q?: string;
  city?: string;
  method?: string;
  option?: string;
  selection?: string;
};

export default async function SelectionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('shops')
    .select('id, slug, name, city, description, is_selection, methods, options, photos')
    .eq('status', 'published')
    .order('name', { ascending: true });

  if (params.selection === '1') query = query.eq('is_selection', true);
  if (params.city) query = query.ilike('city', params.city);
  if (params.q) query = query.ilike('name', `%${params.q}%`);
  if (params.method) query = query.contains('methods', [params.method]);
  if (params.option) query = query.contains('options', [params.option]);

  const { data: shops } = await query;

  const { data: cityRows } = await supabase
    .from('shops')
    .select('city')
    .eq('status', 'published')
    .not('city', 'is', null);

  const cities = Array.from(new Set((cityRows ?? []).map((r) => r.city).filter(Boolean))).sort();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
            Annuaire
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
            Sélection <em className="italic">Dripper.</em>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Les adresses qui prennent le café au sérieux. Les shops marqués{' '}
            <span className="border-border rounded-full border px-2 py-0.5 text-xs">
              Sélection
            </span>{' '}
            passent nos quatre critères — voir{' '}
            <Link href="/selection/criteres" className="underline underline-offset-4">
              les critères
            </Link>
            .
          </p>
        </div>
      </div>

      <form className="border-border mt-10 grid grid-cols-1 gap-4 rounded-md border p-5 md:grid-cols-5">
        <div className="md:col-span-2">
          <label className="text-muted-foreground text-xs tracking-[0.2em] uppercase" htmlFor="q">
            Recherche
          </label>
          <input
            id="q"
            name="q"
            defaultValue={params.q ?? ''}
            placeholder="Nom"
            className="border-border bg-background mt-1 w-full rounded-md border px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="text-muted-foreground text-xs tracking-[0.2em] uppercase" htmlFor="city">
            Ville
          </label>
          <select
            id="city"
            name="city"
            defaultValue={params.city ?? ''}
            className="border-border bg-background mt-1 w-full rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="">Toutes</option>
            {cities.map((c) => (
              <option key={c} value={c!}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
            htmlFor="method"
          >
            Méthode
          </label>
          <select
            id="method"
            name="method"
            defaultValue={params.method ?? ''}
            className="border-border bg-background mt-1 w-full rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="">Toutes</option>
            {METHOD_OPTIONS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="text-muted-foreground text-xs tracking-[0.2em] uppercase"
            htmlFor="option"
          >
            Option
          </label>
          <select
            id="option"
            name="option"
            defaultValue={params.option ?? ''}
            className="border-border bg-background mt-1 w-full rounded-md border px-3 py-1.5 text-sm"
          >
            <option value="">Toutes</option>
            {OPTION_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm md:col-span-5">
          <input
            type="checkbox"
            name="selection"
            value="1"
            defaultChecked={params.selection === '1'}
            className="size-4"
          />
          Uniquement les shops Sélection
        </label>
        <div className="flex gap-3 md:col-span-5">
          <button
            type="submit"
            className="border-foreground hover:bg-foreground hover:text-background rounded-md border px-4 py-2 text-sm transition-colors"
          >
            Filtrer
          </button>
          <Link
            href="/selection"
            className="text-muted-foreground hover:text-foreground self-center text-sm"
          >
            Réinitialiser
          </Link>
        </div>
      </form>

      <p className="text-muted-foreground mt-8 text-sm">
        {shops?.length ?? 0} {(shops?.length ?? 0) > 1 ? 'résultats' : 'résultat'}.
      </p>

      {!shops?.length ? (
        <p className="text-muted-foreground mt-6">Aucun shop ne correspond.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-md border md:grid-cols-2 lg:grid-cols-3 bg-border border-border">
          {shops.map((s) => (
            <li key={s.id} className="bg-background">
              <Link
                href={`/shops/${s.slug}`}
                className="hover:bg-muted/40 flex h-full flex-col gap-2 p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl leading-tight">{s.name}</h3>
                  {s.is_selection ? (
                    <span className="border-border shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase">
                      Sélection
                    </span>
                  ) : null}
                </div>
                {s.city ? (
                  <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                    {s.city}
                  </p>
                ) : null}
                {s.description ? (
                  <p className="text-muted-foreground line-clamp-3 text-sm">{s.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
