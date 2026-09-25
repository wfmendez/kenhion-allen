import { WHOLESALE } from '@/config/business';
import { cn } from '@/lib/cn';
import { formatUSD } from '@/lib/money';
import type { CartTotals } from './pricing';

/** Barra de progreso hacia el descuento al mayor. */
export function WholesaleProgress({ totals }: { totals: CartTotals }) {
  const pct = Math.round(WHOLESALE.rate * 100);
  const progress = Math.min(1, totals.itemCount / WHOLESALE.minQty);
  return (
    <div
      className={cn(
        'rounded-card border p-4 text-sm',
        totals.isWholesale ? 'border-success/40 bg-success/10' : 'border-gold/30 bg-gold/5',
      )}
    >
      <p className={totals.isWholesale ? 'text-success' : 'text-fg-muted'}>
        {totals.isWholesale ? (
          <>
            <strong>¡Docena completada!</strong> Tienes {pct}% de descuento al mayor.
          </>
        ) : (
          <>
            Añade <strong className="text-gold">{totals.itemsToWholesale}</strong>{' '}
            {totals.itemsToWholesale === 1 ? 'prenda' : 'prendas'} más y obtén{' '}
            <strong className="text-gold">{pct}% al mayor</strong>.
          </>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progreso hacia el descuento al mayor"
        aria-valuemin={0}
        aria-valuemax={WHOLESALE.minQty}
        aria-valuenow={Math.min(totals.itemCount, WHOLESALE.minQty)}
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            totals.isWholesale ? 'bg-success' : 'bg-gold-gradient',
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function CartTotalsList({ totals }: { totals: CartTotals }) {
  const pct = Math.round(WHOLESALE.rate * 100);
  return (
    <dl className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between text-fg-muted">
        <dt>
          Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'prenda' : 'prendas'})
        </dt>
        <dd>{formatUSD(totals.subtotalCents)}</dd>
      </div>
      {totals.isWholesale ? (
        <div className="flex justify-between text-success">
          <dt>Descuento al mayor ({pct}%)</dt>
          <dd>−{formatUSD(totals.discountCents)}</dd>
        </div>
      ) : null}
      <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-display text-xs font-bold tracking-[0.2em] uppercase">Total</dt>
        <dd className="font-display text-2xl font-extrabold text-gold">
          {formatUSD(totals.totalCents)} <span className="text-xs text-fg-subtle">USD</span>
        </dd>
      </div>
    </dl>
  );
}
