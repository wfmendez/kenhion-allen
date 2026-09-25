/** Datos públicos de la marca. Único lugar para cambiar eslogan, contacto o ubicación. */
export const siteConfig = {
  name: 'Kenhion Allen',
  slogan: 'Más allá del límite',
  description:
    'Tienda de ropa especializada en prendas elegantes para hombres y mujeres en Maracay, Venezuela.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3006',
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
