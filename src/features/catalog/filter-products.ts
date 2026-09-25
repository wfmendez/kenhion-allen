import type { CollectionSlug, Gender, Product } from '@/lib/schemas/product';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

export interface CatalogFilters {
  collection: CollectionSlug | 'all';
  gender: Gender | 'all';
  query: string;
  sort: SortOption;
}

export const defaultFilters: CatalogFilters = {
  collection: 'all',
  gender: 'all',
  query: '',
  sort: 'featured',
};

/** Minúsculas y sin acentos: "compresion" encuentra "Compresión". */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function matchesQuery(product: Product, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  return [product.name, product.description, product.badge].some((field) =>
    normalizeText(field).includes(q),
  );
}

/**
 * Filtra y ordena sin modificar el arreglo original.
 * Las prendas Unisex aparecen también al filtrar por Mujer u Hombre.
 */
export function filterProducts(products: Product[], filters: Partial<CatalogFilters>): Product[] {
  const { collection, gender, query, sort } = { ...defaultFilters, ...filters };

  const result = products.filter((p) => {
    if (collection !== 'all' && p.collection !== collection) return false;
    if (gender !== 'all' && p.gender !== gender && p.gender !== 'Unisex') return false;
    return matchesQuery(p, query);
  });

  switch (sort) {
    case 'price-asc':
      return result.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return result.sort((a, b) => b.priceCents - a.priceCents);
    case 'name':
      return result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    case 'featured':
      return result;
  }
}

export function countByCollection(products: Product[]): Record<CollectionSlug | 'all', number> {
  const counts: Record<CollectionSlug | 'all', number> = {
    all: products.length,
    'ka-elite': 0,
    resiliencia: 0,
    pod: 0,
  };
  for (const p of products) counts[p.collection] += 1;
  return counts;
}
