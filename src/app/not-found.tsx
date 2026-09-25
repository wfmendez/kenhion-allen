import { BrandEmblem } from '@/components/layout/brand-emblem';
import { ButtonLink } from '@/components/ui/button';
import { shopPath } from '@/lib/routes';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center">
      <BrandEmblem className="h-24 w-20 text-gold" />
      <p className="font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
        Error 404
      </p>
      <h1 className="font-display text-3xl font-extrabold">Esta página no existe</h1>
      <p className="text-fg-muted">
        Puede que el enlace esté roto o que la prenda ya no esté disponible.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href={shopPath} variant="outline">
          Ver la tienda
        </ButtonLink>
      </div>
    </div>
  );
}
