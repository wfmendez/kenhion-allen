import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './helpers';

const pages = [
  { path: '/', heading: 'Más allá del límite' },
  { path: '/tienda', heading: 'Tienda online' },
  { path: '/tienda/resiliencia', heading: 'Resiliencia' },
  { path: '/producto/hoodie-resiliencia', heading: 'Hoodie Resiliencia' },
  { path: '/carrito', heading: 'Cesta de compras' },
  { path: '/servicios', heading: 'Nuestros servicios' },
  { path: '/galeria', heading: 'Galería' },
  { path: '/nosotros', heading: 'Moda elegante en Maracay' },
  { path: '/preguntas-frecuentes', heading: 'Preguntas frecuentes' },
  { path: '/contacto', heading: 'Hablemos' },
  { path: '/checkout', heading: 'Finalizar compra' },
];

for (const { path, heading } of pages) {
  test(`${path} carga, es accesible y no desborda`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(/Kenhion Allen/);

    await expectNoHorizontalScroll(page);
    await expectNoA11yViolations(page);
    expect(errors).toEqual([]);
  });
}

test('rutas inexistentes muestran el 404 de la marca', async ({ page }) => {
  const response = await page.goto('/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
});

test('la guía de diseño no se publica en producción de Vercel pero sí en local', async ({
  page,
}) => {
  // En local VERCEL_ENV no existe, así que debe verse.
  const response = await page.goto('/dev/design');
  expect(response?.status()).toBe(200);
});

test('sitemap y robots están disponibles', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain('/producto/hoodie-resiliencia');
  expect(xml).toContain('/tienda/ka-elite');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /checkout');
});

test('la navegación principal funciona (menú móvil o de escritorio)', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    const menu = page.getByRole('dialog', { name: 'Menú' });
    await menu.getByRole('link', { name: 'Tienda' }).click();
  } else {
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Tienda' })
      .click();
  }
  await expect(page).toHaveURL(/\/tienda$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tienda online');
});
