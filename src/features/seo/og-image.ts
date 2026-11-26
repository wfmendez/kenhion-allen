import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from '@/components/layout/emblem-paths';
import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';
import { collections as collectionsData } from '@/data/collections';
import { gallery } from '@/data/gallery';
import { formatUSD } from '@/lib/money';
import { ogCollectionPath, ogProductPath, ogShopPath, ogSitePath } from '@/lib/routes';
import { getPrimaryImage, type Collection, type Product } from '@/lib/schemas/product';
import { colors } from '@/styles/tokens';
import { photoDigest } from './photo-digest';

/**
 * Imágenes para compartir (WhatsApp, Facebook, X, iMessage…): JPEG 1200x630 generados en el build.
 *
 * La URL lleva `?v=<huella>` calculada con todo lo que se dibuja: los datos (precio, mayoreo,
 * nombre…), el CONTENIDO de cada foto (también si se reemplaza con el mismo nombre), los colores
 * de la marca y el emblema. Si algo de eso cambia, cambia la URL y las redes descargan la imagen
 * nueva en vez de mostrar la que tienen en caché (se sirve como immutable por un año).
 *
 * Hay que subir OG_DESIGN_VERSION a mano solo al cambiar el diseño (og-cards.tsx) o las fuentes
 * de src/assets/og/.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_DESIGN_VERSION = 1;

export interface OgImage {
  url: string;
  width: number;
  height: number;
  type: 'image/jpeg';
  alt: string;
}

type Wholesale = { minQty: number; rate: number };

/** FNV-1a de 32 bits en hexadecimal sobre los datos dibujados y la versión del diseño. */
export function ogFingerprint(input: unknown, designVersion: number = OG_DESIGN_VERSION): string {
  const text = `${JSON.stringify(input)}${designVersion}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** Dominio que se imprime en las tarjetas (siempre el de producción, también en local). */
const domain = new URL(siteConfig.productionUrl).host;

/** Nombre corto para las listas: «Short de caballero» → «Short». */
const shortName = (product: Product) => product.name.split(' ')[0]!;

const brand = { brand: siteConfig.name, slogan: siteConfig.slogan, domain };

// ---- Datos que dibuja cada tarjeta (og-cards.tsx solo pinta lo que hay aquí) ----

export function siteOgData() {
  const collection = collectionsData[0];
  return {
    ...brand,
    photo: gallery[0]!.src,
    line: collection ? `${collection.name} · Ropa de compresión` : 'Ropa de compresión',
  };
}
export type SiteOgData = ReturnType<typeof siteOgData>;

function gridOgData(
  eyebrow: string,
  title: string,
  products: Product[],
  wholesale: Wholesale = WHOLESALE,
) {
  return {
    ...brand,
    eyebrow,
    title,
    photos: products.slice(0, 3).map((p) => getPrimaryImage(p).src),
    names: products.map(shortName),
    wholesale: { minQty: wholesale.minQty, rate: wholesale.rate },
  };
}
export type GridOgData = ReturnType<typeof gridOgData>;

export const shopOgData = (products: Product[], wholesale?: Wholesale) =>
  gridOgData('Tienda online', siteConfig.name, products, wholesale);

export const collectionOgData = (
  collection: Collection,
  products: Product[],
  wholesale?: Wholesale,
) =>
  gridOgData(
    `Colección · ${collection.tagline}`,
    collection.name,
    products.filter((p) => p.collection === collection.slug),
    wholesale,
  );

export function productOgData(
  product: Product,
  collection?: Collection,
  wholesale: Wholesale = WHOLESALE,
) {
  return {
    ...brand,
    name: product.name,
    priceCents: product.priceCents,
    price: formatUSD(product.priceCents),
    eyebrow: [collection?.name, product.gender].filter(Boolean).join(' · '),
    photo: getPrimaryImage(product).src,
    units: product.wholesaleUnits,
    wholesale: { minQty: wholesale.minQty, rate: wholesale.rate },
  };
}
export type ProductOgData = ReturnType<typeof productOgData>;

// ---- Descriptores para la metadata (og:image, og:image:width/height/type/alt) ----

/** Lo que el diseño toma de fuera de los datos: si cambia, cambian todas las tarjetas. */
const DESIGN_INPUTS = { colors, emblem: [EMBLEM_VIEWBOX, ...EMBLEM_PATHS] };

/**
 * Versión de una tarjeta: datos dibujados + contenido de sus fotos + colores y emblema.
 * `digest` se inyecta en los tests; en el sitio lee el archivo de public/.
 */
export function ogVersion(
  data: { photo?: string; photos?: readonly string[] },
  digest: (src: string) => string = photoDigest,
): string {
  const photos = [...(data.photo ? [data.photo] : []), ...(data.photos ?? [])];
  return ogFingerprint({ data, photos: photos.map(digest), design: DESIGN_INPUTS });
}

function image(path: string, data: Parameters<typeof ogVersion>[0], alt: string): OgImage {
  return {
    url: `${path}?v=${ogVersion(data)}`,
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    type: 'image/jpeg',
    alt,
  };
}

export function siteOgImage(): OgImage {
  const data = siteOgData();
  return image(ogSitePath, data, `${siteConfig.name}: ${siteConfig.slogan}. ${data.line}`);
}

export function shopOgImage(products: Product[], wholesale?: Wholesale): OgImage {
  const data = shopOgData(products, wholesale);
  return image(
    ogShopPath,
    data,
    `Tienda online de ${siteConfig.name}: ${products.map((p) => p.name).join(', ')}`,
  );
}

export function collectionOgImage(
  collection: Collection,
  products: Product[],
  wholesale?: Wholesale,
): OgImage {
  const data = collectionOgData(collection, products, wholesale);
  return image(
    ogCollectionPath(collection.slug),
    data,
    `Colección ${collection.name} de ${siteConfig.name}`,
  );
}

export function productOgImage(
  product: Product,
  collection?: Collection,
  wholesale?: Wholesale,
): OgImage {
  return image(
    ogProductPath(product.slug),
    productOgData(product, collection, wholesale),
    `${product.name} de ${siteConfig.name}, ${formatUSD(product.priceCents)}`,
  );
}
