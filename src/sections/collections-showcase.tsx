import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductImage } from '@/features/product/product-image';
import { collectionPath } from '@/lib/routes';
import type { Collection, Product } from '@/lib/schemas/product';

/** Una tarjeta por colección, usando como portada su primer producto. */
export function CollectionsShowcase({
  collections,
  products,
}: {
  collections: Collection[];
  products: Product[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Colecciones oficiales" title="Encuentra tu estilo" />
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {collections.map((collection) => {
          const cover = products.find((p) => p.collection === collection.slug);
          const count = products.filter((p) => p.collection === collection.slug).length;
          return (
            <li key={collection.slug}>
              <Link
                href={collectionPath(collection.slug)}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-card border border-line p-6 transition-shadow hover:shadow-gold"
              >
                {cover ? (
                  <ProductImage
                    src={cover.image}
                    fallbackSrc={cover.fallbackImage}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                <div className="relative flex flex-col gap-2">
                  <span className="font-display text-[0.65rem] font-bold tracking-[0.25em] text-gold uppercase">
                    {collection.tagline} · {count} {count === 1 ? 'prenda' : 'prendas'}
                  </span>
                  <span className="font-display text-3xl font-extrabold">{collection.name}</span>
                  <span className="text-sm text-fg-muted">{collection.description}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    Ver colección <Icon name="chevronRight" size={16} />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
