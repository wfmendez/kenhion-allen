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

export const collectionNav: NavItem[] = [
  { label: 'KA ELITE', href: '/tienda/ka-elite' },
  { label: 'Resiliencia', href: '/tienda/resiliencia' },
  { label: 'P.O.D.', href: '/tienda/pod' },
];

/** Marca como activo el enlace exacto o cualquier subruta ("/tienda" en "/tienda/pod"). */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
