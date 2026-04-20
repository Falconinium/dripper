'use client';

import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export type ShopPin = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  isSelection: boolean;
  lng: number;
  lat: number;
};

export function MapView({ pins, token }: { pins: ShopPin[]; token: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style:
        resolvedTheme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/light-v11',
      center: [2.3522, 46.6034],
      zoom: 5.2,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    const markers: mapboxgl.Marker[] = [];
    const bounds = new mapboxgl.LngLatBounds();

    for (const pin of pins) {
      const el = document.createElement('a');
      el.href = `/shops/${pin.slug}`;
      el.setAttribute('aria-label', pin.name);
      el.className = [
        'block size-3.5 rounded-full border-2 shadow',
        pin.isSelection ? 'bg-amber-200 border-neutral-900' : 'bg-neutral-900 border-white',
      ].join(' ');

      const popup = new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
        `<div style="font-family:var(--font-sans);font-size:13px;line-height:1.4;padding:2px 2px 0"><div style="font-weight:500">${escapeHtml(
          pin.name,
        )}</div>${pin.city ? `<div style="opacity:.6">${escapeHtml(pin.city)}</div>` : ''}<div style="margin-top:4px"><a style="text-decoration:underline" href="/shops/${pin.slug}">Voir la fiche →</a></div></div>`,
      );

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map);
      markers.push(marker);
      bounds.extend([pin.lng, pin.lat]);
    }

    if (pins.length > 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 0 });
    } else if (pins.length === 1) {
      map.setCenter([pins[0].lng, pins[0].lat]);
      map.setZoom(13);
    }

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [pins, token, resolvedTheme]);

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-sm text-muted-foreground">
        Token Mapbox manquant.
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[70vh] flex-1" />;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
