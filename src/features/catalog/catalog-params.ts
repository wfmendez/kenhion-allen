import type { Gender } from '@/lib/schemas/product';
import type { CatalogFilters, SortOption } from './filter-products';

/**
 * Traduce los query params públicos (en español, compartibles) a filtros internos y viceversa.
 * Valores desconocidos se ignoran: una URL manipulada nunca rompe la página.
 */
export type SearchParams = Record<string, string | string[] | undefined>;

const genderParam: Record<string, Gender> = {
  mujer: 'Mujer',
  hombre: 'Hombre',
  unisex: 'Unisex',
};

const sortParam: Record<string, SortOption> = {
  destacados: 'featured',
  'precio-asc': 'price-asc',
  'precio-desc': 'price-desc',
  nombre: 'name',
};

export const sortLabels: Record<SortOption, string> = {
  featured: 'Destacados',
  'price-asc': 'Precio: menor a mayor',
  'price-desc': 'Precio: mayor a menor',
  name: 'Nombre: A–Z',
};

export const genderOptions: { value: Gender | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Mujer', label: 'Mujer' },
  { value: 'Hombre', label: 'Hombre' },
  { value: 'Unisex', label: 'Unisex' },
];

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? '';

export function parseCatalogParams(params: SearchParams): Omit<CatalogFilters, 'collection'> {
  return {
    gender: genderParam[first(params.genero).toLowerCase()] ?? 'all',
    query: first(params.q).slice(0, 80),
    sort: sortParam[first(params.orden).toLowerCase()] ?? 'featured',
  };
}

export function sortToParam(sort: SortOption): string {
  return Object.entries(sortParam).find(([, v]) => v === sort)?.[0] ?? 'destacados';
}

/** Construye el query string omitiendo valores por defecto: "?genero=mujer&q=hoodie". */
export function buildCatalogQuery(filters: Partial<Omit<CatalogFilters, 'collection'>>): string {
  const params = new URLSearchParams();
  if (filters.gender && filters.gender !== 'all')
    params.set('genero', filters.gender.toLowerCase());
  if (filters.query?.trim()) params.set('q', filters.query.trim());
  if (filters.sort && filters.sort !== 'featured') params.set('orden', sortToParam(filters.sort));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
