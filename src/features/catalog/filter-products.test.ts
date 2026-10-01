import { products } from '@/data/products';
import type { Product } from '@/lib/schemas/product';
import { genderOptionsFor } from './catalog-params';
import { countByCollection, filterProducts, normalizeText } from './filter-products';

const names = (list: { name: string }[]) => list.map((p) => p.name);

describe('filterProducts', () => {
  it('sin filtros devuelve todo en el orden original', () => {
    expect(filterProducts(products, {})).toEqual(products);
  });

  it('filtra por colección', () => {
    expect(filterProducts(products, { collection: 'ka-elite' })).toHaveLength(products.length);
  });

  it('filtra por género', () => {
    expect(names(filterProducts(products, { gender: 'Dama' }))).toEqual(['Conjunto biker + top']);
    expect(names(filterProducts(products, { gender: 'Caballero' }))).toEqual([
      'Short de caballero',
      'Franela de compresión de caballero',
    ]);
  });

  it('las prendas Unisex aparecen al filtrar por Caballero o Dama', () => {
    const unisex: Product = { ...products[0]!, id: 99, slug: 'unisex', gender: 'Unisex' };
    const all = [...products, unisex];
    expect(filterProducts(all, { gender: 'Dama' })).toContain(unisex);
    expect(filterProducts(all, { gender: 'Caballero' })).toContain(unisex);
  });

  it('busca sin distinguir mayúsculas ni acentos', () => {
    expect(names(filterProducts(products, { query: 'COMPRESION' }))).toEqual(
      expect.arrayContaining(['Franela de compresión de caballero', 'Conjunto biker + top']),
    );
    expect(names(filterProducts(products, { query: 'biker' }))).toEqual(['Conjunto biker + top']);
    expect(filterProducts(products, { query: '  ' })).toHaveLength(products.length);
  });

  it('ordena por precio y nombre sin mutar el catálogo', () => {
    const original = [...products];
    const asc = filterProducts(products, { sort: 'price-asc' });
    const desc = filterProducts(products, { sort: 'price-desc' });
    expect(asc[0]?.priceCents).toBe(2437);
    expect(desc[0]?.priceCents).toBe(4467);
    const byName = names(filterProducts(products, { sort: 'name' }));
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b, 'es')));
    expect(products).toEqual(original);
  });
});

describe('countByCollection', () => {
  it('cuenta productos por colección', () => {
    expect(countByCollection(products)).toEqual({ all: 3, 'ka-elite': 3 });
  });
});

describe('genderOptionsFor', () => {
  it('solo ofrece los géneros que tienen productos', () => {
    expect(genderOptionsFor(products).map((o) => o.value)).toEqual(['all', 'Caballero', 'Dama']);
  });
});

describe('normalizeText', () => {
  it('quita acentos y espacios', () => {
    expect(normalizeText('  Compresión ')).toBe('compresion');
  });
});
