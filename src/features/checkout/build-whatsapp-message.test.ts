import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { calculateTotals, resolveCartLines } from '@/features/cart/pricing';
import { customerSchema } from '@/lib/schemas/customer';
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from './build-whatsapp-message';
import { createOrder } from './create-order';

function cartFor(lines: Parameters<typeof resolveCartLines>[0]) {
  const resolved = resolveCartLines(lines, products);
  return { lines: resolved, totals: calculateTotals(resolved), collections };
}

const customer = customerSchema.parse({
  name: 'Ana Pérez',
  idNumber: 'v12345678',
  phone: '0412 1234567',
  email: '',
  state: 'Carabobo',
  city: 'Valencia',
  address: 'Av. Bolívar, edificio Sol, piso 3',
  shippingAgency: 'MRW',
  paymentMethod: 'Zelle',
  notes: '',
});

describe('buildWhatsAppMessage (cesta)', () => {
  it('lista productos, color, talla, cantidad y total', () => {
    const msg = buildWhatsAppMessage(
      cartFor([{ productId: 13, color: 'negro', size: 'L', qty: 2 }]),
    );
    expect(msg).toContain('*1. Conjunto biker + top*');
    expect(msg).toContain('Colección: KA ELITE');
    expect(msg).toContain('Color: Negro');
    expect(msg).toContain('Talla: L');
    expect(msg).toContain('Cantidad: 2 unidad(es)');
    expect(msg).toContain('*TOTAL A PAGAR: $89.34 USD*');
    expect(msg).not.toContain('Descuento al mayor');
    expect(msg).not.toContain('Orden:');
  });

  it('incluye el descuento al mayor desde 6 piezas', () => {
    const msg = buildWhatsAppMessage(
      cartFor([{ productId: 12, color: 'verde', size: 'M', qty: 6 }]),
    );
    expect(msg).toContain('Subtotal: $198.72 USD');
    expect(msg).toContain('*Descuento al mayor (15%): -$29.81 USD*');
    expect(msg).toContain('*TOTAL A PAGAR: $168.91 USD*');
  });
});

describe('buildOrderWhatsAppMessage (pedido confirmado)', () => {
  const order = createOrder({
    ...cartFor([{ productId: 11, color: 'blanco', size: 'S', qty: 6 }]),
    customer,
    now: new Date(2026, 8, 25),
    random: () => 0,
  });

  it('incluye orden, color, cliente normalizado, envío y pago', () => {
    const msg = buildOrderWhatsAppMessage(order);
    expect(msg).toContain('*Orden:* KA-20260925-2222');
    expect(msg).toContain('*1. Short de caballero*');
    expect(msg).toContain('Color: Blanco');
    expect(msg).toContain('Nombre: Ana Pérez');
    expect(msg).toContain('Cédula/RIF: V-12345678');
    expect(msg).toContain('Teléfono: 0412-1234567');
    expect(msg).toContain('Dirección: Av. Bolívar, edificio Sol, piso 3, Valencia, Carabobo');
    expect(msg).toContain('Envío: MRW');
    expect(msg).toContain('Pago: Zelle');
    // 6 × $24.37 = $146.22; 15% = $21.93
    expect(msg).toContain('*Descuento al mayor (15%): -$21.93 USD*');
    expect(msg).toContain('Adjunto el comprobante de pedido en PDF.');
  });

  it('omite correo y notas vacíos', () => {
    const msg = buildOrderWhatsAppMessage(order);
    expect(msg).not.toContain('Correo:');
    expect(msg).not.toContain('Notas:');
  });
});

describe('buildWhatsAppUrl', () => {
  it('codifica el mensaje para wa.me', () => {
    expect(buildWhatsAppUrl('Hola & chao', '58400')).toBe(
      'https://wa.me/58400?text=Hola%20%26%20chao',
    );
  });
});
