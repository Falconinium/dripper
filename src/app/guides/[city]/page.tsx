import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllSlugs, getContentBody, getContentMeta } from '@/lib/content/mdx';
import { RenderMdx } from '@/lib/content/render';
import { createClient } from '@/lib/supabase/server';

export async function generateStaticParams() {
  const slugs = await getAllSlugs('guides');
  return slugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const meta = await getContentMeta('guides', city);
  if (!meta) return { title: 'Guide introuvable' };
  return { title: meta.title, description: meta.excerpt };
}

export default async function CityGuide({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const [meta, body] = await Promise.all([
    getContentMeta('guides', city),
    getContentBody('guides', city),
  ]);
  if (!meta || !body) notFound();

  const supabase = await createClient();
  const { data: shops } = meta.city
    ? await supabase
        .from('shops')
        .select('slug, name, is_selection, description')
        .eq('status', 'published')
        .ilike('city', meta.city)
        .order('name')
    : { data: [] };

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
        Guide · {meta.city ?? city}
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal md:text-6xl">{meta.title}</h1>
      {meta.excerpt ? (
        <p className="text-muted-foreground mt-6 text-xl leading-relaxed">{meta.excerpt}</p>
      ) : null}
      <div className="mt-12">
        <RenderMdx source={body} />
      </div>

      {shops?.length ? (
        <section className="mt-20 border-t pt-12">
          <h2 className="font-serif text-3xl">Les adresses</h2>
          <ul className="divide-border mt-8 divide-y">
            {shops.map((s) => (
              <li key={s.slug} className="py-5">
                <Link
                  href={`/shops/${s.slug}`}
                  className="group flex items-baseline justify-between gap-4"
                >
                  <div>
                    <h3 className="font-serif text-xl group-hover:underline underline-offset-4">
                      {s.name}
                    </h3>
                    {s.description ? (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                  {s.is_selection ? (
                    <span className="border-border shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase">
                      Sélection
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
