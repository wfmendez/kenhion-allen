# 0008: Dominio canónico, imágenes para compartir y datos estructurados

- **Estado:** aceptada (noviembre 2026)

## Contexto

- La tienda estrenó el dominio **kenhionallen.com**. El build de producción anterior tomó la URL de `VERCEL_PROJECT_PRODUCTION_URL` cuando el dominio todavía no existía: canonical, og:image, sitemap, robots y JSON-LD quedaron apuntando a `kenhion-allen.vercel.app`, que ahora responde 404. Al compartir un enlace no salía imagen y Google veía canónicas rotas.
- La imagen para compartir usaba la fuente por defecto de next/og, sin foto, y las fichas compartían la foto vertical del producto (hasta ~550 KB, 2:3) y perdían og:site_name, og:locale y og:type, porque Next reemplaza el `openGraph` del layout cuando una página define el suyo.
- Google Search no acepta SVG como favicon, y el sitio solo tenía `icon.svg`.

## Decisión

### Dominio

- `https://kenhionallen.com` (sin www) es el dominio canónico y está fijo en `src/config/site.ts` como `PRODUCTION_URL`.
- Orden de resolución de `siteConfig.url`: `NEXT_PUBLIC_SITE_URL` (sobrescritura opcional) → cualquier `next build` (`NODE_ENV=production`) usa el dominio real → en `next dev` y en los tests, `http://localhost:3006`. Ya no se leen `VERCEL_PROJECT_PRODUCTION_URL` ni `VERCEL_URL`.
- En el build de producción de Vercel (`VERCEL_ENV=production`), una `NEXT_PUBLIC_SITE_URL` que no sea https, o que sea localhost o `*.vercel.app`, hace fallar el build: es preferible a publicar otra vez canónicas e imágenes rotas.
- El build local también usa el dominio real a propósito: el artefacto que prueban los E2E es idéntico al que se despliega, y `e2e/seo.spec.ts` exige que canonical, og:url, sitemap y JSON-LD digan exactamente kenhionallen.com. Eso habría detectado el fallo en CI. Lighthouse no penaliza una canónica a otro dominio (solo comprueba que no apunte a la raíz por error).
- `www.kenhionallen.com` debe redirigir con 308 al dominio canónico. Se configura fuera del código: registro `CNAME` `www` en el DNS y redirección en Vercel → Domains (pasos en el README). En noviembre de 2026 `www` todavía no tiene registro DNS y `kenhion-allen.vercel.app` responde 404; nada del sitio enlaza ya a ninguno de los dos.
- Las previsualizaciones (`VERCEL_ENV` = `preview` o `development`) llevan `noindex` en el layout y su robots.txt no declara sitemap. Vercel ya envía `X-Robots-Tag: noindex` en `*.vercel.app`, pero no si a una rama se le asigna un dominio propio. Heredan la canónica de producción, también en og:image: si un PR añade un producto o cambia una tarjeta, la vista previa del enlace del preview apunta a `kenhionallen.com/og/…` y no muestra la imagen nueva hasta el merge. Se acepta: los previews están protegidos con Vercel Authentication, así que las redes tampoco podrían descargar una imagen servida desde el preview.
- robots.txt solo bloquea `/dev/`. Carrito y checkout llevan `noindex` en su metadata, y Google no podría leerlo si robots.txt los bloqueara.

### Metadata e imágenes para compartir

- Cada página indexable usa `pageMetadata` (`src/lib/seo/metadata.ts`): canonical igual a og:url y el Open Graph completo (tipo, idioma, sitio e imagen). El og:title va sin el sufijo «| Kenhion Allen».
- Las imágenes son JPEG 1200x630 generadas en el build por Route Handlers (`/og/sitio`, `/og/tienda`, `/og/coleccion/[coleccion]`, `/og/producto/[slug]`) con next/og y convertidas a JPEG con sharp (dependencia directa en `package.json`, la misma versión que Next usa para optimizar las fotos). Pesan 41-56 KB, frente a los 600 KB que admite WhatsApp. Usan Montserrat y Great Vibes en TTF (`src/assets/og/`, licencia OFL).
- Su URL lleva `?v=<huella>`: un hash FNV-1a de todo lo que se dibuja (nombre, precio, mayoreo, eslogan…), del **contenido** de cada foto (sha256 del archivo, así que también cambia si se reemplaza una foto con el mismo nombre), de los colores de `tokens.ts` y de los trazos del emblema. Si algo de eso cambia, cambia la URL y WhatsApp y Facebook descargan la imagen nueva; por eso se sirven con `Cache-Control: immutable` de un año. La huella de cada foto se lee en el servidor (`photo-digest.ts`); como `/tienda` y `/tienda/[coleccion]` son dinámicas (filtros en la URL), Next incluye `public/images/` en su función (hoy ~9 MB), lo que se acepta a cambio de que la URL siga al contenido. **Al cambiar el diseño** (`og-cards.tsx`) o las fuentes de `src/assets/og/` hay que subir `OG_DESIGN_VERSION` en `og-image.ts`.
- El layout, el manifest y `OnlineStore.description` usan la misma descripción que la home (`homeDescription`). `siteConfig.description` queda solo en el pie de página, pendiente de que el cliente apruebe el texto.
- Favicon en ICO (48/32/16) y emblema en PNG 192/512, generados con `scripts/generate-favicon.mjs` y versionados; `apple-icon.tsx` y `manifest.ts` los completan. `icon.svg` se mantiene para los navegadores.

### Datos estructurados

- La home publica un grafo con `WebSite` (Google lo usa para el nombre del sitio) y `OnlineStore`. Se usa `OnlineStore` y no `ClothingStore` porque este es un `LocalBusiness` y presupone un local físico con dirección, que el cliente no ha dado.
- `Product` sin `color` (para Google es el color de un solo artículo), con todas las fotos, público sugerido, categoría de la taxonomía de Google e `itemCondition`.
- No se publican datos pendientes del cliente: dirección exacta, horarios, redes sociales (`sameAs`), reseñas, costos de envío (`shippingDetails`), política de devoluciones (`hasMerchantReturnPolicy`) ni `priceValidUntil`. Un test lo comprueba en la home y en cada producto. Search Console mostrará avisos (no errores) en «Fichas de comerciante» por esos campos: son esperables.
- El sitemap no lleva `lastmod`: no hay una fecha fiable de cambio. Sí incluye las fotos de todos los colores de cada producto.

## Consecuencias

- El dominio ya no depende de variables de Vercel. Cambiar de dominio es cambiar `PRODUCTION_URL` (y los E2E lo comprueban).
- Si se define `NEXT_PUBLIC_SITE_URL` en `.env.local`, los E2E de dominio fallan a propósito.
- Las imágenes para compartir se regeneran en cada build; no hay que subirlas a mano.
- Cuando llegue Sloop Script Pro hay que pedirla también en TTF u OTF para las imágenes (next/og no lee `.woff2`).
- Cuando el cliente confirme local físico, redes o políticas, se amplían `homeJsonLd` y `productJsonLd`.
- Tras mergear el PR de estilo (que añade `WHOLESALE_PERCENT` en `business.ts`), usar esa constante en `metadata.ts` y `og-cards.tsx` en vez de recalcular el porcentaje.
