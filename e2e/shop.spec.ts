import { expect, test } from '@playwright/test';
import { captureWindowOpen, openedUrls, readCart, seedCart } from './helpers';

test('los filtros de la tienda viven en la URL', async ({ page }) => {
  await page.goto('/tienda?genero=caballero&orden=precio-desc');
  const titles = page.getByRole('article').getByRole('heading', { level: 3 });
  await expect(titles).toHaveText(['Franela de compresión de caballero', 'Short de caballero']);
  await expect(page.getByText('2 prendas')).toBeVisible();

  await page.goto('/tienda?genero=dama');
  await expect(titles).toHaveText(['Conjunto biker + top']);
});

test('la búsqueda funciona sin JavaScript de por medio (formulario GET)', async ({ page }) => {
  await page.goto('/tienda');
  const search = page.getByRole('searchbox', { name: 'Buscar prendas' });
  await search.fill('compresion');
  await search.press('Enter');
  await expect(page).toHaveURL(/q=compresion/);
  await expect(page.getByText(/prendas? para/)).toContainText('compresion');
  await expect(page.getByRole('article')).toHaveCount(2);
});

test('búsqueda rápida del header lleva al producto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar prendas' }).click();
  await page.getByPlaceholder('¿Qué estás buscando?').fill('biker');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /Conjunto biker \+ top/ })
    .click();
  await expect(page).toHaveURL(/\/producto\/conjunto-biker-top$/);
});

test('en la ficha, cambiar de color cambia la foto principal', async ({ page }) => {
  await page.goto('/producto/short-de-caballero');
  const main = page.getByRole('img', { name: /Short de caballero color/ }).first();
  await expect(main).toHaveAttribute('alt', 'Short de caballero color verde, vista frontal');

  await page
    .getByRole('group', { name: /^Color:/ })
    .getByRole('radio', { name: 'Blanco' })
    .check({ force: true });
  await expect(main).toHaveAttribute('alt', 'Short de caballero color blanco, vista frontal');

  await page.getByRole('button', { name: /Ver foto 2/ }).click();
  await expect(main).toHaveAttribute('alt', 'Short de caballero color blanco, detalle del emblema');
});

test('pedir al mayor aplica 15% desde 6 piezas y el carrito persiste al recargar', async ({
  page,
}) => {
  await page.goto('/producto/franela-de-compresion-de-caballero');
  await page
    .getByRole('group', { name: /^Color:/ })
    .getByRole('radio', { name: 'Negro' })
    .check({ force: true });
  await page
    .getByRole('group', { name: 'Selecciona tu talla' })
    .getByRole('radio', { name: 'L', exact: true })
    .check({ force: true });
  await page.getByRole('button', { name: /Pedir al mayor \(6 uds\)/ }).click();

  const drawer = page.getByRole('dialog', { name: 'Cesta de compras' });
  await expect(drawer).toContainText('¡Precio al mayor activado!');
  await expect(drawer).toContainText('Color Negro');
  await expect(drawer).toContainText('$198.72');
  await expect(drawer).toContainText('−$29.81');
  await expect(drawer).toContainText('$168.91');

  await page.reload();
  expect(await readCart(page)).toEqual([{ productId: 12, color: 'negro', size: 'L', qty: 6 }]);
  await expect(page.getByRole('button', { name: 'Abrir cesta (6 prendas)' })).toBeVisible();
});

test('con 5 piezas todavía no hay descuento', async ({ page }) => {
  await seedCart(page, [{ productId: 13, color: 'verde', size: 'M', qty: 5 }]);
  await page.goto('/carrito');
  const summary = page.getByRole('complementary');
  await expect(summary).toContainText('$223.35');
  await expect(summary).not.toContainText('Descuento al mayor');
  await expect(page.getByRole('main').getByText(/Añade 1 pieza más/)).toBeVisible();
});

test('en la cesta, cambiar a una talla repetida fusiona las líneas', async ({ page }) => {
  await seedCart(page, [
    { productId: 12, color: 'verde', size: 'L', qty: 6 },
    { productId: 12, color: 'verde', size: 'M', qty: 1 },
  ]);
  await page.goto('/carrito');
  const lines = page.getByRole('region', { name: 'Prendas en la cesta' }).getByRole('listitem');
  await expect(lines).toHaveCount(2);

  await lines.nth(1).getByRole('combobox').selectOption('L');
  await expect(lines).toHaveCount(1);
  expect(await readCart(page)).toEqual([{ productId: 12, color: 'verde', size: 'L', qty: 7 }]);
  // 7 × $33.12 = $231.84; −15% ($34.78) = $197.06
  await expect(page.getByRole('complementary')).toContainText('$197.06');
});

test('el pedido rápido por WhatsApp arma el mensaje correcto', async ({ page }) => {
  await captureWindowOpen(page);
  await seedCart(page, [{ productId: 11, color: 'negro', size: 'M', qty: 6 }]);
  await page.goto('/carrito');
  await page.getByRole('button', { name: /Pedido rápido por WhatsApp/ }).click();

  const [url] = await openedUrls(page);
  expect(url).toMatch(/^https:\/\/wa\.me\/584125305464\?text=/);
  const message = decodeURIComponent(url!.split('text=')[1]!);
  expect(message).toContain('Short de caballero');
  expect(message).toContain('Color: Negro');
  // 6 × $24.37 = $146.22; −15% ($21.93) = $124.29
  expect(message).toContain('*TOTAL A PAGAR: $124.29 USD*');
});
