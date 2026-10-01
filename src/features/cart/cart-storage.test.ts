import { CART_STORAGE_KEY, OBSOLETE_CART_KEYS, loadCart, saveCart } from './cart-storage';

describe('cart-storage', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y carga con versión', () => {
    saveCart([{ productId: 11, color: 'verde', size: 'M', qty: 2 }]);
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 3,
    });
    expect(loadCart()).toEqual([{ productId: 11, color: 'verde', size: 'M', qty: 2 }]);
  });

  it('descarta datos corruptos sin lanzar errores', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{no es json');
    expect(loadCart()).toEqual([]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 3, lines: [{ qty: -1 }] }));
    expect(loadCart()).toEqual([]);
  });

  it('descarta una talla que ya no existe (XL)', () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: 3,
        lines: [{ productId: 11, color: 'verde', size: 'XL', qty: 1 }],
      }),
    );
    expect(loadCart()).toEqual([]);
  });

  it('borra los carritos del catálogo anterior sin migrarlos', () => {
    localStorage.setItem('ka_cart', JSON.stringify([{ id: 10, size: 'L', qty: 3 }]));
    localStorage.setItem(
      'ka_cart_v2',
      JSON.stringify({ version: 2, lines: [{ productId: 10, size: 'L', qty: 12 }] }),
    );
    expect(loadCart()).toEqual([]);
    OBSOLETE_CART_KEYS.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
  });
});
