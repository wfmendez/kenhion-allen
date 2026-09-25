import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import type { Collection, Product } from '@/lib/schemas/product';
import { productPath } from '@/lib/routes';
import { ProductImage } from './product-image';
import { QuickAdd } from './quick-add';

export function ProductCard({
  product,
  collection,
  priority = false,
}: {
  product: Product;
  collection?: Collection;
  priority?: boolean;
}) {
  const href = productPath(product.slug);
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow duration-300 hover:shadow-gold">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-surface-raised"
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage
          src={product.image}
          fallbackSrc={product.fallbackImage}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
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
          <span className="truncate">{collection?.name ?? product.collection}</span>
          <span className="shrink-0">{product.gender}</span>
        </p>
        <h3 className="font-display text-base font-bold sm:text-lg">
          <Link href={href} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <Price cents={product.priceCents} compareAtCents={product.compareAtPriceCents} />
        <div className="mt-auto pt-2">
          <QuickAdd product={product} />
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
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.id} className="flex">
          <ProductCard
            product={product}
            collection={bySlug.get(product.collection)}
            priority={i < priorityCount}
          />
        </li>
      ))}
    </ul>
  );
}
