import { buildRobots } from './robots';

describe('buildRobots', () => {
  it('en producción solo bloquea /dev/ y declara el sitemap absoluto', () => {
    const robots = buildRobots(true, 'https://kenhionallen.com');
    expect(robots.rules).toEqual({ userAgent: '*', allow: '/', disallow: ['/dev/'] });
    expect(robots.sitemap).toBe('https://kenhionallen.com/sitemap.xml');
  });

  it('no bloquea carrito ni checkout: su noindex tiene que poder leerse', () => {
    const { rules } = buildRobots(true, 'https://kenhionallen.com');
    const disallow = Array.isArray(rules) ? [] : [rules.disallow].flat();
    expect(disallow).not.toContain('/carrito');
    expect(disallow).not.toContain('/checkout');
  });

  it('en una previsualización no hay sitemap ni disallow', () => {
    const robots = buildRobots(false, 'https://kenhionallen.com');
    expect(robots.sitemap).toBeUndefined();
    expect(robots.rules).toEqual({ userAgent: '*', allow: '/' });
  });
});
