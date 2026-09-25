import type { MetadataRoute } from 'next';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { getCollections, getProducts } from '@/lib/repositories/product-repository';
import { collectionPath, productPath } from '@/lib/routes';

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
    })),
  ];
}
