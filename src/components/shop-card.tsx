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
  priority?: boolean;
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
  priority,
}: ShopCardProps) {
  const cover = firstPhotoUrl(photos);
  const score = typeof cup_score === 'number' ? cup_score : null;

  return (
    <Link href={`/shops/${slug}`} className="group block">
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-[4/5]">
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 92vw"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center font-serif text-6xl italic">
            {name.slice(0, 1)}
          </div>
        )}
        {is_selection ? (
          <span className="bg-background/95 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase shadow-sm backdrop-blur">
            Sélection
          </span>
        ) : null}
      </div>

      <div className="mt-5 px-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-xl leading-tight tracking-tight md:text-2xl">
            {name}
          </h3>
          {score !== null ? (
            <span className="shrink-0 font-serif text-lg tabular-nums">
              {score.toFixed(1)}
              <span className="text-muted-foreground text-sm"> /10</span>
            </span>
          ) : null}
        </div>

        {city ? (
          <p className="text-muted-foreground mt-1.5 text-sm">{city}</p>
        ) : null}

        {description ? (
          <p className="text-muted-foreground/80 line-clamp-2 mt-3 text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
