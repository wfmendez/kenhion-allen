import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { homeGallery } from '@/data/gallery';
import { services } from '@/data/services';
import { ProductGrid } from '@/features/product/product-card';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { shopPath } from '@/lib/routes';
import { Hero } from '@/sections/hero';
import { ServicesGrid } from '@/sections/services-grid';
import { WholesaleBanner } from '@/sections/wholesale-banner';

export default async function HomePage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const collection = collections[0];

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center gap-10">
          <SectionHeading
            eyebrow="Colección oficial"
            title={collection?.name ?? 'Tienda online'}
            description={collection?.description}
          />
          <ProductGrid products={products} collections={collections} priorityCount={2} />
          <ButtonLink href={shopPath} variant="outline">
            Ver la tienda
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center gap-10">
          <SectionHeading
            eyebrow="En acción"
            title="Hecha para entrenar"
            description="La colección puesta a prueba por atletas."
          />
          <ul className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {homeGallery.map((image) => (
              <li
                key={image.src}
                className="relative aspect-[9/16] overflow-hidden rounded-card border border-line"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
          <ButtonLink href="/galeria" variant="outline">
            Ver la galería
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
