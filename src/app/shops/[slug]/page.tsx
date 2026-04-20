import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

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

async function loadShop(slug: string) {
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!shop) return null;

  const { data: scores } = await supabase
    .from('shop_scores')
    .select('avg_cup_score, avg_experience_score, review_count')
    .eq('shop_id', shop.id)
    .maybeSingle();

  return { shop, scores };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadShop(slug);
  if (!loaded) return { title: 'Shop introuvable' };
  return {
    title: loaded.shop.name,
    description: loaded.shop.description ?? undefined,
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loaded = await loadShop(slug);
  if (!loaded) notFound();

  const { shop, scores } = loaded;
  const photos: Photo[] = Array.isArray(shop.photos)
    ? (shop.photos as Photo[]).filter((p) => p && typeof p.url === 'string')
    : [];
  const cover = photos[0];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 md:py-24">
      <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">
        {shop.city ?? 'Coffee shop'}
        {shop.is_selection ? ' · Sélection Dripper' : ''}
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
        <em className="italic">{shop.name}</em>
      </h1>

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
        <div className="md:col-span-2 space-y-8">
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

          {photos.length > 1 ? (
            <Section title="Photos">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.slice(1).map((p) => (
                  <div
                    key={p.url}
                    className="relative aspect-square overflow-hidden rounded-md"
                  >
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
        </div>

        <aside className="space-y-6 text-sm">
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
        {count === 0
          ? 'Aucun avis pour le moment.'
          : `Moyenne sur ${count} avis Dripper.`}
      </p>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="border-border rounded-md border p-5">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</p>
      <p className="mt-2 font-serif text-4xl">
        {value !== null && value !== undefined ? value.toFixed(1) : '—'}
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
