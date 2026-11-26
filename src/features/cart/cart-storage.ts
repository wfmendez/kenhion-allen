import {
  CART_STORAGE_VERSION,
  cartLineSchema,
  storedCartSchema,
  type CartLine,
} from '@/lib/schemas/cart';
import { readStorage, removeStorage, writeStorage } from '@/lib/storage';
import { cartReducer, initialCartState } from './cart-reducer';

export const CART_STORAGE_KEY = 'ka_cart_v3';

/**
 * Claves de versiones anteriores. Sus productos ya no existen en el catálogo,
 * así que no se migran: se borran para no dejar basura en el navegador.
 */
export const OBSOLETE_CART_KEYS = ['ka_cart', 'ka_cart_v2'] as const;

/**
 * Carga el carrito guardado. Una línea inválida (talla retirada, cantidad fuera de rango)
 * se descarta sola, sin vaciar el resto, y las líneas repetidas se unen como en el reducer.
 */
export function loadCart(): CartLine[] {
  OBSOLETE_CART_KEYS.forEach(removeStorage);
  const stored = readStorage(CART_STORAGE_KEY, storedCartSchema);
  if (!stored) return [];
  const lines = stored.lines.flatMap((line) => {
    const parsed = cartLineSchema.safeParse(line);
    return parsed.success ? [parsed.data] : [];
  });
  return cartReducer(initialCartState, { type: 'hydrate', lines }).lines;
}

export function saveCart(lines: CartLine[]): void {
  writeStorage(CART_STORAGE_KEY, { version: CART_STORAGE_VERSION, lines });
}
