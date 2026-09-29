import type { Metadata } from 'next';
import { OrderConfirmation } from '@/features/checkout/order-confirmation';
import { confirmationPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Pedido registrado',
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <>
      <PageHeader
        title="Pedido registrado"
        crumbs={[{ name: 'Confirmación', path: confirmationPath }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <OrderConfirmation />
      </div>
    </>
  );
}
