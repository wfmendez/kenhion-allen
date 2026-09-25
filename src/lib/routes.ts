import type { CollectionSlug } from '@/lib/schemas/product';

/** Constructores de URL: un solo lugar para cambiar la estructura de rutas. */
export const productPath = (slug: string) => `/producto/${slug}`;
export const collectionPath = (slug: CollectionSlug) => `/tienda/${slug}`;
export const shopPath = '/tienda';
export const cartPath = '/carrito';
