import { ImageResponse } from 'next/og';

export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F0E0C',
        }}
      >
        <svg viewBox="0 0 24 28" width="128" height="150" fill="none">
          <path
            d="M3 6 L21 6 L13.5 19 L10.5 19 Z"
            stroke="#F5F1EB"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          <circle cx={12} cy={24} r={1.4} fill="#F5F1EB" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
