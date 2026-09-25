import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colors, contrastPairs, contrastRatio } from './tokens';

describe('tokens de diseño', () => {
  it('globals.css declara exactamente los colores de tokens.ts', () => {
    const css = readFileSync(join(__dirname, 'globals.css'), 'utf8');
    const declared = Object.fromEntries(
      [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [
        name,
        value!.toLowerCase(),
      ]),
    );
    expect(declared).toEqual(colors);
  });

  it('respeta los colores exactos pedidos por el cliente', () => {
    expect(colors.red).toBe('#c74646');
    expect(colors.gold).toBe('#d4af37');
  });

  it.each(contrastPairs)('$use: $fg sobre $bg ≥ $min:1', ({ fg, bg, min }) => {
    expect(contrastRatio(colors[fg], colors[bg])).toBeGreaterThanOrEqual(min);
  });

  it('calcula el contraste WCAG correctamente', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBe(1);
  });
});
