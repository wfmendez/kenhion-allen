'use client';

import { siteConfig } from '@/config/site';
import { ErrorState, type ErrorStateProps } from '@/sections/error-state';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

/**
 * Errores en el layout raíz. Reemplaza todo el documento, así que trae su propio
 * <html>, estilos y fuentes; no hay encabezado ni pie.
 */
export default function GlobalError(props: ErrorStateProps) {
  return (
    <html lang="es" className={fontVariables}>
      <body className="flex min-h-dvh flex-col justify-center">
        <title>{`Algo salió mal | ${siteConfig.name}`}</title>
        <main>
          <ErrorState {...props} />
        </main>
      </body>
    </html>
  );
}
