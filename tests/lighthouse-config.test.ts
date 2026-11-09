import lighthouseConfig from '../lighthouserc.json';
import nextConfig from '../next.config';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { collectionPath, productPath } from '@/lib/routes';

const auditedPaths = lighthouseConfig.ci.collect.url.map((url) => new URL(url).pathname);

describe('Lighthouse en CI', () => {
  it('audita páginas que existen (no URLs retiradas que redirigen)', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const redirected = new Set(redirects.map((r) => r.source));
    expect(auditedPaths.filter((path) => redirected.has(path))).toEqual([]);

    const productPaths = new Set(products.map((p) => productPath(p.slug)));
    const collectionPaths = new Set(collections.map((c) => collectionPath(c.slug)));
    for (const path of auditedPaths) {
      if (path.startsWith('/producto/')) expect(productPaths).toContain(path);
      if (path.startsWith('/tienda/')) expect(collectionPaths).toContain(path);
    }
  });

  it('incluye al menos una ficha de producto', () => {
    expect(auditedPaths.some((path) => path.startsWith('/producto/'))).toBe(true);
  });
});
