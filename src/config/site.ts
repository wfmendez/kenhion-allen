/** Dominio canónico de la tienda (ADR 0008). www y kenhion-allen.vercel.app redirigen aquí. */
export const PRODUCTION_URL = 'https://kenhionallen.com';

const LOCAL_URL = 'http://localhost:3006';

/**
 * URL pública del sitio. Se usa en metadata, sitemap, robots, imágenes para compartir y JSON-LD.
 *
 * 1. `NEXT_PUBLIC_SITE_URL`, si se define (sobrescritura opcional).
 * 2. En cualquier `next build` (producción, previews de Vercel, CI y build local), el dominio real.
 * 3. En `next dev` y en los tests, localhost.
 *
 * No lee `VERCEL_PROJECT_PRODUCTION_URL` ni `VERCEL_URL`: el build anterior al dominio tomó de ahí
 * kenhion-allen.vercel.app y dejó canónicas e imágenes rotas.
 */
export function resolveSiteUrl(env: { NODE_ENV?: string; NEXT_PUBLIC_SITE_URL?: string }): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  if (env.NODE_ENV === 'production') return PRODUCTION_URL;
  return LOCAL_URL;
}

/**
 * Las previsualizaciones de Vercel no se indexan. Vercel ya envía `X-Robots-Tag: noindex` en
 * *.vercel.app, pero no si a una rama se le asigna un dominio propio. Leer `VERCEL_ENV` solo en
 * el servidor (layout y robots).
 */
export function isIndexable(vercelEnv: string | undefined): boolean {
  return vercelEnv !== 'preview' && vercelEnv !== 'development';
}

/** Datos públicos de la marca. Único lugar para cambiar eslogan, contacto o ubicación. */
export const siteConfig = {
  name: 'Kenhion Allen',
  slogan: 'Más allá del límite',
  description:
    'Tienda de ropa especializada en prendas elegantes para hombres y mujeres en Maracay, Venezuela.',
  productionUrl: PRODUCTION_URL,
  // Acceso literal a process.env: Next incrusta estos valores también en el bundle del cliente.
  url: resolveSiteUrl({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }),
  locale: 'es-VE',
  contact: {
    whatsappNumber: '584125305464',
    whatsappDisplay: '+58 412-530-5464',
    email: '88kenhionallen@gmail.com',
  },
  location: {
    city: 'Maracay',
    state: 'Aragua',
    country: 'Venezuela',
  },
} as const;
