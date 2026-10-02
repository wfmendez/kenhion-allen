import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';
import { products } from './products';
import { shippingCarriersText } from './shipping';

export interface FaqItem {
  question: string;
  answer: string;
}

const wholesalePercent = Math.round(WHOLESALE.rate * 100);

// Productos que suman más de una pieza al mayor (hoy, el conjunto biker + top).
const multiPieceNote = products
  .filter((p) => p.wholesaleUnits > 1)
  .map((p) => ` Cada ${p.name.toLowerCase()} cuenta como ${p.wholesaleUnits} piezas.`)
  .join('');

export const faq: FaqItem[] = [
  {
    question: '¿Realizan envíos a toda Venezuela desde Maracay?',
    answer: `Sí, realizamos envíos nacionales seguros a través de las agencias de encomienda ${shippingCarriersText} hacia cualquier estado de Venezuela. En la ciudad de Maracay contamos con entregas personales y servicio de delivery.`,
  },
  {
    question: `¿Cómo funciona el descuento al mayor (${wholesalePercent}% OFF)?`,
    answer: `Al acumular ${WHOLESALE.minQty} o más piezas en tu cesta de compras (pueden ser de la misma referencia o combinadas), el sistema calcula automáticamente un ${wholesalePercent}% de descuento al mayor en el subtotal de tu pedido.${multiPieceNote}`,
  },
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer:
      'Aceptamos pagos electrónicos mediante Pago Móvil, transferencias bancarias en Bolívares (Banesco / Mercantil), pagos por Binance y efectivo en USD / divisas para entregas en Maracay.',
  },
  {
    question: '¿Cómo solicito una prenda personalizada o asesoría de moda?',
    answer: `Puedes agendar tu servicio directamente a través de nuestro WhatsApp oficial ${siteConfig.contact.whatsappDisplay}. Nuestro equipo de diseño te orientará con ideas, tallaje y combinaciones exclusivas.`,
  },
];
