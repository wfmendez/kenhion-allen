/**
 * Paleta oficial de la marca (notas del cliente, septiembre 2026):
 * fondo negro, rojo #C74646 y detalles en dorado #D4AF37.
 *
 * Fuente de verdad de los colores. `globals.css` declara los mismos valores en `@theme`
 * y el test `tokens.test.ts` falla si ambos archivos se desincronizan o si un par
 * de texto/fondo no cumple el contraste mínimo.
 */
export const colors = {
  ink: '#0a0a0b',
  surface: '#141416',
  'surface-raised': '#1c1c1f',
  line: '#2c2c31',
  fg: '#f5f5f4',
  'fg-muted': '#a8a8b0',
  'fg-subtle': '#8a8a93',
  gold: '#d4af37',
  'gold-light': '#ecd27a',
  'gold-deep': '#a8871f',
  red: '#c74646',
  'red-deep': '#a83838',
  'red-light': '#e27a7a',
  'on-accent': '#ffffff',
  success: '#5fd08a',
  whatsapp: '#147a41',
  'whatsapp-deep': '#11683a',
} as const;

export type ColorToken = keyof typeof colors;

export const colorDescriptions: Record<ColorToken, string> = {
  ink: 'Fondo principal (negro de marca)',
  surface: 'Tarjetas, header y paneles',
  'surface-raised': 'Modales, menús y estados hover',
  line: 'Bordes y divisores sutiles',
  fg: 'Texto principal',
  'fg-muted': 'Texto secundario',
  'fg-subtle': 'Texto terciario y placeholders',
  gold: 'Dorado de marca: emblema, precios, botones principales y detalles',
  'gold-light': 'Hover del dorado y brillos del degradado',
  'gold-deep': 'Sombra del degradado dorado',
  red: 'Rojo de marca: badges, ofertas y descuento al mayor',
  'red-deep': 'Hover del rojo',
  'red-light': 'Rojo para texto pequeño sobre negro (errores): el #C74646 no llega a AA',
  'on-accent': 'Texto sobre rojo y verde WhatsApp (blanco puro: el gris claro no llega a AA)',
  success: 'Confirmaciones y descuento aplicado',
  whatsapp: 'Botón de WhatsApp (verde oscurecido para cumplir AA)',
  'whatsapp-deep': 'Hover del botón de WhatsApp',
};

/** Pares texto/fondo que la interfaz usa de verdad. Cada uno debe cumplir el mínimo indicado. */
export const contrastPairs: { fg: ColorToken; bg: ColorToken; min: number; use: string }[] = [
  { fg: 'fg', bg: 'ink', min: 4.5, use: 'Texto principal' },
  { fg: 'fg', bg: 'surface-raised', min: 4.5, use: 'Texto en modales' },
  { fg: 'fg-muted', bg: 'ink', min: 4.5, use: 'Texto secundario' },
  { fg: 'fg-muted', bg: 'surface', min: 4.5, use: 'Texto secundario en tarjetas' },
  { fg: 'fg-subtle', bg: 'surface', min: 4.5, use: 'Texto terciario en tarjetas' },
  { fg: 'gold', bg: 'ink', min: 4.5, use: 'Precios y enlaces dorados' },
  { fg: 'gold', bg: 'surface', min: 4.5, use: 'Dorado en tarjetas' },
  { fg: 'ink', bg: 'gold', min: 4.5, use: 'Botón principal (texto negro sobre dorado)' },
  { fg: 'on-accent', bg: 'red', min: 4.5, use: 'Badge rojo (texto blanco)' },
  { fg: 'on-accent', bg: 'whatsapp', min: 4.5, use: 'Botón de WhatsApp' },
  { fg: 'success', bg: 'surface', min: 4.5, use: 'Descuento aplicado' },
  { fg: 'red-light', bg: 'ink', min: 4.5, use: 'Mensajes de error' },
  { fg: 'red-light', bg: 'surface-raised', min: 4.5, use: 'Errores en modales' },
  // El rojo sobre negro no llega a 4.5: solo se permite en texto grande (>= 24px) o decoración.
  { fg: 'red', bg: 'ink', min: 3, use: 'Rojo sobre negro (solo texto grande)' },
];

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Relación de contraste WCAG 2.x entre dos colores hex. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}
