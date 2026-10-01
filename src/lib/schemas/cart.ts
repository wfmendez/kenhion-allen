import { z } from 'zod';
import { sizeSchema } from './product';

export const cartLineSchema = z.object({
  productId: z.number().int().positive(),
  /** Slug del color elegido (ver `colors` en el producto). */
  color: z.string().min(1).max(40),
  size: sizeSchema,
  qty: z.number().int().positive().max(999),
});
export type CartLine = z.infer<typeof cartLineSchema>;

/** v3: las líneas incluyen color y el catálogo pasó a ser solo KA ELITE. */
export const CART_STORAGE_VERSION = 3;

export const storedCartSchema = z.object({
  version: z.literal(CART_STORAGE_VERSION),
  lines: z.array(cartLineSchema),
});
export type StoredCart = z.infer<typeof storedCartSchema>;
