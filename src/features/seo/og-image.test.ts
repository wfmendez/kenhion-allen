import { collections } from '@/data/collections';
import { products } from '@/data/products';
import type { Product } from '@/lib/schemas/product';
import {
  collectionOgImage,
  OG_DESIGN_VERSION,
  ogFingerprint,
  ogVersion,
  productOgData,
  productOgImage,
  shopOgImage,
  siteOgImage,
} from './og-image';

const collection = collections[0]!;
const biker = products.find((p) => p.slug === 'conjunto-biker-top')!;
const version = (url: string) => new URL(url, 'https://x.test').searchParams.get('v');

describe('descriptores de imagen para compartir', () => {
  const all = [
    { image: siteOgImage(), path: '/og/sitio' },
    { image: shopOgImage(products), path: '/og/tienda' },
    { image: collectionOgImage(collection, products), path: '/og/coleccion/ka-elite' },
    { image: productOgImage(biker, collection), path: '/og/producto/conjunto-biker-top' },
  ];

  it.each(all)('$path: ruta correcta, ?v= y JPEG 1200x630', ({ image, path }) => {
    expect(image.url.startsWith(`${path}?v=`)).toBe(true);
    expect(version(image.url)).toMatch(/^[0-9a-f]{8}$/);
    expect(image).toMatchObject({ width: 1200, height: 630, type: 'image/jpeg' });
    expect(image.alt.length).toBeGreaterThan(10);
  });

  it('el alt del producto lleva el nombre y el precio formateado', () => {
    expect(productOgImage(biker, collection).alt).toBe(
      'Conjunto biker + top de Kenhion Allen, $44.67',
    );
  });

  it('la tarjeta del producto dibuja el conteo de piezas del conjunto', () => {
    expect(productOgData(biker, collection)).toMatchObject({
      name: 'Conjunto biker + top',
      price: '$44.67',
      eyebrow: 'KA ELITE · Dama',
      units: 2,
      domain: 'kenhionallen.com',
    });
  });
});

describe('ogFingerprint', () => {
  const base = productOgImage(biker, collection);
  const withChanges = (changes: Partial<Product>) =>
    productOgImage({ ...biker, ...changes }, collection);

  it('es estable con los mismos datos', () => {
    expect(productOgImage(structuredClone(biker), collection).url).toBe(base.url);
    expect(ogFingerprint({ a: 1 })).toBe(ogFingerprint({ a: 1 }));
  });

  it('cambia al cambiar el precio', () => {
    expect(withChanges({ priceCents: 4999 }).url).not.toBe(base.url);
  });

  it('cambia al cambiar la foto principal', () => {
    const [first, ...rest] = biker.colors;
    const colors = [{ ...first!, images: [...first!.images].reverse() }, ...rest];
    expect(withChanges({ colors }).url).not.toBe(base.url);
  });

  it('cambia al cambiar las piezas que cuenta al mayor', () => {
    expect(withChanges({ wholesaleUnits: 3 }).url).not.toBe(base.url);
  });

  it('cambia al cambiar el descuento al mayor', () => {
    const otherRate = productOgImage(biker, collection, { minQty: 6, rate: 0.2 });
    expect(otherRate.url).not.toBe(base.url);
    expect(shopOgImage(products, { minQty: 12, rate: 0.15 }).url).not.toBe(
      shopOgImage(products).url,
    );
  });

  it('cambia si se reemplaza una foto aunque conserve el nombre', () => {
    const data = productOgData(biker, collection);
    const before = ogVersion(data, (src) => `${src}:contenido-viejo`);
    const after = ogVersion(data, (src) => `${src}:contenido-nuevo`);
    expect(after).not.toBe(before);
    expect(ogVersion(data, (src) => `${src}:contenido-viejo`)).toBe(before);
  });

  it('lee el contenido real de las fotos de public/', () => {
    const data = productOgData(biker, collection);
    const byPath = ogVersion(data, (src) => src);
    expect(ogVersion(data)).not.toBe(byPath);
    expect(version(productOgImage(biker, collection).url)).toBe(ogVersion(data));
  });

  it('cambia al subir OG_DESIGN_VERSION', () => {
    const data = productOgData(biker, collection);
    expect(ogFingerprint(data, OG_DESIGN_VERSION + 1)).not.toBe(ogFingerprint(data));
  });
});
