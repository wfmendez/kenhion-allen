/** Reglas de negocio configurables. Cambiarlas aquí actualiza carrito, UI, WhatsApp y comprobante. */
export const SIZES = ['S', 'M', 'L'] as const;
export type Size = (typeof SIZES)[number];

export const DEFAULT_SIZE: Size = 'M';

export const WHOLESALE = {
  /** Piezas totales en el carrito a partir de las cuales aplica el descuento. */
  minQty: 6,
  /** Descuento como fracción (0.15 = 15%). */
  rate: 0.15,
} as const;

export const CURRENCY = 'USD';

/** Agencias de encomienda para envíos nacionales. */
export const SHIPPING_CARRIERS = ['MRW', 'Zoom', 'Tealca', 'T-envíos'] as const;

/** Opciones de entrega dentro de Maracay. */
export const LOCAL_DELIVERY_OPTIONS = [
  'Delivery en Maracay',
  'Entrega personal en Maracay',
] as const;

/** Todas las formas de recibir un pedido, en el orden en que se ofrecen en el checkout. */
export const SHIPPING_AGENCIES = [...SHIPPING_CARRIERS, ...LOCAL_DELIVERY_OPTIONS] as const;

export const PAYMENT_METHODS = [
  'Pago Móvil',
  'Transferencia en Bolívares',
  'Binance',
  'Efectivo (USD)',
] as const;
