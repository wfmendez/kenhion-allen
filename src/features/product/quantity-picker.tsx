'use client';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 999,
  label,
  size = 'md',
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  /** Nombre del producto, para que el lector de pantalla diga "Cantidad de Hoodie…". */
  label: string;
  size?: 'sm' | 'md';
}) {
  const btn = cn(
    'grid place-items-center text-fg-muted transition-colors hover:text-gold disabled:opacity-40',
    size === 'sm' ? 'size-8' : 'size-11',
  );
  return (
    <div
      role="group"
      aria-label={`Cantidad de ${label}`}
      className="inline-flex items-center rounded-full border border-line"
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        <Icon name="minus" size={16} label="Restar uno" />
      </button>
      <output
        aria-live="polite"
        className={cn('text-center font-display font-bold', size === 'sm' ? 'w-7 text-sm' : 'w-10')}
      >
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Icon name="plus" size={16} label="Sumar uno" />
      </button>
    </div>
  );
}
