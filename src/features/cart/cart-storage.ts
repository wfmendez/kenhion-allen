import { CART_STORAGE_VERSION, storedCartSchema, type CartLine } from '@/lib/schemas/cart';
import { readStorage, removeStorage, writeStorage } from '@/lib/storage';

export const CART_STORAGE_KEY = 'ka_cart_v3';

/**
 * Claves de versiones anteriores. Sus productos ya no existen en el catálogo,
 * así que no se migran: se borran para no dejar basura en el navegador.
 */
export const OBSOLETE_CART_KEYS = ['ka_cart', 'ka_cart_v2'] as const;

export function loadCart(): CartLine[] {
  OBSOLETE_CART_KEYS.forEach(removeStorage);
  return readStorage(CART_STORAGE_KEY, storedCartSchema)?.lines ?? [];
}

export function saveCart(lines: CartLine[]): void {
  writeStorage(CART_STORAGE_KEY, { version: CART_STORAGE_VERSION, lines });
}
