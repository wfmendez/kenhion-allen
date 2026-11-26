import { isIndexable, PRODUCTION_URL, resolveSiteUrl, siteConfig } from './site';

describe('resolveSiteUrl', () => {
  it('en un build de producción usa el dominio canónico', () => {
    expect(resolveSiteUrl({ NODE_ENV: 'production' })).toBe('https://kenhionallen.com');
  });

  it('NEXT_PUBLIC_SITE_URL tiene prioridad y se limpia (espacios y barra final)', () => {
    expect(
      resolveSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://x.test/ ' }),
    ).toBe('https://x.test');
    expect(resolveSiteUrl({ NODE_ENV: 'development', NEXT_PUBLIC_SITE_URL: '   ' })).toBe(
      'http://localhost:3006',
    );
  });

  it('en desarrollo y en los tests usa localhost', () => {
    expect(resolveSiteUrl({ NODE_ENV: 'development' })).toBe('http://localhost:3006');
    expect(resolveSiteUrl({ NODE_ENV: 'test' })).toBe('http://localhost:3006');
    expect(resolveSiteUrl({})).toBe('http://localhost:3006');
  });

  it('ignora VERCEL_PROJECT_PRODUCTION_URL: el dominio viejo no puede volver a colarse', () => {
    const env: Record<string, string | undefined> = {
      ...process.env,
      NODE_ENV: 'production',
      VERCEL_PROJECT_PRODUCTION_URL: 'kenhion-allen.vercel.app',
      VERCEL_URL: 'kenhion-allen-git-rama.vercel.app',
    };
    delete env.NEXT_PUBLIC_SITE_URL;
    expect(resolveSiteUrl(env)).toBe(PRODUCTION_URL);
  });
});

describe('resolveSiteUrl en el build de producción de Vercel', () => {
  const prod = (url: string) => () =>
    resolveSiteUrl({ NODE_ENV: 'production', VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: url });

  it('rechaza localhost, http y *.vercel.app en vez de publicarlos', () => {
    expect(prod('http://localhost:3006')).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(prod('http://kenhionallen.com')).toThrow(/https/);
    expect(prod('https://kenhion-allen.vercel.app')).toThrow(/Vercel/);
  });

  it('acepta un dominio público en https', () => {
    expect(prod('https://kenhionallen.com/')()).toBe('https://kenhionallen.com');
  });

  it('en las previsualizaciones y fuera de Vercel no valida (pruebas locales)', () => {
    expect(
      resolveSiteUrl({
        NODE_ENV: 'production',
        VERCEL_ENV: 'preview',
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3006',
      }),
    ).toBe('http://localhost:3006');
    expect(
      resolveSiteUrl({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'http://localhost:3006' }),
    ).toBe('http://localhost:3006');
  });
});

describe('isIndexable', () => {
  it('las previsualizaciones y el desarrollo de Vercel no se indexan', () => {
    expect(isIndexable('preview')).toBe(false);
    expect(isIndexable('development')).toBe(false);
  });

  it('producción y los builds fuera de Vercel sí', () => {
    expect(isIndexable('production')).toBe(true);
    expect(isIndexable(undefined)).toBe(true);
  });
});

describe('siteConfig', () => {
  it('declara el dominio de producción como dato de marca', () => {
    expect(siteConfig.productionUrl).toBe('https://kenhionallen.com');
  });
});
