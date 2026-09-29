# Kenhion Allen: tienda online

Sitio y tienda online de **Kenhion Allen**, marca de ropa elegante de Maracay, Venezuela.
Eslogan: **"Más allá del límite"**.

Producción: https://kenhion-allen.vercel.app

## Qué hace

- Catálogo multipágina: colecciones **KA ELITE**, **Resiliencia** y **P.O.D.**, con filtros en la URL.
- Ficha por producto con tallas, cantidad y pedido por docena.
- Cesta persistente con **15% de descuento al mayor** a partir de 12 prendas.
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

Copia `.env.example` a `.env.local` si necesitas fijar `NEXT_PUBLIC_SITE_URL`. En Vercel se usa el dominio de producción automáticamente.

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

## Estructura

```
src/
  app/          Rutas (App Router): /, /tienda, /producto/[slug], /carrito, /checkout, …
  config/       site.ts (marca, contacto, eslogan), business.ts (tallas, mayoreo, envíos, pagos), navigation.ts
  data/         Contenido: productos, colecciones, FAQ, galería, guía de tallas, servicios, estados
  lib/          Utilidades sin UI: esquemas Zod, repositorio del catálogo, dinero, rutas, JSON-LD
  features/     Funcionalidades: cart, catalog, checkout, invoice, product, search, gallery, faq, size-guide
  components/   UI reutilizable (ui/) y layout (header, footer, logo)
  sections/     Bloques de página (hero, colecciones, servicios…)
  styles/       Tokens de color, fuentes y CSS global (Tailwind)
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

## Documentación

- [docs/brand.md](docs/brand.md): identidad de marca, colores, tipografía y pendientes del cliente.
- [docs/adr/](docs/adr/): decisiones de arquitectura.
- [CONTRIBUTING.md](CONTRIBUTING.md): cómo trabajar en el proyecto (ramas, commits, agregar productos).

## Problemas conocidos

- **Windows con Application Control:** si una política de seguridad bloquea `@next/swc-win32-x64-msvc`, Turbopack no arranca (`npm run dev` y `npm run build` fallan con "native bindings are not available"). Usa `npm run build:webpack` y `npm start`, o pide una excepción para esa carpeta. Vercel y GitHub Actions no están afectados.
