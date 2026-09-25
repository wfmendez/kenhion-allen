import Link from 'next/link';
import type { ReactNode } from 'react';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/structured-data';

export interface Crumb {
  name: string;
  path: string;
}

/** Encabezado de páginas internas con migas de pan (visibles y en JSON-LD). */
export function PageHeader({
  title,
  eyebrow,
  description,
  crumbs,
}: {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  crumbs: Crumb[];
}) {
  const trail = [{ name: 'Inicio', path: '/' }, ...crumbs];
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(212_175_55/0.12),transparent_60%)]"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:px-6 sm:py-16">
        <JsonLd data={breadcrumbJsonLd(trail)} />
        <nav aria-label="Migas de pan">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={crumb.path} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="text-fg-muted">
                      {crumb.name}
                    </span>
                  ) : (
                    <>
                      <Link href={crumb.path} className="hover:text-gold">
                        {crumb.name}
                      </Link>
                      <span aria-hidden>/</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {eyebrow ? (
          <p className="flex items-center gap-3 font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
            <span aria-hidden className="h-px w-8 bg-red" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {description ? <p className="max-w-2xl text-fg-muted">{description}</p> : null}
      </div>
    </div>
  );
}
