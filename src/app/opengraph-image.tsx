import { ImageResponse } from 'next/og';

export const alt =
  'Dripper — le guide des cafés de spécialité';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0F0E0C',
          color: '#F5F1EB',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg viewBox="0 0 24 28" width="42" height="50" fill="none">
            <path
              d="M3 6 L21 6 L13.5 19 L10.5 19 Z"
              stroke="#F5F1EB"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <circle cx={12} cy={24} r={1.4} fill="#F5F1EB" />
          </svg>
          <span
            style={{
              fontSize: 38,
              letterSpacing: -0.5,
              fontFamily: 'serif',
            }}
          >
            Dripper
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p
            style={{
              fontSize: 18,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#A09B92',
              margin: 0,
              fontFamily: 'sans-serif',
            }}
          >
            Le guide du café de spécialité · France
          </p>
          <h1
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              margin: 0,
              fontWeight: 400,
              fontFamily: 'serif',
              maxWidth: 1000,
            }}
          >
            Là où le café est pris{' '}
            <span style={{ fontStyle: 'italic' }}>au sérieux.</span>
          </h1>
        </div>

        <p
          style={{
            fontSize: 22,
            color: '#A09B92',
            margin: 0,
            fontFamily: 'sans-serif',
          }}
        >
          dripper-app.fr
        </p>
      </div>
    ),
    { ...size },
  );
}
