'use client';

import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Feature = {
  place_name: string;
  center: [number, number];
  text?: string;
  address?: string;
  context?: Array<{ id: string; text: string; short_code?: string }>;
};

type Suggestion = {
  label: string;
  address: string;
  city: string;
  postal_code: string;
  lng: number;
  lat: number;
};

function parseFeature(f: Feature): Suggestion {
  const street = [f.address, f.text].filter(Boolean).join(' ').trim();
  const ctx = f.context ?? [];
  const postal = ctx.find((c) => c.id.startsWith('postcode'))?.text ?? '';
  const city =
    ctx.find((c) => c.id.startsWith('place'))?.text ??
    ctx.find((c) => c.id.startsWith('locality'))?.text ??
    '';
  const [lng, lat] = f.center;
  return {
    label: f.place_name,
    address: street || (f.place_name.split(',')[0] ?? ''),
    city,
    postal_code: postal,
    lng,
    lat,
  };
}

export function AddressAutocomplete({
  token,
  defaultAddress,
  defaultCity,
  defaultPostalCode,
  defaultLng,
  defaultLat,
}: {
  token: string;
  defaultAddress?: string;
  defaultCity?: string;
  defaultPostalCode?: string;
  defaultLng?: string;
  defaultLat?: string;
}) {
  const [query, setQuery] = useState(defaultAddress ?? '');
  const [city, setCity] = useState(defaultCity ?? '');
  const [postalCode, setPostalCode] = useState(defaultPostalCode ?? '');
  const [lng, setLng] = useState(defaultLng ?? '');
  const [lat, setLat] = useState(defaultLat ?? '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token || query.trim().length < 3) {
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      );
      url.searchParams.set('access_token', token);
      url.searchParams.set('country', 'fr');
      url.searchParams.set('types', 'address,poi');
      url.searchParams.set('limit', '5');
      url.searchParams.set('language', 'fr');
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = (await res.json()) as { features: Feature[] };
        setSuggestions((data.features ?? []).map(parseFeature));
        setOpen(true);
        setActiveIndex(0);
      } catch {
        // ignore
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, token]);

  const pick = (s: Suggestion) => {
    setQuery(s.address);
    setCity(s.city);
    setPostalCode(s.postal_code);
    setLng(String(s.lng));
    setLat(String(s.lat));
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative space-y-2">
        <Label htmlFor="address">Adresse *</Label>
        <Input
          id="address"
          name="address"
          required
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (!open || !suggestions.length) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              pick(suggestions[activeIndex]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder={token ? 'Commencez à taper une adresse…' : 'Mapbox token manquant'}
          role="combobox"
          aria-expanded={open}
          aria-controls="address-suggestions"
          aria-autocomplete="list"
        />
        {open && suggestions.length ? (
          <ul
            id="address-suggestions"
            role="listbox"
            className="border-border bg-background absolute top-full left-0 right-0 z-20 mt-1 max-h-72 overflow-auto rounded-md border shadow-lg"
          >
            {suggestions.map((s, i) => (
              <li
                key={`${s.lng},${s.lat},${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === activeIndex ? 'bg-muted' : ''
                }`}
              >
                {s.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude (optionnel)</Label>
          <Input
            id="lng"
            name="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude (optionnel)</Label>
          <Input
            id="lat"
            name="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
      </div>
      <p className="text-muted-foreground text-xs">
        Les coordonnées sont remplies automatiquement depuis l&apos;adresse. Laissez vide pour
        un géocodage serveur si besoin.
      </p>
    </div>
  );
}
