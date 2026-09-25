import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'whatsapp' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-display font-bold uppercase tracking-[0.12em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-light',
  outline: 'border border-gold/70 text-gold hover:border-gold hover:bg-gold/10',
  ghost: 'text-fg-muted hover:bg-surface-raised hover:text-fg',
  danger: 'bg-red text-on-accent hover:bg-red-deep',
  whatsapp: 'bg-whatsapp text-on-accent hover:bg-whatsapp-deep',
  /** Para fondos rojos o claros: botón negro con texto dorado. */
  dark: 'bg-ink text-gold hover:bg-surface',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-[0.68rem]',
  md: 'min-h-11 px-6 text-xs',
  lg: 'min-h-13 px-8 text-sm',
  icon: 'size-11 p-0',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);
}

type StyleProps = { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean };

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & StyleProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

/** Mismo estilo que Button pero navega (interna con next/link, externa con <a>). */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  href,
  external = false,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & StyleProps & { href: string; external?: boolean }) {
  const classes = buttonClasses({ variant, size, fullWidth, className });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
