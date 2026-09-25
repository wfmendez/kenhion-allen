import type { Metadata } from 'next';
import type { SearchParams } from '@/features/catalog/catalog-params';
import { CatalogView } from '@/features/catalog/catalog-view';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { shopPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Tienda online',
  description:
    'Compra en línea las colecciones KA ELITE, Resiliencia y P.O.D. Envíos a toda Venezuela y descuento al mayor.',
  alternates: { canonical: shopPath },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [products, collections, params] = await Promise.all([
    getProducts(),
    getCollections(),
    searchParams,
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Colecciones oficiales"
        title="Tienda online"
        crumbs={[{ name: 'Tienda', path: shopPath }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CatalogView
          products={products}
          collections={collections}
          activeCollection="all"
          searchParams={params}
        />
      </div>
    </>
  );
}
