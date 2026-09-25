import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';

export function TopBar() {
  const pct = Math.round(WHOLESALE.rate * 100);
  return (
    <div className="bg-red px-4 py-2 text-center font-display text-[0.65rem] font-bold tracking-[0.2em] text-on-accent uppercase">
      <span>
        {siteConfig.location.city}, {siteConfig.location.country}
      </span>
      <span aria-hidden className="mx-3 text-gold-light">
        ◆
      </span>
      <span>
        {pct}% al mayor comprando {WHOLESALE.minQty} prendas
      </span>
      <span aria-hidden className="mx-3 hidden text-gold-light sm:inline">
        ◆
      </span>
      <span className="hidden sm:inline">WhatsApp {siteConfig.contact.whatsappDisplay}</span>
    </div>
  );
}
