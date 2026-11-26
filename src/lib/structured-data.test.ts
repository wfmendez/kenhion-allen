import { CURRENCY } from '@/config/business';
import { siteConfig } from '@/config/site';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { productPath } from './routes';
import { breadcrumbJsonLd, faqJsonLd, productJsonLd, storeJsonLd } from './structured-data';

const product = { ...products[0]!, slug: 'prenda-de-prueba', priceCents: 2437 };
const siteRoot = new URL('/', siteConfig.url).toString();

describe('datos estructurados (JSON-LD)', () => {
  it('Product: precio en dólares con dos decimales, no en centavos', () => {
    const ld = productJsonLd(product, collections[0]);
    expect(ld['@type']).toBe('Product');
    expect(ld.offers.price).toBe('24.37');
    expect(ld.offers.priceCurrency).toBe(CURRENCY);
    expect(productJsonLd({ ...product, priceCents: 1500 }).offers.price).toBe('15.00');
  });

  it('Product: URL de la oferta e imágenes absolutas en el dominio del sitio', () => {
    const ld = productJsonLd(product);
    expect(ld.offers.url).toBe(new URL(productPath(product.slug), siteConfig.url).toString());
    expect(ld.image).toHaveLength(product.colors.length);
    ld.image.forEach((src) => expect(src.startsWith(siteRoot)).toBe(true));
  });

  it('Product: marca, colores y categoría opcional', () => {
    const ld = productJsonLd(product, collections[0]);
    expect(ld.brand.name).toBe(siteConfig.name);
    expect(ld.color).toBe(product.colors.map((c) => c.name).join(', '));
    expect(ld.category).toBe(collections[0]!.name);
    expect(productJsonLd(product).category).toBeUndefined();
  });

  it('BreadcrumbList: posiciones desde 1 y URLs absolutas', () => {
    const ld = breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Tienda', path: '/tienda' },
    ]);
    expect(ld['@type']).toBe('BreadcrumbList');
    expect(ld.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(ld.itemListElement[0]?.item).toBe(siteRoot);
    expect(ld.itemListElement[1]?.item).toBe(new URL('/tienda', siteConfig.url).toString());
  });

  it('FAQPage: una pregunta con su respuesta por cada elemento', () => {
    const ld = faqJsonLd([{ question: '¿Hacen envíos?', answer: 'Sí, a toda Venezuela.' }]);
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: '¿Hacen envíos?',
        acceptedAnswer: { '@type': 'Answer', text: 'Sí, a toda Venezuela.' },
      },
    ]);
  });

  it('ClothingStore: datos de la tienda desde siteConfig', () => {
    const ld = storeJsonLd();
    expect(ld['@type']).toBe('ClothingStore');
    expect(ld.name).toBe(siteConfig.name);
    expect(ld.url).toBe(siteConfig.url);
    expect(ld.address.addressCountry).toBe('VE');
  });
});
