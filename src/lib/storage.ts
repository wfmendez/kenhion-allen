import type { z } from 'zod';

/**
 * Acceso seguro a localStorage: nunca lanza (modo privado, cuota llena, SSR)
 * y descarta datos que no cumplan el esquema en lugar de romper la app.
 */
export function readStorage<T>(key: string, schema: z.ZodType<T>): T | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento disponible: el carrito sigue funcionando en memoria.
  }
}

export function removeStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  } catch {
    // ignorado
  }
}
