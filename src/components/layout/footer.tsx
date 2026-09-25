import Link from 'next/link';
import { PAYMENT_METHODS, SHIPPING_AGENCIES } from '@/config/business';
import { collectionNav, mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Icon } from '@/components/ui/icon';
import { BrandEmblem } from './brand-emblem';

const linkClass = 'text-sm text-fg-muted transition-colors hover:text-gold';
const titleClass = 'font-display text-xs font-bold uppercase tracking-[0.2em] text-fg';

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, location } = siteConfig;

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      {/* Filete dorado superior */}
      <div aria-hidden className="h-px bg-gold-gradient opacity-60" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <BrandEmblem className="h-12 w-10 text-gold" />
            <span className="text-gold-gradient font-script text-4xl">{siteConfig.name}</span>
          </div>
          <p className="font-script text-2xl text-gold">{siteConfig.slogan}</p>
          <p className="text-sm text-fg-muted">{siteConfig.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className={titleClass}>Colecciones</h2>
          <ul className="flex flex-col gap-2">
            {collectionNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tienda" className={linkClass}>
                Ver toda la tienda
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className={titleClass}>Navegación</h2>
          <ul className="flex flex-col gap-2">
            {mainNav.slice(2).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className={titleClass}>Contacto</h2>
          <ul className="flex flex-col gap-3 text-sm text-fg-muted">
            <li className="flex gap-2">
              <Icon name="mapPin" size={18} className="shrink-0 text-gold" />
              {location.city}, {location.state}, {location.country}
            </li>
            <li>
              <a
                href={`https://wa.me/${contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 hover:text-gold"
              >
                <Icon name="whatsapp" size={18} className="shrink-0 text-gold" />
                {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex gap-2 break-all hover:text-gold">
                <Icon name="mail" size={18} className="shrink-0 text-gold" />
                {contact.email}
              </a>
            </li>
          </ul>
          <p className="text-xs text-fg-subtle">
            Envíos: {SHIPPING_AGENCIES.slice(0, 3).join(' · ')}
            <br />
            Pagos: {PAYMENT_METHODS.join(' · ')}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-fg-subtle sm:flex-row sm:px-6">
          <span>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </span>
          <span className="font-display font-bold tracking-[0.2em] text-gold uppercase">
            {siteConfig.slogan}
          </span>
        </div>
      </div>
    </footer>
  );
}
