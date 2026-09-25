import { ButtonLink } from '@/components/ui/button';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { WHOLESALE } from '@/config/business';
import { shopPath } from '@/lib/routes';

export function WholesaleBanner() {
  const pct = Math.round(WHOLESALE.rate * 100);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-card bg-red px-6 py-12 text-on-accent sm:px-12">
        <BrandEmblem
          aria-hidden
          className="absolute -top-8 -right-6 h-56 w-48 text-gold-light opacity-20"
        />
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-display text-[0.7rem] font-bold tracking-[0.3em] text-on-accent uppercase">
              Compras al mayor
            </p>
            <p className="font-display text-3xl font-extrabold sm:text-4xl">
              {pct}% OFF comprando {WHOLESALE.minQty} prendas
            </p>
            <p className="max-w-xl text-on-accent">
              Combina referencias y colecciones: el descuento se aplica solo en tu cesta al llegar a
              la docena.
            </p>
          </div>
          <ButtonLink href={shopPath} size="lg" variant="dark">
            Armar mi docena
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
