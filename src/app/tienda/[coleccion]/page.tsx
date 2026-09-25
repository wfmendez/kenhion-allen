import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { SearchParams } from '@/features/catalog/catalog-params';
import { CatalogView } from '@/features/catalog/catalog-view';
import {
  getCollectionBySlug,
  getCollections,
  getProducts,
} from '@/lib/repositories/product-repository';
import { collectionPath, shopPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

type Params = Promise<{ coleccion: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ coleccion: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const collection = await getCollectionBySlug((await params).coleccion);
  if (!collection) return {};
  return {
    title: `${collection.name}: ${collection.tagline}`,
    description: collection.description,
    alternates: { canonical: collectionPath(collection.slug) },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  const { coleccion } = await params;
  const collection = await getCollectionBySlug(coleccion);
  if (!collection) notFound();

  const [products, collections, query] = await Promise.all([
    getProducts(),
    getCollections(),
    searchParams,
  ]);

  return (
    <>
      <PageHeader
        eyebrow={collection.tagline}
        title={collection.name}
        description={collection.description}
        crumbs={[
          { name: 'Tienda', path: shopPath },
          { name: collection.name, path: collectionPath(collection.slug) },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CatalogView
          products={products}
          collections={collections}
          activeCollection={collection.slug}
          searchParams={query}
        />
      </div>
    </>
  );
}
