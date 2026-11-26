import { siteConfig } from '@/config/site';
import { faq } from '@/data/faq';
import { products } from '@/data/products';
import { breadcrumbJsonLd, faqJsonLd, homeJsonLd, productJsonLd } from './structured-data';

const bySlug = (slug: string) => products.find((p) => p.slug === slug)!;
type Node = Record<string, unknown> & { '@type': string; '@id': string };

describe('homeJsonLd', () => {
  const graph = homeJsonLd()['@graph'] as Node[];
  const website = graph.find((n) => n['@type'] === 'WebSite')!;
  const store = graph.find((n) => n['@type'] === 'OnlineStore')!;

  it('trae WebSite y OnlineStore enlazados por @id', () => {
    expect(graph.map((n) => n['@type'])).toEqual(['WebSite', 'OnlineStore']);
    expect((website.publisher as { '@id': string })['@id']).toBe(store['@id']);
    expect(website.inLanguage).toBe('es-VE');
  });

  it('el logo es un PNG absoluto de 512 px', () => {
    const logo = store.logo as { url: string; width: number };
    expect(logo.url.startsWith(siteConfig.url)).toBe(true);
    expect(logo.url.endsWith('/images/marca/emblema-512.png')).toBe(true);
    expect(logo.width).toBe(512);
  });

  it('no inventa datos pendientes del cliente', () => {
    const json = JSON.stringify(homeJsonLd());
    for (const key of [
      'streetAddress',
      'openingHours',
      'sameAs',
      'SearchAction',
      'ClothingStore',
    ]) {
      expect(json).not.toContain(key);
    }
  });
});

describe('productJsonLd', () => {
  const short = productJsonLd(bySlug('short-de-caballero'));
  const biker = productJsonLd(bySlug('conjunto-biker-top'));

  it('precio en dólares con dos decimales', () => {
    expect(short.offers.price).toBe('24.37');
    expect(short.offers.priceCurrency).toBe('USD');
  });

  it('sin `color`, producto nuevo y vendido por la tienda del grafo', () => {
    expect(short).not.toHaveProperty('color');
    expect(short.offers.itemCondition).toBe('https://schema.org/NewCondition');
    expect(short.offers.seller['@id']).toBe(`${siteConfig.url}/#tienda`);
    expect(short['@id']).toBe(`${siteConfig.url}/producto/short-de-caballero#producto`);
  });

  it('público sugerido según el género (se omite si es unisex)', () => {
    expect(short.audience).toEqual({ '@type': 'PeopleAudience', suggestedGender: 'male' });
    expect(biker.audience?.suggestedGender).toBe('female');
    const unisex = productJsonLd({ ...bySlug('short-de-caballero'), gender: 'Unisex' });
    expect(unisex).not.toHaveProperty('audience');
  });

  it('todas las fotos de todos los colores, absolutas y sin duplicados', () => {
    const product = bySlug('short-de-caballero');
    const all = product.colors.flatMap((c) => c.images);
    expect(short.image).toHaveLength(new Set(all.map((i) => i.src)).size);
    expect(new Set(short.image).size).toBe(short.image.length);
    expect(short.image[0]).toBe(`${siteConfig.url}${product.colors[0]!.images[0]!.src}`);
    expect(short.image.every((u) => u.startsWith(siteConfig.url))).toBe(true);
  });
});

describe('faqJsonLd y breadcrumbJsonLd', () => {
  it('FAQPage con una pregunta por entrada', () => {
    expect(faqJsonLd(faq).mainEntity).toHaveLength(faq.length);
  });

  it('migas con posiciones y URL absolutas', () => {
    const crumbs = breadcrumbJsonLd([{ name: 'Tienda', path: '/tienda' }]);
    expect(crumbs.itemListElement[0]).toMatchObject({
      position: 1,
      item: `${siteConfig.url}/tienda`,
    });
  });
});
