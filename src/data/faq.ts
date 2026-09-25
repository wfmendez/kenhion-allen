import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';

export interface FaqItem {
  question: string;
  answer: string;
}

const wholesalePercent = Math.round(WHOLESALE.rate * 100);

export const faq: FaqItem[] = [
  {
    question: '¿Realizan envíos a toda Venezuela desde Maracay?',
    answer:
      'Sí, realizamos envíos nacionales seguros a través de las agencias de encomienda MRW, Zoom y Tealca hacia cualquier estado de Venezuela. En la ciudad de Maracay contamos con entregas personales y servicio de delivery.',
  },
  {
    question: `¿Cómo funciona el Descuento Al Mayor por docena (${wholesalePercent}% OFF)?`,
    answer: `Al acumular ${WHOLESALE.minQty} o más prendas en tu cesta de compras (pueden ser de la misma referencia o combinadas entre colecciones), el sistema calcula automáticamente un ${wholesalePercent}% de descuento al mayor en el subtotal de tu pedido.`,
  },
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer:
      'Aceptamos pagos electrónicos mediante Pago Móvil, transferencias bancarias en Bolívares (Banesco / Mercantil), transferencias internacionales vía Zelle y efectivo en USD / divisas para entregas en Maracay.',
  },
  {
    question: '¿Cómo solicito una prenda personalizada o asesoría de moda?',
    answer: `Puedes agendar tu servicio directamente a través de nuestro WhatsApp oficial ${siteConfig.contact.whatsappDisplay}. Nuestro equipo de diseño te orientará con ideas, tallaje y combinaciones exclusivas.`,
  },
];
