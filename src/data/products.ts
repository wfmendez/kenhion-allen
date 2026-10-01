import type { Product, ProductColor, ProductImage } from '@/lib/schemas/product';

const BASE = '/images/ka-elite';
const ALL_SIZES: Product['sizes'] = ['S', 'M', 'L'];

const swatch = {
  verde: { slug: 'verde', name: 'Verde', hex: '#2f4a1f' },
  negro: { slug: 'negro', name: 'Negro', hex: '#111111' },
  blanco: { slug: 'blanco', name: 'Blanco', hex: '#f4f4f4' },
} as const;

/** Arma un color con sus fotos: `vistas` es la lista de [archivo, descripción de la vista]. */
function color(
  folder: string,
  product: string,
  key: keyof typeof swatch,
  views: [file: string, view: string][],
): ProductColor {
  const s = swatch[key];
  return {
    ...s,
    images: views.map(([file, view]) => ({
      src: `${BASE}/${folder}/${key}-${file}.jpg`,
      alt: `${product} color ${s.name.toLowerCase()}, ${view}`,
    })),
  };
}

const action = (n: string, alt: string): ProductImage => ({
  src: `${BASE}/accion/accion-${n}.jpg`,
  alt,
});

/**
 * Catálogo oficial: colección KA ELITE. Los precios van en centavos (2437 = $24.37).
 * Se valida con Zod en el repositorio y en los tests: un dato inválido rompe el build, no la tienda.
 * Los ids empiezan en 11 para no coincidir con los del catálogo anterior.
 */
export const products: Product[] = [
  {
    id: 11,
    slug: 'short-de-caballero',
    name: 'Short de caballero',
    collection: 'ka-elite',
    gender: 'Caballero',
    priceCents: 2437,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    description:
      'Short deportivo liviano de máxima movilidad, con cintura elástica y bolsillos laterales. Para entrenar o para el día a día.',
    sizes: ALL_SIZES,
    colors: [
      color('short', 'Short de caballero', 'verde', [
        ['frente', 'vista frontal'],
        ['detalle', 'detalle del emblema'],
      ]),
      color('short', 'Short de caballero', 'negro', [
        ['frente', 'vista frontal'],
        ['detalle', 'detalle del emblema'],
      ]),
      color('short', 'Short de caballero', 'blanco', [
        ['frente', 'vista frontal'],
        ['detalle', 'detalle del emblema'],
      ]),
    ],
    lifestyleImages: [action('06', 'Atleta entrenando con el short de caballero negro')],
    wholesaleUnits: 1,
  },
  {
    id: 12,
    slug: 'franela-de-compresion-de-caballero',
    name: 'Franela de compresión de caballero',
    collection: 'ka-elite',
    gender: 'Caballero',
    priceCents: 3312,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    description:
      'Franela técnica de compresión con ajuste firme al torso y manga ranglan. Destaca la figura mientras mantiene alta respirabilidad.',
    sizes: ALL_SIZES,
    colors: [
      color('franela', 'Franela de compresión', 'verde', [
        ['frente', 'vista frontal'],
        ['espalda', 'detalle de la espalda'],
      ]),
      color('franela', 'Franela de compresión', 'negro', [
        ['frente', 'vista frontal'],
        ['espalda', 'detalle de la espalda'],
      ]),
      color('franela', 'Franela de compresión', 'blanco', [
        ['frente', 'vista frontal'],
        ['espalda', 'detalle de la espalda'],
      ]),
    ],
    lifestyleImages: [
      action('02', 'Atleta levantando una barra con la franela de compresión'),
      action('04', 'Boxeador entrenando con la franela de compresión blanca'),
    ],
    wholesaleUnits: 1,
  },
  {
    id: 13,
    slug: 'conjunto-biker-top',
    name: 'Conjunto biker + top',
    collection: 'ka-elite',
    gender: 'Dama',
    priceCents: 4467,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    description:
      'Conjunto de compresión para dama: top deportivo y biker de pretina alta. Brinda soporte, moldea la silueta y acompaña cada movimiento.',
    sizes: ALL_SIZES,
    colors: [
      color('conjunto', 'Conjunto biker + top', 'verde', [
        ['frente', 'vista frontal'],
        ['espalda', 'vista posterior'],
      ]),
      color('conjunto', 'Conjunto biker + top', 'negro', [
        ['frente', 'vista frontal'],
        ['espalda', 'vista posterior'],
      ]),
    ],
    lifestyleImages: [
      action('01', 'Atleta en bicicleta de aire con el conjunto verde'),
      action('03', 'Atleta en anillas con el conjunto verde'),
      action('05', 'Atleta calentando con el conjunto negro'),
      action('07', 'Atleta descansando con el conjunto negro'),
      action('09', 'Detalle del emblema en la espalda del top negro'),
    ],
    // Confirmado por el cliente: el conjunto trae dos prendas y cuenta como 2 piezas al mayor.
    wholesaleUnits: 2,
  },
];
