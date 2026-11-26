import { expect, test, type Page } from '@playwright/test';
import { PRODUCTION_URL } from '../src/config/site';

/**
 * SEO y vista previa al compartir. Corre contra `next start` de un build local, que sale con el
 * dominio real (ADR 0008): así se habría detectado que todo apuntaba a kenhion-allen.vercel.app.
 */

const indexable = [
  '/',
  '/tienda',
  '/tienda/ka-elite',
  '/producto/conjunto-biker-top',
  '/producto/short-de-caballero',
  '/nosotros',
  '/galeria',
  '/servicios',
  '/contacto',
  '/preguntas-frecuentes',
];

const meta = (page: Page, key: string) =>
  page.locator(`meta[property="${key}"], meta[name="${key}"]`).first().getAttribute('content');

for (const path of indexable) {
  test(`${path}: canonical, Open Graph e imagen para compartir`, async ({
    page,
    request,
    baseURL,
  }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(await meta(page, 'og:url'));
    expect(canonical?.startsWith(PRODUCTION_URL)).toBe(true);
    if (path === '/') expect(canonical).toBe(PRODUCTION_URL);

    expect(await meta(page, 'og:site_name')).toBe('Kenhion Allen');
    expect(await meta(page, 'og:type')).toBe('website');
    expect(await meta(page, 'og:locale')).toBe('es_VE');
    if (path !== '/') expect(await meta(page, 'og:title')).not.toContain('| Kenhion Allen');
    expect(await meta(page, 'og:image:width')).toBe('1200');
    expect(await meta(page, 'og:image:height')).toBe('630');
    expect(await meta(page, 'og:image:type')).toBe('image/jpeg');
    expect(await meta(page, 'twitter:card')).toBe('summary_large_image');

    const ogImage = new URL((await meta(page, 'og:image'))!);
    expect(ogImage.origin).toBe(PRODUCTION_URL);
    expect(ogImage.searchParams.get('v')).toMatch(/^[0-9a-f]{8}$/);
    const image = await request.get(new URL(ogImage.pathname + ogImage.search, baseURL).href);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toBe('image/jpeg');
    expect((await image.body()).length).toBeLessThan(300_000);

    expect(await page.content()).not.toContain('vercel.app');
  });
}

test('robots.txt declara el sitemap del dominio y no bloquea páginas con noindex', async ({
  request,
}) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${PRODUCTION_URL}/sitemap.xml`);
  expect(robots).toContain('Disallow: /dev/');
  expect(robots).not.toContain('Disallow: /carrito');
  expect(robots).not.toContain('Disallow: /checkout');
});

test('sitemap.xml: todas las URL en el dominio y con las fotos de producto', async ({
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<(?:loc|image:loc)>([^<]+)<\//g)].map((m) => m[1]!);
  expect(locs.length).toBeGreaterThan(10);
  for (const loc of locs) {
    expect(loc.startsWith(PRODUCTION_URL), loc).toBe(true);
    expect(loc).not.toMatch(/vercel\.app|localhost/);
  }
  expect(xml).toContain('<image:image>');
});

for (const path of ['/carrito', '/checkout', '/checkout/confirmacion']) {
  test(`${path} lleva noindex y no tiene canonical`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
}

test('favicon, apple-touch-icon y manifest responden y se declaran', async ({ page, request }) => {
  for (const path of [
    '/favicon.ico',
    '/apple-icon',
    '/manifest.webmanifest',
    '/images/marca/emblema-512.png',
    '/icon.svg',
  ]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }

  await page.goto('/');
  await expect(page.locator('link[rel="icon"][href^="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
});

const jsonLdTypes = async (page: Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  type Node = { '@type'?: string; '@graph'?: Node[] };
  const nodes = blocks.flatMap((text): Node[] => {
    const data = JSON.parse(text) as Node;
    return data['@graph'] ?? [data];
  });
  return { types: nodes.map((n) => n['@type']), raw: blocks.join('\n') };
};

test('JSON-LD: WebSite y OnlineStore en la home; Product en la ficha', async ({ page }) => {
  await page.goto('/');
  const home = await jsonLdTypes(page);
  expect(home.types).toEqual(expect.arrayContaining(['WebSite', 'OnlineStore']));
  expect(home.raw).not.toContain('vercel.app');

  await page.goto('/producto/short-de-caballero');
  const product = await jsonLdTypes(page);
  expect(product.types).toContain('Product');
  expect(product.types).not.toContain('ClothingStore');
  expect(product.types).not.toContain('OnlineStore');
  expect(product.raw).not.toContain('vercel.app');
});
