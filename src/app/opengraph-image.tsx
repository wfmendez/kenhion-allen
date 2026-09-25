import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const alt = `${siteConfig.name}: ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagen para compartir en redes: emblema dorado sobre negro con el eslogan. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0b',
        color: '#f5f5f4',
        borderTop: '12px solid #c74646',
        gap: 28,
      }}
    >
      <svg width="120" height="144" viewBox="0 0 100 120" fill="none">
        <g stroke="#d4af37" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 50 5 Q 50 35 85 60 Q 50 85 50 115 Q 50 85 15 60 Q 50 35 50 5 Z" />
          <path d="M 24 25 Q 38 60 24 95" />
          <path d="M 76 25 Q 62 60 76 95" />
        </g>
      </svg>
      <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: 6, color: '#d4af37' }}>
        {siteConfig.name.toUpperCase()}
      </div>
      <div style={{ fontSize: 40, fontStyle: 'italic', color: '#f5f5f4' }}>{siteConfig.slogan}</div>
      <div style={{ fontSize: 24, letterSpacing: 8, color: '#a8a8b0' }}>
        {`${siteConfig.location.city.toUpperCase()} · ${siteConfig.location.country.toUpperCase()}`}
      </div>
    </div>,
    size,
  );
}
