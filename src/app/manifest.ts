import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { homeDescription } from '@/lib/seo/metadata';
import { colors } from '@/styles/tokens';

/**
 * Manifiesto web: nombre, colores e iconos PNG para Android y los buscadores.
 * `display: 'browser'` porque no se busca que la tienda se instale como app (PWA).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: homeDescription,
    lang: siteConfig.locale,
    start_url: '/',
    display: 'browser',
    background_color: colors.ink,
    theme_color: colors.ink,
    icons: [
      { src: '/images/marca/emblema-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/marca/emblema-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
