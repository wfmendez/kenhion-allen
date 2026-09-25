import { formatUSD, type Cents } from '@/lib/money';
import { cn } from '@/lib/cn';

const sizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
} as const;

export function Price({
  cents,
  compareAtCents,
  size = 'md',
  className,
}: {
  cents: Cents;
  compareAtCents?: Cents | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-display font-extrabold text-gold', sizes[size])}>
        {formatUSD(cents)}
      </span>
      {compareAtCents ? (
        <span className="text-sm text-fg-subtle line-through">
          <span className="sr-only">Antes </span>
          {formatUSD(compareAtCents)}
        </span>
      ) : null}
    </span>
  );
}
