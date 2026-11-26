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
- El build local también usa el dominio real a propósito: el artefacto que prueban los E2E es idéntico al que se despliega, y `e2e/seo.spec.ts` exige que canonical, og:url, sitemap y JSON-LD digan exactamente kenhionallen.com. Eso habría detectado el fallo en CI. Lighthouse no penaliza una canónica a otro dominio (solo comprueba que no apunte a la raíz por error).
- `www.kenhionallen.com` y `kenhion-allen.vercel.app` deben redirigir con 308 al dominio canónico. Se configura en Vercel (Domains), fuera del código.
- Las previsualizaciones (`VERCEL_ENV` = `preview` o `development`) llevan `noindex` en el layout y su robots.txt no declara sitemap. Vercel ya envía `X-Robots-Tag: noindex` en `*.vercel.app`, pero no si a una rama se le asigna un dominio propio. Heredan la canónica de producción.
- robots.txt solo bloquea `/dev/`. Carrito y checkout llevan `noindex` en su metadata, y Google no podría leerlo si robots.txt los bloqueara.

### Metadata e imágenes para compartir

- Cada página indexable usa `pageMetadata` (`src/lib/seo/metadata.ts`): canonical igual a og:url y el Open Graph completo (tipo, idioma, sitio e imagen). El og:title va sin el sufijo «| Kenhion Allen».
- Las imágenes son JPEG 1200x630 generadas en el build por Route Handlers (`/og/sitio`, `/og/tienda`, `/og/coleccion/[coleccion]`, `/og/producto/[slug]`) con next/og y convertidas a JPEG con sharp (la dependencia opcional que ya trae Next). Pesan 41-56 KB, frente a los 600 KB que admite WhatsApp. Usan Montserrat y Great Vibes en TTF (`src/assets/og/`, licencia OFL).
- Su URL lleva `?v=<huella>`: un hash FNV-1a de todo lo que se dibuja (nombre, precio, foto, mayoreo, eslogan…). Si cambia un dato, cambia la URL y WhatsApp y Facebook descargan la imagen nueva. **Al cambiar el diseño** (`og-cards.tsx`) hay que subir `OG_DESIGN_VERSION` en `og-image.ts`.
- Favicon en ICO (48/32/16) y emblema en PNG 192/512, generados con `scripts/generate-favicon.mjs` y versionados; `apple-icon.tsx` y `manifest.ts` los completan. `icon.svg` se mantiene para los navegadores.

### Datos estructurados

- La home publica un grafo con `WebSite` (Google lo usa para el nombre del sitio) y `OnlineStore`. Se usa `OnlineStore` y no `ClothingStore` porque este es un `LocalBusiness` y presupone un local físico con dirección, que el cliente no ha dado.
- `Product` sin `color` (para Google es el color de un solo artículo), con todas las fotos, público sugerido, categoría de la taxonomía de Google e `itemCondition`.
- No se publican datos pendientes del cliente: dirección exacta, horarios, redes sociales (`sameAs`), costos de envío ni política de devoluciones.
- El sitemap no lleva `lastmod`: no hay una fecha fiable de cambio. Sí incluye las fotos de todos los colores de cada producto.

## Consecuencias

- El dominio ya no depende de variables de Vercel. Cambiar de dominio es cambiar `PRODUCTION_URL` (y los E2E lo comprueban).
- Si se define `NEXT_PUBLIC_SITE_URL` en `.env.local`, los E2E de dominio fallan a propósito.
- Las imágenes para compartir se regeneran en cada build; no hay que subirlas a mano.
- Cuando llegue Sloop Script Pro hay que pedirla también en TTF u OTF para las imágenes (next/og no lee `.woff2`).
- Cuando el cliente confirme local físico, redes o políticas, se amplían `homeJsonLd` y `productJsonLd`.
