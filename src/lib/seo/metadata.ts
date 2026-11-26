import type { Metadata } from 'next';
import { WHOLESALE } from '@/config/business';
import { isIndexable, siteConfig } from '@/config/site';
import { siteOgImage, type OgImage } from '@/features/seo/og-image';

/**
 * Open Graph común. Next REEMPLAZA entero el `openGraph` del layout cuando una página define el
 * suyo, así que cada página lo repite completo con `pageMetadata` (tipo, idioma, sitio e imagen).
 * La imagen se declara siempre de forma explícita: ver og-image.ts.
 */
export const baseOpenGraph = {
  type: 'website',
  locale: 'es_VE',
  siteName: siteConfig.name,
  images: [siteOgImage()],
} satisfies Metadata['openGraph'];

type Title = string | { absolute: string };

/**
 * Metadata de una página indexable: canonical y og:url iguales, Open Graph completo.
 * El og:title va sin el sufijo «| Kenhion Allen»: og:site_name ya muestra la marca y así no se
 * repite en la vista previa. El <title> sí usa la plantilla del layout.
 */
export function pageMetadata({
  path,
  title,
  description,
  ogTitle,
  image,
}: {
  path: string;
  title: Title;
  description: string;
  ogTitle?: string;
  image?: OgImage;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...baseOpenGraph,
      url: path,
      title: ogTitle ?? (typeof title === 'string' ? title : title.absolute),
      description,
      images: image ? [image] : baseOpenGraph.images,
    },
  };
}

const wholesalePercent = Math.round(WHOLESALE.rate * 100);

/**
 * Descripción de la home, compuesta solo con datos que ya están en el código.
 * Pendiente: que el cliente apruebe el texto (docs/brand.md).
 */
export const homeDescription =
  `Ropa deportiva de compresión KA ELITE en ${siteConfig.location.city}, ${siteConfig.location.country}. ` +
  `Envíos a toda Venezuela y ${wholesalePercent}% de descuento al mayor desde ${WHOLESALE.minQty} piezas.`;

/**
 * Metadata del layout raíz (se extrae aquí para poder probarla con cada entorno).
 * Sin canonical: lo heredarían la 404 y el carrito; cada página indexable declara el suyo.
 * Las páginas sin openGraph propio (carrito, checkout, 404) heredan este, con la imagen genérica.
 */
export function rootMetadata(env: {
  VERCEL_ENV?: string;
  GOOGLE_SITE_VERIFICATION?: string;
  BING_SITE_VERIFICATION?: string;
}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | ${siteConfig.slogan}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: homeDescription,
    openGraph: baseOpenGraph,
    // Las previsualizaciones no se indexan (ADR 0008).
    robots: isIndexable(env.VERCEL_ENV) ? undefined : { index: false, follow: false },
    // Opcional: verificación por etiqueta de Search Console y Bing (mejor por DNS, ver README).
    verification: siteVerification(env),
  };
}

/**
 * Etiquetas de verificación de Google Search Console y Bing Webmaster Tools, opcionales.
 * Lo recomendado es verificar por DNS (registro TXT) y dejarlas vacías. Se leen en el build.
 */
export function siteVerification(env: {
  GOOGLE_SITE_VERIFICATION?: string;
  BING_SITE_VERIFICATION?: string;
}): Metadata['verification'] {
  const google = env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
  };
}
