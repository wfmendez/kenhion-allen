import { siteConfig } from '@/config/site';
import { products } from '@/data/products';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('cada producto trae todas las fotos de todos sus colores, sin duplicados', async () => {
    const entries = await sitemap();
    for (const product of products) {
      const entry = entries.find((e) => e.url.endsWith(`/producto/${product.slug}`));
      const photos = new Set(product.colors.flatMap((c) => c.images.map((i) => i.src)));
      expect(entry?.images).toHaveLength(photos.size);
      expect(new Set(entry?.images).size).toBe(entry?.images?.length);
    }
  });

  it('todas las URL son absolutas sobre el dominio del sitio', async () => {
    const entries = await sitemap();
    const urls = entries.flatMap((e) => [e.url, ...(e.images ?? [])]);
    expect(urls.every((u) => u.startsWith(siteConfig.url))).toBe(true);
  });

  it('no incluye carrito, checkout ni la guía de diseño', async () => {
    const urls = (await sitemap()).map((e) => new URL(e.url).pathname);
    expect(urls).toContain('/');
    for (const path of urls) expect(path).not.toMatch(/^\/(carrito|checkout|dev)/);
  });
});
