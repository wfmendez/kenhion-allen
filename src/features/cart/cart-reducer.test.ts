import { cartReducer, getLineId, initialCartState, type CartState } from './cart-reducer';

const withLines = (...lines: CartState['lines']): CartState => ({ lines });

describe('cartReducer', () => {
  it('agrega un producto nuevo', () => {
    const state = cartReducer(initialCartState, { type: 'add', productId: 1, size: 'M', qty: 1 });
    expect(state.lines).toEqual([{ productId: 1, size: 'M', qty: 1 }]);
  });

  it('suma cantidades al agregar el mismo producto y talla', () => {
    const state = cartReducer(withLines({ productId: 1, size: 'M', qty: 2 }), {
      type: 'add',
      productId: 1,
      size: 'M',
      qty: 12,
    });
    expect(state.lines).toEqual([{ productId: 1, size: 'M', qty: 14 }]);
  });

  it('mantiene líneas separadas para tallas distintas', () => {
    const state = cartReducer(withLines({ productId: 1, size: 'M', qty: 1 }), {
      type: 'add',
      productId: 1,
      size: 'L',
      qty: 1,
    });
    expect(state.lines).toHaveLength(2);
  });

  it('ignora cantidades no positivas al agregar', () => {
    const before = withLines({ productId: 1, size: 'M', qty: 1 });
    expect(cartReducer(before, { type: 'add', productId: 2, size: 'S', qty: 0 })).toBe(before);
  });

  it('elimina la línea cuando la cantidad llega a 0', () => {
    const state = cartReducer(withLines({ productId: 1, size: 'M', qty: 1 }), {
      type: 'setQty',
      lineId: '1-M',
      qty: 0,
    });
    expect(state.lines).toEqual([]);
  });

  it('fusiona líneas al cambiar a una talla que ya está en el carrito', () => {
    const state = cartReducer(
      withLines({ productId: 1, size: 'M', qty: 2 }, { productId: 1, size: 'L', qty: 3 }),
      { type: 'changeSize', lineId: '1-M', size: 'L' },
    );
    expect(state.lines).toEqual([{ productId: 1, size: 'L', qty: 5 }]);
  });

  it('no muta el estado anterior', () => {
    const before = withLines({ productId: 1, size: 'M', qty: 1 });
    const snapshot = structuredClone(before);
    cartReducer(before, { type: 'add', productId: 1, size: 'M', qty: 5 });
    cartReducer(before, { type: 'setQty', lineId: '1-M', qty: 9 });
    cartReducer(before, { type: 'changeSize', lineId: '1-M', size: 'XL' });
    expect(before).toEqual(snapshot);
  });

  it('elimina, vacía e hidrata', () => {
    const base = withLines(
      { productId: 1, size: 'M', qty: 1 },
      { productId: 2, size: 'S', qty: 1 },
    );
    expect(cartReducer(base, { type: 'remove', lineId: '2-S' }).lines).toHaveLength(1);
    expect(cartReducer(base, { type: 'clear' }).lines).toEqual([]);
    const hydrated = cartReducer(initialCartState, {
      type: 'hydrate',
      lines: [
        { productId: 3, size: 'S', qty: 1 },
        { productId: 3, size: 'S', qty: 2 },
      ],
    });
    expect(hydrated.lines).toEqual([{ productId: 3, size: 'S', qty: 3 }]);
  });

  it('genera ids de línea por producto y talla', () => {
    expect(getLineId({ productId: 7, size: 'XL' })).toBe('7-XL');
  });
});
