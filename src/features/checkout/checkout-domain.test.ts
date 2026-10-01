import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { resolveCartLines } from '@/features/cart/pricing';
import {
  customerSchema,
  normalizeIdNumber,
  normalizePhone,
  type CustomerInput,
} from '@/lib/schemas/customer';
import { orderSchema } from '@/lib/schemas/order';
import { createOrder } from './create-order';
import { clearLastOrder, loadLastOrder, saveLastOrder } from './order-storage';

const valid: CustomerInput = {
  name: 'Luis Rodríguez',
  idNumber: 'V-20.123.456',
  phone: '+58 414-555.1234',
  email: 'luis@example.com',
  state: 'Aragua',
  city: 'Maracay',
  address: 'Urb. El Limón, calle 5, casa 12',
  shippingAgency: 'Entrega personal en Maracay',
  paymentMethod: 'Pago Móvil',
  notes: 'Llamar antes de llegar',
};

describe('normalizadores', () => {
  it.each([
    ['v12345678', 'V-12345678'],
    ['E-8.123.456', 'E-8123456'],
    ['j 123456789', 'J-123456789'],
    ['12345678', '12345678'],
  ])('cédula/RIF %s → %s', (raw, expected) => {
    expect(normalizeIdNumber(raw)).toBe(expected);
  });

  it.each([
    ['04125305464', '0412-5305464'],
    ['+58 412 530 5464', '0412-5305464'],
    ['4125305464', '0412-5305464'],
    ['0241-2345678', '0241-2345678'],
    ['123', '123'],
  ])('teléfono %s → %s', (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });
});

describe('customerSchema', () => {
  it('acepta datos válidos y los normaliza', () => {
    const c = customerSchema.parse(valid);
    expect(c.idNumber).toBe('V-20123456');
    expect(c.phone).toBe('0414-5551234');
  });

  it('el correo y las notas son opcionales', () => {
    expect(customerSchema.safeParse({ ...valid, email: '', notes: '' }).success).toBe(true);
  });

  it('explica cada error en español', () => {
    const result = customerSchema.safeParse({
      ...valid,
      name: 'A',
      idNumber: 'X-1',
      phone: '123',
      email: 'no-es-correo',
      state: '',
      address: 'corta',
      paymentMethod: 'Bitcoin',
    });
    expect(result.success).toBe(false);
    const messages = Object.fromEntries(
      result.error!.issues.map((i) => [String(i.path[0]), i.message]),
    );
    expect(messages).toMatchObject({
      name: 'Escribe tu nombre y apellido',
      idNumber: 'Formato válido: V-12345678 o J-123456789',
      phone: 'Formato válido: 0412-1234567',
      email: 'Correo no válido',
      state: 'Selecciona un estado',
      address: 'Incluye calle, sector o punto de referencia',
      paymentMethod: 'Selecciona un método de pago',
    });
  });
});

describe('createOrder', () => {
  const customer = customerSchema.parse(valid);
  const lines = resolveCartLines(
    [
      { productId: 13, color: 'verde', size: 'L', qty: 3 },
      { productId: 12, color: 'negro', size: 'M', qty: 3 },
    ],
    products,
  );

  it('crea un pedido válido con copia de precios y descuento', () => {
    const order = createOrder({
      lines,
      collections,
      customer,
      now: new Date('2026-09-25T15:00:00Z'),
      random: () => 0.5,
    });
    expect(orderSchema.safeParse(order).success).toBe(true);
    expect(order.number).toMatch(/^KA-\d{8}-[2-9A-Z]{4}$/);
    expect(order.items[0]).toMatchObject({
      name: 'Conjunto biker + top',
      colorName: 'Verde',
      collectionName: 'KA ELITE',
      unitPriceCents: 4467,
      lineTotalCents: 13401,
    });
    expect(order.totals).toEqual({
      itemCount: 6,
      // 3 conjuntos (2 piezas c/u) + 3 franelas
      wholesalePieces: 9,
      subtotalCents: 23337,
      discountCents: 3501,
      totalCents: 19836,
      isWholesale: true,
      discountRate: 0.15,
    });
  });

  it('rechaza la cesta vacía', () => {
    expect(() => createOrder({ lines: [], collections, customer })).toThrow(/cesta vacía/);
  });
});

describe('order-storage', () => {
  beforeEach(() => sessionStorage.clear());

  it('guarda en sessionStorage (no en localStorage) y valida al leer', () => {
    const oneLine = resolveCartLines(
      [{ productId: 11, color: 'blanco', size: 'M', qty: 1 }],
      products,
    );
    const order = createOrder({
      lines: oneLine,
      collections,
      customer: customerSchema.parse(valid),
    });
    saveLastOrder(order);
    expect(localStorage.length).toBe(0);
    expect(loadLastOrder()).toEqual(order);
    clearLastOrder();
    expect(loadLastOrder()).toBeNull();
  });

  it('descarta datos corruptos', () => {
    sessionStorage.setItem('ka_last_order', '{"number":"x"}');
    expect(loadLastOrder()).toBeNull();
  });
});
