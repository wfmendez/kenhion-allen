import { WHOLESALE } from '@/config/business';
import { calculateTotals, type ResolvedCartLine } from '@/features/cart/pricing';
import { generateOrderNumber } from '@/lib/order-number';
import type { Customer } from '@/lib/schemas/customer';
import type { Order } from '@/lib/schemas/order';
import type { Collection } from '@/lib/schemas/product';

/** Arma el pedido a partir del carrito y del cliente validado. Función pura (fecha y azar inyectables). */
export function createOrder({
  lines,
  collections,
  customer,
  now = new Date(),
  random = Math.random,
}: {
  lines: ResolvedCartLine[];
  collections: Collection[];
  customer: Customer;
  now?: Date;
  random?: () => number;
}): Order {
  if (lines.length === 0) throw new Error('No se puede crear un pedido con la cesta vacía');

  const collectionName = new Map(collections.map((c) => [c.slug, c.name]));
  const totals = calculateTotals(lines);

  return {
    number: generateOrderNumber(now, random),
    createdAt: now.toISOString(),
    customer,
    items: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      collectionName: collectionName.get(line.product.collection) ?? line.product.collection,
      size: line.size,
      qty: line.qty,
      unitPriceCents: line.product.priceCents,
      lineTotalCents: line.lineTotalCents,
    })),
    totals: {
      itemCount: totals.itemCount,
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      totalCents: totals.totalCents,
      isWholesale: totals.isWholesale,
      discountRate: totals.isWholesale ? WHOLESALE.rate : 0,
    },
  };
}
