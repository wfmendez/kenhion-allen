'use client';

import { Button, ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { WhatsAppCheckoutButton } from '@/features/checkout/whatsapp-checkout-button';
import { shopPath } from '@/lib/routes';
import { useCart } from './cart-context';
import { CartLineItem } from './cart-line-item';
import { CartTotalsList, WholesaleProgress } from './cart-summary';

export function CartPageContent() {
  const { lines, totals, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-20 text-center">
        <Icon name="bag" size={48} className="text-gold" />
        <p className="font-display text-lg font-bold">Tu cesta está vacía</p>
        <p className="text-fg-muted">Explora las colecciones y elige tus prendas y tallas.</p>
        <ButtonLink href={shopPath}>Ir a la tienda</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section aria-label="Prendas en la cesta" className="flex flex-col gap-4">
        <WholesaleProgress totals={totals} />
        <ul className="rounded-card border border-line bg-surface px-5">
          {lines.map((line) => (
            <CartLineItem key={line.lineId} line={line} />
          ))}
        </ul>
        <div className="flex flex-wrap justify-between gap-3">
          <ButtonLink href={shopPath} variant="ghost">
            ← Seguir comprando
          </ButtonLink>
          <Button variant="ghost" onClick={clear}>
            Vaciar cesta
          </Button>
        </div>
      </section>

      <aside className="flex h-fit flex-col gap-5 rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          Resumen del pedido
        </h2>
        <CartTotalsList totals={totals} />
        <WhatsAppCheckoutButton />
        <p className="flex items-start gap-2 text-xs text-fg-subtle">
          <Icon name="truck" size={16} className="shrink-0 text-gold" />
          Envíos a toda Venezuela por MRW, Zoom y Tealca. Entrega personal en Maracay.
        </p>
      </aside>
    </div>
  );
}
