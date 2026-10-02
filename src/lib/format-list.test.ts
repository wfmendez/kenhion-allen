import { formatList } from './format-list';

describe('formatList', () => {
  it('une con comas y "y" al final', () => {
    expect(formatList(['MRW', 'Zoom', 'Tealca', 'T-envíos'])).toBe('MRW, Zoom, Tealca y T-envíos');
    expect(formatList(['Delivery', 'entrega personal'])).toBe('Delivery y entrega personal');
  });

  it('funciona con uno o ningún elemento', () => {
    expect(formatList(['MRW'])).toBe('MRW');
    expect(formatList([])).toBe('');
  });
});
