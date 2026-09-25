import { z } from 'zod';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { formatUSD, percentOf } from './money';
import { generateOrderNumber } from './order-number';
import {
  getCollectionBySlug,
  getProductBySlug,
  getProducts,
  getProductsByCollection,
} from './repositories/product-repository';
import { collectionSchema, productSchema } from './schemas/product';
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

  it('el esquema rechaza un precio anterior menor que el actual', () => {
    const bad = { ...products[0], priceCents: 2000, compareAtPriceCents: 1000 };
    expect(productSchema.safeParse(bad).success).toBe(false);
  });
});

describe('product-repository', () => {
  it('consulta productos y colecciones', async () => {
    expect(await getProducts()).toHaveLength(10);
    expect((await getProductBySlug('hoodie-resiliencia'))?.id).toBe(10);
    expect(await getProductBySlug('no-existe')).toBeUndefined();
    expect(await getProductsByCollection('ka-elite')).toHaveLength(5);
    expect((await getCollectionBySlug('pod'))?.name).toBe('P.O.D.');
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
