import type { Metadata } from 'next';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { siteConfig } from '@/config/site';
import { shopPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: `${siteConfig.name}: moda elegante en ${siteConfig.location.city}, ${siteConfig.location.country}.`,
  alternates: { canonical: '/nosotros' },
};

const values: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'check',
    title: 'Diseño elegante',
    text: 'Cortes pulidos y acabados limpios que resaltan en cualquier ocasión.',
  },
  {
    icon: 'check',
    title: 'Calidad garantizada',
    text: 'Algodón 100% de alto gramaje y fibras técnicas para las prendas de compresión.',
  },
  {
    icon: 'mapPin',
    title: `Hecho en ${siteConfig.location.city}`,
    text: 'Atención cercana y envíos seguros a toda Venezuela.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre nosotros"
        title={`Moda elegante en ${siteConfig.location.city}`}
        crumbs={[{ name: 'Nosotros', path: '/nosotros' }]}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_3fr]">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-card border border-gold/30 bg-surface">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle,rgb(212_175_55/0.15),transparent_65%)]"
          />
          <BrandEmblem className="relative h-48 w-40 text-gold" />
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-fg-muted">
            Somos una tienda de ropa especializada en prendas elegantes para hombres y mujeres. Nos
            destacamos por la calidad de nuestros productos y ofrecemos ropa de diseñador con un
            estilo elegante y conservador. Estamos ubicados en {siteConfig.location.city},{' '}
            {siteConfig.location.country}.
          </p>
          <p className="text-gold-gradient font-script text-5xl">{siteConfig.slogan}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="rounded-card border border-line bg-surface p-5">
                <Icon name={v.icon} className="text-gold" />
                <h2 className="mt-3 font-display text-sm font-bold">{v.title}</h2>
                <p className="mt-1 text-sm text-fg-muted">{v.text}</p>
              </li>
            ))}
          </ul>
          <ButtonLink href={shopPath} className="self-start">
            Conocer las colecciones
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
