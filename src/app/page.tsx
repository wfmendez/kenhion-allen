import type { Metadata } from 'next';
import Image from 'next/image';
import { JsonLd } from '@/components/seo/json-ld';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { siteConfig } from '@/config/site';
import { homeGallery } from '@/data/gallery';
import { services } from '@/data/services';
import { ProductGrid } from '@/features/product/product-card';
import { PHOTO_QUALITY } from '@/lib/images';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { shopPath } from '@/lib/routes';
import { homeDescription, pageMetadata } from '@/lib/seo/metadata';
import { homeJsonLd } from '@/lib/structured-data';
import { Hero } from '@/sections/hero';
import { ServicesGrid } from '@/sections/services-grid';
import { WholesaleBanner } from '@/sections/wholesale-banner';

const homeTitle = `${siteConfig.name} | ${siteConfig.slogan}`;

// La home no tenía canonical. Se declara aquí y no en el layout (lo heredarían la 404 y el carrito).
export const metadata: Metadata = pageMetadata({
  path: '/',
  title: { absolute: homeTitle },
  ogTitle: homeTitle,
  description: homeDescription,
});

export default async function HomePage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const collection = collections[0];

  return (
    <>
      <JsonLd data={homeJsonLd()} />
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
                  sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, 50vw"
                  quality={PHOTO_QUALITY}
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
