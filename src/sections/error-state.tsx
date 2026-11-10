'use client';

import { useEffect } from 'react';
import { BrandEmblem } from '@/components/layout/brand-emblem';
import { Button, ButtonLink } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export interface ErrorStateProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/** Contenido común de `error.tsx` y `global-error.tsx`. */
export function ErrorState({ error, retry }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reference = error.digest ? ` (código ${error.digest})` : '';

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center">
      <BrandEmblem weight="official" className="h-24 w-20 text-gold" />
      <p className="font-display text-[0.7rem] font-bold tracking-[0.3em] text-gold uppercase">
        Error inesperado
      </p>
      <h1 className="font-display text-3xl font-extrabold">Algo salió mal</h1>
      <p className="text-fg-muted">
        No pudimos mostrar esta página. Tu cesta sigue guardada en este dispositivo.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={retry}>Intentar de nuevo</Button>
        <ButtonLink href="/" variant="outline">
          Ir al inicio
        </ButtonLink>
      </div>
      <p className="text-sm text-fg-subtle">
        Si el problema sigue,{' '}
        <a
          href={buildWhatsAppUrl(`Hola, la página web me mostró un error${reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-gold underline underline-offset-4 hover:text-gold-light"
        >
          <Icon name="whatsapp" size={14} />
          escríbenos por WhatsApp
        </a>
        .
      </p>
      {error.digest ? <p className="text-xs text-fg-subtle">Código: {error.digest}</p> : null}
    </div>
  );
}
