import { SHIPPING_CARRIERS } from '@/config/business';
import { siteConfig } from '@/config/site';
import { formatList } from '@/lib/format-list';

/** Agencias nacionales en una frase: "MRW, Zoom, Tealca y T-envíos". */
export const shippingCarriersText = formatList(SHIPPING_CARRIERS);

/** Resumen de envíos que se repite en la ficha de producto y en la cesta. */
export const shippingSummary = `Envíos a toda Venezuela por ${shippingCarriersText}. Delivery y entrega personal en ${siteConfig.location.city}.`;
