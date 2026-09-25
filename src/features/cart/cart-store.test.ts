import { CART_STORAGE_KEY } from './cart-storage';
import {
  dispatchCart,
  getCartSnapshot,
  getServerCartSnapshot,
  resetCartStoreForTests,
  subscribeCart,
} from './cart-store';

describe('cart-store', () => {
  beforeEach(() => {
    localStorage.clear();
    resetCartStoreForTests();
  });

  it('el snapshot del servidor siempre está vacío', () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 2, lines: [{ productId: 1, size: 'M', qty: 1 }] }),
    );
    expect(getServerCartSnapshot().lines).toEqual([]);
    expect(getCartSnapshot().lines).toHaveLength(1);
  });

  it('persiste y notifica a los suscriptores', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCart(listener);
    dispatchCart({ type: 'add', productId: 2, size: 'L', qty: 3 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!).lines).toEqual([
      { productId: 2, size: 'L', qty: 3 },
    ]);
    unsubscribe();
  });

  it('no notifica si la acción no cambia nada', () => {
    const listener = vi.fn();
    subscribeCart(listener);
    dispatchCart({ type: 'add', productId: 2, size: 'L', qty: 0 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('mantiene el mismo snapshot entre lecturas (requisito de useSyncExternalStore)', () => {
    expect(getCartSnapshot()).toBe(getCartSnapshot());
  });

  it('se sincroniza cuando otra pestaña modifica el carrito', () => {
    const listener = vi.fn();
    subscribeCart(listener);
    getCartSnapshot();
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: 2, lines: [{ productId: 5, size: 'S', qty: 2 }] }),
    );
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY }));
    expect(listener).toHaveBeenCalled();
    expect(getCartSnapshot().lines).toEqual([{ productId: 5, size: 'S', qty: 2 }]);
  });
});
