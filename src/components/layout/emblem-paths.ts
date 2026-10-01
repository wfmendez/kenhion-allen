/**
 * Trazos del emblema de Kenhion Allen, medidos sobre el logo oficial
 * (docs/brand/referencias/logo-blanco-sobre-negro.jpg):
 * - Un rombo de cuatro arcos que nacen tangentes a la vertical en las puntas superior e inferior.
 * - Un arco a cada lado que toca el vértice lateral del rombo (lectura de doble "K").
 *
 * Única fuente del dibujo: lo usan el componente React, el comprobante PDF,
 * la imagen Open Graph y el favicon (src/app/icon.svg repite estos valores a mano).
 * Cuando el cliente envíe el vector original, se reemplazan aquí.
 */
export const EMBLEM_VIEWBOX = '0 0 100 120';

export const EMBLEM_PATHS = [
  // Rombo
  'M 50 6.6 Q 50 36.4 25.3 60 Q 50 83.6 50 113.4 Q 50 83.6 74.7 60 Q 50 36.4 50 6.6 Z',
  // Arco izquierdo
  'M 18.9 32.7 Q 29 60 18.9 87.3',
  // Arco derecho
  'M 81.1 32.7 Q 71 60 81.1 87.3',
] as const;

/** Grosor del trazo en el logo oficial (proporción medida: ~3.2% del alto). */
export const EMBLEM_STROKE_OFFICIAL = 3.5;

/** Grosor para tamaños pequeños (header, favicon, PDF): más grueso para que se lea. */
export const EMBLEM_STROKE_SMALL = 5;
