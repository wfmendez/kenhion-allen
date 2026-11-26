# Kenhion Allen: tienda online

Sitio y tienda online de **Kenhion Allen**, marca de ropa elegante de Maracay, Venezuela.
Eslogan: **"Más allá del límite"**.

Producción: https://kenhionallen.com

## Qué hace

- Catálogo multipágina de la colección **KA ELITE** (short, franela de compresión y conjunto biker + top), con filtros en la URL.
- Ficha por producto con selector de **color** y talla, cantidad y pedido al mayor.
- Cesta persistente con **15% de descuento al mayor** a partir de 6 piezas.
- **Checkout** con datos del cliente y **comprobante de pedido en PDF** (no fiscal).
- Pedido enviado por **WhatsApp**. No hay pasarela de pago: el pago se coordina por chat.

## Stack

| Área        | Herramienta                                                  |
| ----------- | ------------------------------------------------------------ |
| Framework   | Next.js 16 (App Router) + React 19                           |
| Lenguaje    | TypeScript estricto                                          |
| Estilos     | Tailwind CSS v4 con tokens de marca (`src/styles/tokens.ts`) |
| Validación  | Zod (catálogo, carrito, cliente, pedido)                     |
| Formularios | react-hook-form                                              |
| PDF         | @react-pdf/renderer (se genera en el navegador)              |
| Tests       | Vitest + Testing Library · Playwright + axe · Lighthouse CI  |
| Deploy      | Vercel (preview por PR, producción desde `main`)             |

## Empezar

