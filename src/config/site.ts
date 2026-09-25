/**
 * URL pública: variable explícita, o el dominio de producción que expone Vercel,
 * o localhost en desarrollo. Se usa en metadata, sitemap y datos estructurados.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3006';
}

/** Datos públicos de la marca. Único lugar para cambiar eslogan, contacto o ubicación. */
export const siteConfig = {
  name: 'Kenhion Allen',
  slogan: 'Más allá del límite',
  description:
    'Tienda de ropa especializada en prendas elegantes para hombres y mujeres en Maracay, Venezuela.',
  url: resolveSiteUrl(),
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
