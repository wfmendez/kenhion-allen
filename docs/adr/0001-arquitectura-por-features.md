# 0001: Arquitectura por features con App Router

- **Estado:** aceptada (septiembre 2026)

## Contexto

La v2 era una sola página cliente de ~1140 líneas: datos, reglas de negocio y UI mezclados, sin tests. Había bugs por mutación de estado y cualquier cambio tocaba todo el archivo.

## Decisión

- Next.js App Router, una ruta por página (`/tienda`, `/producto/[slug]`, `/checkout`, …).
- **Server Components por defecto**; componentes cliente solo para interacción (carrito, filtros, formularios, modales).
- Código organizado **por funcionalidad** en `src/features/<feature>`: cada una con su lógica pura (`*.ts`), sus componentes y sus tests.
- `src/config` (reglas y marca), `src/data` (contenido), `src/lib` (utilidades sin UI), `src/components` (UI genérica) y `src/sections` (bloques de página).
- Carrito en un store externo consumido con `useSyncExternalStore`: sin desajustes de hidratación y sincronizado entre pestañas.

## Consecuencias

- Las fichas de producto se generan estáticamente (SSG) y el catálogo se renderiza en el servidor.
- La lógica se prueba sin navegador; la UI se prueba con Playwright.
- Agregar una funcionalidad es agregar una carpeta, no editar un archivo gigante.
