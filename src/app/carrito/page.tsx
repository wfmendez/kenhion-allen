import type { Metadata } from 'next';
import { CartPageContent } from '@/features/cart/cart-page-content';
import { cartPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Cesta de compras',
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Cesta de compras" crumbs={[{ name: 'Cesta', path: cartPath }]} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CartPageContent />
      </div>
    </>
  );
}
