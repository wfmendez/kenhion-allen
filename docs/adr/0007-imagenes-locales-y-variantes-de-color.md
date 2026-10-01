# 0007: Imágenes locales y productos con variantes de color

- **Estado:** aceptada (octubre 2026)

## Contexto

- El catálogo enlazaba las fotos al CDN del sitio anterior (Webnode), con respaldos de Unsplash. Si ese sitio se daba de baja, la tienda se quedaba sin imágenes.
- El cliente envió las fotos oficiales de la colección KA ELITE, que pasa a ser la única del sitio, con cada prenda en varios colores.

## Decisión

- Las imágenes viven en el repositorio, en `public/images/`, y se sirven con `next/image`. No se enlazan imágenes de otros dominios (`remotePatterns` se eliminó).
- Cada producto declara `colors`: slug, nombre, color de muestra y sus fotos. El primero es el color por defecto. `lifestyleImages` guarda las fotos en uso.
- El **color forma parte de la línea del carrito** (`productId-color-talla`) y viaja al pedido, al mensaje de WhatsApp y al comprobante PDF.
- El carrito guardado pasa a la versión 3 (`ka_cart_v3`). Los carritos anteriores se borran sin migrar, porque sus productos ya no existen.
- `wholesaleUnits` permite que un artículo sume más de una pieza para el descuento al mayor.
- Las URLs de productos y colecciones retirados redirigen a `/tienda` de forma temporal.

## Consecuencias

- El sitio ya no depende de servidores externos para mostrar productos; un test falla si falta una imagen.
- El repositorio pesa unos 9 MB más. Si el catálogo crece mucho, conviene mover las fotos a un almacenamiento (por ejemplo Vercel Blob o Supabase Storage) detrás del mismo esquema.
- Agregar un color es copiar fotos y editar `src/data/products.ts` (ver CONTRIBUTING.md).
