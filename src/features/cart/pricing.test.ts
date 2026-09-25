import { products } from '@/data/products';
import { calculateTotals, resolveCartLines } from './pricing';

describe('resolveCartLines', () => {
  it('toma el precio del catálogo y descarta productos inexistentes', () => {
    const lines = resolveCartLines(
      [
        { productId: 1, size: 'M', qty: 2 },
        { productId: 999, size: 'M', qty: 1 },
      ],
      products,
    );
    expect(lines).toHaveLength(1);
    expect(lines[0]?.lineTotalCents).toBe(3000);
    expect(lines[0]?.lineId).toBe('1-M');
  });
});

describe('calculateTotals', () => {
  it('no aplica descuento por debajo de 12 unidades', () => {
    const totals = calculateTotals([{ qty: 11, lineTotalCents: 11 * 2500 }]);
    expect(totals).toMatchObject({
      itemCount: 11,
      subtotalCents: 27500,
      discountCents: 0,
      totalCents: 27500,
      isWholesale: false,
      itemsToWholesale: 1,
    });
  });

  it('aplica 15% exacto al llegar a 12 unidades combinadas', () => {
    const totals = calculateTotals([
      { qty: 6, lineTotalCents: 6 * 1500 },
      { qty: 6, lineTotalCents: 6 * 3500 },
    ]);
    expect(totals.isWholesale).toBe(true);
    expect(totals.subtotalCents).toBe(30000);
    expect(totals.discountCents).toBe(4500);
    expect(totals.totalCents).toBe(25500);
    expect(totals.itemsToWholesale).toBe(0);
  });

  it('redondea el descuento al centavo', () => {
    const totals = calculateTotals([{ qty: 12, lineTotalCents: 12 * 2599 }]);
    // 31188 * 0.15 = 4678.2 → 4678
    expect(totals.discountCents).toBe(4678);
    expect(totals.totalCents).toBe(31188 - 4678);
  });

  it('devuelve ceros con el carrito vacío', () => {
    expect(calculateTotals([])).toMatchObject({
      itemCount: 0,
      totalCents: 0,
      itemsToWholesale: 12,
    });
  });

  it('acepta reglas personalizadas', () => {
    const totals = calculateTotals([{ qty: 3, lineTotalCents: 1000 }], { minQty: 3, rate: 0.1 });
    expect(totals.discountCents).toBe(100);
  });
});
