'use client';

import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export function ShopMap({
  lng,
  lat,
  token,
  name,
}: {
  lng: number;
  lat: number;
  token: string;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: ref.current,
      style:
        resolvedTheme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: 14,
      interactive: true,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    const el = document.createElement('div');
    el.setAttribute('aria-label', name);
    el.style.width = '14px';
    el.style.height = '14px';
    el.style.borderRadius = '999px';
    el.style.background = resolvedTheme === 'dark' ? '#F5F1EB' : '#0A0A0A';
    el.style.border = resolvedTheme === 'dark' ? '2px solid #0F0E0C' : '2px solid #fff';
    el.style.boxShadow = '0 1px 4px rgba(0,0,0,.3)';

    const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);

    return () => {
      marker.remove();
      map.remove();
    };
  }, [lng, lat, token, resolvedTheme, name]);

  if (!token) return null;

  return <div ref={ref} className="border-border aspect-[4/3] w-full overflow-hidden rounded-md border" />;
}
