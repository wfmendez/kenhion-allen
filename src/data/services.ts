import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export interface Service {
  id: string;
  title: string;
  description: string;
  cta: { label: string; href: string; external: boolean };
}

export const services: Service[] = [
  {
    id: 'asesoria',
    title: 'Asesoría de moda',
    description:
      'Orientación personalizada de estilo: recomendamos prendas y combinaciones según tu personalidad, tipo de cuerpo y ocasión.',
    cta: {
      label: 'Solicitar asesoría',
      href: buildWhatsAppUrl(`Hola ${siteConfig.name}, quisiera solicitar una asesoría de moda.`),
      external: true,
    },
  },
  {
    id: 'pod',
    title: 'P.O.D. (Print On Demand)',
    description:
      'Producimos bajo demanda cuando realizas tu pedido, garantizando piezas exclusivas de edición limitada.',
    cta: { label: 'Ver productos P.O.D.', href: '/tienda/pod', external: false },
  },
  {
    id: 'personalizadas',
    title: 'Prendas personalizadas',
    description:
      'Vestuario a medida adaptado a tus ideas. Ideal para artistas y personas que buscan prendas verdaderamente únicas.',
    cta: {
      label: 'Consultar personalización',
      href: buildWhatsAppUrl(
        `Hola ${siteConfig.name}, me interesa el servicio de prendas personalizadas.`,
      ),
      external: true,
    },
  },
];
