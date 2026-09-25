import type { Size } from '@/config/business';

export interface SizeGuideRow {
  size: Size;
  label: string;
  chestCm: string;
  waistCm: string;
  hipCm: string;
  lengthCm: string;
}

/** Medidas en centímetros. Pendiente de validación con el cliente. */
export const sizeGuide: SizeGuideRow[] = [
  {
    size: 'S',
    label: 'Small',
    chestCm: '86 - 92',
    waistCm: '70 - 76',
    hipCm: '90 - 96',
    lengthCm: '68',
  },
  {
    size: 'M',
    label: 'Medium',
    chestCm: '93 - 100',
    waistCm: '77 - 84',
    hipCm: '97 - 104',
    lengthCm: '71',
  },
  {
    size: 'L',
    label: 'Large',
    chestCm: '101 - 108',
    waistCm: '85 - 92',
    hipCm: '105 - 112',
    lengthCm: '74',
  },
  {
    size: 'XL',
    label: 'Extra Large',
    chestCm: '109 - 116',
    waistCm: '93 - 100',
    hipCm: '113 - 120',
    lengthCm: '77',
  },
];
