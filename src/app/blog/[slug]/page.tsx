import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllSlugs, getContentBody, getContentMeta } from '@/lib/content/mdx';
import { RenderMdx } from '@/lib/content/render';

export async function generateStaticParams() {
  const slugs = await getAllSlugs('blog');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getContentMeta('blog', slug);
  if (!meta) return { title: 'Article introuvable' };
  return { title: meta.title, description: meta.excerpt };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [meta, body] = await Promise.all([
    getContentMeta('blog', slug),
    getContentBody('blog', slug),
  ]);
  if (!meta || !body) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        {meta.published_at
          ? new Date(meta.published_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'Journal'}{' '}
        · {meta.readingMinutes} min
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">{meta.title}</h1>
      {meta.excerpt ? (
        <p className="text-muted-foreground mt-6 text-xl leading-relaxed">{meta.excerpt}</p>
      ) : null}
      <div className="mt-12">
        <RenderMdx source={body} />
      </div>
    </article>
  );
}
