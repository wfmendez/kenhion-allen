import { siteOgImage, type OgImage } from '@/features/seo/og-image';
import { siteConfig } from '@/config/site';
import {
  baseOpenGraph,
  homeDescription,
  pageMetadata,
  rootMetadata,
  siteVerification,
} from './metadata';

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
});

describe('rootMetadata (layout)', () => {
  it('usa el Open Graph base con la imagen genérica y la descripción de la tienda', () => {
    const meta = rootMetadata({});
    expect(meta.openGraph).toBe(baseOpenGraph);
    expect(baseOpenGraph.images).toEqual([siteOgImage()]);
    expect(meta.description).toBe(homeDescription);
    expect(String(meta.metadataBase)).toBe(new URL(siteConfig.url).href);
    expect(meta).not.toHaveProperty('alternates');
  });

  it('las previsualizaciones de Vercel llevan noindex', () => {
    expect(rootMetadata({ VERCEL_ENV: 'preview' }).robots).toEqual({
      index: false,
      follow: false,
    });
    expect(rootMetadata({ VERCEL_ENV: 'development' }).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('producción y los builds fuera de Vercel se indexan', () => {
    expect(rootMetadata({ VERCEL_ENV: 'production' }).robots).toBeUndefined();
    expect(rootMetadata({}).robots).toBeUndefined();
  });

  it('pasa las verificaciones de Search Console y Bing', () => {
    expect(rootMetadata({ GOOGLE_SITE_VERIFICATION: 'g' }).verification).toEqual({ google: 'g' });
    expect(rootMetadata({}).verification).toBeUndefined();
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

describe('siteVerification', () => {
  it('sin variables no declara nada', () => {
    expect(siteVerification({})).toBeUndefined();
    expect(siteVerification({ GOOGLE_SITE_VERIFICATION: '  ' })).toBeUndefined();
  });

  it('declara Google y Bing (msvalidate.01) cuando hay valores', () => {
    expect(
      siteVerification({ GOOGLE_SITE_VERIFICATION: 'abc ', BING_SITE_VERIFICATION: 'XYZ' }),
    ).toEqual({ google: 'abc', other: { 'msvalidate.01': 'XYZ' } });
    expect(siteVerification({ BING_SITE_VERIFICATION: 'XYZ' })).toEqual({
      other: { 'msvalidate.01': 'XYZ' },
    });
  });
});
