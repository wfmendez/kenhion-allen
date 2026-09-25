/** Reglas de negocio configurables. Cambiarlas aquí actualiza carrito, UI, WhatsApp y comprobante. */
export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export type Size = (typeof SIZES)[number];

export const DEFAULT_SIZE: Size = 'M';

export const WHOLESALE = {
  /** Unidades totales en el carrito a partir de las cuales aplica el descuento. */
  minQty: 12,
  /** Descuento como fracción (0.15 = 15%). */
  rate: 0.15,
} as const;

export const CURRENCY = 'USD';

export const SHIPPING_AGENCIES = ['MRW', 'Zoom', 'Tealca', 'Entrega personal en Maracay'] as const;

export const PAYMENT_METHODS = [
  'Pago Móvil',
  'Transferencia en Bolívares',
  'Zelle',
  'Efectivo (USD)',
] as const;
