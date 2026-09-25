const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // sin 0/O ni 1/I/L para evitar confusiones al dictarlo

/**
 * Número de orden legible: KA-AAAAMMDD-XXXX.
 * No es correlativo (no hay backend todavía). Cuando exista una base de datos,
 * este generador se reemplaza por una secuencia del servidor.
 */
export function generateOrderNumber(date: Date = new Date(), random: () => number = Math.random) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return `KA-${y}${m}${d}-${suffix}`;
}
