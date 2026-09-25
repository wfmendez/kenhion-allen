import { Great_Vibes, Inter, Montserrat } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

/**
 * Fuente script PROVISIONAL. La oficial es Sloop Script Pro (licencia pendiente).
 * Al tener los .woff2, reemplazar por:
 *   import localFont from 'next/font/local';
 *   export const brandScript = localFont({
 *     src: './fonts/SloopScriptPro-Regular.woff2',
 *     variable: '--font-brand-script',
 *     display: 'swap',
 *   });
 */
export const brandScript = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-brand-script',
  display: 'swap',
});

export const fontVariables = [inter.variable, montserrat.variable, brandScript.variable].join(' ');
