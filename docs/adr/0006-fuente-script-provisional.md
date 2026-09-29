# 0006: Fuente script provisional

- **Estado:** aceptada (septiembre 2026). Se reemplaza al tener la licencia.

## Contexto

La fuente de marca es **Sloop Script Pro** (Lipton Letter Design), comercial. Hace falta la licencia **web** y todavía no se ha comprado.

## Decisión

- Usar **Great Vibes** (Google Fonts, gratuita y de estilo similar) mediante el token `--font-script`.
- Usarla solo en el nombre, el eslogan y los titulares decorativos, nunca en párrafos.
- El reemplazo está documentado en `src/styles/fonts.ts` (`next/font/local`) y en `docs/brand.md`, con los enlaces de compra.

## Consecuencias

- El sitio puede publicarse sin esperar la licencia.
- Cambiar a la fuente oficial toca un solo archivo, más los `.woff2`.
