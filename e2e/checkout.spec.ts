import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import {
  captureWindowOpen,
  expectNoA11yViolations,
  openedUrls,
  readCart,
  seedCart,
} from './helpers';

test.describe('checkout con comprobante PDF', () => {
  test.beforeEach(async ({ page }) => {
    await captureWindowOpen(page);
    await seedCart(page, [
      { productId: 10, size: 'XL', qty: 8 },
      { productId: 2, size: 'S', qty: 4 },
    ]);
  });

  test('valida los campos obligatorios', async ({ page }) => {
    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    await expect(page.getByText('Escribe tu nombre')).toBeVisible();
    await expect(page.getByText('Selecciona un método de pago')).toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);
    await expectNoA11yViolations(page);
  });

  test('pedido completo: formulario → confirmación → PDF → WhatsApp', async ({ page }) => {
    await page.goto('/checkout');

    await page.getByLabel('Nombre y apellido').fill('María José Núñez');
    await page.getByLabel('Cédula o RIF').fill('v 15.123.456');
    await page.getByLabel('Teléfono (WhatsApp)').fill('+58 424 123 4567');
    await page.getByLabel('Estado').selectOption('Mérida');
    await page.getByLabel('Ciudad').fill('Mérida');
    await page.getByLabel('Dirección').fill('Av. Las Américas, residencias Añil, apto 4-B');
    await page.getByLabel('¿Cómo lo recibes?').selectOption('Tealca');
    await page.getByLabel('Método de pago').selectOption('Zelle');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(page).toHaveURL(/\/checkout\/confirmacion$/);
    const orderNumber = page.getByText(/^KA-\d{8}-[2-9A-Z]{4}$/);
    await expect(orderNumber).toBeVisible();
    const number = (await orderNumber.textContent())!;
    await expect(page.getByRole('complementary')).toContainText('$289.00');

    // La confirmación sobrevive a una recarga (sessionStorage).
    await page.reload();
    await expect(page.getByText(number)).toBeVisible();

    // PDF
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar comprobante' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`Comprobante-${number}.pdf`);
    const pdf = await readFile((await download.path())!);
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');

    // WhatsApp
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();
    const [url] = await openedUrls(page);
    const message = decodeURIComponent(url!.split('text=')[1]!);
    expect(message).toContain(`*Orden:* ${number}`);
    expect(message).toContain('Cédula/RIF: V-15123456');
    expect(message).toContain('Teléfono: 0424-1234567');
    expect(message).toContain('*TOTAL A PAGAR: $289.00 USD*');
    await expect(page.getByRole('status').filter({ hasText: 'Abrimos WhatsApp' })).toBeVisible();

    // La cesta se vacía y no quedan datos personales en localStorage.
    expect(await readCart(page)).toEqual([]);
    const local = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    expect(local).not.toContain('Núñez');

    await expectNoA11yViolations(page);
  });

  test('con la cesta vacía, el checkout invita a volver a la tienda', async ({ page }) => {
    await page.goto('/checkout');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByRole('main').getByText('Tu cesta está vacía')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toHaveCount(0);
  });

  test('sin pedido en la pestaña, la confirmación lo explica', async ({ page }) => {
    await page.goto('/checkout/confirmacion');
    await expect(page.getByText('No encontramos un pedido reciente')).toBeVisible();
  });
});
