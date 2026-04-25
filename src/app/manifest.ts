import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dripper',
    short_name: 'Dripper',
    description:
      'Le guide éditorial et communautaire des coffee shops français qui prennent le café au sérieux.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0E0C',
    theme_color: '#0F0E0C',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
