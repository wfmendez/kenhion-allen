import type { MetadataRoute } from 'next';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { collectionPath, productPath } from '@/lib/routes';

/**
 * Sin lastModified: no hay una fecha fiable de cambio. Las fichas incluyen todas las fotos de
 * todos los colores: las de los colores que no salen por defecto solo se cargan al elegirlos,
 * y el sitemap de imágenes existe justo para lo que Google no encontraría de otra forma.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  return [
    ...mainNav.map((item) => ({
      url: url(item.href),
      changeFrequency: 'monthly' as const,
      priority: item.href === '/' ? 1 : 0.7,
    })),
    ...collections.map((c) => ({
      url: url(collectionPath(c.slug)),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: url(productPath(p.slug)),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      images: [...new Set(p.colors.flatMap((c) => c.images.map((i) => url(i.src))))],
    })),
  ];
}
