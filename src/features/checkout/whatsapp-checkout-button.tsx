'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/features/cart/cart-context';
import { buildWhatsAppMessage, buildWhatsAppUrl } from './build-whatsapp-message';

/**
 * Pedido directo por WhatsApp, sin formulario ni comprobante (flujo de la v2).
 * `quick` lo muestra como alternativa discreta al checkout completo.
 */
export function WhatsAppCheckoutButton({ variant = 'full' }: { variant?: 'full' | 'quick' }) {
  const { lines, totals, collections } = useCart();

  return (
    <Button
      variant={variant === 'quick' ? 'ghost' : 'whatsapp'}
      size={variant === 'quick' ? 'sm' : 'lg'}
      fullWidth
      disabled={lines.length === 0}
      onClick={() => {
        const message = buildWhatsAppMessage({ lines, totals, collections });
        window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
      }}
    >
      <Icon name="whatsapp" size={variant === 'quick' ? 16 : 18} />
      {variant === 'quick' ? 'Pedido rápido por WhatsApp (sin comprobante)' : 'Pedir por WhatsApp'}
    </Button>
  );
}
