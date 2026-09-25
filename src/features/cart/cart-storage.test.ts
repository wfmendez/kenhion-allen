import { CART_STORAGE_KEY, LEGACY_CART_STORAGE_KEY, loadCart, saveCart } from './cart-storage';

describe('cart-storage', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y carga con versión', () => {
    saveCart([{ productId: 1, size: 'M', qty: 2 }]);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 2,
    });
    expect(loadCart()).toEqual([{ productId: 1, size: 'M', qty: 2 }]);
  });

  it('descarta datos corruptos sin lanzar errores', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{no es json');
    expect(loadCart()).toEqual([]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 2, lines: [{ qty: -1 }] }));
    expect(loadCart()).toEqual([]);
  });

  it('migra el carrito del sitio anterior y borra la clave vieja', () => {
    localStorage.setItem(
      LEGACY_CART_STORAGE_KEY,
      JSON.stringify([{ id: 10, name: 'Hoodie', price: 35, size: 'L', qty: 3 }]),
    );
    expect(loadCart()).toEqual([{ productId: 10, size: 'L', qty: 3 }]);
    expect(localStorage.getItem(LEGACY_CART_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(CART_STORAGE_KEY)).not.toBeNull();
  });
});
