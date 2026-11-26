import type { Metadata } from 'next';
import type { SearchParams } from '@/features/catalog/catalog-params';
import { CatalogView } from '@/features/catalog/catalog-view';
import { shopOgImage } from '@/features/seo/og-image';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { shopPath } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { PageHeader } from '@/sections/page-header';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: shopPath,
    title: 'Tienda online',
    description:
      'Compra en línea la colección KA ELITE: short, franela de compresión y conjunto biker + top. Envíos a toda Venezuela y descuento al mayor.',
    image: shopOgImage(await getProducts()),
  });
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [products, collections, params] = await Promise.all([
    getProducts(),
    getCollections(),
    searchParams,
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Colección KA ELITE"
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
