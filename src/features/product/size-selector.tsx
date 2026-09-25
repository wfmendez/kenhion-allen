'use client';

import { useId } from 'react';
import type { Size } from '@/config/business';
import { cn } from '@/lib/cn';

/** Grupo de radio accesible con aspecto de píldoras. */
export function SizeSelector({
  sizes,
  value,
  onChange,
  compact = false,
  label = 'Talla',
}: {
  sizes: readonly Size[];
  value: Size;
  onChange: (size: Size) => void;
  compact?: boolean;
  label?: string;
}) {
  const name = useId();
  return (
    <fieldset
      className={cn(compact ? 'grid grid-cols-4 gap-1.5' : 'flex flex-wrap items-center gap-2')}
    >
      <legend className={cn('mb-2 text-xs font-medium text-fg-muted', compact && 'sr-only')}>
        {label}
      </legend>
      {sizes.map((size) => (
        <label
          key={size}
          className={cn(
            'grid cursor-pointer place-items-center rounded-full border font-display font-bold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
            compact ? 'h-8 w-full text-[0.68rem]' : 'size-11 text-xs',
            value === size
              ? 'border-gold bg-gold text-ink'
              : 'border-line text-fg-muted hover:border-gold/60 hover:text-fg',
          )}
        >
          <input
            type="radio"
            name={name}
            value={size}
            checked={value === size}
            onChange={() => onChange(size)}
            className="sr-only"
          />
          {size}
        </label>
      ))}
    </fieldset>
  );
}
