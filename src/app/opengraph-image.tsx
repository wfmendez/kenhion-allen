import { ImageResponse } from 'next/og';
import {
  EMBLEM_PATHS,
  EMBLEM_STROKE_OFFICIAL,
  EMBLEM_VIEWBOX,
} from '@/components/layout/emblem-paths';
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
      <svg width="120" height="144" viewBox={EMBLEM_VIEWBOX} fill="none">
        <g
          stroke="#d4af37"
          strokeWidth={EMBLEM_STROKE_OFFICIAL}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {EMBLEM_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
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
