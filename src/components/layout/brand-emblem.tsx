import type { SVGProps } from 'react';

/**
 * Emblema de Kenhion Allen. Usa `currentColor`: el color se controla con clases
 * de texto (por ejemplo `text-gold`).
 * TODO: reemplazar los trazos por el vector oficial cuando el cliente lo envíe.
 */
export function BrandEmblem({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={6.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      <path d="M 50 5 Q 50 35 85 60 Q 50 85 50 115 Q 50 85 15 60 Q 50 35 50 5 Z" />
      <path d="M 24 25 Q 38 60 24 95" />
      <path d="M 76 25 Q 62 60 76 95" />
    </svg>
  );
}
