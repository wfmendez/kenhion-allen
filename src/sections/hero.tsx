import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { WHOLESALE } from '@/config/business';
import { siteConfig } from '@/config/site';
import { heroImage } from '@/data/gallery';
import { shopPath } from '@/lib/routes';

export function Hero() {
  const pct = Math.round(WHOLESALE.rate * 100);
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgb(212_175_55/0.14),transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <p className="flex items-center gap-3 font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
            <span aria-hidden className="h-px w-10 bg-red" />
            {siteConfig.location.city}, {siteConfig.location.country}
          </p>
          <h1 className="text-gold-gradient font-script text-6xl leading-[1.1] sm:text-7xl lg:text-8xl">
            {siteConfig.slogan}
          </h1>
          <p className="max-w-lg text-lg text-fg-muted">
            Prendas elegantes para hombres y mujeres, con materiales de alta calidad y un estilo que
            no pasa desapercibido.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={shopPath} size="lg">
              Ver la tienda
            </ButtonLink>
            <ButtonLink href="/servicios" size="lg" variant="outline">
              Nuestros servicios
            </ButtonLink>
          </div>
          <p className="text-sm text-fg-subtle">
            <span className="text-gold">{pct}% de descuento al mayor</span> comprando{' '}
            {WHOLESALE.minQty} prendas o más.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-3 rounded-[1.25rem] border border-gold/30" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-card">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-card border border-gold/40 bg-ink/90 px-5 py-4 backdrop-blur sm:-left-8">
            <BrandEmblem className="h-10 w-8 text-gold" />
            <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-fg uppercase">
              Moda elegante
              <br />
              <span className="text-gold">y conservadora</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
