import { z } from 'zod';
import { SIZES } from '@/config/business';

export const collectionSlugSchema = z.enum(['ka-elite', 'resiliencia', 'pod']);
export type CollectionSlug = z.infer<typeof collectionSlugSchema>;

export const genderSchema = z.enum(['Mujer', 'Hombre', 'Unisex']);
export type Gender = z.infer<typeof genderSchema>;

export const sizeSchema = z.enum(SIZES);

export const collectionSchema = z.object({
  slug: collectionSlugSchema,
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
});
export type Collection = z.infer<typeof collectionSchema>;

export const productSchema = z
  .object({
    id: z.number().int().positive(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug en kebab-case'),
    name: z.string().min(1),
    collection: collectionSlugSchema,
    gender: genderSchema,
    /** Precio en centavos de USD para evitar errores de punto flotante. */
    priceCents: z.number().int().positive(),
    compareAtPriceCents: z.number().int().positive().nullable(),
    badge: z.string().min(1),
    image: z.url(),
    fallbackImage: z.url(),
    description: z.string().min(1),
    sizes: z.array(sizeSchema).min(1),
  })
  .refine((p) => p.compareAtPriceCents === null || p.compareAtPriceCents > p.priceCents, {
    message: 'compareAtPriceCents debe ser mayor que priceCents',
    path: ['compareAtPriceCents'],
  });
export type Product = z.infer<typeof productSchema>;
