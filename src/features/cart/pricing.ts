import { WHOLESALE } from '@/config/business';
import { percentOf, type Cents } from '@/lib/money';
import type { CartLine } from '@/lib/schemas/cart';
import type { Product } from '@/lib/schemas/product';
import { getLineId } from './cart-reducer';

export interface ResolvedCartLine extends CartLine {
  lineId: string;
  product: Product;
  lineTotalCents: Cents;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: Cents;
  discountCents: Cents;
  totalCents: Cents;
  isWholesale: boolean;
  /** Prendas que faltan para llegar al descuento al mayor (0 si ya aplica). */
  itemsToWholesale: number;
}

/**
 * Cruza las líneas del carrito con el catálogo. El precio SIEMPRE sale del catálogo,
 * nunca de lo guardado en el navegador. Descarta productos que ya no existen.
 */
export function resolveCartLines(lines: CartLine[], products: Product[]): ResolvedCartLine[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return lines.flatMap((line) => {
    const product = byId.get(line.productId);
    if (!product) return [];
    return [
      { ...line, lineId: getLineId(line), product, lineTotalCents: product.priceCents * line.qty },
    ];
  });
}

export function calculateTotals(
  lines: Pick<ResolvedCartLine, 'qty' | 'lineTotalCents'>[],
  rules: { minQty: number; rate: number } = WHOLESALE,
): CartTotals {
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const isWholesale = itemCount >= rules.minQty;
  const discountCents = isWholesale ? percentOf(subtotalCents, rules.rate) : 0;
  return {
    itemCount,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    isWholesale,
    itemsToWholesale: Math.max(0, rules.minQty - itemCount),
  };
}
