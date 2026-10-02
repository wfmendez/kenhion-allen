import type { Metadata } from 'next';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { ButtonLink } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { siteConfig } from '@/config/site';
import { aboutCopy, type AboutValue } from '@/data/copy';
import { shopPath } from '@/lib/routes';
import { PageHeader } from '@/sections/page-header';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: `${siteConfig.name}: moda elegante en ${siteConfig.location.city}, ${siteConfig.location.country}.`,
  alternates: { canonical: '/nosotros' },
};

const valueIcons: Record<AboutValue['id'], IconName> = {
  diseno: 'check',
  calidad: 'check',
  manufactura: 'mapPin',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sobre nosotros"
        title={`Moda elegante en ${siteConfig.location.city}`}
        crumbs={[{ name: 'Nosotros', path: '/nosotros' }]}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center overflow-hidden rounded-card border border-gold/30 bg-surface lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle,rgb(212_175_55/0.15),transparent_65%)]"
            />
            <BrandEmblem weight="official" className="relative h-48 w-40 text-gold" />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-fg-muted">{aboutCopy.description}</p>
            <p className="text-gold-gradient font-script text-5xl">{siteConfig.slogan}</p>
            <ButtonLink href={shopPath} className="self-start">
              Conocer la colección
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-5 md:grid-cols-3">
          {aboutCopy.values.map((value) => (
            <li
              key={value.id}
              className="flex flex-col gap-3 rounded-card border border-line bg-surface p-6"
            >
              <Icon name={valueIcons[value.id]} className="text-gold" />
              <h2 className="font-display text-base font-bold">{value.title}</h2>
              <p className="text-sm leading-relaxed text-fg-muted">{value.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
