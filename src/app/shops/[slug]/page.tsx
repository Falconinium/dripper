import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { adminDeleteReview, deleteMyReview } from './actions';
import { FavoriteButton } from './favorite-button';
import { ReviewForm } from './review-form';
import { ShopMap } from './shop-map';

type Photo = { url: string; alt?: string };

const METHOD_LABELS: Record<string, string> = {
  espresso: 'Espresso',
  v60: 'V60',
  aeropress: 'Aeropress',
  chemex: 'Chemex',
  kalita: 'Kalita',
  cold_brew: 'Cold brew',
};

const OPTION_LABELS: Record<string, string> = {
  decaf: 'Décaf',
  oat_milk: 'Lait d’avoine',
  soy_milk: 'Lait de soja',
  beans_to_go: 'Grains à emporter',
  wifi: 'Wifi',
  seating: 'Places assises',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('name, description')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!shop) return { title: 'Shop introuvable' };
  return { title: shop.name, description: shop.description ?? undefined };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!shop) notFound();

  const { data: coordsRow } = await supabase
    .from('shops_public')
    .select('lng, lat')
    .eq('id', shop.id)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [scoresRes, reviewsRes, myReviewRes, favRes, profileRes, roastersRes] = await Promise.all([
    supabase
      .from('shop_scores')
      .select('avg_cup_score, avg_experience_score, review_count')
      .eq('shop_id', shop.id)
      .maybeSingle(),
    supabase
      .from('reviews_with_author')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false })
      .limit(50),
    user
      ? supabase
          .from('reviews')
          .select('cup_score, experience_score, comment, drink_ordered')
          .eq('shop_id', shop.id)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from('favorites')
          .select('shop_id')
          .eq('shop_id', shop.id)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('shop_roasters')
      .select('is_primary, roasters:roasters!inner(slug, name, city)')
      .eq('shop_id', shop.id),
  ]);

  const scores = scoresRes.data;
  const reviews = reviewsRes.data ?? [];
  const myReview = myReviewRes.data;
  const isFavorite = !!favRes.data;
  const isAdmin = profileRes.data?.role === 'admin';
  const roasters =
    roastersRes.data
      ?.filter((l) => l.roasters)
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary)) ?? [];

  const photos: Photo[] = Array.isArray(shop.photos)
    ? (shop.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];
  const cover = photos[0];

  const deleteMine = async () => {
    'use server';
    await deleteMyReview(shop.id, slug);
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${baseUrl}/shops/${slug}`,
    name: shop.name,
    description: shop.description ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.address ?? undefined,
      postalCode: shop.postal_code ?? undefined,
      addressLocality: shop.city ?? undefined,
      addressCountry: 'FR',
    },
    telephone: shop.phone ?? undefined,
    url: shop.website ?? `${baseUrl}/shops/${slug}`,
    image: photos.map((p) => p.url),
    ...(coordsRow?.lng && coordsRow?.lat
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: coordsRow.lat,
            longitude: coordsRow.lng,
          },
        }
      : {}),
    ...(scores?.avg_cup_score && scores?.review_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(scores.avg_cup_score),
            reviewCount: scores.review_count,
            bestRating: 10,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">
        {shop.city ?? 'Coffee shop'}
        {shop.is_selection ? ' · Sélection Dripper' : ''}
      </p>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          <em className="italic">{shop.name}</em>
        </h1>
        <FavoriteButton shopId={shop.id} slug={slug} isFavorite={isFavorite} authed={!!user} />
      </div>

      {shop.description ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          {shop.description}
        </p>
      ) : null}

      {cover ? (
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-md">
          <Image
            src={cover.url}
            alt={cover.alt ?? shop.name}
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
          <Scores
            cup={scores?.avg_cup_score}
            exp={scores?.avg_experience_score}
            count={scores?.review_count ?? 0}
          />

          {shop.methods?.length ? (
            <Section title="Méthodes">
              <Tags values={shop.methods} labels={METHOD_LABELS} />
            </Section>
          ) : null}

          {shop.options?.length ? (
            <Section title="Options">
              <Tags values={shop.options} labels={OPTION_LABELS} />
            </Section>
          ) : null}

          {roasters.length ? (
            <Section title="Torréfacteurs">
              <ul className="flex flex-wrap gap-2">
                {roasters.map((r) => (
                  <li key={r.roasters!.slug}>
                    <Link
                      href={`/torrefacteurs/${r.roasters!.slug}`}
                      className="border-border hover:bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors"
                    >
                      {r.roasters!.name}
                      {r.is_primary ? (
                        <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                          Principal
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {photos.length > 1 ? (
            <Section title="Photos">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.slice(1).map((p) => (
                  <div key={p.url} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={p.url}
                      alt={p.alt ?? shop.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          <section>
            <h2 className="font-serif text-2xl mb-4">
              {myReview ? 'Votre avis' : 'Laisser un avis'}
            </h2>
            {!user ? (
              <p className="text-muted-foreground text-sm">
                <Link
                  href={`/connexion?next=/shops/${slug}`}
                  className="underline underline-offset-4"
                >
                  Connectez-vous
                </Link>{' '}
                pour noter ce shop.
              </p>
            ) : (
              <>
                <ReviewForm
                  shopId={shop.id}
                  slug={slug}
                  existing={
                    myReview
                      ? {
                          cup_score: myReview.cup_score,
                          experience_score: myReview.experience_score,
                          comment: myReview.comment,
                          drink_ordered: myReview.drink_ordered,
                        }
                      : null
                  }
                />
                {myReview ? (
                  <form action={deleteMine} className="mt-3">
                    <button
                      type="submit"
                      className="text-destructive hover:underline text-xs"
                    >
                      Supprimer mon avis
                    </button>
                  </form>
                ) : null}
              </>
            )}
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">
              Avis ({scores?.review_count ?? 0})
            </h2>
            {!reviews.length ? (
              <p className="text-muted-foreground text-sm">Aucun avis pour le moment.</p>
            ) : (
              <ul className="space-y-6">
                {reviews.map((r) => {
                  const adminDelete = async () => {
                    'use server';
                    if (r.id) await adminDeleteReview(r.id, slug);
                  };
                  const name = r.author_display_name ?? r.author_username ?? 'Anonyme';
                  return (
                    <li key={r.id} className="border-border border-b pb-6 last:border-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-muted-foreground text-xs">
                            {r.created_at
                              ? new Date(r.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : ''}
                          </p>
                        </div>
                        <div className="text-muted-foreground text-xs tabular-nums">
                          Tasse {r.cup_score}/10 · Exp. {r.experience_score}/10
                        </div>
                      </div>
                      {r.drink_ordered ? (
                        <p className="text-muted-foreground mt-2 text-xs italic">
                          Commandé : {r.drink_ordered}
                        </p>
                      ) : null}
                      {r.comment ? (
                        <p className="mt-3 leading-relaxed">{r.comment}</p>
                      ) : null}
                      {isAdmin ? (
                        <form action={adminDelete} className="mt-3">
                          <button
                            type="submit"
                            className="text-destructive text-xs hover:underline"
                          >
                            Supprimer (admin)
                          </button>
                        </form>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 text-sm">
          {coordsRow?.lng && coordsRow?.lat ? (
            <ShopMap
              lng={coordsRow.lng}
              lat={coordsRow.lat}
              token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''}
              name={shop.name}
            />
          ) : null}
          <InfoRow label="Adresse" value={shop.address} />
          {shop.postal_code || shop.city ? (
            <InfoRow
              label="Ville"
              value={[shop.postal_code, shop.city].filter(Boolean).join(' ')}
            />
          ) : null}
          <InfoRow label="Téléphone" value={shop.phone} />
          {shop.website ? (
            <InfoRow
              label="Site"
              value={
                <Link href={shop.website} className="underline underline-offset-4">
                  {shop.website.replace(/^https?:\/\//, '')}
                </Link>
              }
            />
          ) : null}
          {shop.instagram ? (
            <InfoRow
              label="Instagram"
              value={
                <Link
                  href={`https://instagram.com/${shop.instagram.replace(/^@/, '')}`}
                  className="underline underline-offset-4"
                >
                  @{shop.instagram.replace(/^@/, '')}
                </Link>
              }
            />
          ) : null}
          <InfoRow label="Machine espresso" value={shop.espresso_machine} />
          <InfoRow
            label="Flat white"
            value={shop.avg_flat_white_price ? `${shop.avg_flat_white_price} €` : null}
          />
        </aside>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-muted-foreground mb-3 text-xs tracking-[0.2em] uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Tags({ values, labels }: { values: string[]; labels: Record<string, string> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <span key={v} className="border-border rounded-full border px-3 py-1 text-xs">
          {labels[v] ?? v}
        </span>
      ))}
    </div>
  );
}

function Scores({
  cup,
  exp,
  count,
}: {
  cup: number | null | undefined;
  exp: number | null | undefined;
  count: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ScoreCard label="Tasse" value={cup} />
      <ScoreCard label="Expérience" value={exp} />
      <p className="text-muted-foreground col-span-2 text-xs">
        {count === 0 ? 'Aucun avis pour le moment.' : `Moyenne sur ${count} avis Dripper.`}
      </p>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="border-border rounded-md border p-5">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</p>
      <p className="mt-2 font-serif text-4xl">
        {value !== null && value !== undefined ? Number(value).toFixed(1) : '—'}
        <span className="text-muted-foreground text-base"> / 10</span>
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="border-border flex flex-col gap-1 border-b pb-4">
      <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
