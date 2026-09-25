import { CURRENCY } from '@/config/business';

/** Todo el dinero se maneja en centavos enteros; solo se convierte a texto al mostrarlo. */
export type Cents = number;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
});

/** 2550 → "$25.50" */
export function formatUSD(cents: Cents): string {
  return formatter.format(cents / 100);
}

/** Aplica un porcentaje (0.15 = 15%) y redondea al centavo más cercano. */
export function percentOf(cents: Cents, rate: number): Cents {
  return Math.round(cents * rate);
}
