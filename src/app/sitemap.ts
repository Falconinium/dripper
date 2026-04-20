import type { MetadataRoute } from 'next';

import { getAllSlugs } from '@/lib/content/mdx';
import { createClient } from '@/lib/supabase/server';

const BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: shops } = await supabase
    .from('shops')
    .select('slug, updated_at')
    .eq('status', 'published');

  const [blogSlugs, guideSlugs] = await Promise.all([
    getAllSlugs('blog'),
    getAllSlugs('guides'),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    '',
    '/carte',
    '/selection',
    '/selection/criteres',
    '/manifeste',
    '/blog',
    '/guides',
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  const shopEntries: MetadataRoute.Sitemap = (shops ?? []).map((s) => ({
    url: `${BASE}/shops/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${BASE}/guides/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...shopEntries, ...blogEntries, ...guideEntries];
}
