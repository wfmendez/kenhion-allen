import { products } from '@/data/products';
import { countByCollection, filterProducts, normalizeText } from './filter-products';

const names = (list: { name: string }[]) => list.map((p) => p.name);

describe('filterProducts', () => {
  it('sin filtros devuelve todo en el orden original', () => {
    expect(filterProducts(products, {})).toEqual(products);
  });

  it('filtra por colección', () => {
    const result = filterProducts(products, { collection: 'pod' });
    expect(names(result)).toEqual(['Basic T Shirt Oversize']);
  });

  it('al filtrar por Mujer incluye prendas Unisex', () => {
    const result = filterProducts(products, { gender: 'Mujer' });
    expect(result.every((p) => p.gender === 'Mujer' || p.gender === 'Unisex')).toBe(true);
    expect(result.some((p) => p.gender === 'Unisex')).toBe(true);
  });

  it('busca sin distinguir mayúsculas ni acentos', () => {
    expect(names(filterProducts(products, { query: 'COMPRESION' }))).toEqual(
      expect.arrayContaining(['Crop Top de Compresión', 'Franela de Compresión']),
    );
    expect(filterProducts(products, { query: '  ' })).toHaveLength(products.length);
  });

  it('ordena por precio y nombre sin mutar el catálogo', () => {
    const original = [...products];
    const asc = filterProducts(products, { sort: 'price-asc' });
    const desc = filterProducts(products, { sort: 'price-desc' });
    expect(asc[0]?.priceCents).toBe(1500);
    expect(desc[0]?.priceCents).toBe(3500);
    const byName = names(filterProducts(products, { sort: 'name' }));
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b, 'es')));
    expect(products).toEqual(original);
  });
});

describe('countByCollection', () => {
  it('cuenta productos por colección', () => {
    expect(countByCollection(products)).toEqual({ all: 10, 'ka-elite': 5, resiliencia: 4, pod: 1 });
  });
});

describe('normalizeText', () => {
  it('quita acentos y espacios', () => {
    expect(normalizeText('  Algodón ')).toBe('algodon');
  });
});
