import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';
import { BrandEmblem } from './brand-emblem';

/** Emblema dorado + nombre en la fuente script de marca, con eslogan opcional. */
export function Logo({
  showSlogan = false,
  size = 'md',
  className,
}: {
  showSlogan?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}: inicio`}
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <BrandEmblem
        className={cn(
          'shrink-0 text-gold transition-transform duration-300 group-hover:scale-105',
          size === 'md' ? 'h-9 w-8' : 'h-14 w-12',
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-gold-gradient font-script whitespace-nowrap',
            size === 'md' ? 'text-3xl' : 'text-5xl',
          )}
        >
          {siteConfig.name}
        </span>
        {showSlogan ? (
          <span className="mt-1 font-display text-[0.6rem] font-bold tracking-[0.3em] text-fg-muted uppercase">
            {siteConfig.slogan}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
