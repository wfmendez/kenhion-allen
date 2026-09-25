import { z } from 'zod';
import { collections as collectionsData } from '@/data/collections';
import { products as productsData } from '@/data/products';
import {
  collectionSchema,
  productSchema,
  type Collection,
  type CollectionSlug,
  type Product,
} from '@/lib/schemas/product';

/**
 * Único punto de acceso al catálogo. Hoy lee archivos locales; mañana puede leer
 * Supabase o un CMS sin que cambie ningún componente (por eso la API es async).
 */

let cache: { products: Product[]; collections: Collection[] } | null = null;

function load() {
  if (!cache) {
    cache = {
      products: z.array(productSchema).parse(productsData),
      collections: z.array(collectionSchema).parse(collectionsData),
    };
  }
  return cache;
}

export async function getProducts(): Promise<Product[]> {
  return load().products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return load().products.find((p) => p.slug === slug);
}

export async function getProductsByCollection(slug: CollectionSlug): Promise<Product[]> {
  return load().products.filter((p) => p.collection === slug);
}

export async function getCollections(): Promise<Collection[]> {
  return load().collections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return load().collections.find((c) => c.slug === slug);
}
