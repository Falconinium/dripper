'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref}>
      {visible ? (
        <ShopMap {...props} />
      ) : (
        <div className="border-border bg-muted/30 aspect-[4/3] w-full rounded-md border" />
      )}
    </div>
  );
}
