'use client';

import { ButtonLink } from '@/components/ui/button';
import { Drawer } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { WhatsAppCheckoutButton } from '@/features/checkout/whatsapp-checkout-button';
import { cartPath, shopPath } from '@/lib/routes';
import { useCart } from './cart-context';
import { CartLineItem } from './cart-line-item';
import { CartTotalsList, WholesaleProgress } from './cart-summary';

export function CartDrawer() {
  const { lines, totals, isDrawerOpen, closeDrawer } = useCart();

  return (
    <Drawer open={isDrawerOpen} onClose={closeDrawer} title="Cesta de compras">
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Icon name="bag" size={40} className="text-gold" />
          <p className="text-fg">Tu cesta está vacía.</p>
          <p className="text-sm text-fg-muted">Explora las colecciones y elige tus prendas.</p>
          <ButtonLink href={shopPath} variant="outline" onClick={closeDrawer}>
            Ir a la tienda
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <WholesaleProgress totals={totals} />
          <ul>
            {lines.map((line) => (
              <CartLineItem key={line.lineId} line={line} onNavigate={closeDrawer} />
            ))}
          </ul>
          <CartTotalsList totals={totals} />
          <div className="flex flex-col gap-3">
            <WhatsAppCheckoutButton />
            <ButtonLink href={cartPath} variant="outline" fullWidth onClick={closeDrawer}>
              Ver cesta completa
            </ButtonLink>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export function CartButton() {
  const { totals, openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-surface-raised hover:text-gold"
    >
      <Icon name="bag" label={`Abrir cesta (${totals.itemCount} prendas)`} />
      {totals.itemCount > 0 ? (
        <span
          aria-hidden
          className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-gold px-1 font-display text-[0.62rem] font-extrabold text-ink"
        >
          {totals.itemCount > 99 ? '99+' : totals.itemCount}
        </span>
      ) : null}
    </button>
  );
}
