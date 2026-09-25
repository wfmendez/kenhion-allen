import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';
import type { CartTotals, ResolvedCartLine } from '@/features/cart/pricing';
import { formatUSD } from '@/lib/money';
import type { Collection } from '@/lib/schemas/product';

export interface OrderCustomerSummary {
  name: string;
  idNumber: string;
  phone: string;
  city: string;
  state: string;
  shippingAgency: string;
  paymentMethod: string;
}

export interface WhatsAppOrderInput {
  lines: ResolvedCartLine[];
  totals: CartTotals;
  collections: Collection[];
  orderNumber?: string;
  customer?: OrderCustomerSummary;
}

const SEPARATOR = '-----------------------------------';

export function buildWhatsAppMessage({
  lines,
  totals,
  collections,
  orderNumber,
  customer,
}: WhatsAppOrderInput): string {
  const collectionName = new Map(collections.map((c) => [c.slug, c.name]));
  const out: string[] = [];

  out.push(`*NUEVO PEDIDO — ${siteConfig.name.toUpperCase()}*`);
  if (orderNumber) out.push(`*Orden:* ${orderNumber}`);
  out.push('');
  out.push('Hola, quisiera procesar la compra de los siguientes productos:');
  out.push('');

  lines.forEach((line, i) => {
    const collection = collectionName.get(line.product.collection) ?? line.product.collection;
    out.push(`*${i + 1}. ${line.product.name}*`);
    out.push(`   • Colección: ${collection}`);
    out.push(`   • Talla: ${line.size}`);
    out.push(`   • Cantidad: ${line.qty} unidad(es)`);
    out.push(`   • Precio: ${formatUSD(line.lineTotalCents)}`);
    out.push('');
  });

  out.push(SEPARATOR);
  out.push(`Subtotal: ${formatUSD(totals.subtotalCents)} USD`);
  if (totals.isWholesale) {
    const pct = Math.round(WHOLESALE.rate * 100);
    out.push(`*Descuento al mayor (${pct}%): -${formatUSD(totals.discountCents)} USD*`);
  }
  out.push(`*TOTAL A PAGAR: ${formatUSD(totals.totalCents)} USD*`);
  out.push(SEPARATOR);
  out.push('');

  if (customer) {
    out.push('*Datos del cliente*');
    out.push(`Nombre: ${customer.name}`);
    out.push(`Cédula/RIF: ${customer.idNumber}`);
    out.push(`Teléfono: ${customer.phone}`);
    out.push(`Destino: ${customer.city}, ${customer.state}`);
    out.push(`Envío: ${customer.shippingAgency}`);
    out.push(`Pago: ${customer.paymentMethod}`);
    out.push('');
    out.push('Adjunto el comprobante de pedido en PDF.');
  } else {
    out.push('Quedo atento para coordinar los datos de envío. ¡Muchas gracias!');
  }

  return out.join('\n');
}

export { buildWhatsAppUrl } from '@/lib/whatsapp';
