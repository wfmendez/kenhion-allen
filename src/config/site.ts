/**
 * Dominio canónico de la tienda (ADR 0008). www.kenhionallen.com debe redirigir aquí con 308: se
 * configura en el DNS y en Vercel → Domains (ver README), no en el código.
 */
export const PRODUCTION_URL = 'https://kenhionallen.com';

const LOCAL_URL = 'http://localhost:3006';

/**
 * URL pública del sitio. Se usa en metadata, sitemap, robots, imágenes para compartir y JSON-LD.
 *
 * 1. `NEXT_PUBLIC_SITE_URL`, si se define (sobrescritura opcional). En el build de producción de
 *    Vercel (`VERCEL_ENV=production`) tiene que ser https y no puede ser localhost ni *.vercel.app:
 *    si no, el build falla en vez de publicar canónicas e imágenes rotas.
 * 2. En cualquier `next build` (producción, previews de Vercel, CI y build local), el dominio real.
 * 3. En `next dev` y en los tests, localhost.
 *
 * No lee `VERCEL_PROJECT_PRODUCTION_URL` ni `VERCEL_URL`: el build anterior al dominio tomó de ahí
 * kenhion-allen.vercel.app y dejó canónicas e imágenes rotas.
 */
export function resolveSiteUrl(env: {
  NODE_ENV?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
}): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  if (explicit) {
    if (env.VERCEL_ENV === 'production') assertPublicUrl(explicit);
    return explicit;
  }
  if (env.NODE_ENV === 'production') return PRODUCTION_URL;
  return LOCAL_URL;
}

function assertPublicUrl(value: string): void {
  const { protocol, hostname } = new URL(value);
  if (
    protocol !== 'https:' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.vercel.app')
  ) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL=${value} no sirve en producción: debe ser el dominio público en https. ` +
        'Bórrala en Vercel → Settings → Environment Variables (sin ella se usa ' +
        `${PRODUCTION_URL}).`,
    );
  }
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
  // VERCEL_ENV solo existe en el servidor: la comprobación de producción corre en el build.
  url: resolveSiteUrl({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
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
