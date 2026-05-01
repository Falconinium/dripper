'use client';

import dynamic from 'next/dynamic';

const ShopMap = dynamic(() => import('./shop-map').then((m) => m.ShopMap), {
  ssr: false,
  loading: () => (
    <div className="border-border bg-muted/30 aspect-[4/3] w-full animate-pulse rounded-md border" />
  ),
});

export function ShopMapClient(props: {
  lng: number;
  lat: number;
  token: string;
  name: string;
}) {
  return <ShopMap {...props} />;
}
