import { expect, test } from '@playwright/test';

test('la página de inicio carga con la marca', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Kenhion Allen/);
  await expect(page.getByRole('banner')).toBeVisible();
});
