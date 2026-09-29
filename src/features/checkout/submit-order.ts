import type { Order } from '@/lib/schemas/order';
import { saveLastOrder } from './order-storage';

/**
 * Punto único de "envío" del pedido. Hoy no hay backend: solo lo deja listo para la
 * página de confirmación. Cuando exista una base de datos, aquí se hará el POST
 * (y el número de orden correlativo vendrá del servidor) sin tocar la interfaz.
 */
export async function submitOrder(order: Order): Promise<Order> {
  saveLastOrder(order);
  return order;
}
