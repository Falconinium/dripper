import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

type Photo = { url: string; alt?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: roaster } = await supabase
    .from('roasters')
    .select('name, description')
    .eq('slug', slug)
    .maybeSingle();
  if (!roaster) return { title: 'Torréfacteur introuvable' };
  return { title: roaster.name, description: roaster.description ?? undefined };
}

export default async function RoasterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: roaster } = await supabase
    .from('roasters')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!roaster) notFound();

  const { data: shopLinks } = await supabase
    .from('shop_roasters')
    .select('is_primary, shops:shops!inner(slug, name, city, is_selection, status)')
    .eq('roaster_id', roaster.id);

  const shops =
    shopLinks
      ?.filter((l) => l.shops && l.shops.status === 'published')
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary)) ?? [];

  const photos: Photo[] = Array.isArray(roaster.photos)
    ? (roaster.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];
  const cover = photos[0];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">
        Torréfacteur{roaster.city ? ` · ${roaster.city}` : ''}
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
        <em className="italic">{roaster.name}</em>
      </h1>
      {roaster.description ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          {roaster.description}
        </p>
      ) : null}

      {cover ? (
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-md">
          <Image
            src={cover.url}
            alt={cover.alt ?? roaster.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 64rem, 100vw"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          {photos.length > 1 ? (
            <section>
              <h2 className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">
                Photos
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.slice(1).map((p) => (
                  <div
                    key={p.url}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
                    <Image
                      src={p.url}
                      alt={p.alt ?? roaster.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="font-serif text-2xl mb-4">
              Shops qui travaillent ce grain ({shops.length})
            </h2>
            {!shops.length ? (
              <p className="text-muted-foreground text-sm">
                Aucun shop référencé pour ce torréfacteur.
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {shops.map((s) => (
                  <li key={s.shops!.slug} className="py-4">
                    <Link
                      href={`/shops/${s.shops!.slug}`}
                      className="group flex items-baseline justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-serif text-xl group-hover:underline underline-offset-4">
                          {s.shops!.name}
                        </h3>
                        {s.shops!.city ? (
                          <p className="text-muted-foreground text-xs">{s.shops!.city}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {s.is_primary ? (
                          <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                            Principal
                          </span>
                        ) : null}
                        {s.shops!.is_selection ? (
                          <span className="border-border rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase">
                            Sélection
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4 text-sm">
          {roaster.city ? (
            <InfoRow label="Ville" value={roaster.city} />
          ) : null}
          {roaster.website ? (
            <InfoRow
              label="Site"
              value={
                <Link href={roaster.website} className="underline underline-offset-4">
                  {roaster.website.replace(/^https?:\/\//, '')}
                </Link>
              }
            />
          ) : null}
          {roaster.instagram ? (
            <InfoRow
              label="Instagram"
              value={
                <Link
                  href={`https://instagram.com/${roaster.instagram.replace(/^@/, '')}`}
                  className="underline underline-offset-4"
                >
                  @{roaster.instagram.replace(/^@/, '')}
                </Link>
              }
            />
          ) : null}
        </aside>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="border-border flex flex-col gap-1 border-b pb-4">
      <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
