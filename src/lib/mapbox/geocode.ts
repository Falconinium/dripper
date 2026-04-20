export type GeocodeResult = { lng: number; lat: number; formatted: string };

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token || !address.trim()) return null;

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
  );
  url.searchParams.set('access_token', token);
  url.searchParams.set('country', 'fr');
  url.searchParams.set('limit', '1');
  url.searchParams.set('language', 'fr');

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    features: Array<{ center: [number, number]; place_name: string }>;
  };
  const first = data.features?.[0];
  if (!first) return null;

  const [lng, lat] = first.center;
  return { lng, lat, formatted: first.place_name };
}
