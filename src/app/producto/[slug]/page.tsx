import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Price } from '@/components/ui/price';
import { SectionHeading } from '@/components/ui/section-heading';
import { WHOLESALE } from '@/config/business';
import { AddToCartPanel } from '@/features/product/add-to-cart-panel';
import { ProductGrid } from '@/features/product/product-card';
import { ProductImage } from '@/features/product/product-image';
import { SizeGuideButton } from '@/features/size-guide/size-guide-button';
import {
  getCollectionBySlug,
  getCollections,
  getProductBySlug,
  getProducts,
  getProductsByCollection,
} from '@/lib/repositories/product-repository';
import { collectionPath, productPath, shopPath } from '@/lib/routes';
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
    openGraph: { images: [{ url: product.image, alt: product.name }] },
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

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface lg:sticky lg:top-24 lg:self-start">
          <ProductImage
            src={product.image}
            fallbackSrc={product.fallbackImage}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <Badge
            tone={product.compareAtPriceCents ? 'red' : 'gold'}
            className="absolute top-4 left-4"
          >
            {product.badge}
          </Badge>
        </div>

        <div className="flex flex-col gap-8">
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

          <div className="flex flex-col gap-3 border-t border-line pt-6">
            <SizeGuideButton />
            <AddToCartPanel product={product} />
          </div>

          <ul className="flex flex-col gap-3 border-t border-line pt-6 text-sm text-fg-muted">
            <li className="flex gap-3">
              <Icon name="check" size={18} className="shrink-0 text-gold" />
              {pct}% de descuento al mayor comprando {WHOLESALE.minQty} prendas o más (combinables).
            </li>
            <li className="flex gap-3">
              <Icon name="truck" size={18} className="shrink-0 text-gold" />
              Envíos a toda Venezuela por MRW, Zoom y Tealca. Entrega personal en Maracay.
            </li>
          </ul>
        </div>
      </div>

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
