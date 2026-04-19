import Link from 'next/link';

import { Button } from '@/components/ui/button';

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

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-8 px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          Phase 0 · France
        </p>
        <h1 className="font-serif text-5xl leading-[1.02] font-normal md:text-7xl">
          Là où le café est pris
          <br />
          <em className="italic">au sérieux.</em>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
          Dripper est le guide des coffee shops français qui travaillent vraiment le grain. Carte,
          critères Sélection, carnet de dégustation — bientôt, tout ce qu’il faut pour trouver la
          bonne tasse.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/manifeste">Lire le manifeste</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/selection">Voir les critères Sélection</Link>
          </Button>
        </div>
      </section>

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

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-24 md:py-32">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">À venir</p>
        <h2 className="font-serif text-4xl leading-tight font-normal md:text-5xl">
          Une carte.
          <br />
          <em className="text-muted-foreground italic">Pas une vitrine.</em>
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Chaque adresse référencée fera l’objet d’une visite ou d’un audit. Chaque score sera
          justifié. Chaque shop Sélection sera vérifié sur les quatre critères non-négociables.
        </p>
      </section>
    </main>
  );
}
