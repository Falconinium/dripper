import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils/slug';

export type CityEntry = {
  slug: string;
  name: string;
  count: number;
};

export async function listCities(): Promise<CityEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('shops')
    .select('city')
    .eq('status', 'published')
    .not('city', 'is', null);

  const counts = new Map<string, { name: string; count: number }>();
  for (const row of data ?? []) {
    const raw = (row.city ?? '').trim();
    if (!raw) continue;
    const slug = slugify(raw);
    const existing = counts.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(slug, { name: raw, count: 1 });
    }
  }

  return Array.from(counts.entries())
    .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'));
}

export function cityNameFromSlug(slug: string, cities: CityEntry[]): string | null {
  return cities.find((c) => c.slug === slug)?.name ?? null;
}
