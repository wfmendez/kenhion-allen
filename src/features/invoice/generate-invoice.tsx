import type { Order } from '@/lib/schemas/order';

export function invoiceFileName(order: Order): string {
  return `Comprobante-${order.number}.pdf`;
}

/**
 * Genera el PDF en el navegador. @react-pdf/renderer pesa bastante, así que se importa
 * solo cuando el cliente pide el comprobante y no afecta la carga del resto del sitio.
 */
export async function generateInvoicePdf(order: Order): Promise<Blob> {
  const [{ pdf }, { InvoiceDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./invoice-document'),
  ]);
  return pdf(<InvoiceDocument order={order} />).toBlob();
}

const prepared = new Map<string, Promise<Blob>>();

/**
 * Genera el PDF una sola vez por pedido. La confirmación lo pide en segundo plano al
 * abrirse, así el botón de descarga responde al instante.
 */
export function prepareInvoice(order: Order): Promise<Blob> {
  let blob = prepared.get(order.number);
  if (!blob) {
    blob = generateInvoicePdf(order);
    prepared.set(order.number, blob);
    // Si falla, se olvida para que el siguiente intento lo vuelva a generar.
    blob.catch(() => prepared.delete(order.number));
  }
  return blob;
}

export async function downloadInvoice(order: Order): Promise<void> {
  const blob = await prepareInvoice(order);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = invoiceFileName(order);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Se libera después para no cortar la descarga en navegadores lentos.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
