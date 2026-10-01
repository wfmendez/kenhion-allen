import { products } from '@/data/products';
import { calculateTotals, describeQuantity, resolveCartLines } from './pricing';

describe('resolveCartLines', () => {
  it('toma precio, color e imagen del catálogo', () => {
    const [line] = resolveCartLines(
      [{ productId: 12, color: 'negro', size: 'M', qty: 2 }],
      products,
    );
    expect(line).toMatchObject({
      lineId: '12-negro-M',
      lineTotalCents: 6624,
      wholesalePieces: 2,
      colorOption: { name: 'Negro' },
      image: { src: '/images/ka-elite/franela/negro-frente.jpg' },
    });
  });

  it('descarta líneas con producto, color o talla que ya no existen', () => {
    const lines = resolveCartLines(
      [
        { productId: 999, color: 'verde', size: 'M', qty: 1 },
        { productId: 13, color: 'blanco', size: 'M', qty: 1 }, // el conjunto no viene en blanco
        { productId: 11, color: 'verde', size: 'M', qty: 1 },
      ],
      products,
    );
    expect(lines.map((l) => l.lineId)).toEqual(['11-verde-M']);
  });

  it('el conjunto cuenta como 2 piezas: 3 conjuntos activan el descuento al mayor', () => {
    const lines = resolveCartLines(
      [{ productId: 13, color: 'verde', size: 'M', qty: 3 }],
      products,
    );
    const totals = calculateTotals(lines);
    expect(totals.itemCount).toBe(3);
    expect(totals.wholesalePieces).toBe(6);
    expect(totals.isWholesale).toBe(true);
    // 3 × $44.67 = $134.01; 15% = $20.10
    expect(totals.discountCents).toBe(2010);
    expect(totals.totalCents).toBe(11391);
  });

  it('2 conjuntos + 1 short son 5 piezas: todavía sin descuento', () => {
    const totals = calculateTotals(
      resolveCartLines(
        [
          { productId: 13, color: 'negro', size: 'S', qty: 2 },
          { productId: 11, color: 'verde', size: 'M', qty: 1 },
        ],
        products,
      ),
    );
    expect(totals).toMatchObject({
      itemCount: 3,
      wholesalePieces: 5,
      isWholesale: false,
      itemsToWholesale: 1,
    });
  });
});

const line = (qty: number, unitCents: number) => ({
  qty,
  lineTotalCents: qty * unitCents,
  wholesalePieces: qty,
});

describe('calculateTotals', () => {
  it('no aplica descuento por debajo de 6 piezas', () => {
    expect(calculateTotals([line(5, 3312)])).toMatchObject({
      itemCount: 5,
      subtotalCents: 16560,
      discountCents: 0,
      totalCents: 16560,
      isWholesale: false,
      itemsToWholesale: 1,
    });
  });

  it('aplica 15% al llegar a 6 piezas combinadas', () => {
    const totals = calculateTotals([line(3, 2437), line(3, 4467)]);
    expect(totals.isWholesale).toBe(true);
    expect(totals.subtotalCents).toBe(20712);
    // 20712 * 0.15 = 3106.8 → 3107
    expect(totals.discountCents).toBe(3107);
    expect(totals.totalCents).toBe(17605);
    expect(totals.itemsToWholesale).toBe(0);
  });

  it('redondea el descuento al centavo', () => {
    const totals = calculateTotals([line(6, 3312)]);
    // 19872 * 0.15 = 2980.8 → 2981
    expect(totals.discountCents).toBe(2981);
    expect(totals.totalCents).toBe(16891);
  });

  it('devuelve ceros con el carrito vacío', () => {
    expect(calculateTotals([])).toMatchObject({
      itemCount: 0,
      totalCents: 0,
      itemsToWholesale: 6,
    });
  });

  it('acepta reglas personalizadas', () => {
    const totals = calculateTotals([line(3, 1000)], { minQty: 3, rate: 0.1 });
    expect(totals.discountCents).toBe(300);
  });
});

describe('describeQuantity', () => {
  it('muestra artículos y, si difieren, las piezas al mayor', () => {
    expect(describeQuantity({ itemCount: 1, wholesalePieces: 1 })).toBe('1 artículo');
    expect(describeQuantity({ itemCount: 4, wholesalePieces: 4 })).toBe('4 artículos');
    expect(describeQuantity({ itemCount: 3, wholesalePieces: 6 })).toBe('3 artículos · 6 piezas');
  });
});
