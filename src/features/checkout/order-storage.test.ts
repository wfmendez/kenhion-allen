import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { resolveCartLines } from '@/features/cart/pricing';
import { customerSchema } from '@/lib/schemas/customer';
import type { Order } from '@/lib/schemas/order';
import { createOrder } from './create-order';

const order: Order = createOrder({
  lines: resolveCartLines([{ productId: 11, color: 'blanco', size: 'M', qty: 1 }], products),
  collections,
  customer: customerSchema.parse({
    name: 'Luis Rodríguez',
    idNumber: 'V-20123456',
    phone: '0414-5551234',
    email: '',
    state: 'Aragua',
    city: 'Maracay',
    address: 'Urb. El Limón, calle 5, casa 12',
    shippingAgency: 'Entrega personal en Maracay',
    paymentMethod: 'Pago Móvil',
    notes: '',
  }),
  now: new Date('2026-11-11T15:00:00Z'),
  random: () => 0,
});

/** Cada test carga el módulo de nuevo: la caché y la copia en memoria son estado del módulo. */
async function freshStorage() {
  vi.resetModules();
  return import('./order-storage');
}

/** Simula un navegador con el almacenamiento del sitio bloqueado (SecurityError). */
function blockSessionStorage() {
  vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
    throw new DOMException('Bloqueado', 'SecurityError');
  });
}

describe('order-storage', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('getLastOrderSnapshot devuelve la misma referencia mientras el dato no cambie', async () => {
    const { getLastOrderSnapshot, saveLastOrder } = await freshStorage();
    expect(getLastOrderSnapshot()).toBeNull();

    saveLastOrder(order);
    const first = getLastOrderSnapshot();
    expect(first).toEqual(order);
    // useSyncExternalStore exige la misma referencia o entra en un ciclo de renders.
    expect(getLastOrderSnapshot()).toBe(first);

    saveLastOrder({ ...order, number: 'KA-20261111-ZZZZ' });
    const second = getLastOrderSnapshot();
    expect(second).not.toBe(first);
    expect(second?.number).toBe('KA-20261111-ZZZZ');
  });

  it('tras una recarga lee sessionStorage y mantiene la referencia', async () => {
    sessionStorage.setItem('ka_last_order', JSON.stringify(order));
    const { getLastOrderSnapshot } = await freshStorage();

    const first = getLastOrderSnapshot();
    expect(first).toEqual(order);
    expect(getLastOrderSnapshot()).toBe(first);
  });

  it('conserva el pedido en memoria si sessionStorage está bloqueado', async () => {
    blockSessionStorage();
    const { clearLastOrder, getLastOrderSnapshot, saveLastOrder } = await freshStorage();

    expect(() => saveLastOrder(order)).not.toThrow();
    const snapshot = getLastOrderSnapshot();
    expect(snapshot).toEqual(order);
    expect(getLastOrderSnapshot()).toBe(snapshot);

    clearLastOrder();
    expect(getLastOrderSnapshot()).toBeNull();
  });

  it('conserva el pedido en memoria si sessionStorage no pudo guardarlo (cuota llena)', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Lleno', 'QuotaExceededError');
    });
    const { getLastOrderSnapshot, saveLastOrder } = await freshStorage();

    saveLastOrder(order);
    expect(sessionStorage.length).toBe(0);
    expect(getLastOrderSnapshot()).toEqual(order);
  });

  it('si no puede guardar el pedido nuevo, nunca muestra el anterior', async () => {
    const previous = { ...order, number: 'KA-20261110-AAAA' };
    sessionStorage.setItem('ka_last_order', JSON.stringify(previous));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Lleno', 'QuotaExceededError');
    });
    const { getLastOrderSnapshot, saveLastOrder } = await freshStorage();

    saveLastOrder(order);
    expect(getLastOrderSnapshot()?.number).toBe(order.number);
    // Tras una recarga (módulo nuevo, sin copia en memoria) tampoco aparece el anterior.
    const reloaded = await freshStorage();
    expect(reloaded.getLastOrderSnapshot()).toBeNull();
  });
});
