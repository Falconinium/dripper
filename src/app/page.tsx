import Link from 'next/link';

import { Marquee } from '@/components/animated/marquee';
import { Reveal } from '@/components/animated/reveal';
import { RotatingWord } from '@/components/animated/rotating-word';
import { HeroSearch } from '@/components/hero-search';
import { ShopCard } from '@/components/shop-card';
import { Button } from '@/components/ui/button';
import { listCities } from '@/lib/cities';
import { listContent } from '@/lib/content/mdx';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const pillars = [
  {
    title: 'Curation éditoriale',
    body: 'Une sélection de coffee shops français évalués sur ce qui compte : la qualité de la tasse, pas la déco Instagram.',
  },
  {
    title: 'Notation honnête',
    body: 'Une note Expérience attribuée par les amateurs, pour savoir enfin si un lieu sert un bon café, indépendamment de la déco.',
  },
  {
    title: 'Transparence',
    body: 'Le label Sélection repose sur quatre critères publics, auditables, et jamais monétisés.',
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [shopsRes, allShopsRes, guides, cities] = await Promise.all([
    supabase
      .from('shops')
      .select('id, slug, name, city, description, is_selection, photos')
      .eq('status', 'published')
      .eq('is_selection', true)
      .order('name')
      .limit(6),
    supabase
      .from('shops')
      .select('slug, name, city')
      .eq('status', 'published')
      .order('name'),
    listContent('guides'),
    listCities(),
  ]);

  const allShops = allShopsRes.data ?? [];

  const featured = shopsRes.data ?? [];
  const latestGuides = guides.slice(0, 3);
  const topCities = cities.slice(0, 5);

  const scoresByShop = new Map<string, number>();
  if (featured.length) {
    const { data: scores } = await supabase
      .from('shop_scores')
      .select('shop_id, avg_experience_score')
      .in(
        'shop_id',
        featured.map((s) => s.id),
      );
    for (const row of scores ?? []) {
      if (row.avg_experience_score !== null && row.shop_id) {
        scoresByShop.set(row.shop_id, Number(row.avg_experience_score));
      }
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start justify-center gap-8 px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Le guide du café de spécialité · France
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-7xl">
          <span className="block">
            Là où{' '}
            <RotatingWord
              words={['le café', 'le grain', 'le filtre', 'l’espresso']}
            />
          </span>
          <span className="block">
            est pris <em className="italic">au sérieux.</em>
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
          Trouve les meilleurs coffee shops de spécialité dans ta ville. Grains
          travaillés, extraction maîtrisée, adresses vérifiées.
        </p>

        <div className="w-full max-w-xl pt-2">
          <HeroSearch cities={cities} shops={allShops} />
        </div>

        {topCities.length ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Populaires
            </span>
            {topCities.map((c) => (
              <Link
                key={c.slug}
                href={`/shops?city=${c.slug}`}
                className="border-border hover:bg-muted/40 rounded-full border px-3 py-1 text-xs transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Button asChild size="lg" variant="outline">
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
                href="/shops?selection=1"
                className="text-muted-foreground hover:text-foreground hidden text-sm underline underline-offset-4 md:block"
              >
                Voir toutes les adresses
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-8">
              {featured.map((s, i) => (
                <Reveal key={s.slug} as="li" delay={i * 0.08}>
                  <ShopCard
                    slug={s.slug}
                    name={s.name}
                    city={s.city}
                    description={s.description}
                    is_selection={s.is_selection}
                    photos={s.photos}
                    score={scoresByShop.get(s.id) ?? null}
                    priority={i === 0}
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-border/60 bg-muted/30 border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-3 md:py-24">
          {pillars.map((p, i) => (
            <Reveal
              key={p.title}
              as="article"
              delay={i * 0.1}
              className="flex flex-col gap-3"
            >
              <h2 className="font-serif text-2xl leading-tight font-normal">{p.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {cities.length ? (
        <section className="border-border/60 border-t border-b py-10 md:py-12">
          <Marquee items={cities.map((c) => c.name)} />
        </section>
      ) : null}

      {latestGuides.length ? (
        <section className="border-border/60 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
                  Guides
                </p>
                <h2 className="font-serif text-3xl leading-tight md:text-4xl">
                  Le guide du <em className="italic">café.</em>
                </h2>
              </div>
              <Link
                href="/guides"
                className="text-muted-foreground hover:text-foreground hidden text-sm underline underline-offset-4 md:block"
              >
                Tous les guides
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestGuides.map((g, i) => (
                <Reveal
                  key={g.slug}
                  as="li"
                  delay={i * 0.08}
                  className="border-border bg-background rounded-md border"
                >
                  <Link
                    href={`/guides/${g.slug}`}
                    className="hover:bg-muted/40 flex h-full flex-col gap-2 p-6 transition-colors"
                  >
                    <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                      {g.city ?? 'Guide'}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-tight">{g.title}</h3>
                    {g.excerpt ? (
                      <p className="text-muted-foreground mt-2 text-sm line-clamp-3">
                        {g.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-border/60 bg-muted/30 border-t border-b">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-6 py-20 md:py-24">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
            Communauté
          </p>
          <h2 className="font-serif text-3xl leading-tight font-normal md:text-4xl">
            Une adresse <em className="italic">manquante</em>{' '}?
          </h2>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
            Vous connaissez un coffee shop sérieux qui n’est pas encore
            référencé&nbsp;? Partagez-le avec nous. L’équipe éditoriale
            relit chaque proposition au regard des critères Sélection.
          </p>
          <Link
            href="/proposer-un-shop"
            className="text-foreground underline underline-offset-4"
          >
            Proposer une adresse →
          </Link>
        </div>
      </section>

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
