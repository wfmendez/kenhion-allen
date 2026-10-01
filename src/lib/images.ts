/**
 * Calidad de compresión para las fotos que el cliente mira de cerca (producto, hero, galería).
 * El valor debe estar en `images.qualities` de next.config.ts. Las miniaturas usan el 75 por defecto.
 */
export const PHOTO_QUALITY = 90;

/**
 * Ancho real de la tarjeta de producto según el número de columnas de la grilla en pantallas
 * grandes (contenedor de 1280px). Si `sizes` no coincide con el ancho real, el navegador pide
 * una imagen más pequeña de lo necesario y la foto se ve blanda.
 */
export function productCardSizes(columnsAtXl: 3 | 4): string {
  const xl = columnsAtXl === 3 ? '400px' : '300px';
  return `(min-width: 1280px) ${xl}, (min-width: 768px) 33vw, 50vw`;
}
