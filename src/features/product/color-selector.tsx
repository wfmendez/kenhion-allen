'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { ProductColor } from '@/lib/schemas/product';

/** Grupo de radio accesible con muestras de color. Mismo patrón que SizeSelector. */
export function ColorSelector({
  colors,
  value,
  onChange,
  compact = false,
  label = 'Color',
}: {
  colors: ProductColor[];
  value: string;
  onChange: (colorSlug: string) => void;
  compact?: boolean;
  label?: string;
}) {
  const name = useId();
  const selected = colors.find((c) => c.slug === value);
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className={cn('mb-2 text-xs font-medium text-fg-muted', compact && 'sr-only')}>
        {label}
        {selected ? <span className="text-fg">: {selected.name}</span> : null}
      </legend>
      {colors.map((color) => {
        const checked = color.slug === value;
        return (
          <label
            key={color.slug}
            title={color.name}
            className={cn(
              'grid cursor-pointer place-items-center rounded-full border-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
              compact ? 'size-7' : 'size-10',
              checked ? 'border-gold' : 'border-transparent hover:border-gold/50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={color.slug}
              checked={checked}
              onChange={() => onChange(color.slug)}
              className="sr-only"
            />
            {/* El borde gris mantiene visible la muestra negra sobre el fondo oscuro. */}
            <span
              aria-hidden
              className={cn(
                'rounded-full border border-fg-subtle/70',
                compact ? 'size-4.5' : 'size-7',
              )}
              style={{ backgroundColor: color.hex }}
            />
            <span className="sr-only">{color.name}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
