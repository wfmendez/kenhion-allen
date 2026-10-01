import { WHOLESALE } from '@/config/business';
import { percentOf, type Cents } from '@/lib/money';
import type { CartLine } from '@/lib/schemas/cart';
import type { Product, ProductColor, ProductImage } from '@/lib/schemas/product';
import { getLineId } from './cart-reducer';

export interface ResolvedCartLine extends CartLine {
  lineId: string;
  product: Product;
  /** Color elegido, con su nombre y fotos. */
  colorOption: ProductColor;
  image: ProductImage;
  lineTotalCents: Cents;
  /** Piezas que suma esta línea para el descuento al mayor. */
  wholesalePieces: number;
}

export interface CartTotals {
  /** Artículos en la cesta (lo que ve el cliente). */
  itemCount: number;
  /** Piezas que cuentan para el mayoreo (un conjunto puede sumar más de una). */
  wholesalePieces: number;
  subtotalCents: Cents;
  discountCents: Cents;
  totalCents: Cents;
  isWholesale: boolean;
  /** Piezas que faltan para llegar al descuento al mayor (0 si ya aplica). */
  itemsToWholesale: number;
}

/**
 * Cruza las líneas del carrito con el catálogo. El precio SIEMPRE sale del catálogo,
 * nunca de lo guardado en el navegador. Descarta líneas cuyo producto, color o talla ya no existan.
 */
export function resolveCartLines(lines: CartLine[], products: Product[]): ResolvedCartLine[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return lines.flatMap((line) => {
    const product = byId.get(line.productId);
    const colorOption = product?.colors.find((c) => c.slug === line.color);
    if (!product || !colorOption || !product.sizes.includes(line.size)) return [];
    return [
      {
        ...line,
        lineId: getLineId(line),
        product,
        colorOption,
        image: colorOption.images[0]!,
        lineTotalCents: product.priceCents * line.qty,
        wholesalePieces: product.wholesaleUnits * line.qty,
      },
    ];
  });
}

export function calculateTotals(
  lines: Pick<ResolvedCartLine, 'qty' | 'lineTotalCents' | 'wholesalePieces'>[],
  rules: { minQty: number; rate: number } = WHOLESALE,
): CartTotals {
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const wholesalePieces = lines.reduce((sum, l) => sum + l.wholesalePieces, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const isWholesale = wholesalePieces >= rules.minQty;
  const discountCents = isWholesale ? percentOf(subtotalCents, rules.rate) : 0;
  return {
    itemCount,
    wholesalePieces,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
    isWholesale,
    itemsToWholesale: Math.max(0, rules.minQty - wholesalePieces),
  };
}
