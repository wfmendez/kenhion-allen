import type { Metadata } from 'next';
import { CheckoutContent } from '@/features/checkout/checkout-content';
import { cartPath, checkoutPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Finalizar compra',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Finalizar compra"
        description="Completa tus datos para generar tu comprobante y enviar el pedido por WhatsApp."
        crumbs={[
          { name: 'Cesta', path: cartPath },
          { name: 'Finalizar compra', path: checkoutPath },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CheckoutContent />
      </div>
    </>
  );
}
