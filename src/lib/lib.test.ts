import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { collections } from '@/data/collections';
import { gallery, heroImage } from '@/data/gallery';
import { products } from '@/data/products';
import { formatUSD, percentOf } from './money';
import { generateOrderNumber } from './order-number';
import {
  getCollectionBySlug,
  getProductBySlug,
  getProducts,
  getProductsByCollection,
} from './repositories/product-repository';
import {
  collectionSchema,
  getPrimaryImage,
  getProductColor,
  productSchema,
} from './schemas/product';
import { readStorage, writeStorage } from './storage';

describe('datos del catálogo', () => {
  it('todos los productos y colecciones cumplen el esquema', () => {
    expect(() => z.array(productSchema).parse(products)).not.toThrow();
    expect(() => z.array(collectionSchema).parse(collections)).not.toThrow();
  });

  it('ids y slugs son únicos y cada colección existe', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const slugs = new Set(collections.map((c) => c.slug));
    expect(products.every((p) => slugs.has(p.collection))).toBe(true);
  });

  it('precios, tallas y colores coinciden con lo indicado por el cliente', () => {
    const summary = products.map((p) => [p.name, p.priceCents, p.colors.map((c) => c.slug)]);
    expect(summary).toEqual([
      ['Short de caballero', 2437, ['verde', 'negro', 'blanco']],
      ['Franela de compresión de caballero', 3312, ['verde', 'negro', 'blanco']],
      ['Conjunto biker + top', 4467, ['verde', 'negro']],
    ]);
    expect(products.every((p) => p.sizes.join() === 'S,M,L')).toBe(true);
  });

  it('todas las imágenes del catálogo y la galería existen en /public', () => {
    const sources = [
      ...products.flatMap((p) => [
        ...p.colors.flatMap((c) => c.images.map((i) => i.src)),
        ...p.lifestyleImages.map((i) => i.src),
      ]),
      ...gallery.map((i) => i.src),
      heroImage.src,
    ];
    const missing = sources.filter((src) => !existsSync(join(process.cwd(), 'public', src)));
    expect(missing).toEqual([]);
    expect(sources.some((src) => /^https?:/.test(src))).toBe(false);
  });

  it('getPrimaryImage usa el color pedido o el primero', () => {
    const short = products[0]!;
    expect(getPrimaryImage(short).src).toContain('/short/verde-frente.jpg');
    expect(getPrimaryImage(short, 'blanco').src).toContain('/short/blanco-frente.jpg');
    expect(getProductColor(short, 'no-existe').slug).toBe('verde');
  });

  it('el esquema rechaza colores repetidos e imágenes remotas', () => {
    const short = products[0]!;
    const repeated = { ...short, colors: [short.colors[0], short.colors[0]] };
    expect(productSchema.safeParse(repeated).success).toBe(false);
    const remote = {
      ...short,
      lifestyleImages: [{ src: 'https://ejemplo.com/foto.jpg', alt: 'x' }],
    };
    expect(productSchema.safeParse(remote).success).toBe(false);
  });

  it('el esquema rechaza un precio anterior menor que el actual', () => {
    const bad = { ...products[0], priceCents: 2000, compareAtPriceCents: 1000 };
    expect(productSchema.safeParse(bad).success).toBe(false);
  });
});

describe('product-repository', () => {
  it('consulta productos y colecciones', async () => {
    expect(await getProducts()).toHaveLength(3);
    expect((await getProductBySlug('conjunto-biker-top'))?.id).toBe(13);
    expect(await getProductBySlug('no-existe')).toBeUndefined();
    expect(await getProductsByCollection('ka-elite')).toHaveLength(3);
    expect((await getCollectionBySlug('ka-elite'))?.name).toBe('KA ELITE');
    expect(await getCollectionBySlug('pod')).toBeUndefined();
  });
});

describe('money', () => {
  it('formatea centavos como USD', () => {
    expect(formatUSD(2550)).toBe('$25.50');
    expect(formatUSD(123456)).toBe('$1,234.56');
  });
  it('calcula porcentajes redondeando', () => {
    expect(percentOf(1001, 0.15)).toBe(150);
  });
});

describe('generateOrderNumber', () => {
  it('usa el formato KA-AAAAMMDD-XXXX', () => {
    const n = generateOrderNumber(new Date(2026, 8, 5), () => 0);
    expect(n).toBe('KA-20260905-2222');
    expect(generateOrderNumber()).toMatch(/^KA-\d{8}-[2-9A-Z]{4}$/);
  });
});

describe('storage', () => {
  beforeEach(() => localStorage.clear());
  it('devuelve null si falta o no cumple el esquema', () => {
    expect(readStorage('x', z.number())).toBeNull();
    writeStorage('x', 'texto');
    expect(readStorage('x', z.number())).toBeNull();
    writeStorage('x', 5);
    expect(readStorage('x', z.number())).toBe(5);
  });
});
