import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { calculateTotals, resolveCartLines } from '@/features/cart/pricing';
import { buildWhatsAppMessage, buildWhatsAppUrl } from './build-whatsapp-message';

function orderFor(lines: Parameters<typeof resolveCartLines>[0]) {
  const resolved = resolveCartLines(lines, products);
  return { lines: resolved, totals: calculateTotals(resolved), collections };
}

describe('buildWhatsAppMessage', () => {
  it('lista productos, talla, cantidad y total', () => {
    const msg = buildWhatsAppMessage(orderFor([{ productId: 10, size: 'L', qty: 2 }]));
    expect(msg).toContain('*1. Hoodie Resiliencia*');
    expect(msg).toContain('Colección: Resiliencia');
    expect(msg).toContain('Talla: L');
    expect(msg).toContain('Cantidad: 2 unidad(es)');
    expect(msg).toContain('*TOTAL A PAGAR: $70.00 USD*');
    expect(msg).not.toContain('Descuento al mayor');
  });

  it('incluye el descuento al mayor cuando aplica', () => {
    const msg = buildWhatsAppMessage(orderFor([{ productId: 3, size: 'M', qty: 12 }]));
    expect(msg).toContain('Subtotal: $300.00 USD');
    expect(msg).toContain('*Descuento al mayor (15%): -$45.00 USD*');
    expect(msg).toContain('*TOTAL A PAGAR: $255.00 USD*');
  });

  it('agrega número de orden y datos del cliente si existen', () => {
    const msg = buildWhatsAppMessage({
      ...orderFor([{ productId: 1, size: 'S', qty: 1 }]),
      orderNumber: 'KA-20260925-ABCD',
      customer: {
        name: 'Ana Pérez',
        idNumber: 'V-12345678',
        phone: '0412-0000000',
        city: 'Valencia',
        state: 'Carabobo',
        shippingAgency: 'MRW',
        paymentMethod: 'Zelle',
      },
    });
    expect(msg).toContain('*Orden:* KA-20260925-ABCD');
    expect(msg).toContain('Nombre: Ana Pérez');
    expect(msg).toContain('Destino: Valencia, Carabobo');
    expect(msg).toContain('Adjunto el comprobante de pedido en PDF.');
  });
});

describe('buildWhatsAppUrl', () => {
  it('codifica el mensaje para wa.me', () => {
    expect(buildWhatsAppUrl('Hola & chao', '58400')).toBe(
      'https://wa.me/58400?text=Hola%20%26%20chao',
    );
  });
});
