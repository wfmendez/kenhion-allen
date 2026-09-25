'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { mainNav, isActivePath } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { Drawer } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';
import { Logo } from './logo';

/**
 * Header fijo con navegación y menú móvil.
 * `actions` recibe los botones de la derecha (búsqueda, carrito) para no acoplar
 * el header al estado del carrito.
 */
export function Header({ actions }: { actions?: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative px-3 py-2 font-display text-[0.7rem] font-bold tracking-[0.16em] uppercase transition-colors',
                      active ? 'text-gold' : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          {actions}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid size-11 place-items-center rounded-full text-fg hover:bg-surface-raised lg:hidden"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" label="Abrir menú" />
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú">
        <nav aria-label="Móvil">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between py-4 font-display text-sm font-bold tracking-[0.16em] uppercase',
                      active ? 'text-gold' : 'text-fg',
                    )}
                  >
                    {item.label}
                    <Icon name="chevronRight" size={16} className="text-fg-subtle" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="mt-8 font-script text-3xl text-gold">{siteConfig.slogan}</p>
      </Drawer>
    </header>
  );
}
