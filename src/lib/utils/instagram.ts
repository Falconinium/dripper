export function instagramHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/(?:instagram\.com\/)?@?([A-Za-z0-9_.]+)\/?$/);
  return match?.[1] ?? null;
}

export function instagramUrl(raw: string | null | undefined): string | null {
  const handle = instagramHandle(raw);
  return handle ? `https://instagram.com/${handle}` : null;
}
