import { orderSchema, type Order } from '@/lib/schemas/order';

/**
 * Último pedido confirmado, para mostrarlo en /checkout/confirmacion (y que sobreviva a una recarga).
 * Se usa sessionStorage a propósito: contiene datos personales, así que vive solo en esa pestaña
 * y el navegador lo borra al cerrarla. Nunca va a localStorage ni sale del navegador.
 *
 * Además se guarda una copia en memoria del módulo: si el navegador bloquea el almacenamiento
 * (cookies bloqueadas, algunos webviews), la confirmación sigue mostrando el pedido tras la
 * navegación del lado del cliente. Esa copia tampoco sale de la pestaña (ADR 0004).
 */
const KEY = 'ka_last_order';

let memoryOrder: Order | null = null;

export function saveLastOrder(order: Order): void {
  memoryOrder = order;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Sin almacenamiento (bloqueado o cuota llena): queda la copia en memoria, pero la
    // confirmación no sobrevivirá a una recarga. Se borra un pedido anterior que pudiera
    // quedar guardado, para que nunca se muestre en lugar del recién confirmado.
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      // ignorado
    }
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
 * Primero la copia en memoria (el pedido recién confirmado en esta pestaña); sessionStorage
 * solo se lee cuando no la hay, es decir, tras una recarga.
 */
let cachedRaw: string | null = null;
let cachedOrder: Order | null = null;

export function getLastOrderSnapshot(): Order | null {
  if (memoryOrder) return memoryOrder;
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
  memoryOrder = null;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignorado
  }
}
