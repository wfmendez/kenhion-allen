import type { MetadataRoute } from 'next';

/**
 * robots.txt. Solo se bloquea /dev/: carrito y checkout llevan `noindex` en su metadata, y
 * Google no podría leerlo si robots.txt bloqueara esas páginas.
 * En una previsualización no se declara sitemap ni se bloquea nada: el `noindex` del layout
 * la desindexa, y para eso tiene que poder leerse.
 */
export function buildRobots(indexable: boolean, siteUrl: string): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: '*', allow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dev/'] },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
