// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { resolveCartLines } from '@/features/cart/pricing';
import { createOrder } from '@/features/checkout/create-order';
import { customerSchema } from '@/lib/schemas/customer';
import { invoiceFileName } from './generate-invoice';
import { formatOrderDate, InvoiceDocument } from './invoice-document';

const customer = customerSchema.parse({
  name: 'María José Núñez',
  idNumber: 'V-15123456',
  phone: '04241234567',
  email: 'mj@example.com',
  state: 'Mérida',
  city: 'Mérida',
  address: 'Av. Las Américas, residencias Añil, apto 4-B',
  shippingAgency: 'Tealca',
  paymentMethod: 'Transferencia en Bolívares',
  notes: 'Empaque para regalo, por favor.',
});

function orderWith(lines: Parameters<typeof resolveCartLines>[0]) {
  return createOrder({
    lines: resolveCartLines(lines, products),
    collections,
    customer,
    now: new Date('2026-09-25T18:30:00Z'),
    random: () => 0.1,
  });
}

describe('InvoiceDocument', () => {
  it('genera un PDF válido con descuento, notas y acentos', async () => {
    const order = orderWith([
      { productId: 13, color: 'verde', size: 'L', qty: 4 },
      { productId: 11, color: 'blanco', size: 'S', qty: 2 },
    ]);
    const buffer = await renderToBuffer(<InvoiceDocument order={order} />);
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-');
    expect(buffer.length).toBeGreaterThan(3000);
  });

  it('pagina pedidos largos sin romperse', async () => {
    const many = products.flatMap((p) =>
      p.colors.flatMap((c) =>
        p.sizes.map((size) => ({ productId: p.id, color: c.slug, size, qty: 1 })),
      ),
    );
    const buffer = await renderToBuffer(<InvoiceDocument order={orderWith(many)} />);
    // 24 líneas (3 productos × colores × tallas) no caben en una página A4: debe haber más de un objeto /Page.
    const pages = buffer.toString('latin1').match(/\/Type \/Page\b/g) ?? [];
    expect(pages.length).toBeGreaterThan(1);
  });

  it('nombra el archivo con el número de orden', () => {
    expect(
      invoiceFileName(orderWith([{ productId: 11, color: 'negro', size: 'M', qty: 1 }])),
    ).toMatch(/^Comprobante-KA-\d{8}-[2-9A-Z]{4}\.pdf$/);
  });

  it('formatea la fecha en hora de Venezuela', () => {
    // 18:30 UTC = 2:30 p. m. en Caracas (UTC-4)
    expect(formatOrderDate('2026-09-25T18:30:00Z')).toMatch(/25 de septiembre de 2026.*2:30/);
  });
});
