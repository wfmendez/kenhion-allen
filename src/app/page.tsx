import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { services } from '@/data/services';
import { ProductGrid } from '@/features/product/product-card';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { shopPath } from '@/lib/routes';
import { CollectionsShowcase } from '@/sections/collections-showcase';
import { Hero } from '@/sections/hero';
import { ServicesGrid } from '@/sections/services-grid';
import { WholesaleBanner } from '@/sections/wholesale-banner';

const FEATURED_COUNT = 4;

export default async function HomePage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  // Destacados: productos más recientes del catálogo (los últimos agregados).
  const featured = [...products].reverse().slice(0, FEATURED_COUNT);

  return (
    <>
      <Hero />
      <CollectionsShowcase collections={collections} products={products} />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center gap-8">
          <SectionHeading eyebrow="Tienda online" title="Lo más nuevo" />
          <ProductGrid products={featured} collections={collections} />
          <ButtonLink href={shopPath} variant="outline">
            Ver todas las prendas
          </ButtonLink>
        </div>
      </section>

      <WholesaleBanner />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Kenhion Allen"
          title="Nuestros servicios"
          description="Más que una tienda: te acompañamos a construir tu estilo."
          className="mb-12"
        />
        <ServicesGrid services={services} />
      </section>
    </>
  );
}
