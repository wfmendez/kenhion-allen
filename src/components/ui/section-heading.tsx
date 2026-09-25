import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Encabezado de sección con el divisor de marca "—— Kenhion Allen ——". */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as: Tag = 'h2',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <header
      className={cn('flex flex-col gap-3', centered && 'items-center text-center', className)}
    >
      {eyebrow ? (
        <p className="flex items-center gap-3 font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
          <span aria-hidden className="h-px w-8 bg-red" />
          {eyebrow}
          {centered ? <span aria-hidden className="h-px w-8 bg-red" /> : null}
        </p>
      ) : null}
      <Tag className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
        {title}
      </Tag>
      {description ? <p className="max-w-2xl text-fg-muted">{description}</p> : null}
    </header>
  );
}
