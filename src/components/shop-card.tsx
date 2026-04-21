import Image from 'next/image';
import Link from 'next/link';

type ShopCardProps = {
  slug: string;
  name: string;
  city: string | null;
  description?: string | null;
  is_selection?: boolean | null;
  photos?: unknown;
  cup_score?: number | null;
};

function firstPhotoUrl(photos: unknown): string | null {
  if (!Array.isArray(photos)) return null;
  const first = photos[0] as { url?: unknown } | undefined;
  return typeof first?.url === 'string' ? first.url : null;
}

export function ShopCard({
  slug,
  name,
  city,
  description,
  is_selection,
  photos,
  cup_score,
}: ShopCardProps) {
  const cover = firstPhotoUrl(photos);

  return (
    <Link
      href={`/shops/${slug}`}
      className="group bg-background hover:bg-muted/30 flex h-full flex-col overflow-hidden transition-colors"
    >
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs tracking-[0.25em] uppercase">
            {name.slice(0, 1)}
          </div>
        )}
        {is_selection ? (
          <span className="bg-background/90 border-border absolute top-3 left-3 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase backdrop-blur">
            Sélection
          </span>
        ) : null}
        {cup_score !== null && cup_score !== undefined ? (
          <span className="bg-background/90 border-border absolute top-3 right-3 rounded-full border px-2 py-0.5 text-xs tabular-nums backdrop-blur">
            {Number(cup_score).toFixed(1)}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg leading-tight">{name}</h3>
        {city ? (
          <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">{city}</p>
        ) : null}
        {description ? (
          <p className="text-muted-foreground line-clamp-2 mt-1 text-sm">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}
