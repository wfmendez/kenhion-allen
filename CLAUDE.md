# Guía para agentes (Claude Code y otros)

Tienda online de Kenhion Allen (Next.js 16 App Router, React 19, TypeScript estricto, Tailwind v4). Textos de UI, commits y documentación **en español**. Eslogan único: "Más allá del límite".

## Antes de terminar una tarea

- `npm run check` debe pasar (tipos, lint, formato, tests unitarios).
- Si tocaste UI o flujos: `npm run build` (o `npm run build:webpack`, ver abajo) y `npm run test:e2e`.
- Commits en Conventional Commits. Un PR por cambio, siempre contra `main`.

## Dónde va cada cosa

- Marca, contacto y eslogan → `src/config/site.ts`. Reglas (tallas, mayoreo 12 uds / 15%, envíos, pagos) → `src/config/business.ts`. Nunca hardcodear estos valores en componentes.
- Contenido → `src/data/`. La UI lo lee **solo** vía `src/lib/repositories/product-repository.ts`.
- URLs → `src/lib/routes.ts`.
- Lógica de negocio → funciones puras `.ts` en `src/features/<feature>/` con test al lado (`*.test.ts`).
- Colores → `src/styles/tokens.ts` + `@theme` en `src/styles/globals.css`. Agrega el par a `contrastPairs` si es texto.

## Convenciones

- Server Components por defecto; `'use client'` solo si hace falta.
- Dinero en centavos (`priceCents`), formateado con `formatUSD`.
- Accesibilidad: controles nativos, `Field`/`Input`/`Select` de `src/components/ui/field.tsx`, `Modal`/`Drawer` sobre `<dialog>`. Un botón con `aria-label` debe **empezar** con su texto visible (WCAG 2.5.3).
- Los datos personales del checkout nunca van a `localStorage` ni a un servidor (ADR 0004).
- Decisiones estructurales → ADR nuevo en `docs/adr/`.

## Entorno local conocido

En la máquina de desarrollo principal (Windows), una política de Application Control puede bloquear el binario nativo de Next (`@next/swc-win32-x64-msvc`), y entonces Turbopack no arranca. Usa `npm run build:webpack` + `npm start` para verificar. CI y Vercel no están afectados.

## Pendientes del cliente (no inventar estos datos)

Logo en vector, licencia de Sloop Script Pro, RIF y dirección fiscal de la tienda, datos de pago y validación de la guía de tallas. Ver `docs/brand.md`.