Requisitos: Node 24 (ver `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:3006
```

No hace falta ninguna variable de entorno. La URL pública sale de `src/config/site.ts`: `NEXT_PUBLIC_SITE_URL` si se define, si no `https://kenhionallen.com` en cualquier `next build` (Vercel, previews, CI y build local) y `http://localhost:3006` en `npm run dev` y en los tests. En Vercel ya no depende de variables (ver [ADR 0008](docs/adr/0008-dominio-canonico-y-seo.md)). `.env.example` lista las variables opcionales; si defines `NEXT_PUBLIC_SITE_URL` en `.env.local`, los E2E de dominio fallan.

## Scripts

| Script                        | Qué hace                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`                 | Servidor de desarrollo en el puerto 3006                                                             |
| `npm run build` / `npm start` | Build de producción y servidor                                                                       |
| `npm run build:webpack`       | Build con webpack (ver "Problemas conocidos")                                                        |
| `npm run check`               | Tipos + lint + formato + tests unitarios                                                             |
| `npm run test:coverage`       | Tests unitarios con cobertura (mínimo 80% en la lógica)                                              |
| `npm run test:e2e`            | Tests de punta a punta en escritorio y móvil, con auditoría de accesibilidad (requiere build previo) |

La primera vez que corras los E2E: `npx playwright install chromium`.

Si cambia el emblema o los colores de marca, regenera el favicon y los PNG del emblema con `node scripts/generate-favicon.mjs` y versiona los archivos que produce (`src/app/favicon.ico` y `public/images/marca/emblema-*.png`).

## Estructura

```
src/
  app/          Rutas (App Router): /, /tienda, /producto/[slug], /carrito, /checkout, …
  config/       site.ts (marca, contacto, eslogan), business.ts (tallas, mayoreo, envíos, pagos), navigation.ts
  data/         Contenido: productos, colecciones, FAQ, galería, guía de tallas, servicios, estados
  lib/          Utilidades sin UI: esquemas Zod, repositorio del catálogo, dinero, rutas, JSON-LD
  features/     Funcionalidades: cart, catalog, checkout, invoice, product, search, gallery, faq, size-guide
  components/   UI reutilizable (ui/) y layout (header, footer, logo)
  sections/     Bloques de página (hero, servicios, banner de mayoreo…)
  styles/       Tokens de color, fuentes y CSS global (Tailwind)
public/images/  Fotos de producto y de la marca (ver ADR 0007)
e2e/            Tests de Playwright
docs/           Marca (brand.md) y decisiones de arquitectura (adr/)
```

Reglas principales (detalle en [CONTRIBUTING.md](CONTRIBUTING.md)):

- **Server Components por defecto**; `'use client'` solo donde hay interacción.
- **La lógica de negocio es pura** (`*.ts` sin React) y tiene tests.
- **La UI nunca lee `src/data` directamente**: pasa por `src/lib/repositories/product-repository.ts`.
- **El dinero va en centavos** (`priceCents`).

## Calidad y CI

Cada PR corre en GitHub Actions (`.github/workflows/ci.yml`):

1. Tipos, lint, formato y tests unitarios con cobertura.
2. Build + Playwright (escritorio y móvil) + axe (WCAG 2.1 AA).
3. Lighthouse: accesibilidad ≥ 95 y SEO ≥ 90 son obligatorios; rendimiento y buenas prácticas generan aviso.

Dependabot abre PRs semanales de dependencias.

## SEO y vista previa al compartir

- **Dominio canónico:** `https://kenhionallen.com` (sin www), fijo en `src/config/site.ts`. Las previsualizaciones llevan `noindex`. No definas `NEXT_PUBLIC_SITE_URL` en Vercel: si apunta a localhost, a http o a `*.vercel.app`, el build de producción falla a propósito.
- **Redirigir www (pendiente, se hace fuera del código):** hoy `www.kenhionallen.com` no existe en el DNS, así que quien la escriba no llega a la tienda.
  1. En el proveedor del dominio, crea el registro `CNAME` `www` con el destino que muestre Vercel al agregar el dominio (por ejemplo `cname.vercel-dns.com`).
  2. En Vercel → Project → Settings → Domains, agrega `www.kenhionallen.com` y elige redirigir con **308** a `kenhionallen.com`.
  3. `kenhion-allen.vercel.app` hoy responde 404: si ya no está asignado al proyecto, no hace falta recuperarlo (nada lo enlaza tras este cambio). Si Vercel permite volver a agregarlo, que redirija igual a `kenhionallen.com`.
  4. Actualiza la página del repo en GitHub, que aún apunta a la URL vieja: `gh repo edit --homepage https://kenhionallen.com`.
- **Qué publica el sitio:** `/sitemap.xml` (con las fotos de cada producto), `/robots.txt`, canonical y Open Graph completo en cada página, imágenes para compartir de 1200x630 en `/og/*`, favicon ICO/PNG, `/manifest.webmanifest` y datos estructurados (WebSite + OnlineStore en la home, Product en cada ficha).
- **Registrar el dominio en buscadores:** en [Google Search Console](https://search.google.com/search-console) crea una propiedad de **dominio** para `kenhionallen.com`, verifícala con el registro TXT que te da Google en el DNS y envía `https://kenhionallen.com/sitemap.xml` en «Sitemaps». En [Bing Webmaster Tools](https://www.bing.com/webmasters) puedes importar la propiedad desde Search Console. Si prefieres verificar con etiqueta HTML, define `GOOGLE_SITE_VERIFICATION` y/o `BING_SITE_VERIFICATION` en Vercel (solo el valor de `content`) y vuelve a desplegar.
- **Imágenes para compartir:** se generan en el build (`src/features/seo/`). Su URL lleva `?v=` con una huella de lo que dibujan (datos, contenido de cada foto, colores y emblema), así que al cambiar un precio o reemplazar una foto, aunque conserve el nombre, la URL cambia sola. Si cambias el diseño (`og-cards.tsx`) o las fuentes de `src/assets/og/`, sube `OG_DESIGN_VERSION` en `og-image.ts`.
- **Refrescar la vista previa en WhatsApp y Facebook:** ambas guardan en caché la vista previa de cada enlace. En Facebook (e Instagram), tras desplegar, pega la URL en el [Sharing Debugger](https://developers.facebook.com/tools/debug/) y pulsa «Volver a extraer». WhatsApp arma la vista previa al pegar el enlace y la recuerda un tiempo: los mensajes ya enviados no cambian, pero al compartir el enlace de nuevo sale la imagen actual (su URL cambió con `?v=`). Si aun así muestra la vieja, comparte el enlace con un parámetro cualquiera, por ejemplo `https://kenhionallen.com/tienda?ref=wa`: la canónica no cambia. En X basta con publicar el enlace otra vez.
- **Comprobar tras desplegar:** `curl -s https://kenhionallen.com/sitemap.xml | grep -c vercel.app` y `curl -s https://kenhionallen.com/robots.txt | grep -c vercel.app` deben dar 0. Luego, en este orden: pasa la home y una ficha por el Sharing Debugger de Facebook («Volver a extraer»), para que WhatsApp y Facebook dejen de mostrar la vista previa vieja sin imagen; pasa las mismas URL por la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results), y envía el sitemap en Search Console.
- **Avisos esperables en Search Console:** las fichas cumplen lo obligatorio para fragmentos de producto (nombre, imagen, precio, moneda y disponibilidad). En «Fichas de comerciante» Google avisará (sin error) de que faltan `shippingDetails`, `hasMerchantReturnPolicy` y `priceValidUntil`: dependen del costo de envío y de la política de devoluciones, que el cliente aún no confirma. Cuando lo haga, se añaden en `productJsonLd` (`src/lib/structured-data.ts`).

## Documentación

- [docs/brand.md](docs/brand.md): identidad de marca, colores, tipografía y pendientes del cliente.
- [docs/adr/](docs/adr/): decisiones de arquitectura.
- [CONTRIBUTING.md](CONTRIBUTING.md): cómo trabajar en el proyecto (ramas, commits, agregar productos).

## Problemas conocidos

- **Windows con Application Control:** si una política de seguridad bloquea `@next/swc-win32-x64-msvc`, Turbopack no arranca (`npm run dev` y `npm run build` fallan con "native bindings are not available"). Usa `npm run build:webpack` y `npm start`, o pide una excepción para esa carpeta. Vercel y GitHub Actions no están afectados.
