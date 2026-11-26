import { siteConfig } from '@/config/site';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // sin 0/O ni 1/I/L para evitar confusiones al dictarlo

/** Fecha en la zona horaria de la tienda, la misma que muestra el comprobante. */
const storeDateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: siteConfig.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Número de orden legible: KA-AAAAMMDD-XXXX.
 * No es correlativo (no hay backend todavía). Cuando exista una base de datos,
 * este generador se reemplaza por una secuencia del servidor.
 * La fecha es la de Caracas aunque el dispositivo esté en otra zona horaria.
 */
export function generateOrderNumber(date: Date = new Date(), random: () => number = Math.random) {
  const parts = Object.fromEntries(
    storeDateFormat.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const ymd = `${parts.year}${parts.month}${parts.day}`;
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return `KA-${ymd}-${suffix}`;
}
