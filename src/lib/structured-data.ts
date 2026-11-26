import { CURRENCY } from '@/config/business';
import { siteConfig } from '@/config/site';
import type { FaqItem } from '@/data/faq';
import { productPath } from '@/lib/routes';
import type { Product } from '@/lib/schemas/product';

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

/** Identificador de la tienda en el grafo: lo referencian WebSite.publisher y Offer.seller. */
const storeId = () => `${siteConfig.url}/#tienda`;

/** Emblema en PNG cuadrado (Google no acepta SVG como logo). Lo genera scripts/generate-favicon.mjs. */
const LOGO = { path: '/images/marca/emblema-512.png', size: 512 };

/**
 * Datos estructurados de la home: WebSite (Google lo usa para el nombre del sitio) y la tienda.
 * OnlineStore y no ClothingStore: ClothingStore es un LocalBusiness y presupone un local físico
 * con dirección, que el cliente no ha dado. Sin streetAddress, horarios, sameAs ni SearchAction:
 * son datos pendientes del cliente (docs/brand.md).
 */
export function homeJsonLd() {
  const url = siteConfig.url;
  const logo = {
    '@type': 'ImageObject',
    url: absolute(LOGO.path),
    width: LOGO.size,
    height: LOGO.size,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#sitio`,
        name: siteConfig.name,
        url: `${url}/`,
        inLanguage: siteConfig.locale,
        publisher: { '@id': storeId() },
      },
      {
        '@type': 'OnlineStore',
        '@id': storeId(),
        name: siteConfig.name,
        url: `${url}/`,
        slogan: siteConfig.slogan,
        description: siteConfig.description,
        telephone: siteConfig.contact.whatsappDisplay,
        email: siteConfig.contact.email,
        logo,
        image: logo,
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.location.city,
          addressRegion: siteConfig.location.state,
          addressCountry: 'VE',
        },
        areaServed: { '@type': 'Country', name: siteConfig.location.country },
      },
    ],
  };
}

/** Categoría de la taxonomía de productos de Google (id 5322). */
const GOOGLE_CATEGORY = 'Apparel & Accessories > Clothing > Activewear';

const SUGGESTED_GENDER: Partial<Record<Product['gender'], 'male' | 'female'>> = {
  Caballero: 'male',
  Dama: 'female',
};

/**
 * Sin `color` (para Google es el color de UN artículo, no la lista de variantes) y sin
 * shippingDetails, hasMerchantReturnPolicy, priceValidUntil ni reseñas: son datos pendientes del
 * cliente.
 */
export function productJsonLd(product: Product) {
  const url = absolute(productPath(product.slug));
  // Todas las fotos de todos los colores; la primera es la principal del color por defecto.
  const images = [
    ...new Set(product.colors.flatMap((color) => color.images.map((i) => absolute(i.src)))),
  ];
  const gender = SUGGESTED_GENDER[product.gender];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#producto`,
    url,
    name: product.name,
    description: product.description,
    image: images,
    sku: `KA-${product.id}`,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: GOOGLE_CATEGORY,
    ...(gender ? { audience: { '@type': 'PeopleAudience', suggestedGender: gender } } : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: CURRENCY,
      price: (product.priceCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', '@id': storeId(), name: siteConfig.name },
    },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
