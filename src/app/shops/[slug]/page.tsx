import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PhotoCarousel } from '@/components/photo-carousel';
import { createClient } from '@/lib/supabase/server';
import { instagramHandle, instagramUrl } from '@/lib/utils/instagram';

import { adminDeleteReview, deleteMyReview } from './actions';
import { FavoriteButton } from './favorite-button';
import { ReviewForm } from './review-form';
import { ShopMapClient } from './shop-map-client';

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

const REVIEWS_PER_PAGE = 10;

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviews_page?: string }>;
}) {
  const { slug } = await params;
  const { reviews_page } = await searchParams;
  const page = Math.max(1, Number.parseInt(reviews_page ?? '1', 10) || 1);
  const reviewsFrom = (page - 1) * REVIEWS_PER_PAGE;
  const reviewsTo = reviewsFrom + REVIEWS_PER_PAGE - 1;
  const supabase = await createClient();

  const [shopRes, coordsRes, userRes] = await Promise.all([
    supabase
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    supabase
      .from('shops_public')
      .select('lng, lat')
      .eq('slug', slug)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  const shop = shopRes.data;
  if (!shop) notFound();

  const coordsRow = coordsRes.data;
  const user = userRes.data.user;

  const [scoresRes, reviewsRes, myReviewRes, favRes, profileRes] = await Promise.all([
    supabase
      .from('shop_scores')
      .select('avg_experience_score, review_count')
      .eq('shop_id', shop.id)
      .maybeSingle(),
    supabase
      .from('reviews_with_author')
      .select('*', { count: 'exact' })
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false })
      .range(reviewsFrom, reviewsTo),
    user
      ? supabase
          .from('reviews')
          .select('experience_score, comment, drink_ordered')
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
  ]);

  const scores = scoresRes.data;
  const reviews = reviewsRes.data ?? [];
  const totalReviews = reviewsRes.count ?? scores?.review_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalReviews / REVIEWS_PER_PAGE));
  const myReview = myReviewRes.data;
  const isFavorite = !!favRes.data;
  const isAdmin = profileRes.data?.role === 'admin';

  const photos: Photo[] = Array.isArray(shop.photos)
    ? (shop.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];

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
    ...(scores?.avg_experience_score && scores?.review_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(scores.avg_experience_score),
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
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-serif min-w-0 flex-1 text-4xl leading-[1.05] md:max-w-[20ch] md:text-6xl">
          <em className="italic">{shop.name}</em>
        </h1>
        <div className="shrink-0">
          <FavoriteButton shopId={shop.id} slug={slug} isFavorite={isFavorite} authed={!!user} />
        </div>
      </div>

      {shop.description ? (
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          {shop.description}
        </p>
      ) : null}

      {photos.length ? (
        <PhotoCarousel photos={photos} name={shop.name} priority />
      ) : null}

      {(() => {
        const overviewBlock = (
          <div className="space-y-10">
            <Scores
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

            {shop.labels?.length ? (
              <Section title="Labels">
                <Tags values={shop.labels} labels={{}} />
              </Section>
            ) : null}
          </div>
        );

        const mapBlock = coordsRow?.lng && coordsRow?.lat ? (
          <ShopMapClient
            lng={coordsRow.lng}
            lat={coordsRow.lat}
            token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''}
            name={shop.name}
          />
        ) : null;

        const infoBlock = (
          <div className="space-y-6 text-sm">
            <dl className="space-y-6">
              {shop.address ? (
                <InfoRow
                  label="Adresse"
                  value={
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        [shop.address, shop.postal_code, shop.city].filter(Boolean).join(', '),
                      )}`}
                      target="_blank"
                      rel="noopener"
                      className="underline underline-offset-4"
                    >
                      {shop.address}
                      <span className="text-muted-foreground ml-1 text-xs">↗ Itinéraire</span>
                    </Link>
                  }
                />
              ) : null}
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
              {shop.instagram && instagramHandle(shop.instagram) ? (
                <InfoRow
                  label="Instagram"
                  value={
                    <Link
                      href={instagramUrl(shop.instagram)!}
                      target="_blank"
                      rel="noopener"
                      className="underline underline-offset-4"
                    >
                      @{instagramHandle(shop.instagram)}
                    </Link>
                  }
                />
              ) : null}
              <InfoRow label="Machine espresso" value={shop.espresso_machine} />
            </dl>
            {!shop.claimed_by ? (
              <div className="border-border mt-4 rounded-2xl border p-5">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Propriétaire ?
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  Revendiquez ce shop pour gérer ses informations sur Dripper.
                </p>
                <Link
                  href={
                    user
                      ? `/shops/${slug}/revendiquer`
                      : `/connexion?next=/shops/${slug}/revendiquer`
                  }
                  className="border-border hover:bg-muted/40 mt-3 inline-flex items-center rounded-full border px-4 py-2 text-xs transition-colors"
                >
                  Revendiquer ce shop →
                </Link>
              </div>
            ) : null}
          </div>
        );

        const reviewsBlock = (
          <div className="space-y-10">
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

            <section id="avis">
              <h2 className="font-serif text-2xl mb-4">
                Avis ({scores?.review_count ?? 0})
              </h2>
              {!reviews.length ? (
                <p className="text-muted-foreground text-sm">
                  {page > 1
                    ? 'Aucun avis sur cette page.'
                    : 'Aucun avis pour le moment.'}
                </p>
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
                            {r.experience_score}/10
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
              {totalPages > 1 ? (
                <nav
                  className="text-muted-foreground mt-8 flex items-center justify-between text-sm"
                  aria-label="Pagination des avis"
                >
                  {page > 1 ? (
                    <Link
                      href={
                        page - 1 === 1
                          ? `/shops/${slug}#avis`
                          : `/shops/${slug}?reviews_page=${page - 1}#avis`
                      }
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      ← Précédent
                    </Link>
                  ) : (
                    <span aria-hidden />
                  )}
                  <span className="text-xs">
                    Page {page} / {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={`/shops/${slug}?reviews_page=${page + 1}#avis`}
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      Suivant →
                    </Link>
                  ) : (
                    <span aria-hidden />
                  )}
                </nav>
              ) : null}
            </section>
          </div>
        );

        return (
          <>
            <div className="mt-12 flex flex-col gap-12 md:hidden">
              {overviewBlock}
              {infoBlock}
              {mapBlock}
              {reviewsBlock}
            </div>

            <div className="mt-12 hidden gap-12 md:grid md:grid-cols-3">
              <div className="md:col-span-2 space-y-10">
                {overviewBlock}
                {reviewsBlock}
              </div>
              <aside className="space-y-6 text-sm">
                {mapBlock}
                {infoBlock}
              </aside>
            </div>
          </>
        );
      })()}
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
  exp,
  count,
}: {
  exp: number | null | undefined;
  count: number;
}) {
  return (
    <div className="space-y-3">
      <ScoreCard label="Expérience" value={exp} />
      <p className="text-muted-foreground text-xs">
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
    <div className="border-border border-b pb-4">
      <dt className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
