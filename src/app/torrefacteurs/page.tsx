import type { Metadata } from 'next';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Torréfacteurs',
  description:
    'Les torréfacteurs de spécialité français que nous suivons, et les shops qui travaillent leurs grains.',
};

export const dynamic = 'force-dynamic';

export default async function RoastersIndex() {
  const supabase = await createClient();
  const { data: roasters } = await supabase
    .from('roasters')
    .select('id, slug, name, city, description')
    .order('name');

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">Annuaire</p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        Les <em className="italic">torréfacteurs.</em>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl">
        Sans eux, pas de tasse. Les artisans qui sourcent, cuisent et livrent les grains des shops
        qu’on recommande.
      </p>

      {!roasters?.length ? (
        <p className="text-muted-foreground mt-12">Bientôt.</p>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border border-border md:grid-cols-2">
          {roasters.map((r) => (
            <li key={r.id} className="bg-background">
              <Link
                href={`/torrefacteurs/${r.slug}`}
                className="hover:bg-muted/40 flex h-full flex-col gap-2 p-6 transition-colors"
              >
                <h2 className="font-serif text-2xl leading-tight">{r.name}</h2>
                {r.city ? (
                  <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                    {r.city}
                  </p>
                ) : null}
                {r.description ? (
                  <p className="text-muted-foreground line-clamp-3 text-sm">{r.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
