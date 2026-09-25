import { buildCatalogQuery, parseCatalogParams } from './catalog-params';

describe('parseCatalogParams', () => {
  it('traduce los parámetros en español', () => {
    expect(parseCatalogParams({ genero: 'Mujer', q: ' hoodie ', orden: 'precio-desc' })).toEqual({
      gender: 'Mujer',
      query: 'hoodie',
      sort: 'price-desc',
    });
  });

  it('usa valores por defecto con parámetros ausentes o inválidos', () => {
    expect(parseCatalogParams({})).toEqual({ gender: 'all', query: '', sort: 'featured' });
    expect(parseCatalogParams({ genero: 'otro', orden: '<script>' })).toEqual({
      gender: 'all',
      query: '',
      sort: 'featured',
    });
  });

  it('toma el primer valor si el parámetro se repite y limita la búsqueda', () => {
    expect(parseCatalogParams({ genero: ['hombre', 'mujer'] }).gender).toBe('Hombre');
    expect(parseCatalogParams({ q: 'x'.repeat(200) }).query).toHaveLength(80);
  });
});

describe('buildCatalogQuery', () => {
  it('omite los valores por defecto', () => {
    expect(buildCatalogQuery({ gender: 'all', query: '', sort: 'featured' })).toBe('');
  });

  it('es el inverso de parseCatalogParams', () => {
    const filters = { gender: 'Unisex', query: 'algodón', sort: 'name' } as const;
    const qs = buildCatalogQuery(filters);
    expect(qs).toBe('?genero=unisex&q=algod%C3%B3n&orden=nombre');
    const parsed = parseCatalogParams(Object.fromEntries(new URLSearchParams(qs)));
    expect(parsed).toEqual(filters);
  });
});
