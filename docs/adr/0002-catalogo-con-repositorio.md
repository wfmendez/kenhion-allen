# 0002: Catálogo en archivos locales detrás de un repositorio

- **Estado:** aceptada (septiembre 2026)

## Contexto

Son 10 productos que cambian poco y no hay presupuesto ni necesidad inmediata de una base de datos o un CMS. Pero se espera crecer: más productos, panel de administración e inventario.

## Decisión

- Productos y colecciones viven en `src/data/*.ts` y se validan con **Zod** (`src/lib/schemas`).
- La UI accede **solo** a través de `src/lib/repositories/product-repository.ts`, cuya API es **asíncrona** (`getProducts`, `getProductBySlug`, …) aunque hoy lea archivos.

## Consecuencias

- Un dato inválido (slug repetido, precio negativo) rompe los tests y el build, no la tienda en producción.
- Migrar a Supabase o a un CMS implica reescribir el repositorio, no los componentes.
- Mientras tanto, editar el catálogo requiere un commit (ver CONTRIBUTING.md).
