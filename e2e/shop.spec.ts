import { expect, test } from '@playwright/test';
import { captureWindowOpen, openedUrls, readCart, seedCart } from './helpers';

test('los filtros de la tienda viven en la URL', async ({ page }) => {
  await page.goto('/tienda/resiliencia?genero=mujer&orden=precio-desc');
  const titles = page.getByRole('article').getByRole('heading', { level: 3 });
  await expect(titles).toHaveText([
    'Hoodie Resiliencia',
    'T Shirt Oversize Resiliencia',
    'Girl Shorts Resiliencia',
  ]);
  await expect(page.getByText('3 prendas')).toBeVisible();
});

test('la búsqueda funciona sin JavaScript de por medio (formulario GET)', async ({ page }) => {
  await page.goto('/tienda');
  const search = page.getByRole('searchbox', { name: 'Buscar prendas' });
  await search.fill('compresion');
  await search.press('Enter');
  await expect(page).toHaveURL(/q=compresion/);
  await expect(page.getByText(/prendas? para/)).toContainText('compresion');
  await expect(page.getByRole('article')).toHaveCount(3);
});

test('búsqueda rápida del header lleva al producto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar prendas' }).click();
  await page.getByPlaceholder('¿Qué estás buscando?').fill('hoodie');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /Hoodie Resiliencia/ })
    .click();
  await expect(page).toHaveURL(/\/producto\/hoodie-resiliencia$/);
});

test('pedir docena aplica 15% y el carrito persiste al recargar', async ({ page }) => {
  await page.goto('/producto/hoodie-resiliencia');
  await page
    .getByRole('group', { name: 'Selecciona tu talla' })
    .getByRole('radio', { name: 'L', exact: true })
    .check({ force: true });
  await page.getByRole('button', { name: /Pedir docena/ }).click();

  const drawer = page.getByRole('dialog', { name: 'Cesta de compras' });
  await expect(drawer).toContainText('¡Docena completada!');
  await expect(drawer).toContainText('$420.00');
  await expect(drawer).toContainText('−$63.00');
  await expect(drawer).toContainText('$357.00');

  await page.reload();
  expect(await readCart(page)).toEqual([{ productId: 10, size: 'L', qty: 12 }]);
  await expect(page.getByRole('button', { name: 'Abrir cesta (12 prendas)' })).toBeVisible();
});

test('en la cesta, cambiar a una talla repetida fusiona las líneas', async ({ page }) => {
  await seedCart(page, [
    { productId: 10, size: 'L', qty: 12 },
    { productId: 10, size: 'M', qty: 1 },
  ]);
  await page.goto('/carrito');
  const lines = page.getByRole('region', { name: 'Prendas en la cesta' }).getByRole('listitem');
  await expect(lines).toHaveCount(2);

  await lines.nth(1).getByRole('combobox').selectOption('L');
  await expect(lines).toHaveCount(1);
  expect(await readCart(page)).toEqual([{ productId: 10, size: 'L', qty: 13 }]);
  await expect(page.getByRole('complementary')).toContainText('$386.75');
});

test('el pedido rápido por WhatsApp arma el mensaje correcto', async ({ page }) => {
  await captureWindowOpen(page);
  await seedCart(page, [{ productId: 3, size: 'M', qty: 12 }]);
  await page.goto('/carrito');
  await page.getByRole('button', { name: /Pedido rápido por WhatsApp/ }).click();

  const [url] = await openedUrls(page);
  expect(url).toMatch(/^https:\/\/wa\.me\/584125305464\?text=/);
  const message = decodeURIComponent(url!.split('text=')[1]!);
  expect(message).toContain('Shorts KA Elite');
  expect(message).toContain('*TOTAL A PAGAR: $255.00 USD*');
});
