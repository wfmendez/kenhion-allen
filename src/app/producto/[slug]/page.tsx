import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { Icon } from '@/components/ui/icon';
import { Price } from '@/components/ui/price';
import { SectionHeading } from '@/components/ui/section-heading';
import { WHOLESALE } from '@/config/business';
import { ProductGrid } from '@/features/product/product-card';
import { ProductPurchase } from '@/features/product/product-purchase';
import { SizeGuideButton } from '@/features/size-guide/size-guide-button';
import {
  getCollectionBySlug,
  getCollections,
  getProductBySlug,
  getProducts,
  getProductsByCollection,
} from '@/lib/repositories/product-repository';
import { collectionPath, productPath, shopPath } from '@/lib/routes';
import { getPrimaryImage } from '@/lib/schemas/product';
import { productJsonLd } from '@/lib/structured-data';
import { PageHeader } from '@/sections/page-header';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: productPath(product.slug) },
    openGraph: { images: [{ url: getPrimaryImage(product).src, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const [collection, collections, siblings] = await Promise.all([
    getCollectionBySlug(product.collection),
    getCollections(),
    getProductsByCollection(product.collection),
  ]);
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 4);
  const pct = Math.round(WHOLESALE.rate * 100);

  return (
    <>
      <JsonLd data={productJsonLd(product, collection)} />
      <PageHeader
        title={product.name}
        crumbs={[
          { name: 'Tienda', path: shopPath },
          ...(collection ? [{ name: collection.name, path: collectionPath(collection.slug) }] : []),
          { name: product.name, path: productPath(product.slug) },
        ]}
      />

      <ProductPurchase
        product={product}
        info={
          <div className="flex flex-col gap-3">
            <p className="font-display text-[0.7rem] font-bold tracking-[0.25em] text-gold uppercase">
              {collection?.name} · {product.gender}
            </p>
            <Price
              cents={product.priceCents}
              compareAtCents={product.compareAtPriceCents}
              size="lg"
            />
            <p className="leading-relaxed text-fg-muted">{product.description}</p>
          </div>
        }
        sizeGuide={<SizeGuideButton />}
        footer={
          <ul className="flex flex-col gap-3 border-t border-line pt-6 text-sm text-fg-muted">
            <li className="flex gap-3">
              <Icon name="check" size={18} className="shrink-0 text-gold" />
              {pct}% de descuento al mayor comprando {WHOLESALE.minQty} piezas o más (combinables).
              {product.wholesaleUnits > 1
                ? ` Este producto cuenta como ${product.wholesaleUnits} piezas.`
                : null}
            </li>
            <li className="flex gap-3">
              <Icon name="truck" size={18} className="shrink-0 text-gold" />
              Envíos a toda Venezuela por MRW, Zoom y Tealca. Entrega personal en Maracay.
            </li>
          </ul>
        }
      />

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <SectionHeading
            eyebrow={collection?.name}
            title="También te puede gustar"
            className="mb-10"
          />
          <ProductGrid products={related} collections={collections} />
        </section>
      ) : null}
    </>
  );
}
