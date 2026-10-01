import type { SVGProps } from 'react';
import {
  EMBLEM_PATHS,
  EMBLEM_STROKE_OFFICIAL,
  EMBLEM_STROKE_SMALL,
  EMBLEM_VIEWBOX,
} from './emblem-paths';

/**
 * Emblema de Kenhion Allen. Usa `currentColor`: el color se controla con clases
 * de texto (por ejemplo `text-gold`).
 *
 * `weight="official"` respeta el grosor del logo original y es para tamaños grandes;
 * `weight="small"` (por defecto) engrosa el trazo para que se lea en iconos pequeños.
 */
export function BrandEmblem({
  title,
  weight = 'small',
  ...props
}: SVGProps<SVGSVGElement> & { title?: string; weight?: 'official' | 'small' }) {
  return (
    <svg
      viewBox={EMBLEM_VIEWBOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight === 'official' ? EMBLEM_STROKE_OFFICIAL : EMBLEM_STROKE_SMALL}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {EMBLEM_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
