import type { NextConfig } from 'next';

/** Productos y colecciones del catálogo anterior: sus enlaces viejos llevan a la tienda. */
const RETIRED_PRODUCT_SLUGS = [
  'crop-top-de-compresion',
  'biker-de-compresion',
  'shorts-ka-elite',
  'franela-de-compresion',
  'sudadera-ka-elite',
  'basic-t-shirt-oversize',
  'girl-shorts-resiliencia',
  'shorts-resiliencia',
  't-shirt-oversize-resiliencia',
  'hoodie-resiliencia',
];
const RETIRED_COLLECTION_SLUGS = ['resiliencia', 'pod'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF conserva más detalle que WebP con el mismo peso; WebP queda como respaldo.
    formats: ['image/avif', 'image/webp'],
    // 90 para fotos de producto y galería (PHOTO_QUALITY); 75 para miniaturas.
    qualities: [75, 90],
  },
  async redirects() {
    // Temporales (307): esas colecciones pueden volver más adelante.
    return [
      ...RETIRED_PRODUCT_SLUGS.map((slug) => ({
        source: `/producto/${slug}`,
        destination: '/tienda',
        permanent: false,
      })),
      ...RETIRED_COLLECTION_SLUGS.map((slug) => ({
        source: `/tienda/${slug}`,
        destination: '/tienda',
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
