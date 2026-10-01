import { z } from 'zod';
import { SIZES } from '@/config/business';

export const collectionSlugSchema = z.enum(['ka-elite']);
export type CollectionSlug = z.infer<typeof collectionSlugSchema>;

export const genderSchema = z.enum(['Caballero', 'Dama', 'Unisex']);
export type Gender = z.infer<typeof genderSchema>;

export const sizeSchema = z.enum(SIZES);

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const collectionSchema = z.object({
  slug: collectionSlugSchema,
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
});
export type Collection = z.infer<typeof collectionSchema>;

/** Imagen local servida desde /public (la ruta empieza por "/"). */
export const productImageSchema = z.object({
  src: z.string().regex(/^\/images\/[\w./-]+\.(jpg|png|webp)$/, 'ruta local bajo /images'),
  alt: z.string().min(1),
});
export type ProductImage = z.infer<typeof productImageSchema>;

export const productColorSchema = z.object({
  slug: z.string().regex(kebab, 'slug en kebab-case'),
  name: z.string().min(1),
  /** Color de la muestra en el selector. */
  hex: z.string().regex(/^#[0-9a-f]{6}$/i),
  images: z.array(productImageSchema).min(1),
});
export type ProductColor = z.infer<typeof productColorSchema>;

export const productSchema = z
  .object({
    id: z.number().int().positive(),
    slug: z.string().regex(kebab, 'slug en kebab-case'),
    name: z.string().min(1),
    collection: collectionSlugSchema,
    gender: genderSchema,
    /** Precio en centavos de USD para evitar errores de punto flotante. */
    priceCents: z.number().int().positive(),
    compareAtPriceCents: z.number().int().positive().nullable(),
    badge: z.string().min(1),
    description: z.string().min(1),
    sizes: z.array(sizeSchema).min(1),
    /** Colores disponibles; el primero es el que se muestra por defecto. */
    colors: z.array(productColorSchema).min(1),
    /** Fotos de la prenda en uso (no dependen del color elegido). */
    lifestyleImages: z.array(productImageSchema),
    /** Cuántas piezas suma cada unidad para el descuento al mayor (un conjunto podría contar 2). */
    wholesaleUnits: z.number().int().positive(),
  })
  .refine((p) => p.compareAtPriceCents === null || p.compareAtPriceCents > p.priceCents, {
    message: 'compareAtPriceCents debe ser mayor que priceCents',
    path: ['compareAtPriceCents'],
  })
  .refine((p) => new Set(p.colors.map((c) => c.slug)).size === p.colors.length, {
    message: 'los colores de un producto no pueden repetirse',
    path: ['colors'],
  });
export type Product = z.infer<typeof productSchema>;

/** Color por slug; si no existe (o no se indica), el color por defecto del producto. */
export function getProductColor(product: Product, colorSlug?: string): ProductColor {
  return product.colors.find((c) => c.slug === colorSlug) ?? product.colors[0]!;
}

/** Imagen principal del producto para un color dado. */
export function getPrimaryImage(product: Product, colorSlug?: string): ProductImage {
  return getProductColor(product, colorSlug).images[0]!;
}
