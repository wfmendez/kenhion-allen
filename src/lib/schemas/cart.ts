import { z } from 'zod';
import { sizeSchema } from './product';

export const cartLineSchema = z.object({
  productId: z.number().int().positive(),
  size: sizeSchema,
  qty: z.number().int().positive().max(999),
});
export type CartLine = z.infer<typeof cartLineSchema>;

export const CART_STORAGE_VERSION = 2;

export const storedCartSchema = z.object({
  version: z.literal(CART_STORAGE_VERSION),
  lines: z.array(cartLineSchema),
});
export type StoredCart = z.infer<typeof storedCartSchema>;

/** Formato de la versión 1 (sitio de una sola página): guardaba una copia completa del producto. */
export const legacyCartSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    size: sizeSchema,
    qty: z.number().int().positive(),
  }),
);
