import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import type { Collection, Product } from '@/lib/schemas/product';
import HomeClient from './_legacy/home-client';

/**
 * Adapta el modelo nuevo (centavos, slugs de colección) a la forma que espera el
 * componente heredado. Desaparece en la Fase 3, cuando la UI consuma el dominio directamente.
 */
function toLegacyProduct(product: Product, collections: Collection[]) {
  const collection = collections.find((c) => c.slug === product.collection);
  return {
    id: product.id,
    name: product.name,
    category: collection?.name ?? product.collection,
    gender: product.gender,
    price: product.priceCents / 100,
    oldPrice: product.compareAtPriceCents === null ? null : product.compareAtPriceCents / 100,
    badge: product.badge,
    badgeType: product.collection === 'ka-elite' ? 'elite' : product.collection,
    image: product.image,
    fallbackImage: product.fallbackImage,
    description: product.description,
  };
}

export default async function HomePage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return <HomeClient products={products.map((p) => toLegacyProduct(p, collections))} />;
}
