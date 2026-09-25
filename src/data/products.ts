import type { Product } from '@/lib/schemas/product';

const CDN = 'https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c';
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const ALL_SIZES: Product['sizes'] = ['S', 'M', 'L', 'XL'];

/**
 * Catálogo oficial. Los precios van en centavos (2500 = $25.00).
 * Se valida con Zod en el repositorio y en los tests: un dato inválido rompe el build, no la tienda.
 */
export const products: Product[] = [
  {
    id: 1,
    slug: 'crop-top-de-compresion',
    name: 'Crop Top de Compresión',
    collection: 'ka-elite',
    gender: 'Mujer',
    priceCents: 1500,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    image: `${CDN}/200000308-1f1501f152/IMG_1507.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1518310383802-640c2de311b2'),
    description:
      'Diseñado para brindar compresión ergonómica, soporte y estética deportiva de alto nivel en tus entrenamientos.',
    sizes: ALL_SIZES,
  },
  {
    id: 2,
    slug: 'biker-de-compresion',
    name: 'Biker de Compresión',
    collection: 'ka-elite',
    gender: 'Mujer',
    priceCents: 1500,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    image: `${CDN}/200000318-03ccb03cce/IMG_1508.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1506152983158-b4a74a01c721'),
    description:
      'Short estilo biker de compresión anatómica. Moldea la silueta con pretina alta antideslizante para máximo confort.',
    sizes: ALL_SIZES,
  },
  {
    id: 3,
    slug: 'shorts-ka-elite',
    name: 'Shorts KA Elite',
    collection: 'ka-elite',
    gender: 'Unisex',
    priceCents: 2500,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    image: `${CDN}/200000335-e8567e8569/IMG_1509.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1591195853828-11db59a44f6b'),
    description:
      'Shorts deportivos livianos de máxima movilidad. Tacto ultra suave para entrenamiento o diario casual.',
    sizes: ALL_SIZES,
  },
  {
    id: 4,
    slug: 'franela-de-compresion',
    name: 'Franela de Compresión',
    collection: 'ka-elite',
    gender: 'Hombre',
    priceCents: 2500,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    image: `${CDN}/200000322-bb18ebb190/IMG_1510.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1521572267360-ee0c2909d518'),
    description:
      'Franela técnica de ajuste firme al torso. Destaca la figura mientras mantiene alta respirabilidad.',
    sizes: ALL_SIZES,
  },
  {
    id: 5,
    slug: 'sudadera-ka-elite',
    name: 'Sudadera KA Elite',
    collection: 'ka-elite',
    gender: 'Unisex',
    priceCents: 2500,
    compareAtPriceCents: null,
    badge: 'KA Elite',
    image: `${CDN}/200000330-b257eb2580/IMG_1511.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1620799140408-edc6dcb6d633'),
    description:
      'Sudadera ligera de ajuste moderno. Corte contemporáneo con bordado frontal distintivo.',
    sizes: ALL_SIZES,
  },
  {
    id: 6,
    slug: 'basic-t-shirt-oversize',
    name: 'Basic T Shirt Oversize',
    collection: 'pod',
    gender: 'Unisex',
    priceCents: 2500,
    compareAtPriceCents: 2800,
    badge: 'Oferta P.O.D.',
    image: `${CDN}/200000268-43acd43ace/IMG_1018.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1583743814966-8936f5b7be1a'),
    description:
      'Camiseta con patrón Oversize holgado y caída estructurada. Modelo exclusivo Print On Demand en algodón grueso.',
    sizes: ALL_SIZES,
  },
  {
    id: 7,
    slug: 'girl-shorts-resiliencia',
    name: 'Girl Shorts Resiliencia',
    collection: 'resiliencia',
    gender: 'Mujer',
    priceCents: 2600,
    compareAtPriceCents: null,
    badge: 'Algodón 100%',
    image: `${CDN}/200000238-a233fa2344/IMG_0996.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1591195853828-11db59a44f6b'),
    description:
      'La colección Resiliencia destaca por la alta calidad de sus materiales, fabricadas en su totalidad de algodón, en estas prendas resalta la elegancia por su bordado minimalista.',
    sizes: ALL_SIZES,
  },
  {
    id: 8,
    slug: 'shorts-resiliencia',
    name: 'Shorts Resiliencia',
    collection: 'resiliencia',
    gender: 'Hombre',
    priceCents: 2800,
    compareAtPriceCents: null,
    badge: 'Algodón 100%',
    image: `${CDN}/200000220-c7cfdc7cff/IMG_1006.JPG-2.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1541099649105-f69ad21f3246'),
    description:
      'Shorts en algodón de alta densidad con estilo elegante y conservador. Perfectos para salir a cenar o ir de paseo a un mall.',
    sizes: ALL_SIZES,
  },
  {
    id: 9,
    slug: 't-shirt-oversize-resiliencia',
    name: 'T Shirt Oversize Resiliencia',
    collection: 'resiliencia',
    gender: 'Unisex',
    priceCents: 3000,
    compareAtPriceCents: null,
    badge: 'Algodón 100%',
    image: `${CDN}/200000253-a830da830f/IMG_0983.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1521572267360-ee0c2909d518'),
    description:
      'Franela oversize en 100% algodón. Comodidad y bordado discreto con la calidad que distingue a Kenhion Allen.',
    sizes: ALL_SIZES,
  },
  {
    id: 10,
    slug: 'hoodie-resiliencia',
    name: 'Hoodie Resiliencia',
    collection: 'resiliencia',
    gender: 'Unisex',
    priceCents: 3500,
    compareAtPriceCents: null,
    badge: 'Algodón 100%',
    image: `${CDN}/200000202-801c5801c6/IMG_1015.JPG.jpeg?ph=af606c0c04`,
    fallbackImage: unsplash('photo-1509631179647-0177331693ae'),
    description:
      'Hoodie con capucha en algodón pesado de máxima suavidad y abrigo. Icono de la colección Resiliencia.',
    sizes: ALL_SIZES,
  },
];
