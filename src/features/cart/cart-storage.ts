import {
  CART_STORAGE_VERSION,
  legacyCartSchema,
  storedCartSchema,
  type CartLine,
} from '@/lib/schemas/cart';
import { readStorage, removeStorage, writeStorage } from '@/lib/storage';

export const CART_STORAGE_KEY = 'ka_cart_v2';
export const LEGACY_CART_STORAGE_KEY = 'ka_cart';

/** Carga el carrito guardado, migrando el formato del sitio anterior si existe. */
export function loadCart(): CartLine[] {
  const stored = readStorage(CART_STORAGE_KEY, storedCartSchema);
  if (stored) return stored.lines;

  const legacy = readStorage(LEGACY_CART_STORAGE_KEY, legacyCartSchema);
  if (legacy) {
    const lines = legacy.map(({ id, size, qty }) => ({ productId: id, size, qty }));
    saveCart(lines);
    removeStorage(LEGACY_CART_STORAGE_KEY);
    return lines;
  }
  return [];
}

export function saveCart(lines: CartLine[]): void {
  writeStorage(CART_STORAGE_KEY, { version: CART_STORAGE_VERSION, lines });
}
