# Cómo contribuir

## Flujo de trabajo

1. Crea una rama desde `main`: `feat/…`, `fix/…`, `chore/…` o `docs/…`.
2. Haz commits pequeños con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat: …`, `fix: …`). Commitlint lo valida.
3. Antes de abrir el PR: `npm run check` y, si tocaste UI o flujos, `npm run build && npm run test:e2e`.
4. Abre el PR contra `main`. CI y el preview de Vercel deben quedar en verde.
5. Al mergear, Vercel publica en producción.

Los hooks de git (husky + lint-staged) formatean y revisan los archivos en cada commit.

## Tareas frecuentes

### Agregar o editar un producto

1. Edita `src/data/products.ts`:
   - `id` único y `slug` único en kebab-case (será la URL `/producto/<slug>`).
   - `collection`: `ka-elite`, `resiliencia` o `pod`.
   - `priceCents` en **centavos** (`2500` = $25.00). `compareAtPriceCents` (precio anterior) debe ser mayor, o `null`.
   - `image` y `fallbackImage` con URLs completas. Si el dominio de la imagen es nuevo, agrégalo en `next.config.ts` → `images.remotePatterns`.
2. Corre `npm test`: el esquema Zod valida todo el catálogo y los tests fallan si algo está mal (slug repetido, precio inválido, etc.).
3. La página del producto, el sitemap y los datos estructurados se generan solos.

### Agregar una colección

1. Agrega el slug a `collectionSlugSchema` en `src/lib/schemas/product.ts`.
2. Agrega la colección en `src/data/collections.ts` y el enlace en `src/config/navigation.ts` (`collectionNav`).
3. Actualiza `countByCollection` en `src/features/catalog/filter-products.ts`.

### Cambiar reglas de negocio

Todo está en `src/config/business.ts`: tallas, mínimo y porcentaje del descuento al mayor, agencias de envío y métodos de pago. Textos, carrito, WhatsApp y comprobante PDF se actualizan solos.

### Cambiar datos de la marca

`src/config/site.ts`: nombre, **eslogan**, WhatsApp, correo y ubicación.

### Agregar un color

1. Agrégalo en `src/styles/tokens.ts` (con descripción) y en `@theme` de `src/styles/globals.css`.
2. Si se usará como texto sobre un fondo, agrega el par a `contrastPairs`. El test exige contraste WCAG AA.

## Principios de código

- **Server Components por defecto.** Usa `'use client'` solo para estado, eventos o APIs del navegador.
- **Lógica pura aparte de la UI:** reducers, precios, filtros, mensajes y creación de pedidos son funciones `.ts` con tests.
- **Datos solo a través del repositorio** (`src/lib/repositories`). Así, migrar a una base de datos no toca componentes.
- **URLs con `src/lib/routes.ts`**, nunca escritas a mano.
- **Accesibilidad:** controles nativos (`<button>`, `<dialog>`, `<details>`, radios), etiquetas asociadas y contraste AA. Los E2E corren axe en cada página.
- **Privacidad:** los datos del cliente no se guardan en `localStorage` ni se envían a servidores (ver ADR 0004).

## Decisiones de arquitectura

Si cambias algo estructural (almacenamiento, pagos, backend, librerías base), agrega un ADR en `docs/adr/` con el formato de los existentes.
