import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';
import type { CartTotals, ResolvedCartLine } from '@/features/cart/pricing';
import { formatUSD } from '@/lib/money';
import type { Order } from '@/lib/schemas/order';
import type { Collection } from '@/lib/schemas/product';

interface MessageItem {
  name: string;
  collectionName: string;
  colorName: string;
  size: string;
  qty: number;
  lineTotalCents: number;
}

interface MessageTotals {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  isWholesale: boolean;
  discountRate: number;
}

const SEPARATOR = '-----------------------------------';

function formatItemsAndTotals(items: MessageItem[], totals: MessageTotals): string[] {
  const out: string[] = [];
  items.forEach((item, i) => {
    out.push(`*${i + 1}. ${item.name}*`);
    out.push(`   • Colección: ${item.collectionName}`);
    out.push(`   • Color: ${item.colorName}`);
    out.push(`   • Talla: ${item.size}`);
    out.push(`   • Cantidad: ${item.qty} unidad(es)`);
    out.push(`   • Precio: ${formatUSD(item.lineTotalCents)}`);
    out.push('');
  });
  out.push(SEPARATOR);
  out.push(`Subtotal: ${formatUSD(totals.subtotalCents)} USD`);
  if (totals.isWholesale) {
    const pct = Math.round(totals.discountRate * 100);
    out.push(`*Descuento al mayor (${pct}%): -${formatUSD(totals.discountCents)} USD*`);
  }
  out.push(`*TOTAL A PAGAR: ${formatUSD(totals.totalCents)} USD*`);
  out.push(SEPARATOR);
  return out;
}

/** Pedido rápido desde la cesta, sin datos del cliente. */
export function buildWhatsAppMessage({
  lines,
  totals,
  collections,
}: {
  lines: ResolvedCartLine[];
  totals: CartTotals;
  collections: Collection[];
}): string {
  const collectionName = new Map(collections.map((c) => [c.slug, c.name]));
  const items = lines.map((line) => ({
    name: line.product.name,
    collectionName: collectionName.get(line.product.collection) ?? line.product.collection,
    colorName: line.colorOption.name,
    size: line.size,
    qty: line.qty,
    lineTotalCents: line.lineTotalCents,
  }));
  return [
    `*NUEVO PEDIDO — ${siteConfig.name.toUpperCase()}*`,
    '',
    'Hola, quisiera procesar la compra de los siguientes productos:',
    '',
    ...formatItemsAndTotals(items, {
      ...totals,
      discountRate: totals.isWholesale ? WHOLESALE.rate : 0,
    }),
    '',
    'Quedo atento para coordinar los datos de envío. ¡Muchas gracias!',
  ].join('\n');
}

/** Pedido confirmado en el checkout: incluye número de orden y datos de envío. */
export function buildOrderWhatsAppMessage(order: Order): string {
  const c = order.customer;
  const lines = [
    `*NUEVO PEDIDO — ${siteConfig.name.toUpperCase()}*`,
    `*Orden:* ${order.number}`,
    '',
    ...formatItemsAndTotals(order.items, order.totals),
    '',
    '*Datos del cliente*',
    `Nombre: ${c.name}`,
    `Cédula/RIF: ${c.idNumber}`,
    `Teléfono: ${c.phone}`,
  ];
  if (c.email) lines.push(`Correo: ${c.email}`);
  lines.push(
    `Dirección: ${c.address}, ${c.city}, ${c.state}`,
    `Envío: ${c.shippingAgency}`,
    `Pago: ${c.paymentMethod}`,
  );
  if (c.notes) lines.push(`Notas: ${c.notes}`);
  lines.push('', 'Adjunto el comprobante de pedido en PDF.');
  return lines.join('\n');
}

export { buildWhatsAppUrl } from '@/lib/whatsapp';
