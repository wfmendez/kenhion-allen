import { z } from 'zod';
import { sizeSchema } from './product';

/** Máximo de unidades por línea (producto + color + talla). El reducer nunca lo supera. */
export const MAX_LINE_QTY = 999;

export const cartLineSchema = z.object({
  productId: z.number().int().positive(),
  /** Slug del color elegido (ver `colors` en el producto). */
  color: z.string().min(1).max(40),
  size: sizeSchema,
  qty: z.number().int().positive().max(MAX_LINE_QTY),
});
export type CartLine = z.infer<typeof cartLineSchema>;

/** v3: las líneas incluyen color y el catálogo pasó a ser solo KA ELITE. */
export const CART_STORAGE_VERSION = 3;

/**
 * Formato guardado en localStorage. Valida la versión pero no las líneas: loadCart revisa
 * cada una con `cartLineSchema` y descarta solo las inválidas, sin vaciar el resto.
 */
export const storedCartSchema = z.object({
  version: z.literal(CART_STORAGE_VERSION),
  lines: z.array(z.unknown()),
});
