import type { Metadata } from 'next';
import Link from 'next/link';

import { listContent } from '@/lib/content/mdx';

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Guides éditoriaux Dripper : repérer un bon coffee shop, sélections par ville, méthodes d’extraction et bases du café de spécialité.',
};

export default async function GuidesIndex() {
  const guides = await listContent('guides');

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">Guides</p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        Le guide du <em className="italic">café.</em>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl">
        Comprendre ce qui distingue un vrai café de spécialité, repérer les bons
        coffee shops, et découvrir des sélections par ville.
      </p>

      {!guides.length ? (
        <p className="text-muted-foreground mt-12">Bientôt.</p>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug} className="border-border bg-background rounded-md border">
              <Link href={`/guides/${g.slug}`} className="hover:bg-muted/40 block p-6 transition-colors">
                <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
                  {g.city ?? 'Guide'}
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight">{g.title}</h2>
                {g.excerpt ? (
                  <p className="text-muted-foreground mt-3 text-sm">{g.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
