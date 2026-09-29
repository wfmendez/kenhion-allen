import { orderSchema, type Order } from '@/lib/schemas/order';

/**
 * Último pedido confirmado, para mostrarlo en /checkout/confirmacion (y que sobreviva a una recarga).
 * Se usa sessionStorage a propósito: contiene datos personales, así que vive solo en esa pestaña
 * y el navegador lo borra al cerrarla. Nunca va a localStorage ni sale del navegador.
 */
const KEY = 'ka_last_order';

export function saveLastOrder(order: Order): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Sin almacenamiento: la confirmación no podrá recargarse, pero el flujo sigue.
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = orderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Snapshot para useSyncExternalStore: devuelve el mismo objeto mientras el dato guardado
 * no cambie (requisito de React para no entrar en un ciclo de renders).
 */
let cachedRaw: string | null = null;
let cachedOrder: Order | null = null;

export function getLastOrderSnapshot(): Order | null {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedOrder = loadLastOrder();
  }
  return cachedOrder;
}

export function clearLastOrder(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignorado
  }
}
