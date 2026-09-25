import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { Logo } from '@/components/layout/logo';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Price } from '@/components/ui/price';
import { SectionHeading } from '@/components/ui/section-heading';
import { siteConfig } from '@/config/site';
import { getProductBySlug } from '@/lib/repositories/product-repository';
import { colorDescriptions, colors, contrastRatio, type ColorToken } from '@/styles/tokens';
import { FormDemo, OverlayDemos } from './interactive-demos';

export const metadata: Metadata = {
  title: 'Sistema de diseño',
  robots: { index: false, follow: false },
};

/** Guía viva del sistema de diseño. Visible en desarrollo y previews, oculta en producción. */
export default async function DesignSystemPage() {
  if (process.env.VERCEL_ENV === 'production') notFound();

  const sample = await getProductBySlug('hoodie-resiliencia');
  const offer = await getProductBySlug('basic-t-shirt-oversize');

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-16 sm:px-6">
      <SectionHeading
        as="h1"
        eyebrow="Kenhion Allen v3"
        title="Sistema de diseño"
        description="Colores, tipografías y componentes de la nueva identidad: fondo negro, rojo #C74646 y detalles en dorado #D4AF37."
      />

      <Block title="Marca">
        <div className="grid gap-6 md:grid-cols-3">
          <Swatch className="bg-ink">
            <Logo size="lg" showSlogan />
          </Swatch>
          <Swatch className="bg-red">
            <BrandEmblem className="h-20 w-16 text-gold-light" />
            <span className="font-script text-4xl text-gold-light">{siteConfig.name}</span>
          </Swatch>
          <Swatch className="bg-fg">
            <BrandEmblem className="h-20 w-16 text-ink" />
            <span className="font-script text-4xl text-ink">{siteConfig.name}</span>
          </Swatch>
        </div>
        <p className="text-sm text-fg-subtle">
          Emblema provisional (se reemplaza por el vector oficial). El nombre usa Great Vibes hasta
          tener la licencia de Sloop Script Pro.
        </p>
        <div className="rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-gold-gradient font-script text-6xl sm:text-7xl">{siteConfig.slogan}</p>
          <p className="mt-3 text-xs tracking-[0.3em] text-fg-subtle uppercase">
            Eslogan oficial, fuente script
          </p>
        </div>
      </Block>

      <Block title="Colores">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(colors) as ColorToken[]).map((token) => (
            <li key={token} className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="h-20" style={{ backgroundColor: colors[token] }} />
              <div className="flex flex-col gap-1 p-4">
                <span className="font-display text-sm font-bold text-fg">{token}</span>
                <code className="text-xs text-gold">{colors[token].toUpperCase()}</code>
                <span className="text-xs text-fg-muted">{colorDescriptions[token]}</span>
                <span className="text-xs text-fg-subtle">
                  Contraste sobre negro: {contrastRatio(colors[token], colors.ink).toFixed(2)}:1
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="h-3 rounded-full bg-gold-gradient" />
        <p className="text-sm text-fg-subtle">
          Regla: el rojo sobre negro solo en texto grande o decoración (contraste 4.4:1). Sobre rojo
          siempre texto blanco puro.
        </p>
      </Block>

      <Block title="Tipografía">
        <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8">
          <Specimen label="Script de marca: eslogan y titulares decorativos">
            <p className="font-script text-5xl text-gold">Más allá del límite</p>
          </Specimen>
          <Specimen label="Montserrat: títulos, botones y etiquetas">
            <p className="font-display text-4xl font-extrabold tracking-tight">
              Colección Resiliencia
            </p>
            <p className="font-display text-xs font-bold tracking-[0.3em] text-gold uppercase">
              Algodón 100%
            </p>
          </Specimen>
          <Specimen label="Inter: textos y descripciones">
            <p className="max-w-prose text-fg-muted">
              Somos una tienda de ropa especializada en prendas elegantes para hombres y mujeres.
              Nos destacamos por la calidad de nuestros productos y un estilo elegante y
              conservador.
            </p>
          </Specimen>
        </div>
      </Block>

      <Block title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Añadir a la cesta</Button>
          <Button variant="outline">Pedir docena −15%</Button>
          <Button variant="ghost">Ver detalle</Button>
          <Button variant="danger">Eliminar</Button>
          <Button variant="whatsapp">
            <Icon name="whatsapp" size={18} /> Pedir por WhatsApp
          </Button>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeño</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" variant="outline" aria-label="Buscar">
            <Icon name="search" />
          </Button>
          <ButtonLink href="/dev/design" variant="outline">
            Enlace con estilo de botón
          </ButtonLink>
        </div>
      </Block>

      <Block title="Badges y precios">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>KA Elite</Badge>
          <Badge tone="red">Oferta P.O.D.</Badge>
          <Badge tone="neutral">Unisex</Badge>
          <Badge tone="success">15% al mayor aplicado</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <Price cents={3500} size="lg" />
          <Price cents={2500} compareAtCents={2800} />
          <Price cents={1500} size="sm" />
        </div>
      </Block>

      {sample && offer ? (
        <Block title="Vista previa: tarjeta de producto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[sample, offer].map((p) => (
              <article
                key={p.id}
                className="group overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-gold"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-raised">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge
                    tone={p.compareAtPriceCents ? 'red' : 'gold'}
                    className="absolute top-3 left-3"
                  >
                    {p.badge}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <p className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-fg-subtle uppercase">
                    {p.gender}
                  </p>
                  <h3 className="font-display text-lg font-bold">{p.name}</h3>
                  <Price cents={p.priceCents} compareAtCents={p.compareAtPriceCents} />
                  <Button fullWidth>
                    <Icon name="bag" size={16} /> Añadir a la cesta
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Block>
      ) : null}

      <Block title="Formularios">
        <FormDemo />
      </Block>

      <Block title="Modales, drawer y notificaciones">
        <OverlayDemos />
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="border-b border-line pb-3 font-display text-xs font-bold tracking-[0.3em] text-gold uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div
      className={`flex min-h-48 flex-col items-center justify-center gap-3 rounded-card border border-line p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-line pb-6 last:border-0 last:pb-0">
      <span className="text-xs tracking-[0.2em] text-fg-subtle uppercase">{label}</span>
      {children}
    </div>
  );
}
