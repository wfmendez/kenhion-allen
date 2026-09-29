## Qué cambia y por qué

<!-- Resumen en 2-4 líneas. Enlaza el issue o la nota del cliente si existe. -->

## Cómo se verificó

- [ ] `npm run check` (tipos, lint, formato, tests)
- [ ] `npm run build` y `npm run test:e2e`
- [ ] Revisado en el preview de Vercel (escritorio y móvil)

## Checklist

- [ ] Sin textos de marca, precios ni reglas de negocio escritos a mano en componentes (van en `src/config` o `src/data`)
- [ ] Colores nuevos agregados a `src/styles/tokens.ts` (el test de contraste debe pasar)
- [ ] Si cambia una decisión de arquitectura, se agregó un ADR en `docs/adr/`
