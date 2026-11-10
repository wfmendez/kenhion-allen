// @vitest-environment node
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { resolveCartLines } from '@/features/cart/pricing';
import { createOrder } from '@/features/checkout/create-order';
import { customerSchema } from '@/lib/schemas/customer';
import { prepareInvoice } from './generate-invoice';

const customer = customerSchema.parse({
  name: 'Ana Pérez',
  idNumber: 'V-20111222',
  phone: '04141234567',
  state: 'Aragua',
  city: 'Maracay',
  address: 'Calle 1, casa 2',
  shippingAgency: 'Delivery en Maracay',
  paymentMethod: 'Pago Móvil',
  email: '',
  notes: '',
});

const order = (random: number) =>
  createOrder({
    lines: resolveCartLines([{ productId: 12, color: 'negro', size: 'M', qty: 1 }], products),
    collections,
    customer,
    now: new Date('2026-11-09T15:00:00Z'),
    random: () => random,
  });

describe('prepareInvoice', () => {
  it('genera el PDF una sola vez por pedido', async () => {
    const first = order(0.1);
    const pending = prepareInvoice(first);
    expect(prepareInvoice(first)).toBe(pending);

    const blob = await pending;
    expect(blob.type).toBe('application/pdf');
    expect(
      Buffer.from(await blob.arrayBuffer())
        .subarray(0, 5)
        .toString(),
    ).toBe('%PDF-');
  });

  it('cada pedido tiene su propio PDF', () => {
    expect(prepareInvoice(order(0.2))).not.toBe(prepareInvoice(order(0.3)));
  });
});
