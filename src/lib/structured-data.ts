import { CURRENCY } from '@/config/business';
import { siteConfig } from '@/config/site';
import type { FaqItem } from '@/data/faq';
import { productPath } from '@/lib/routes';
import type { Collection, Product } from '@/lib/schemas/product';

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export function storeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: siteConfig.name,
    slogan: siteConfig.slogan,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.whatsappDisplay,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: 'VE',
    },
  };
}

export function productJsonLd(product: Product, collection?: Collection) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.image],
    sku: `KA-${product.id}`,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: collection?.name,
    offers: {
      '@type': 'Offer',
      url: absolute(productPath(product.slug)),
      priceCurrency: CURRENCY,
      price: (product.priceCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: siteConfig.name },
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
