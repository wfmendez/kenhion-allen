'use client';

import { ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/features/cart/cart-context';
import { CartTotalsList, WholesaleProgress } from '@/features/cart/cart-summary';
import { formatUSD } from '@/lib/money';
import { cartPath, shopPath } from '@/lib/routes';
import { CheckoutForm } from './checkout-form';

export function CheckoutContent() {
  const { lines, totals } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-20 text-center">
        <Icon name="bag" size={48} className="text-gold" />
        <p className="font-display text-lg font-bold">Tu cesta está vacía</p>
        <p className="text-fg-muted">Añade prendas antes de finalizar la compra.</p>
        <ButtonLink href={shopPath}>Ir a la tienda</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <section
        aria-label="Datos del pedido"
        className="rounded-card border border-line bg-surface p-6 sm:p-8"
      >
        <CheckoutForm />
      </section>

      <aside className="flex h-fit flex-col gap-5 rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
            Tu pedido
          </h2>
          <ButtonLink href={cartPath} variant="ghost" size="sm">
            Editar
          </ButtonLink>
        </div>
        <ul className="flex flex-col divide-y divide-line text-sm">
          {lines.map((line) => (
            <li key={line.lineId} className="flex justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="block truncate font-medium">{line.product.name}</span>
                <span className="text-xs text-fg-subtle">
                  {line.colorOption.name} · Talla {line.size} · {line.qty} ×{' '}
                  {formatUSD(line.product.priceCents)}
                </span>
              </span>
              <span className="shrink-0">{formatUSD(line.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <WholesaleProgress totals={totals} />
        <CartTotalsList totals={totals} />
      </aside>
    </div>
  );
}
