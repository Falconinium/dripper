import { ImageResponse } from 'next/og';

import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const alt = 'Dripper — fiche shop';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('name, city, is_selection')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .maybeSingle();

  const name = shop?.name ?? 'Coffee shop';
  const city = shop?.city ?? '';
  const selection = !!shop?.is_selection;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#0F0E0C',
          color: '#F5F1EB',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.6 }}>
          Dripper{city ? ` · ${city}` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 100, lineHeight: 1.05, fontStyle: 'italic' }}>{name}</div>
          {selection ? (
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                textTransform: 'uppercase',
                border: '1px solid #F5F1EB',
                padding: '8px 20px',
                alignSelf: 'flex-start',
                borderRadius: 999,
              }}
            >
              Sélection
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
