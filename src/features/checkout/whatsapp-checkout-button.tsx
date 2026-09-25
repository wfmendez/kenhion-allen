'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/features/cart/cart-context';
import { buildWhatsAppMessage, buildWhatsAppUrl } from './build-whatsapp-message';

/**
 * Pedido directo por WhatsApp (flujo de la v2).
 * En la Fase 4 se complementa con el checkout que genera el comprobante PDF.
 */
export function WhatsAppCheckoutButton({ fullWidth = true }: { fullWidth?: boolean }) {
  const { lines, totals, collections } = useCart();
  const disabled = lines.length === 0;

  return (
    <Button
      variant="whatsapp"
      size="lg"
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={() => {
        const message = buildWhatsAppMessage({ lines, totals, collections });
        window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
      }}
    >
      <Icon name="whatsapp" size={18} /> Pedir por WhatsApp
    </Button>
  );
}
