import type { CollectionSlug } from '@/lib/schemas/product';

/** Constructores de URL: un solo lugar para cambiar la estructura de rutas. */
export const productPath = (slug: string) => `/producto/${slug}`;
export const collectionPath = (slug: CollectionSlug) => `/tienda/${slug}`;
export const shopPath = '/tienda';
export const cartPath = '/carrito';
export const checkoutPath = '/checkout';
export const confirmationPath = '/checkout/confirmacion';

/** Imágenes para compartir (Open Graph), generadas en el build por Route Handlers. */
export const ogSitePath = '/og/sitio';
export const ogShopPath = '/og/tienda';
export const ogCollectionPath = (slug: CollectionSlug) => `/og/coleccion/${slug}`;
export const ogProductPath = (slug: string) => `/og/producto/${slug}`;
