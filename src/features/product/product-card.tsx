'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/cn';
import { PHOTO_QUALITY, productCardSizes } from '@/lib/images';
import { productPath } from '@/lib/routes';
import { getPrimaryImage, type Collection, type Product } from '@/lib/schemas/product';
import { QuickAdd } from './quick-add';

/** Tarjeta del catálogo. Es cliente porque la foto cambia con el color elegido. */
export function ProductCard({
  product,
  collection,
  priority = false,
  sizes = productCardSizes(4),
}: {
  product: Product;
  collection?: Collection;
  priority?: boolean;
  /** Atributo `sizes` de la foto; debe reflejar el ancho real de la tarjeta. */
  sizes?: string;
}) {
  const [color, setColor] = useState(product.colors[0]!.slug);
  const href = productPath(product.slug);
  const image = getPrimaryImage(product, color);

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow duration-300 hover:shadow-gold">
      <Link
        href={href}
        className="relative block aspect-[2/3] overflow-hidden bg-surface-raised"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={image.src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          quality={PHOTO_QUALITY}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          tone={product.compareAtPriceCents ? 'red' : 'gold'}
          className="absolute top-3 left-3"
        >
          {product.badge}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <p className="flex items-center justify-between gap-2 font-display text-[0.62rem] font-bold tracking-[0.2em] text-fg-subtle uppercase">
          {/* En móvil la colección ya se lee en la insignia de la foto. */}
          <span className="hidden truncate sm:inline">
            {collection?.name ?? product.collection}
          </span>
          <span className="shrink-0">{product.gender}</span>
        </p>
        <h3 className="font-display text-base font-bold sm:text-lg">
          <Link href={href} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <Price cents={product.priceCents} compareAtCents={product.compareAtPriceCents} />
        <div className="mt-auto pt-2">
          <QuickAdd product={product} color={color} onColorChange={setColor} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  collections,
  priorityCount = 0,
}: {
  products: Product[];
  collections: Collection[];
  priorityCount?: number;
}) {
  const bySlug = new Map(collections.map((c) => [c.slug, c]));
  const manyProducts = products.length > 3;
  return (
    <ul
      className={cn(
        'grid w-full grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3',
        // Con pocos productos, 3 columnas llenan la fila; con más, se pasa a 4.
        manyProducts && 'xl:grid-cols-4',
      )}
    >
      {products.map((product, i) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            collection={bySlug.get(product.collection)}
            priority={i < priorityCount}
            sizes={productCardSizes(manyProducts ? 4 : 3)}
          />
        </li>
      ))}
    </ul>
  );
}
