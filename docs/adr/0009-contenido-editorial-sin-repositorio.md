# 0009: El repositorio es solo para el catálogo; el contenido editorial se importa directo

- **Estado:** aceptada (noviembre 2026). Precisa el alcance de la [0002](0002-catalogo-con-repositorio.md), no la reemplaza.

## Contexto

- La ADR 0002 pone el **catálogo** (productos y colecciones) detrás de `src/lib/repositories/product-repository.ts`, para que migrar a una base de datos o a un CMS no toque componentes.
- La documentación (README, CLAUDE.md, CONTRIBUTING) generalizó la regla a todo `src/data`: «la UI lee el contenido solo vía el repositorio». En la práctica, páginas, secciones y features importan directamente los textos, la FAQ, la galería, los servicios, los envíos, la guía de tallas y los estados de Venezuela.
- Ninguna herramienta comprobaba la regla, así que la documentación y el código se fueron separando.

## Decisión

- **Catálogo:** `src/data/products.ts` y `src/data/collections.ts` solo se leen a través de `product-repository.ts` (API asíncrona y validada con Zod, ADR 0002).
- **Contenido editorial:** `copy`, `faq`, `gallery`, `services`, `shipping`, `size-guide` y `venezuela-states` se importan directamente de `src/data`. Son textos y listas estáticas y tipadas, sin planes de moverlos a una base de datos.
- Dentro de `src/data` los módulos pueden usarse entre sí (por ejemplo, la FAQ deriva del catálogo la nota de piezas al mayor). Los tests pueden importar los datos en crudo para validarlos.
- `tests/architecture.test.ts` falla si un archivo de la app fuera de `src/lib/repositories/` o `src/data/` importa `@/data/products` o `@/data/collections` (con alias o ruta relativa).
- **Excepciones:** se listan una a una en `ALLOWED_FILES` del test, con su motivo. Hoy hay una:
  - `src/features/seo/og-image.ts` (llega con el PR de SEO): la imagen para compartir del sitio se calcula de forma síncrona porque la usa `pageMetadata()` para la metadata estática de las páginas, y lee el nombre de la primera colección. Cuando esa metadata pueda ser asíncrona, debe pasar a `getCollections()` y salir de la lista.

## Consecuencias

- La documentación y el código dicen lo mismo, y la regla del catálogo se comprueba en `npm run check`.
- Migrar el catálogo sigue tocando solo el repositorio. Si entonces la FAQ debe seguir derivando datos del catálogo, esa nota pasará a calcularse en la página a través del repositorio.
- Si algún día el contenido editorial se edita desde un CMS, hará falta su propio repositorio y un ADR nuevo.
