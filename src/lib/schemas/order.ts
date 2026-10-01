import { z } from 'zod';
import { customerSchema } from './customer';
import { sizeSchema } from './product';

/**
 * Pedido confirmado. Guarda una copia de nombre y precio de cada prenda:
 * el comprobante no debe cambiar si mañana cambia el catálogo.
 */
export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string(),
  collectionName: z.string(),
  colorName: z.string(),
  size: sizeSchema,
  qty: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  lineTotalCents: z.number().int().nonnegative(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  number: z.string().regex(/^KA-\d{8}-[2-9A-Z]{4}$/),
  createdAt: z.iso.datetime(),
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1),
  totals: z.object({
    itemCount: z.number().int().positive(),
    /** Piezas que contaron para el descuento al mayor (un conjunto suma 2). */
    wholesalePieces: z.number().int().positive(),
    subtotalCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    totalCents: z.number().int().nonnegative(),
    isWholesale: z.boolean(),
    discountRate: z.number().min(0).max(1),
  }),
});
export type Order = z.infer<typeof orderSchema>;
