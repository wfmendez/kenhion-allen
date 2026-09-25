'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/features/cart/cart-context';
import { buildCatalogQuery } from '@/features/catalog/catalog-params';
import { filterProducts } from '@/features/catalog/filter-products';
import { ProductImage } from '@/features/product/product-image';
import { formatUSD } from '@/lib/money';
import { productPath, shopPath } from '@/lib/routes';

const MAX_RESULTS = 6;

/** Búsqueda rápida del header: resultados al escribir y Enter para ver todo en la tienda. */
export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { products } = useCart();
  const router = useRouter();
  const results = query.trim() ? filterProducts(products, { query }).slice(0, MAX_RESULTS) : [];

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-surface-raised hover:text-gold"
      >
        <Icon name="search" label="Buscar prendas" />
      </button>
      <Modal open={open} onClose={close} title="Buscar prendas" hideTitle>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            close();
            router.push(`${shopPath}${buildCatalogQuery({ query })}`);
          }}
        >
          <label className="relative block">
            <span className="sr-only">Buscar prendas</span>
            <Icon
              name="search"
              size={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gold"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              autoFocus
              className="w-full rounded-full border border-line bg-ink py-3.5 pr-4 pl-12 text-base placeholder:text-fg-subtle focus:border-gold focus:outline-none"
            />
          </label>
        </form>
        <div className="mt-5" aria-live="polite">
          {!query.trim() ? (
            <p className="text-sm text-fg-subtle">Escribe el nombre de una prenda o colección.</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-fg-muted">Sin resultados para “{query}”.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={productPath(p.slug)}
                    onClick={close}
                    className="flex items-center gap-4 py-3 hover:text-gold"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <ProductImage
                        src={p.image}
                        fallbackSrc={p.fallbackImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                    <span className="flex-1 font-display text-sm font-bold">{p.name}</span>
                    <span className="text-sm text-gold">{formatUSD(p.priceCents)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}
