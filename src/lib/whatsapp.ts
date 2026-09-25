import { siteConfig } from '@/config/site';

/** Enlace wa.me con el mensaje ya codificado. */
export function buildWhatsAppUrl(
  message: string,
  phone: string = siteConfig.contact.whatsappNumber,
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
