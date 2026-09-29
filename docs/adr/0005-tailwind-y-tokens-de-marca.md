# 0005: Tailwind v4 con tokens de marca y contraste verificado

- **Estado:** aceptada (septiembre 2026)

## Contexto

La v2 tenía ~2360 líneas de CSS global. La nueva identidad (fondo negro, rojo `#C74646`, dorado `#D4AF37`) tenía que aplicarse de forma consistente y accesible.

## Decisión

- Tailwind CSS v4 con los colores declarados en `@theme` (`src/styles/globals.css`).
- `src/styles/tokens.ts` es la fuente de verdad. `tokens.test.ts` falla si el CSS se desincroniza o si un par de texto/fondo en uso no cumple WCAG AA.
- Tokens derivados donde los colores del cliente no alcanzan AA:
  - `on-accent` (blanco puro sobre rojo)
  - `red-light` (errores sobre negro)
  - `whatsapp` (verde oscurecido)

## Consecuencias

- Cambiar un color de marca es editar dos líneas, y los tests avisan si rompe la accesibilidad.
- El rojo exacto del cliente sobre negro queda para texto grande y elementos decorativos (4.4:1).
