import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const CART_KEY = 'ka_cart_v2';

/** Deja un carrito listo antes de cargar la página (sin pasar por la UI). */
export async function seedCart(
  page: Page,
  lines: { productId: number; size: 'S' | 'M' | 'L' | 'XL'; qty: number }[],
) {
  await page.addInitScript(
    ([key, value]) => {
      if (!window.sessionStorage.getItem('__seeded')) {
        window.localStorage.setItem(key, value);
        window.sessionStorage.setItem('__seeded', '1');
      }
    },
    [CART_KEY, JSON.stringify({ version: 2, lines })] as const,
  );
}

export async function readCart(page: Page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? '{"lines":[]}').lines,
    CART_KEY,
  );
}

/** Reemplaza window.open para capturar la URL de WhatsApp sin salir del sitio. */
export async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    };
  });
}

export async function openedUrls(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __opened: string[] }).__opened ?? []);
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, 'la página no debe tener scroll horizontal').toBeLessThanOrEqual(clientWidth);
}

/** Auditoría WCAG 2.1 AA con axe. Falla con la lista legible de violaciones. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help} → ${v.nodes
        .map((n) => n.target.join(' '))
        .slice(0, 3)
        .join(' | ')}`,
  );
  expect(summary, summary.join('\n')).toEqual([]);
}
