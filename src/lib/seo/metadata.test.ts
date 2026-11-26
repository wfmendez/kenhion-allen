import { siteOgImage, type OgImage } from '@/features/seo/og-image';
import { baseOpenGraph, homeDescription, pageMetadata } from './metadata';

const image: OgImage = {
  url: '/og/producto/x?v=00000000',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Producto',
};

describe('pageMetadata', () => {
  const meta = pageMetadata({ path: '/tienda', title: 'Tienda online', description: 'Texto' });
  const og = meta.openGraph as Record<string, unknown>;

  it('canonical y og:url son la misma ruta', () => {
    expect(meta.alternates?.canonical).toBe('/tienda');
    expect(og.url).toBe('/tienda');
  });

  it('repite el Open Graph común (Next reemplaza el del layout)', () => {
    expect(og).toMatchObject({ type: 'website', locale: 'es_VE', siteName: 'Kenhion Allen' });
  });

  it('sin imagen usa la genérica; con imagen, solo esa', () => {
    expect(og.images).toEqual([siteOgImage()]);
    const withImage = pageMetadata({ path: '/p', title: 'P', description: 'D', image });
    expect((withImage.openGraph as Record<string, unknown>).images).toEqual([image]);
  });

  it('el og:title no lleva el sufijo de la marca', () => {
    expect(og.title).toBe('Tienda online');
    expect(String(og.title)).not.toContain('| Kenhion Allen');
    const home = pageMetadata({
      path: '/',
      title: { absolute: 'Kenhion Allen | Más allá del límite' },
      ogTitle: 'Kenhion Allen | Más allá del límite',
      description: 'D',
    });
    expect(home.title).toEqual({ absolute: 'Kenhion Allen | Más allá del límite' });
  });

  it('el layout comparte el mismo Open Graph base', () => {
    expect(baseOpenGraph.images).toHaveLength(1);
  });
});

describe('homeDescription', () => {
  it('mide entre 70 y 160 caracteres y habla de compresión', () => {
    expect(homeDescription.length).toBeGreaterThanOrEqual(70);
    expect(homeDescription.length).toBeLessThanOrEqual(160);
    expect(homeDescription).toContain('compresión');
    expect(homeDescription).toContain('15% de descuento al mayor desde 6 piezas');
  });
});
