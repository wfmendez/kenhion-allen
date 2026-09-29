'use client';

import { useState, useSyncExternalStore } from 'react';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { Button, ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useToast } from '@/components/ui/toast';
import { siteConfig } from '@/config/site';
import { useCart } from '@/features/cart/cart-context';
import { downloadInvoice } from '@/features/invoice/generate-invoice';
import { formatUSD } from '@/lib/money';
import { shopPath } from '@/lib/routes';
import type { Order } from '@/lib/schemas/order';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { buildOrderWhatsAppMessage } from './build-whatsapp-message';
import { getLastOrderSnapshot } from './order-storage';

const noopSubscribe = () => () => {};
const serverSnapshot = () => undefined;

export function OrderConfirmation() {
  // undefined = todavía hidratando; null = no hay pedido en esta pestaña.
  const order = useSyncExternalStore<Order | null | undefined>(
    noopSubscribe,
    getLastOrderSnapshot,
    serverSnapshot,
  );

  if (order === undefined) {
    return <p className="py-20 text-center text-fg-muted">Cargando tu pedido…</p>;
  }

  if (order === null) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-card border border-line bg-surface px-6 py-20 text-center">
        <Icon name="alert" size={40} className="text-gold" />
        <p className="font-display text-lg font-bold">No encontramos un pedido reciente</p>
        <p className="max-w-md text-fg-muted">
          Por privacidad, el pedido solo se conserva en la pestaña donde lo confirmaste. Si ya lo
          enviaste por WhatsApp, no necesitas hacer nada más.
        </p>
        <ButtonLink href={shopPath}>Ir a la tienda</ButtonLink>
      </div>
    );
  }

  return <ConfirmedOrder order={order} />;
}

function ConfirmedOrder({ order }: { order: Order }) {
  const { clear } = useCart();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [sent, setSent] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoice(order);
      setDownloaded(true);
    } catch {
      toast('No se pudo generar el PDF. Intenta de nuevo.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(
      buildWhatsAppUrl(buildOrderWhatsAppMessage(order)),
      '_blank',
      'noopener,noreferrer',
    );
    // El pedido ya salió: la cesta se vacía. El comprobante sigue disponible en esta página.
    clear();
    setSent(true);
  };

  const steps = [
    { done: downloaded, text: 'Descarga tu comprobante en PDF.' },
    { done: sent, text: 'Envía el pedido por WhatsApp.' },
    {
      done: false,
      text: 'Adjunta el PDF en el chat (WhatsApp no permite adjuntarlo automáticamente).',
    },
    { done: false, text: 'Te confirmamos disponibilidad, datos de pago y envío.' },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="flex flex-col gap-8 rounded-card border border-gold/40 bg-surface p-6 sm:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrandEmblem className="h-16 w-14 text-gold" />
          <p className="font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
            Pedido registrado
          </p>
          <p className="font-display text-3xl font-extrabold">{order.number}</p>
          <p className="text-fg-muted">
            ¡Gracias, {order.customer.name.split(' ')[0]}! Completa estos pasos para confirmar tu
            compra.
          </p>
        </div>

        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <li key={step.text} className="flex items-start gap-3 text-sm">
              <span
                className={
                  step.done
                    ? 'grid size-7 shrink-0 place-items-center rounded-full bg-success text-ink'
                    : 'grid size-7 shrink-0 place-items-center rounded-full border border-gold/50 font-display text-xs font-bold text-gold'
                }
              >
                {step.done ? <Icon name="check" size={16} label="Hecho" /> : i + 1}
              </span>
              <span className={step.done ? 'pt-1 text-fg-muted line-through' : 'pt-1'}>
                {step.text}
              </span>
            </li>
          ))}
        </ol>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button size="lg" variant="outline" onClick={handleDownload} disabled={downloading}>
            <Icon name="download" size={18} />
            {downloading ? 'Generando…' : 'Descargar comprobante'}
          </Button>
          <Button size="lg" variant="whatsapp" onClick={handleWhatsApp}>
            <Icon name="whatsapp" size={18} /> Enviar por WhatsApp
          </Button>
        </div>

        {sent ? (
          <p
            role="status"
            className="rounded-card border border-success/40 bg-success/10 p-4 text-sm text-success"
          >
            Abrimos WhatsApp con tu pedido. Si no se abrió, escríbenos al{' '}
            {siteConfig.contact.whatsappDisplay} indicando la orden {order.number}.
          </p>
        ) : null}

        <p className="text-center text-xs text-fg-subtle">
          Comprobante de pedido, no válido como factura fiscal.
        </p>
      </section>

      <aside className="flex h-fit flex-col gap-4 rounded-card border border-line bg-surface p-6 text-sm">
        <h2 className="font-display text-xs font-bold tracking-[0.2em] text-gold uppercase">
          Resumen
        </h2>
        <ul className="flex flex-col divide-y divide-line">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.size}`}
              className="flex justify-between gap-3 py-2.5"
            >
              <span>
                {item.name}
                <span className="block text-xs text-fg-subtle">
                  Talla {item.size} · {item.qty} uds
                </span>
              </span>
              <span className="shrink-0">{formatUSD(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        {order.totals.isWholesale ? (
          <p className="flex justify-between text-success">
            <span>Descuento al mayor</span>
            <span>−{formatUSD(order.totals.discountCents)}</span>
          </p>
        ) : null}
        <p className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">Total</span>
          <span className="font-display text-2xl font-extrabold text-gold">
            {formatUSD(order.totals.totalCents)}
          </span>
        </p>
        <dl className="flex flex-col gap-1 border-t border-line pt-3 text-xs text-fg-muted">
          <div>
            <dt className="inline text-fg-subtle">Envío: </dt>
            <dd className="inline">
              {order.customer.shippingAgency} · {order.customer.city}, {order.customer.state}
            </dd>
          </div>
          <div>
            <dt className="inline text-fg-subtle">Pago: </dt>
            <dd className="inline">{order.customer.paymentMethod}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
