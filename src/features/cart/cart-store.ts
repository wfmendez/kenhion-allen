import { cartReducer, initialCartState, type CartAction, type CartState } from './cart-reducer';
import { CART_STORAGE_KEY, loadCart, saveCart } from './cart-storage';

/**
 * Store del carrito fuera de React, consumido con useSyncExternalStore:
 * - En el servidor y durante la hidratación devuelve el carrito vacío (sin desajustes de HTML).
 * - En el cliente carga localStorage de forma perezosa la primera vez que se lee.
 * - Se sincroniza entre pestañas con el evento `storage`.
 */
type Listener = () => void;

let state: CartState | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY) return;
  state = { lines: loadCart() };
  emit();
}

export function getCartSnapshot(): CartState {
  if (state === null) state = { lines: loadCart() };
  return state;
}

export function getServerCartSnapshot(): CartState {
  return initialCartState;
}

export function subscribeCart(listener: Listener): () => void {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function dispatchCart(action: CartAction): void {
  const next = cartReducer(getCartSnapshot(), action);
  if (next === state) return;
  state = next;
  saveCart(next.lines);
  emit();
}

/** Solo para tests: olvida el estado en memoria para volver a leer localStorage. */
export function resetCartStoreForTests(): void {
  state = null;
  listeners.clear();
}
