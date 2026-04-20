import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { listContent } from '@/lib/content/mdx';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const pillars = [
  {
    title: 'Curation éditoriale',
    body: 'Une sélection de coffee shops français évalués sur ce qui compte : la qualité de la tasse, pas la déco Instagram.',
  },
  {
    title: 'Double notation',
    body: 'Un score Tasse distinct du score Expérience. Pour savoir enfin si un lieu sert un bon café, indépendamment du reste.',
  },
  {
    title: 'Transparence',
    body: 'Le label Sélection repose sur quatre critères publics, auditables, et jamais monétisés.',
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [shopsRes, guides] = await Promise.all([
    supabase
      .from('shops')
      .select('slug, name, city, description')
      .eq('status', 'published')
      .eq('is_selection', true)
      .order('name')
      .limit(6),
    listContent('guides'),
  ]);

  const featured = shopsRes.data ?? [];
  const latestGuides = guides.slice(0, 3);

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-8 px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Le guide du café de spécialité · France
        </p>
        <h1 className="font-serif text-5xl leading-[1.02] font-normal md:text-7xl">
          Là où le café est pris
          <br />
          <em className="italic">au sérieux.</em>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
          Dripper référence les coffee shops français qui travaillent vraiment le grain.
          Une carte, des critères publics, des torréfacteurs identifiés, des avis qualifiés.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/carte">Explorer la carte</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/selection">Les critères Sélection</Link>
          </Button>
        </div>
      </section>

      {featured.length ? (
        <section className="border-border/60 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
                  Sélection Dripper
                </p>
                <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                  Les adresses <em className="italic">vérifiées.</em>
                </h2>
              </div>
              <Link
                href="/carte"
                className="text-muted-foreground hover:text-foreground hidden text-sm underline underline-offset-4 md:block"
              >
                Voir toutes les adresses
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border border-border md:grid-cols-2 lg:grid-cols-3">
              {featured.map((s) => (
                <li key={s.slug} className="bg-background">
                  <Link
                    href={`/shops/${s.slug}`}
                    className="hover:bg-muted/40 flex h-full flex-col gap-2 p-6 transition-colors"
                  >
                    <h3 className="font-serif text-xl leading-tight">{s.name}</h3>
                    {s.city ? (
                      <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                        {s.city}
                      </p>
                    ) : null}
                    {s.description ? (
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {s.description}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-border/60 bg-muted/30 border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-3 md:py-24">
          {pillars.map((p) => (
            <article key={p.title} className="flex flex-col gap-3">
              <h2 className="font-serif text-2xl leading-tight font-normal">{p.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {latestGuides.length ? (
        <section className="border-border/60 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
                  Guides
                </p>
                <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                  Par <em className="italic">ville.</em>
                </h2>
              </div>
              <Link
                href="/guides"
                className="text-muted-foreground hover:text-foreground hidden text-sm underline underline-offset-4 md:block"
              >
                Tous les guides
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border border-border md:grid-cols-3">
              {latestGuides.map((g) => (
                <li key={g.slug} className="bg-background">
                  <Link
                    href={`/guides/${g.slug}`}
                    className="hover:bg-muted/40 flex h-full flex-col gap-2 p-6 transition-colors"
                  >
                    <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                      {g.city ?? g.slug}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-tight">{g.title}</h3>
                    {g.excerpt ? (
                      <p className="text-muted-foreground mt-2 text-sm line-clamp-3">
                        {g.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-24 md:py-32">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Découvrir
        </p>
        <h2 className="font-serif text-4xl leading-tight font-normal md:text-5xl">
          L’annuaire des{' '}
          <Link href="/torrefacteurs" className="italic underline underline-offset-[6px]">
            torréfacteurs
          </Link>
          .
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Sans eux, pas de tasse. On recense les artisans qui sourcent, cuisent et livrent
          les grains travaillés dans les shops qu’on recommande.
        </p>
      </section>
    </main>
  );
}
