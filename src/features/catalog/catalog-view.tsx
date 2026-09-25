import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SizeGuideButton } from '@/features/size-guide/size-guide-button';
import { ProductGrid } from '@/features/product/product-card';
import { cn } from '@/lib/cn';
import { collectionPath, shopPath } from '@/lib/routes';
import type { Collection, CollectionSlug, Product } from '@/lib/schemas/product';
import {
  buildCatalogQuery,
  genderOptions,
  parseCatalogParams,
  sortLabels,
  sortToParam,
  type SearchParams,
} from './catalog-params';
import { countByCollection, filterProducts, type SortOption } from './filter-products';
import { SortSelect } from './sort-select';

/** Vista de catálogo compartida por /tienda y /tienda/[coleccion]. Renderiza en el servidor. */
export function CatalogView({
  products,
  collections,
  activeCollection,
  searchParams,
}: {
  products: Product[];
  collections: Collection[];
  activeCollection: CollectionSlug | 'all';
  searchParams: SearchParams;
}) {
  const filters = parseCatalogParams(searchParams);
  const results = filterProducts(products, { ...filters, collection: activeCollection });
  const counts = countByCollection(products);
  const basePath = activeCollection === 'all' ? shopPath : collectionPath(activeCollection);
  const hasFilters = filters.gender !== 'all' || filters.query !== '';

  const tabs: { slug: CollectionSlug | 'all'; label: string; href: string }[] = [
    { slug: 'all', label: 'Todo', href: shopPath },
    ...collections.map((c) => ({ slug: c.slug, label: c.name, href: collectionPath(c.slug) })),
  ];

  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="Colecciones" className="-mx-4 overflow-x-auto px-4">
        <ul className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const active = tab.slug === activeCollection;
            return (
              <li key={tab.slug}>
                <Link
                  href={`${tab.href}${buildCatalogQuery(filters)}`}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors',
                    active
                      ? 'border-gold bg-gold text-ink'
                      : 'border-line text-fg-muted hover:border-gold/60 hover:text-fg',
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[0.6rem]',
                      active ? 'bg-ink/15' : 'bg-surface-raised',
                    )}
                  >
                    {counts[tab.slug]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Formulario GET: funciona sin JavaScript y deja la búsqueda en la URL. */}
        <form action={basePath} method="get" role="search" className="flex flex-1 gap-2">
          {filters.gender !== 'all' ? (
            <input type="hidden" name="genero" value={filters.gender.toLowerCase()} />
          ) : null}
          {filters.sort !== 'featured' ? (
            <input type="hidden" name="orden" value={sortToParam(filters.sort)} />
          ) : null}
          <label className="relative flex-1">
            <span className="sr-only">Buscar prendas</span>
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-subtle"
            />
            <input
              type="search"
              name="q"
              defaultValue={filters.query}
              placeholder="Buscar: hoodie, shorts, compresión…"
              className="w-full rounded-full border border-line bg-ink py-2.5 pr-4 pl-11 text-sm placeholder:text-fg-subtle focus:border-gold focus:outline-none"
            />
          </label>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-fg-subtle">Género:</span>
          {genderOptions.map((opt) => {
            const active = filters.gender === opt.value;
            return (
              <Link
                key={opt.value}
                href={`${basePath}${buildCatalogQuery({ ...filters, gender: opt.value })}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  active ? 'bg-gold/15 text-gold' : 'text-fg-muted hover:text-fg',
                )}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <SortSelect
            basePath={basePath}
            filters={filters}
            options={Object.entries(sortLabels) as [SortOption, string][]}
          />
          <SizeGuideButton />
        </div>
      </div>

      <p className="text-sm text-fg-muted" aria-live="polite">
        {results.length} {results.length === 1 ? 'prenda' : 'prendas'}
        {filters.query ? (
          <>
            {' '}
            para <strong className="text-fg">“{filters.query}”</strong>
          </>
        ) : null}
      </p>

      {results.length > 0 ? (
        <ProductGrid products={results} collections={collections} priorityCount={4} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface px-6 py-16 text-center">
          <Icon name="search" size={36} className="text-gold" />
          <p className="font-display font-bold">No encontramos coincidencias</p>
          <p className="text-sm text-fg-muted">Prueba con otra palabra o quita los filtros.</p>
          {hasFilters ? (
            <ButtonLink href={basePath} variant="outline">
              Quitar filtros
            </ButtonLink>
          ) : null}
        </div>
      )}
    </div>
  );
}
