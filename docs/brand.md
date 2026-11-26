# Identidad de marca: Kenhion Allen v3

Guía viva en el sitio: `/dev/design` (disponible en desarrollo y en los previews de Vercel; oculta en producción).

## Eslogan

**"Más allá del límite"**. Es el único eslogan oficial y se configura en `src/config/site.ts`.
Las frases anteriores ("Proyecta la grandeza que llevas dentro", "Elegante y Trascendente") quedaron retiradas.

## Colores

Fuente de verdad: `src/styles/tokens.ts`. `src/styles/globals.css` repite los valores en `@theme`, y `tokens.test.ts` falla si los dos archivos se desincronizan o si algún par de texto/fondo no cumple el contraste mínimo.

| Token       | Valor     | Uso                                                                 |
| ----------- | --------- | ------------------------------------------------------------------- |
| `ink`       | `#0A0A0B` | Fondo principal (negro)                                             |
| `gold`      | `#D4AF37` | Dorado del cliente: emblema, precios, botones principales, detalles |
| `red`       | `#C74646` | Rojo del cliente: badges, ofertas, barra superior, divisores        |
| `red-light` | `#E27A7A` | Texto pequeño en rojo sobre negro (errores)                         |
| `on-accent` | `#FFFFFF` | Texto sobre rojo o sobre el verde de WhatsApp                       |
| `whatsapp`  | `#147A41` | Botón de WhatsApp (verde oscurecido para cumplir AA)                |

Reglas de accesibilidad (WCAG AA):

- `#C74646` sobre negro da 4.4:1. Solo se usa en texto grande (≥ 24px) o en elementos decorativos.
- Sobre rojo va siempre blanco puro: el gris claro `#F5F5F4` da 4.38:1 y no alcanza AA.
- El dorado sobre negro (8.4:1) sirve para cualquier tamaño de texto.

## Tipografía

| Rol                                     | Fuente                                          | Token          |
| --------------------------------------- | ----------------------------------------------- | -------------- |
| Marca (eslogan y titulares decorativos) | **Sloop Script Pro** (provisional: Great Vibes) | `font-script`  |
| Títulos, botones, etiquetas             | Montserrat                                      | `font-display` |
| Texto                                   | Inter                                           | `font-sans`    |

La fuente script se usa solo en el nombre, el eslogan y los titulares decorativos. No se usa en párrafos.

### Pendiente: licencia de Sloop Script Pro

Hay que comprar la licencia **Web** (webfont), no solo la Desktop. Un peso (Regular o Medium) es suficiente.

- Type Network (distribuidor oficial): https://store.typenetwork.com/foundry/liptonletterdesign/fonts/sloop-script-pro
- MyFonts: https://www.myfonts.com/collections/sloop-script-pro-font-lipton-letter-design
- I Love Typography: https://fonts.ilovetypography.com/fonts/richardlipton/sloop-script-pro

Con el archivo `.woff2` en mano, se reemplaza `brandScript` en `src/styles/fonts.ts` usando `next/font/local`. El comentario del archivo tiene el código listo.

Las imágenes para compartir (`src/features/seo/`) dibujan el eslogan con la misma script, pero el generador no lee `.woff2`: al comprar la licencia, pedir también el archivo **TTF u OTF**, reemplazar `src/assets/og/GreatVibes-Regular.ttf` y subir `OG_DESIGN_VERSION` (ADR 0008).

## Logo

- **Referencias oficiales** (recibidas en octubre de 2026): `docs/brand/referencias/logo-blanco-sobre-negro.jpg` y `logo-dorado-sobre-rojo.jpg`.
- **Trazos:** `src/components/layout/emblem-paths.ts`, medidos sobre la referencia en blanco y negro. Es la única fuente del dibujo: la usan `brand-emblem.tsx`, el comprobante PDF, las imágenes para compartir, el apple-touch-icon y `scripts/generate-favicon.mjs` (favicon.ico y `public/images/marca/emblema-*.png`). Si cambia, hay que correr ese script y actualizar `src/app/icon.svg` a mano.
- `BrandEmblem` usa `currentColor` (dorado sobre negro, dorado claro sobre rojo, negro sobre blanco). `weight="official"` respeta el grosor original y es para tamaños grandes; por defecto el trazo es más grueso para que se lea en iconos pequeños.
- **Pendiente:** el logo en vector (.SVG/.AI/.PDF) para reemplazar el redibujado.

## Pendientes del cliente

No se inventan: hasta recibirlos, el sitio y los datos estructurados los omiten.

- Logo en vector (.SVG/.AI/.PDF) y licencia de Sloop Script Pro (ver arriba).
- RIF y dirección fiscal de la tienda, y datos de pago.
- Validación de la guía de tallas y de los colores disponibles por prenda.
- Costos y tiempos de envío.
- Política de cambios y devoluciones.
- Redes sociales oficiales (irían en `sameAs` del JSON-LD).
- Dirección y horario, si hay local físico (permitirían pasar de `OnlineStore` a `ClothingStore`).
- Si «KA» es un nombre alternativo de la marca (`alternateName`).
- Aprobación de la descripción de la home para buscadores y redes: «Ropa deportiva de compresión KA ELITE en Maracay, Venezuela. Envíos a toda Venezuela y 15% de descuento al mayor desde 6 piezas.» (`homeDescription` en `src/lib/seo/metadata.ts`).
