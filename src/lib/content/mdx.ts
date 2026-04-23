import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import readingTime from 'reading-time';

export type ContentKind = 'guides';

export type ContentMeta = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  city?: string;
  published_at?: string;
  author?: string;
  kind: ContentKind;
  readingMinutes: number;
};

const CONTENT_ROOT = path.join(process.cwd(), 'content');

async function listFiles(kind: ContentKind): Promise<string[]> {
  try {
    const entries = await readdir(path.join(CONTENT_ROOT, kind));
    return entries.filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];
  }
}

export async function listContent(kind: ContentKind): Promise<ContentMeta[]> {
  const files = await listFiles(kind);
  const items = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = await readFile(path.join(CONTENT_ROOT, kind, file), 'utf8');
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      return {
        slug,
        title: String(data.title ?? slug),
        excerpt: data.excerpt ? String(data.excerpt) : undefined,
        cover: data.cover ? String(data.cover) : undefined,
        city: data.city ? String(data.city) : undefined,
        published_at: data.published_at ? String(data.published_at) : undefined,
        author: data.author ? String(data.author) : undefined,
        kind,
        readingMinutes: Math.max(1, Math.round(stats.minutes)),
      } satisfies ContentMeta;
    }),
  );

  return items
    .filter((i) => !!i.published_at)
    .sort((a, b) => (a.published_at! < b.published_at! ? 1 : -1));
}

export async function getContentMeta(
  kind: ContentKind,
  slug: string,
): Promise<ContentMeta | null> {
  const raw = await readContentSource(kind, slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: data.excerpt ? String(data.excerpt) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    city: data.city ? String(data.city) : undefined,
    published_at: data.published_at ? String(data.published_at) : undefined,
    author: data.author ? String(data.author) : undefined,
    kind,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

async function readContentSource(kind: ContentKind, slug: string): Promise<string | null> {
  try {
    return await readFile(path.join(CONTENT_ROOT, kind, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }
}

export async function getAllSlugs(kind: ContentKind): Promise<string[]> {
  const files = await listFiles(kind);
  return files.map((f) => f.replace(/\.mdx$/, ''));
}

export async function getContentBody(kind: ContentKind, slug: string): Promise<string | null> {
  const raw = await readContentSource(kind, slug);
  if (!raw) return null;
  const { content } = matter(raw);
  return content;
}

export async function getAllContentMeta(kind: ContentKind): Promise<ContentMeta[]> {
  return listContent(kind);
}
