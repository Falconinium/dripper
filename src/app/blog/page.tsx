import type { Metadata } from 'next';
import Link from 'next/link';

import { listContent } from '@/lib/content/mdx';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Articles, réflexions et actualités du café de spécialité.',
};

export default async function BlogIndex() {
  const posts = await listContent('blog');

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">Journal</p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">
        Le <em className="italic">journal.</em>
      </h1>

      {!posts.length ? (
        <p className="text-muted-foreground mt-12">Bientôt.</p>
      ) : (
        <ul className="divide-border mt-16 divide-y">
          {posts.map((p) => (
            <li key={p.slug} className="py-8">
              <Link href={`/blog/${p.slug}`} className="group block">
                <p className="text-muted-foreground mb-2 text-xs tracking-[0.15em] uppercase">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}{' '}
                  · {p.readingMinutes} min
                </p>
                <h2 className="font-serif text-2xl leading-snug group-hover:underline underline-offset-4 md:text-3xl">
                  {p.title}
                </h2>
                {p.excerpt ? (
                  <p className="text-muted-foreground mt-3">{p.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
