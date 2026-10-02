const conjunction = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' });

/** Lista en español con "y" al final: ['MRW', 'Zoom', 'Tealca'] → "MRW, Zoom y Tealca". */
export function formatList(items: readonly string[]): string {
  return conjunction.format(items);
}
