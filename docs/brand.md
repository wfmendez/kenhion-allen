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

## Logo

- `src/components/layout/brand-emblem.tsx`: el emblema usa `currentColor` (dorado sobre negro, dorado claro sobre rojo, negro sobre blanco).
- **Pendiente:** pedir al cliente el logo en vector (.SVG/.AI/.PDF) y las imágenes de referencia, y reemplazar los trazos provisionales.
