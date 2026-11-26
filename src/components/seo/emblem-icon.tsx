import {
  EMBLEM_PATHS,
  EMBLEM_STROKE_SMALL,
  EMBLEM_VIEWBOX,
  emblemIconBox,
} from '@/components/layout/emblem-paths';
import { colors } from '@/styles/tokens';

/**
 * Emblema dorado centrado sobre negro, para los iconos PNG que genera next/og.
 * scripts/generate-favicon.mjs dibuja lo mismo (mismos trazos, medidas y colores) para el
 * favicon.ico y los PNG de public/images/marca.
 */
export function EmblemIcon({
  size,
  stroke = EMBLEM_STROKE_SMALL,
}: {
  size: number;
  stroke?: number;
}) {
  const { width, height } = emblemIconBox(size);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.ink,
      }}
    >
      <svg width={width} height={height} viewBox={EMBLEM_VIEWBOX} fill="none">
        <g stroke={colors.gold} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          {EMBLEM_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
