export interface NavItem {
  label: string;
  href: string;
}

/** Navegación principal. Las rutas se crean en la Fase 3. */
export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Preguntas', href: '/preguntas-frecuentes' },
  { label: 'Contacto', href: '/contacto' },
];

/** Accesos directos a la tienda para el footer. */
export const shopNav: NavItem[] = [
  { label: 'Colección KA ELITE', href: '/tienda' },
  { label: 'Caballero', href: '/tienda?genero=caballero' },
  { label: 'Dama', href: '/tienda?genero=dama' },
];

/** Marca como activo el enlace exacto o cualquier subruta ("/tienda" en "/tienda/pod"). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
